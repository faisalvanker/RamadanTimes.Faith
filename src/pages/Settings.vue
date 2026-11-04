<template>
  <div class="q-pa-md">
    <div class="text-h5 text-weight-bold q-mb-md">Preferences</div>
    <q-card>
      <q-card-section class="q-gutter-y-md">
        <q-select
          filled
          clearable
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
          :rules="[(val) => !!val || 'Required']"
        >
          <template v-slot:prepend>
            <q-icon name="place" color="primary" />
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-field
          filled
          label="Calculation Method (Asr & Esha)"
          stack-label
        >
          <template v-slot:prepend>
            <q-icon name="schedule" color="primary" />
          </template>
          <template v-slot:control>
            <div class="self-center full-width no-outline row items-center justify-between">
              <span class="text-subtitle1 text-weight-bold">{{ timeSelection }}</span>
              <q-toggle
                :label="
                  timeSelection === asrMethods.HANAFI
                    ? `Switch to ${asrMethods.SHAFI}`
                    : `Switch to ${asrMethods.HANAFI}`
                "
                :false-value="asrMethods.HANAFI"
                :true-value="asrMethods.SHAFI"
                color="primary"
                dense
                v-model="timeSelection"
              />
            </div>
          </template>
        </q-field>

        <div>
          <q-btn
            @click="saveSettings"
            color="primary"
            icon="check"
            label="Save Preferences"
          />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import axios from "axios";
import {
  STORAGE_KEYS,
  ASR_METHODS,
  DATA_PATHS,
} from "src/constants/appConfig";

export default {
  name: "SettingsPage",
  data() {
    return {
      asrMethods: ASR_METHODS,
      listOfCities: [],
      citySelection: "",
      timeSelection: ASR_METHODS.HANAFI,
      options: null,
    };
  },

  methods: {
    filterFn(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        this.options = this.listOfCities.filter(
          (v) => v.city.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    saveSettings() {
      this.$refs.citySelection.validate();

      if (this.$refs.citySelection.hasError) {
        this.$q.notify({
          color: "negative",
          message: "Please select a city",
        });
        return;
      }

      try {
        this.$q.localStorage.set(STORAGE_KEYS.CITY, this.citySelection);
        this.$q.localStorage.set(STORAGE_KEYS.ASR_METHOD, this.timeSelection);

        this.$q.notify({
          icon: "done",
          color: "positive",
          message: "Preferences Saved",
        });
        this.$router.push("/");
      } catch (e) {
        console.log(e);
      }
    },
  },
  created() {
    axios
      .get(DATA_PATHS.CITIES_LIST)
      .then((response) => {
        this.listOfCities = response.data;
      })
      .catch(() => {});

    this.citySelection = this.$q.localStorage.getItem(STORAGE_KEYS.CITY) ?? "";
    this.timeSelection =
      this.$q.localStorage.getItem(STORAGE_KEYS.ASR_METHOD) ?? ASR_METHODS.HANAFI;
  },
};
</script>
