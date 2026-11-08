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
          font-size="32px"
          :thickness="0.34"
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
    </template>

    <template v-else>
      <q-list
        v-if="significantDates.length > 0"
        bordered
        separator
        class="text-bold rounded-borders"
      >
        <q-item class="bg-grey-2">
          <q-item-section>Upcoming Significant Dates</q-item-section>
        </q-item>
        <q-item
          v-for="(item, idx) in significantDates"
          :key="item.Id"
          :class="idx === 0 ? 'bg-green-1 text-green-10' : ''"
        >
          <q-item-section>{{ item.Title }}</q-item-section>
          <q-item-section
            side
            :class="idx === 0 ? 'text-green-10' : ''"
          >
            {{ FormatIslamicDate(item.computedDate) }}
          </q-item-section>
        </q-item>
      </q-list>

      <q-list
        v-if="upcomingIslamicMonths.length > 0"
        bordered
        separator
        class="text-bold rounded-borders q-mt-md"
      >
        <q-item class="bg-grey-2">
          <q-item-section>Upcoming Months</q-item-section>
        </q-item>
        <q-item
          v-for="(item, idx) in upcomingIslamicMonths"
          :key="item.Id"
          :class="idx === 0 ? 'bg-green-1 text-green-10' : ''"
        >
          <q-item-section>{{ item.Title }}</q-item-section>
          <q-item-section
            side
            :class="idx === 0 ? 'text-green-10' : ''"
          >
            {{ FormatIslamicDate(item.computedDate) }}
          </q-item-section>
        </q-item>
      </q-list>
    </template>
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
  parseIsoDateLocal,
} from "src/constants/appConfig";

export default {
  name: "InfoTab",
  data() {
    return {
      rawInfo: [],
      Info: [],
      significantDates: [],
      upcomingIslamicMonths: [],
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
    totalDays: {
      type: Number,
      default: RAMADAN_CONFIG.TOTAL_DAYS,
    },
  },
  computed: {
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
    totalDays: function () {
      this.BuildDynamicInfoList();
    },
  },
  created() {
    this.LoadInfo();
    this.LoadIslamicDates();
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
    LoadIslamicDates() {
      const today = this.currentDate || getTodayMidnight();

      axios
        .get(DATA_PATHS.SIGNIFICANT_DATES_LIST)
        .then((response) => {
          const list = Array.isArray(response.data) ? response.data : [];
          const enriched = list.map((item) => ({
            ...item,
            computedDate: parseIsoDateLocal(item.EnglishDate),
          }));
          const upcoming = enriched.filter((x) => x.computedDate >= today);
          this.significantDates =
            upcoming.length > 0 ? upcoming.slice(0, 3) : enriched.slice(-3);
        })
        .catch(() => {});

      axios
        .get(DATA_PATHS.ISLAMIC_MONTHS_LIST)
        .then((response) => {
          const list = Array.isArray(response.data) ? response.data : [];
          const enriched = list.map((item) => ({
            ...item,
            computedDate: parseIsoDateLocal(item.EnglishDate),
          }));
          const upcoming = enriched.filter((x) => x.computedDate >= today);
          this.upcomingIslamicMonths =
            upcoming.length > 0 ? upcoming.slice(0, 3) : enriched.slice(-3);
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
              days: this.totalDays,
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
    FormatIslamicDate(val) {
      return date.formatDate(val, "DD-MMM-YYYY");
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
