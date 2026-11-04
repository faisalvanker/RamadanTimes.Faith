<template>
  <div>
    <template v-if="isRamadanActive">
      <div class="text-h6 text-center">Ramadan Progress</div>
      <div class="q-pa-md flex flex-center">
        <q-knob
          readonly
          show-value
          v-model="getPercentComplete"
          size="180px"
          :thickness="0.43"
          color="green-8"
          track-color="green-2"
          class="text-green-9 text-weight-bold q-ma-md"
        >
          {{ getPercentComplete }}%
        </q-knob>
      </div>
      <q-banner
        v-if="IsOddNight()"
        inline-actions
        rounded
        class="text-white bg-amber-9"
      ><template v-slot:avatar>
          <q-icon name="nights_stay" />
        </template>
        <div class="text-subtitle1 text-weight-bold">Laylat al-Qadr (Odd Night)</div>
      </q-banner>
      <q-banner
        v-else
        inline-actions
        rounded
        class="text-white bg-green-8"
      ><template v-slot:avatar>
          <q-icon name="insert_chart" />
        </template>
        <div class="text-subtitle1 text-weight-bold">{{ DetermineRamadanStage() }}</div>
      </q-banner>
      <q-separator class="q-mt-md" />
    </template>
    <div class="q-px-lg q-pb-md">
      <q-timeline color="green-8">
        <q-timeline-entry
          v-for="item in Info"
          :key="item.Id"
          :title="item.Title"
          :subtitle="FormatDate(item.computedDate)"
          :body="item.computedDetails"
        />
      </q-timeline>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { date } from "quasar";
import {
  DATA_PATHS,
  RAMADAN_CONFIG,
  getTodayMidnight,
  createPrayerDateTime,
} from "src/constants/appConfig";

export default {
  name: "InfoTab",
  data() {
    return {
      rawInfo: [],
      Info: [],
      current: 0,
      IsAfterMagrib: false,
    };
  },
  props: {
    index: {
      type: Number,
      default: 0,
    },
    isRamadanActive: {
      type: Boolean,
      default: false,
    },
    posts: {
      type: Array,
    },
    currentDate: {
      type: Date,
    },
    ramadanStart: {
      type: Date,
    },
  },
  computed: {
    totalDays() {
      return RAMADAN_CONFIG.TOTAL_DAYS;
    },
    getPercentComplete: function () {
      if (this.current <= 0 || Date.now() <= this.ramadanStart) return 0;
      return Math.round((this.current / this.totalDays) * 100);
    },
  },
  watch: {
    posts: function () {
      this.DetermineIfMagribIsOver();
    },
    index: function () {
      this.DetermineIfMagribIsOver();
    },
    ramadanStart: function () {
      this.BuildDynamicInfoList();
    },
  },
  created() {
    this.LoadInfo();
    this.DetermineIfMagribIsOver();
  },
  methods: {
    LoadInfo() {
      axios
        .get(DATA_PATHS.INFO_LIST)
        .then((response) => {
          this.rawInfo = Array.isArray(response.data) ? response.data : [];
          this.BuildDynamicInfoList();
        })
        .catch(() => {});
    },
    BuildDynamicInfoList() {
      if (!this.rawInfo || this.rawInfo.length === 0) return;
      const baseStart = this.ramadanStart || RAMADAN_CONFIG.START_DATE;
      const today = this.currentDate || getTodayMidnight();

      const enriched = this.rawInfo.map((item) => {
        let computedDate;
        let computedDetails = item.Details;

        if (item.Shabaan === 30) {
          computedDate = date.subtractFromDate(baseStart, { days: 1 });
          computedDetails = `Birth of the new Moon on ${date.formatDate(
            computedDate,
            "dddd, D MMMM YYYY"
          )} (expected)`;
        } else if (typeof item.RamadanDate === "number") {
          computedDate = date.addToDate(baseStart, {
            days: item.RamadanDate - 1,
          });
          if (item.Id === 14) {
            const expectedEid = date.addToDate(baseStart, {
              days: RAMADAN_CONFIG.TOTAL_DAYS,
            });
            computedDetails = `Sighting of the Shawwal new moon - Eid al-Fitr expected ${date.formatDate(
              expectedEid,
              "D MMMM YYYY"
            )} (subject to moon sighting)`;
          }
        } else {
          computedDate = new Date(item.EnglishDate);
        }

        return {
          ...item,
          computedDate,
          computedDetails,
        };
      });

      const upcoming = enriched.filter((x) => x.computedDate >= today);
      this.Info =
        upcoming.length > 0 ? upcoming.slice(0, 3) : enriched.slice(-3);
    },
    DetermineIfMagribIsOver() {
      if (!this.posts || this.posts.length === 0) return;
      const item = this.posts[this.index - 1];
      if (!item) return;
      const today = getTodayMidnight();
      const magrib = createPrayerDateTime(today, item.IFTAR);
      this.IsAfterMagrib = Date.now() >= magrib;
      this.current = this.IsAfterMagrib ? this.index : this.index - 1;
    },
    FormatDate(val) {
      return date.formatDate(val, "DD MMMM YYYY");
    },
    IsOddNight() {
      if (!this.IsAfterMagrib) return false;
      return RAMADAN_CONFIG.ODD_NIGHT_INDEXES.includes(this.current);
    },
    DetermineRamadanStage() {
      if (this.current <= 9) {
        return "Days of Mercy";
      }
      if (this.current <= 19) {
        return "Days of Forgiveness";
      }
      return "Days of Refuge from Hellfire";
    },
  },
};
</script>
