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

      <div v-if="isRamadanActive" class="q-mt-md">
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
  getAsrTime,
  getEshaTime,
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
    isRamadanActive: {
      type: Boolean,
      default: false,
    },
    isPerpetual: {
      type: Boolean,
      default: false,
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
    isRamadanActive: function (newVal) {
      if (newVal) {
        this.LoadDailyDua();
      }
      this.LoadNextPrayer();
    },
    hijriYear: function () {
      this.LoadNextPrayer();
    },
    asrTime: function () {
      this.LoadNextPrayer();
    },
  },
  mounted() {
    this.current = this.index - 1;
    this.LoadDailyDua();
    this.LoadNextPrayer();
    this.countdownTimer = setInterval(() => {
      this.LoadNextPrayer();
    }, 10000);
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
      if (!this.isRamadanActive) return;
      const safeIndex = Math.max(1, this.index || 1);
      const duaDay = ((safeIndex - 1) % RAMADAN_CONFIG.TOTAL_DAYS) + 1;
      axios
        .get(DATA_PATHS.dailyDua(duaDay))
        .then((response) => {
          this.dailyDua = response.data.dua;
        })
        .catch(() => {});
    },
    LoadNextPrayer() {
      if (!this.posts || this.posts.length === 0) {
        return;
      }

      const item = this.posts[this.current];
      if (!item) return;

      const today = getTodayMidnight();
      const fajr = createPrayerDateTime(today, item.FAJR);
      const zohr = createPrayerDateTime(today, item.ZOHR);
      const asrSelectionTime = getAsrTime(item, this.asrTime);
      const asr = createPrayerDateTime(today, asrSelectionTime);
      const magrib = createPrayerDateTime(today, item.IFTAR);
      const eshaSelectionTime = getEshaTime(item, this.asrTime);
      const esha = createPrayerDateTime(today, eshaSelectionTime);
      const fajrException = createPrayerDateTime(today, item.SUNRISE);
      const magribLabel = this.isRamadanActive ? "Iftar" : "Magrib";

      this.FastDate = item.DATE;
      this.RamadanDate = this.isRamadanActive
        ? `${item.FAST} Ramadan ${this.hijriYear}`
        : item.DAY_NAME || "";

      const now = Date.now();

      if (now < fajr) {
        if (this.isRamadanActive) {
          this.SetCurrentNextPrayer("Suhoor", item.SERI, "Fajr", item.FAJR, fajr);
        } else {
          this.SetCurrentNextPrayer("Esha", eshaSelectionTime, "Fajr", item.FAJR, fajr);
        }
        return;
      }

      if (now < fajrException) {
        this.SetCurrentNextPrayer("Fajr", item.FAJR, "Sunrise", item.SUNRISE, fajrException);
        return;
      }

      if (now < zohr) {
        this.SetCurrentNextPrayer("Sunrise", item.SUNRISE, "Zohr", item.ZOHR, zohr);
        return;
      }

      if (now < asr) {
        this.SetCurrentNextPrayer("Zohr", item.ZOHR, "Asr", asrSelectionTime, asr);
        return;
      }

      if (now < magrib) {
        this.SetCurrentNextPrayer("Asr", asrSelectionTime, magribLabel, item.IFTAR, magrib);
        return;
      }

      if (now < esha) {
        this.SetCurrentNextPrayer(magribLabel, item.IFTAR, "Esha", eshaSelectionTime, esha);
        return;
      }

      if (now >= esha) {
        let nextPrayer = "";
        let nextPrayerTime = "";
        let nextPrayerDate = null;

        const nextIdx =
          this.current < this.posts.length - 1
            ? this.current + 1
            : this.isPerpetual
              ? 0
              : -1;

        if (nextIdx >= 0) {
          const nextItem = this.posts[nextIdx];
          if (nextItem) {
            nextPrayer = this.isRamadanActive ? "Suhoor" : "Fajr";
            nextPrayerTime = this.isRamadanActive ? nextItem.SERI : nextItem.FAJR;
            const tomorrow = date.addToDate(today, { days: 1 });
            nextPrayerDate = createPrayerDateTime(tomorrow, nextPrayerTime);
          }
        }

        this.SetCurrentNextPrayer(
          "Esha",
          eshaSelectionTime,
          nextPrayer,
          nextPrayerTime,
          nextPrayerDate
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
