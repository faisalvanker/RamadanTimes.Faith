<template>
  <div>
    <div
      class="timetable-slide-container"
      v-touch-swipe.mouse.left.right="handleSwipe"
    >
      <transition :name="slideDirection" mode="out-in">
        <q-list
          :key="current"
          bordered
          separator
          class="text-bold rounded-borders"
        >
          <q-item class="bg-grey-2">
            <q-item-section>
              <div class="row items-center q-gutter-x-sm">
                <span>Fast {{ fastNo }}</span>
                <q-badge
                  v-if="isRamadanActive && current === index"
                  color="green-8"
                  text-color="white"
                  label="Today"
                />
              </div>
            </q-item-section>
            <q-item-section side class="text-grey-9">
              <div class="row items-center q-gutter-x-sm">
                <q-btn
                  v-if="isRamadanActive && current !== index"
                  flat
                  dense
                  no-caps
                  size="sm"
                  color="green-8"
                  icon="today"
                  label="Go to Today"
                  @click="goToToday"
                />
                <span>{{ fastDate }}</span>
              </div>
            </q-item-section>
          </q-item>
          <q-item class="bg-green-1 text-green-10">
            <q-item-section>Suhoor</q-item-section>
            <q-item-section side class="text-green-10">{{ sehri }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>Fajr</q-item-section>
            <q-item-section side>{{ fajr }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>Zohr</q-item-section>
            <q-item-section side>{{ zohr }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>Asr</q-item-section>
            <q-item-section side>{{ asr }}</q-item-section>
          </q-item>
          <q-item class="bg-green-1 text-green-10">
            <q-item-section>Magrib</q-item-section>
            <q-item-section side class="text-green-10">{{ magrib }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>Esha</q-item-section>
            <q-item-section side>{{ esha }}</q-item-section>
          </q-item>
          <q-item class="bg-grey-1 text-grey-8">
            <q-item-section>Duration</q-item-section>
            <q-item-section side>{{ duration }}</q-item-section>
          </q-item>
        </q-list>
      </transition>
    </div>
    <div class="q-pa-lg flex flex-center">
      <q-pagination
        v-model="current"
        :max="maxDays"
        size="25px"
        color="green-8"
        input
        input-class="text-green-10 text-weight-bold"
        @update:model-value="RefreshTimeTable()"
      />
    </div>
  </div>
</template>

<script>
import { ASR_METHODS, RAMADAN_CONFIG } from "src/constants/appConfig";

export default {
  name: "TimeTableTab",
  data() {
    return {
      current: 1,
      slideDirection: "slide-left",
      fastNo: "",
      fastDate: "",
      sehri: "",
      fajr: "",
      zohr: "",
      asr: "",
      magrib: "",
      esha: "",
      duration: "",
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
    posts: {
      type: Array,
    },
    asrTime: {
      type: String,
      default: ASR_METHODS.HANAFI,
    },
  },
  computed: {
    maxDays() {
      return this.posts && this.posts.length > 0
        ? this.posts.length
        : RAMADAN_CONFIG.TOTAL_DAYS;
    },
  },
  watch: {
    posts: function () {
      this.RefreshTimeTable();
    },
    index: function (newVal) {
      this.current = newVal;
      this.RefreshTimeTable();
    },
    current: function (newVal, oldVal) {
      this.slideDirection = newVal >= oldVal ? "slide-left" : "slide-right";
    },
  },
  created() {
    this.current = this.index;
    this.RefreshTimeTable();
  },
  methods: {
    RefreshTimeTable() {
      if (!this.posts || this.posts.length === 0) return;
      const item = this.posts[this.current - 1];
      if (!item) return;
      this.fastNo = item.FAST;
      this.fastDate = item.DATE;
      this.fajr = item.FAJR;
      this.sehri = item.SERI;
      this.zohr = item.ZOHR;
      this.asr = this.asrTime === ASR_METHODS.HANAFI ? item.ASRH : item.ASRS;
      this.magrib = item.IFTAR;
      this.esha = item.ESHA;
      this.duration = item.DURATION;
    },
    goToToday() {
      this.current = this.index;
      this.RefreshTimeTable();
    },
    handleSwipe({ evt, ...info }) {
      if (info.direction === "left" && this.current < this.maxDays) {
        this.current += 1;
      } else if (info.direction === "right" && this.current > 1) {
        this.current -= 1;
      }
      this.RefreshTimeTable();
    },
  },
};
</script>

<style scoped>
.timetable-slide-container {
  overflow-x: hidden;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.18s ease-out, opacity 0.18s ease-out;
}

.slide-left-enter-from {
  transform: translateX(35px);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-35px);
  opacity: 0;
}

.slide-right-enter-from {
  transform: translateX(-35px);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(35px);
  opacity: 0;
}
</style>
