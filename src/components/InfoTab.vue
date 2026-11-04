<template>
  <div>
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
    <div class="q-px-lg q-pb-md">
      <q-timeline color="green-8">
        <q-timeline-entry
          v-for="item in Info"
          :key="item.Id"
          :title="item.Title"
          :subtitle="FormatDate(item.EnglishDate)"
          :body="item.Details"
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
      return this.posts && this.posts.length > 0
        ? this.posts.length
        : RAMADAN_CONFIG.TOTAL_DAYS;
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
          const upcoming = response.data.filter(
            (x) => new Date(x.EnglishDate) >= this.currentDate
          );
          this.Info =
            upcoming.length > 0 ? upcoming.slice(0, 3) : response.data.slice(-3);
        })
        .catch(() => {});
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
