<template>

  <div class="q-pa-md">
    <div class="text-h5 text-weight-bold">Preferences</div>
    <div class="q-gutter-y-md">

      <q-select
        filled
        v-model="citySelection"
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        :options="options"
        option-value="id"
        option-label="city"
        label="Choose a City"
        @filter="filterFn"
        ref="citySelection"
        lazy-rules
        :rules="[ val => !!val || 'Required']"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-toggle
        :label="timeSelection"
        false-value="Hanafi"
        true-value="Shafi"
        v-model="timeSelection"
      />
    </div>
    <q-btn
      @click="saveSettings"
      color="primary"
    >Save</q-btn>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Settings',
  data () {
    return {
      listOfCities: [],
      citySelection: '',
      timeSelection: '',
      options: null,
      errors: []
    }
  },

  methods: {
    filterFn (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.options = this.listOfCities.filter(v => v.city.toLowerCase().indexOf(needle) > -1)
      })
    },
    saveSettings () {
      this.$refs.citySelection.validate()

      if (this.$refs.citySelection.hasError) {
        this.$q.notify({
          color: 'negative',
          message: 'Please select a city'
        })
        return
      }

      try {
        this.$q.localStorage.set('city', this.citySelection)
        this.$q.localStorage.set('time', this.timeSelection)

        this.$q.notify({
          icon: 'done',
          color: 'positive',
          message: 'Preferences Saved'
        })
        this.$router.push('/')
      } catch (e) {
        // data wasn't successfully saved due to
        // a Web Storage API error
      }
    }
  },
  created () {
    axios.get('./statics/data/cities.csv')
      .then(response => {
        this.listOfCities = response.data
      })
      .catch(e => {
        this.errors.push(e)
      })

    this.citySelection = this.$q.localStorage.getItem('city') ?? ''
    this.timeSelection = this.$q.localStorage.getItem('time') ?? 'Hanafi'
  }
}

</script>
