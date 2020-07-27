<template>
  <!-- <div class="text-h6">Time Table</div>-->
  <div>
    <div class="q-pa-md">
      <q-list
        bordered
        separator
        class="text-bold"
        v-touch-swipe.mouse.left="handleSwipe"
        v-touch-swipe.mouse.right="handleSwipe"
      >
        <q-item>
          <q-item-section>Fast {{fastNo}}</q-item-section>
          <q-item-section side>{{fastDate}}</q-item-section>
        </q-item>
        <q-item class="bg-grey-1">
          <q-item-section>Sehri</q-item-section>
          <q-item-section side>{{sehri}}</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>Fajr</q-item-section>
          <q-item-section side>{{fajr}}</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>Zohr</q-item-section>
          <q-item-section side>{{zohr}}</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>Asr</q-item-section>
          <q-item-section side>{{asr}}</q-item-section>
        </q-item>
        <q-item class="bg-grey-1">
          <q-item-section>Magrib</q-item-section>
          <q-item-section side>{{magrib}}</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>Esha</q-item-section>
          <q-item-section side>{{esha}}</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>Duration</q-item-section>
          <q-item-section side>{{duration}}</q-item-section>
        </q-item>
      </q-list>
    </div>
    <div class="q-pa-lg flex flex-center">
      <q-pagination
        v-model="current"
        :max="30"
        size="25px"
        input
        input-class="text-blue-10"
        v-on:click="RefreshTimeTable()"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimeTableTab',
  data () {
    return {
      fastNo: '',
      fastDate: '',
      sehri: '',
      fajr: '',
      zohr: '',
      asr: '',
      magrib: '',
      esha: '',
      duration: ''
    }
  },
  props: {
    index: {
      type: Number,
      default: 2
    },
    posts: {
      type: Array
    },
    asrTime: {
      type: String,
      default: 'Hanafi'
    }

  },
  created () {
    this.current = this.index

    this.RefreshTimeTable()
  },
  methods: {
    RefreshTimeTable () {
      var item = this.posts[this.current - 1]
      this.showLoading()
      this.fastNo = item.FAST
      this.fastDate = item.DATE
      this.fajr = item.FAJR
      this.sehri = item.SERI
      this.zohr = item.ZOHR
      this.asr = (this.asrTime === 'Hanafi') ? item.ASRH : item.ASRS
      this.magrib = item.IFTAR
      this.esha = item.ESHA
      this.duration = item.DURATION
      console.log(this.asrTime)
    },
    handleSwipe ({ evt, ...info }) {
      if (info.direction === 'right') {
        this.current += 1
      } else if (info.direction === 'left') {
        this.current -= 1
      }
      this.RefreshTimeTable()
    },
    showLoading () {
      this.$q.loading.show()

      // hiding in 2s
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        // eslint-disable-next-line no-void
        this.timer = void 0
      }, 800)
    }
  },
  beforeDestroy () {
    // eslint-disable-next-line no-void
    if (this.timer !== void 0) {
      clearTimeout(this.timer)
      this.$q.loading.hide()
    }
  }
}
</script>
