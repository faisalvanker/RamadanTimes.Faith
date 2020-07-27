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
        color="orange"
        track-color="orange-3"
        class="text-orange q-ma-md"
      >
        {{ getPercentComplete }}%
      </q-knob>
    </div>
    <q-banner
      inline-actions
      class="text-white bg-blue"
      v-if="!this.IsOddNight()"
    ><template v-slot:avatar>
        <q-icon name="insert_chart" />
      </template>
      <div class="text-subtitle1">{{this.DeterminRamadanStage()}}</div>
    </q-banner>
    <q-banner
      inline-actions
      class="text-white bg-red"
      v-if="this.IsOddNight()"
    ><template v-slot:avatar>
        <q-icon name="battery_charging_full" />
      </template>
      <div class="text-subtitle1">Laylat al-Qadr</div>
    </q-banner>
    <q-separator />
    <div class="q-px-lg q-pb-md">
      <q-timeline color="secondary">
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
import axios from 'axios'
import { date } from 'quasar'

export default {
  name: 'InfoTab',
  data () {
    return {
      Info: []
    }
  },
  props: {
    index: {
      type: Number,
      default: 0
    },
    posts: {
      type: Array
    },
    currentDate: {
      type: Date
    },
    IfarTime: {
      type: Date
    },
    ramadanStart: {
      type: Date
    }
  },
  computed: {
    getPercentComplete: function () {
      if (this.current <= 0 || Date.now() <= this.ramadanStart) return 0
      return Math.round(((this.current) / 30) * 100)
    }
  },
  created () {
    this.LoadInfo()
    this.DeterminIfMagribIsOver()
  },
  methods: {
    LoadInfo () {
      axios.get('statics/data/info.csv')
        .then(response => {
          this.Info = response.data.filter(x => new Date(x.EnglishDate) >= this.currentDate).slice(0, 3)
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    DeterminIfMagribIsOver () {
      var item = this.posts[this.index - 1]
      var today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
      var magrib = this.CreatePrayerDateTime(today, item.IFTAR)
      this.IsAfterMagrib = Date.now() >= magrib
      this.current = this.IsAfterMagrib ? this.index : this.index - 1
    },
    CreatePrayerDateTime (today, prayerTime) {
      var splitTime = prayerTime.split(':')
      return date.addToDate(today, { hours: splitTime[0], minutes: splitTime[1] })
    },
    FormatDate (val) {
      return date.formatDate(val, 'DD MMMM YYYY')
    },
    IsOddNight () {
      if (!this.IsAfterMagrib) return false

      return this.current === 20 ||
        this.current === 22 ||
        this.current === 24 ||
        this.current === 26 ||
        this.current === 28
    },
    DeterminRamadanStage () {
      if ((this.current < 10) || (this.current === 10 && !this.IsAfterMagrib)) { return 'Days of Mercy' }

      if ((this.current < 20) || (this.current === 20 && !this.IsAfterMagrib)) { return 'Days of Forgiveness' }

      if (this.current >= 20) { return 'Days of Refuge from Hellfire' }
    }
  }
}
</script>
