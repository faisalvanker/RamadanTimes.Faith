<template>
  <div>
    <div class="row text-subtitle1">
      <div class="col text-left">
        {{this.RamadanDate}}
      </div>
      <div class="col text-right">
        {{this.FastDate}}
      </div>
    </div>
    <div class="q-pa-md">
      <!-- <div class="text-h6">Next</div>-->
      <div class="text-h4">
        <q-list
          separator
          class="text-bold"
        >
          <q-item>
            <q-item-section>{{CurrentPrayerName}}</q-item-section>
            <q-item-section side>{{CurrentPrayerTime}}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>{{NextPrayerName}}</q-item-section>
            <q-item-section side>{{NextPrayerTime}}</q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="q-pa-md">
        <q-list bordered>
          <q-expansion-item
            group="somegroup"
            label="Daily Dua"
            default-opened
            header-class="bg-grey-1 text-black text-bold bordered"
          >
            <q-card class="bg-grey-1">
              <q-card-section>
                {{dailyDua}}
              </q-card-section>
            </q-card>
          </q-expansion-item>
          <q-separator />
          <q-expansion-item
            group="somegroup"
            label="Dua for Fasting"
            header-class="bg-grey-1 text-black text-bold"
          >
            <q-card class="bg-grey-1">
              <q-card-section>
                Allahumma Asumu Ghadallaka Faghrili Ma Qad'damtu, Wa Maa Akkhartu
              </q-card-section>
            </q-card>
            <q-separator />
          </q-expansion-item>
          <q-separator />
          <q-expansion-item
            group="somegroup"
            label="Dua for Breaking Fast"
            header-class="bg-grey-1 text-black text-bold"
          >
            <q-card class="bg-grey-1">
              <q-card-section>
                Allahumma Laka Sumtu Wa Bika Aamantu Wa'Alaiyka Tawakkaltu Wa Alaa Rizqika Aftartu Fataqabbal Minni
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </div>

    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { debounce, date } from 'quasar'

export default {
  name: 'NextTab',
  data () {
    return {
      dailyDua: '',
      CurrentPrayerName: '',
      CurrentPrayerTime: '',
      NextPrayerName: '',
      NextPrayerTime: '',
      RamadanDate: '',
      FastDate: ''
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
    },
    ramadanStart: {
      type: Date
    }
  },
  created () {
    this.LoadNextPrayer = debounce(this.LoadNextPrayer, 500)
    this.current = this.index - 1
    this.LoadDailyDua()
    this.LoadNextPrayer()
  },
  methods: {
    LoadDailyDua () {
      axios.get('statics/data/dua/' + this.index + '.csv')
        .then(response => {
          this.dailyDua = response.data.dua
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    LoadNextPrayer () {
      if (Date.now() <= this.ramadanStart) {
        this.SetCurrentNextPrayer('Ramadan', '', '1441', '')
        return
      }

      var item = this.posts[this.current]

      var today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
      var fajr = this.CreatePrayerDateTime(today, item.FAJR)
      var asrSelectionTime = (this.asrTime === 'Hanafi') ? item.ASRH : item.ASRS
      var asr = this.CreatePrayerDateTime(today, asrSelectionTime)
      var magrib = this.CreatePrayerDateTime(today, item.IFTAR)
      var esha = this.CreatePrayerDateTime(today, item.ESHA)
      var fajrException = this.CreatePrayerDateTime(today, item.SUNRISE)

      this.FastDate = item.DATE
      this.RamadanDate = item.FAST + ' Ramadan 1441'

      if (Date.now() <= fajr) {
        this.SetCurrentNextPrayer('Sehri', item.SERI, 'Fajr', item.FAJR)
        return
      }

      if (Date.now() <= fajrException) {
        this.SetCurrentNextPrayer('Fajr', item.FAJR, 'Zohr', item.ZOHR)
        return
      }

      if (Date.now() <= asr) {
        this.SetCurrentNextPrayer('Zohr', item.ZOHR, 'Asr', asrSelectionTime)
        return
      }

      if (Date.now() <= magrib) {
        this.SetCurrentNextPrayer('Asr', asrSelectionTime, 'Iftar', item.IFTAR)
        return
      }

      if (Date.now() <= esha) {
        this.SetCurrentNextPrayer('Iftar', item.IFTAR, 'Esha', item.ESHA)
        return
      }

      if (Date.now() >= esha) {
        var nextPrayer = ''
        var nextPrayerTime = ''

        if (this.current < 29) {
          var nextItem = this.posts[this.current + 1]
          nextPrayer = 'Sehri'
          nextPrayerTime = nextItem.SERI
        }

        this.SetCurrentNextPrayer('Esha', item.ESHA, nextPrayer, nextPrayerTime)
      }
    },
    CreatePrayerDateTime (today, prayerTime) {
      var splitTime = prayerTime.split(':')
      return date.addToDate(today, { hours: splitTime[0], minutes: splitTime[1] })
    },
    SetCurrentNextPrayer (currentName, currentTime, nextName, nextTime) {
      this.CurrentPrayerName = currentName
      this.CurrentPrayerTime = currentTime

      this.NextPrayerName = nextName
      this.NextPrayerTime = nextTime
    }
  }
}
</script>
