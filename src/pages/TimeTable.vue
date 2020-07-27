<template>
  <div class="q-pa-md">
    <div class="text-h5 text-weight-bold">{{city}}</div>
    <div class="q-gutter-y-md">
      <q-card>
        <q-tabs
          class="bg-green-8 text-white"
          v-model="tab"
          dense
          active-color="text-bold"
          indicator-color="green-5"
          align="justify"
          inline-label
        >
          <q-tab
            name="next"
            label="Next"
            icon="date_range"
          />
          <q-tab
            name="times"
            label="Times"
            icon="schedule"
          />
          <q-tab
            name="info"
            label="Info"
            icon="sort"
          />
        </q-tabs>

        <q-tab-panels
          v-model="tab"
          animated
        >
          <q-tab-panel name="next">
            <NextTab
              v-bind:posts="this.posts"
              v-bind:index="this.current"
              v-bind:asrTime="this.AsrTime"
              v-bind:ramadanStart="this.ramadanStarts"
            />

          </q-tab-panel>

          <q-tab-panel name="times">
            <TimeTableTab
              v-bind:index="this.current"
              v-bind:posts="this.posts"
              v-bind:asrTime="this.AsrTime"
            />
          </q-tab-panel>

          <q-tab-panel name="info">
            <InfoTab
              v-bind:index="this.current"
              v-bind:currentDate="this.currentDate"
              v-bind:posts="this.posts"
              v-bind:ramadanStart="this.ramadanStarts"
            />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </div>
</template>

<script>
import InfoTab from 'components/InfoTab'
import TimeTableTab from 'components/TimeTableTab'
import NextTab from 'components/NextTab'

import axios from 'axios'
import { date } from 'quasar'

export default {
  name: 'TimeTable',
  components: {
    NextTab,
    TimeTableTab,
    InfoTab
  },
  created () {
    this.InitialiseVariables()
    this.RedirectNewVisitorsToWelcome()
    this.LoadTimeTableData()
    this.DeterminCurrentDay()
  },
  data () {
    return {
      city: '',
      tab: 'next',
      current: 1,
      posts: [],
      currentDate: ''
    }
  },
  methods: {
    LoadTimeTableData () {
      axios.get('statics/data/city/' + this.city + '.csv')
        .then(response => {
          this.posts = response.data
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    DeterminCurrentDay () {
      // var ramadanStarts = new Date(2020, 3, 25)
      this.ramadanStarts = new Date(2020, 3, 25)
      this.currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
      var page = date.getDateDiff(this.currentDate, this.ramadanStarts, 'days')
      this.current = page < 0 ? 1 : page + 1
    },
    InitialiseVariables () {
      if (this.$q.localStorage.has('city')) {
        this.city = this.$q.localStorage.getItem('city').city
      }
      if (this.$q.localStorage.has('time')) {
        this.AsrTime = this.$q.localStorage.getItem('time')
      }
    },
    RedirectNewVisitorsToWelcome () {
      if (this.city === '') {
        this.$router.push('/About')
      }
    }
  }
}
</script>
