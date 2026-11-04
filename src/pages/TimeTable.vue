<template>
  <div class="q-pa-md">
    <div class="row items-center justify-between no-wrap q-mb-sm">
      <div
        class="row items-center no-wrap cursor-pointer col q-pr-sm overflow-hidden"
        @click="$router.push('/Settings')"
      >
        <q-icon name="place" color="green-8" size="sm" class="q-mr-xs" />
        <span class="text-h6 text-weight-bold ellipsis">{{ city }}</span>
        <q-icon
          name="edit"
          color="grey-6"
          size="xs"
          class="q-ml-xs"
        />
      </div>
      <q-badge
        outline
        color="green-9"
        class="q-px-sm q-py-xs text-weight-bold cursor-pointer"
        @click="$router.push('/Settings')"
      >
        {{ AsrTime }}
      </q-badge>
    </div>
    <div class="q-gutter-y-md">
      <q-card>
        <q-tabs
          class="bg-green-8 text-white"
          v-model="tab"
          dense
          active-color="white"
          indicator-color="green-3"
          inline-label
        >
          <q-tab name="next" label="Next" icon="date_range" />
          <q-tab name="times" label="Times" icon="schedule" />
          <q-tab
            v-if="isRamadanActive"
            name="info"
            label="Info"
            icon="sort"
          />
        </q-tabs>

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="next">
            <NextTab
              :posts="posts"
              :index="current"
              :isRamadanActive="isRamadanActive"
              :isPerpetual="isPerpetual"
              :asrTime="AsrTime"
              :ramadanStart="ramadanStarts"
              :hijriYear="hijriYear"
            />
          </q-tab-panel>

          <q-tab-panel name="times">
            <TimeTableTab
              :index="current"
              :isRamadanActive="isRamadanActive"
              :isPerpetual="isPerpetual"
              :posts="posts"
              :asrTime="AsrTime"
            />
          </q-tab-panel>

          <q-tab-panel v-if="isRamadanActive" name="info">
            <InfoTab
              :index="current"
              :isRamadanActive="isRamadanActive"
              :currentDate="currentDate"
              :posts="posts"
              :ramadanStart="ramadanStarts"
            />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </div>
</template>

<script>
import InfoTab from "components/InfoTab.vue";
import TimeTableTab from "components/TimeTableTab.vue";
import NextTab from "components/NextTab.vue";

import axios from "axios";
import { date } from "quasar";
import {
  STORAGE_KEYS,
  ASR_METHODS,
  DATA_PATHS,
  RAMADAN_CONFIG,
  parseTimetableDate,
  getTodayMidnight,
  buildCitySchedule,
} from "src/constants/appConfig";

export default {
  name: "TimeTable",
  components: {
    NextTab,
    TimeTableTab,
    InfoTab,
  },
  created() {
    this.InitialiseVariables();
    this.RedirectNewVisitorsToWelcome();
    this.DetermineCurrentDay();
    if (this.city !== "") {
      this.LoadTimeTableData();
    }
  },
  mounted() {
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
  },
  beforeUnmount() {
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
  },
  data() {
    return {
      city: "",
      tab: "next",
      current: 1,
      isRamadanActive: false,
      isPerpetual: false,
      rawCityData: null,
      posts: [],
      currentDate: null,
      ramadanStarts: RAMADAN_CONFIG.START_DATE,
      hijriYear: RAMADAN_CONFIG.HIJRI_YEAR,
      AsrTime: ASR_METHODS.HANAFI,
    };
  },
  methods: {
    LoadTimeTableData() {
      axios
        .get(DATA_PATHS.cityTimetable(this.city))
        .then((response) => {
          this.rawCityData = response.data;
          this.ApplySchedule();
        })
        .catch(() => {});
    },
    ApplySchedule() {
      this.currentDate = getTodayMidnight();
      if (!this.rawCityData) return;

      // For legacy 30-day JSON files, read start date from row 0 if present
      if (
        Array.isArray(this.rawCityData) &&
        this.rawCityData.length > 0 &&
        this.rawCityData[0].DATE
      ) {
        this.ramadanStarts = parseTimetableDate(this.rawCityData[0].DATE);
      } else {
        this.ramadanStarts = RAMADAN_CONFIG.START_DATE;
      }

      const schedule = buildCitySchedule(
        this.rawCityData,
        this.currentDate,
        this.ramadanStarts,
        RAMADAN_CONFIG.TOTAL_DAYS
      );

      this.posts = schedule.posts;
      this.current = schedule.currentIndex;
      this.isRamadanActive = schedule.isRamadanActive;
      this.isPerpetual = schedule.isPerpetual;
    },
    DetermineCurrentDay() {
      this.currentDate = getTodayMidnight();
      if (this.rawCityData) {
        this.ApplySchedule();
        return;
      }
      const page = date.getDateDiff(
        this.currentDate,
        this.ramadanStarts,
        "days"
      );
      this.isRamadanActive =
        page >= 0 && page < RAMADAN_CONFIG.TOTAL_DAYS;
      this.current =
        page < 0
          ? 1
          : page >= RAMADAN_CONFIG.TOTAL_DAYS
            ? 1
            : page + 1;
    },
    handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        this.DetermineCurrentDay();
      }
    },
    InitialiseVariables() {
      if (this.$q.localStorage.has(STORAGE_KEYS.CITY)) {
        this.city = this.$q.localStorage.getItem(STORAGE_KEYS.CITY).city;
      }
      if (this.$q.localStorage.has(STORAGE_KEYS.ASR_METHOD)) {
        this.AsrTime = this.$q.localStorage.getItem(STORAGE_KEYS.ASR_METHOD);
      }
    },
    RedirectNewVisitorsToWelcome() {
      if (this.city === "") {
        this.$router.push("/About");
      }
    },
  },
};
</script>
