<template>
  <div>
    <div class="row text-subtitle1 text-weight-medium text-grey-9 q-mb-sm">
      <div class="col text-left">
        {{ RamadanDate }}
      </div>
      <div class="col text-right">
        {{ FastDate }}
      </div>
    </div>
    <div>
      <div class="text-h5">
        <q-list bordered separator class="rounded-borders">
          <q-item class="q-py-md">
            <q-item-section>
              <q-item-label
                v-if="CurrentPrayerTime"
                caption
                class="text-uppercase text-weight-bold text-grey-7 q-mb-xs"
              >
                Current
              </q-item-label>
              <q-item-label class="text-bold text-grey-9">
                {{ CurrentPrayerName }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label class="text-bold text-grey-9">
                {{ CurrentPrayerTime }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            v-if="NextPrayerName"
            class="q-py-md"
            :class="NextPrayerTime ? 'bg-green-1' : ''"
          >
            <q-item-section>
              <div
                v-if="NextPrayerTime"
                class="row items-center q-gutter-x-sm q-mb-xs"
              >
                <span class="text-caption text-uppercase text-weight-bold text-green-9">
                  Upcoming
                </span>
                <q-badge
                  v-if="countdownText"
                  color="green-8"
                  text-color="white"
                  class="text-weight-bold"
                >
                  {{ countdownText }}
                </q-badge>
              </div>
              <q-item-label class="text-bold text-green-10">
                {{ NextPrayerName }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label class="text-bold text-green-10">
                {{ NextPrayerTime }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="q-mt-md">
        <q-list bordered class="rounded-borders overflow-hidden">
          <q-expansion-item
            group="somegroup"
            label="Daily Dua"
            default-opened
            header-class="bg-dua-header text-green-10 text-bold"
            expand-icon-class="text-green-9"
          >
            <q-card class="bg-dua-body">
              <q-card-section class="text-grey-9">
                {{ dailyDua }}
              </q-card-section>
            </q-card>
          </q-expansion-item>
          <q-separator />
          <q-expansion-item
            group="somegroup"
            label="Dua for Fasting"
            header-class="bg-dua-header text-green-10 text-bold"
            expand-icon-class="text-green-9"
          >
            <q-card class="bg-dua-body">
              <q-card-section class="text-grey-9">
                {{ fastingDua }}
              </q-card-section>
            </q-card>
          </q-expansion-item>
          <q-separator />
          <q-expansion-item
            group="somegroup"
            label="Dua for Breaking Fast"
            header-class="bg-dua-header text-green-10 text-bold"
            expand-icon-class="text-green-9"
          >
            <q-card class="bg-dua-body">
              <q-card-section class="text-grey-9">
                {{ breakingFastDua }}
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { date } from "quasar";
import {
  ASR_METHODS,
  DATA_PATHS,
  STATIC_DUAS,
  RAMADAN_CONFIG,
  getTodayMidnight,
  createPrayerDateTime,
} from "src/constants/appConfig";

export default {
  name: "NextTab",
  data() {
    return {
      dailyDua: "",
      fastingDua: STATIC_DUAS.FASTING,
      breakingFastDua: STATIC_DUAS.BREAKING_FAST,
      CurrentPrayerName: "",
      CurrentPrayerTime: "",
      NextPrayerName: "",
      NextPrayerTime: "",
      RamadanDate: "",
      FastDate: "",
      countdownText: "",
      current: 0,
      countdownTimer: null,
    };
  },
  props: {
    index: {
      type: Number,
      default: 1,
    },
    posts: {
      type: Array,
    },
    asrTime: {
      type: String,
      default: ASR_METHODS.HANAFI,
    },
    ramadanStart: {
      type: Date,
    },
    hijriYear: {
      type: String,
      default: RAMADAN_CONFIG.HIJRI_YEAR,
    },
  },
  watch: {
    posts: function () {
      this.current = this.index - 1;
      this.LoadNextPrayer();
    },
    index: function (newVal) {
      this.current = newVal - 1;
      this.LoadDailyDua();
      this.LoadNextPrayer();
    },
  },
  mounted() {
    this.current = this.index - 1;
    this.LoadDailyDua();
    this.LoadNextPrayer();
    this.countdownTimer = setInterval(() => {
      this.LoadNextPrayer();
    }, 30000);
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
  },
  beforeUnmount() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
  },
  methods: {
    handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        this.LoadNextPrayer();
      }
    },
    LoadDailyDua() {
      axios
        .get(DATA_PATHS.dailyDua(this.index))
        .then((response) => {
          this.dailyDua = response.data.dua;
        })
        .catch(() => {});
    },
    LoadNextPrayer() {
      if (Date.now() <= this.ramadanStart || !this.posts || this.posts.length === 0) {
        this.SetCurrentNextPrayer("Ramadan", "", this.hijriYear, "", null);
        return;
      }

      const item = this.posts[this.current];
      if (!item) return;

      const today = getTodayMidnight();
      const fajr = createPrayerDateTime(today, item.FAJR);
      const zohr = createPrayerDateTime(today, item.ZOHR);
      const asrSelectionTime =
        this.asrTime === ASR_METHODS.HANAFI ? item.ASRH : item.ASRS;
      const asr = createPrayerDateTime(today, asrSelectionTime);
      const magrib = createPrayerDateTime(today, item.IFTAR);
      const esha = createPrayerDateTime(today, item.ESHA);
      const fajrException = createPrayerDateTime(today, item.SUNRISE);

      this.FastDate = item.DATE;
      this.RamadanDate = `${item.FAST} Ramadan ${this.hijriYear}`;

      if (Date.now() <= fajr) {
        this.SetCurrentNextPrayer("Suhoor", item.SERI, "Fajr", item.FAJR, fajr);
        return;
      }

      if (Date.now() <= fajrException) {
        this.SetCurrentNextPrayer("Fajr", item.FAJR, "Sunrise", item.SUNRISE, fajrException);
        return;
      }

      if (Date.now() <= zohr) {
        this.SetCurrentNextPrayer("Sunrise", item.SUNRISE, "Zohr", item.ZOHR, zohr);
        return;
      }

      if (Date.now() <= asr) {
        this.SetCurrentNextPrayer("Zohr", item.ZOHR, "Asr", asrSelectionTime, asr);
        return;
      }

      if (Date.now() <= magrib) {
        this.SetCurrentNextPrayer("Asr", asrSelectionTime, "Iftar", item.IFTAR, magrib);
        return;
      }

      if (Date.now() <= esha) {
        this.SetCurrentNextPrayer("Iftar", item.IFTAR, "Esha", item.ESHA, esha);
        return;
      }

      if (Date.now() >= esha) {
        let nextPrayer = "";
        let nextPrayerTime = "";
        let nextPrayerDate = null;

        if (this.current < this.posts.length - 1) {
          const nextItem = this.posts[this.current + 1];
          if (nextItem) {
            nextPrayer = "Suhoor";
            nextPrayerTime = nextItem.SERI;
            const tomorrow = date.addToDate(today, { days: 1 });
            nextPrayerDate = createPrayerDateTime(tomorrow, nextItem.SERI);
          }
        }

        this.SetCurrentNextPrayer(
          "Esha",
          item.ESHA,
          nextPrayer,
          nextPrayerTime,
          nextPrayerDate,
        );
      }
    },
    SetCurrentNextPrayer(currentName, currentTime, nextName, nextTime, nextTargetDate) {
      this.CurrentPrayerName = currentName;
      this.CurrentPrayerTime = currentTime;

      this.NextPrayerName = nextName;
      this.NextPrayerTime = nextTime;

      if (nextTargetDate) {
        const diffMins = Math.ceil((nextTargetDate.getTime() - Date.now()) / 60000);
        if (diffMins > 0) {
          const hrs = Math.floor(diffMins / 60);
          const mins = diffMins % 60;
          this.countdownText =
            hrs > 0 ? "in " + hrs + "h " + mins + "m" : "in " + mins + "m";
        } else {
          this.countdownText = "";
        }
      } else {
        this.countdownText = "";
      }
    },
  },
};
</script>
