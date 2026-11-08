<template>
  <div class="q-pa-md">
    <div class="text-h5 text-weight-bold q-mb-md">Welcome</div>
    <q-card>
      <q-card-section class="q-gutter-y-md">
        <div v-if="isRamadanActive" class="text-body1">
          Ramadan Kareem {{ hijriYear }}. May this sacred month of Ramadan be of
          benefit to us and our family. May all our good deeds, prayers and acts
          of devotion be accepted during this month. Contact us on
          {{ contactEmail }}
        </div>
        <div v-else class="text-body1">
          Assalamu Alaikum. Welcome to Salaah &amp; Ramadan Times. Track daily
          Salaah, Suhoor and Iftar times across South Africa. Contact us on
          {{ contactEmail }}
        </div>
        <div class="text-body1">
          Share this app with your family and friends. Click the button below to
          get started
        </div>

        <div class="row q-col-gutter-sm">
          <div class="col-6 col-sm-auto">
            <q-btn
              unelevated
              no-caps
              color="primary"
              label="Preferences"
              icon="settings"
              class="about-action-btn full-width"
              @click="RedirectToSettings"
            />
          </div>
          <div class="col-6 col-sm-auto">
            <q-btn
              outline
              no-caps
              color="primary"
              label="Share App"
              icon="share"
              class="about-action-btn full-width"
              @click="ShareApp"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import {
  SHARE_URL,
  CONTACT_EMAIL_DISPLAY,
  RAMADAN_CONFIG,
  isCurrentlyRamadan,
  fetchAnnualConfig,
} from "src/constants/appConfig";

export default {
  name: "AboutPage",
  created() {
    fetchAnnualConfig().then((cfg) => {
      this.hijriYear = cfg.HIJRI_YEAR;
      this.isRamadanActive = isCurrentlyRamadan();
    });
  },
  data() {
    return {
      hijriYear: RAMADAN_CONFIG.HIJRI_YEAR,
      isRamadanActive: isCurrentlyRamadan(),
      contactEmail: CONTACT_EMAIL_DISPLAY,
    };
  },
  methods: {
    RedirectToSettings() {
      this.$router.push("/Settings");
    },
    ShareApp() {
      if (typeof navigator !== "undefined" && navigator.share) {
        navigator
          .share({
            title: "Ramadan Times",
            text: "Ramadan Time Table for South Africa",
            url: SHARE_URL,
          })
          .catch(() => {});
      } else {
        window.open(
          "whatsapp://send?text=" + encodeURIComponent(SHARE_URL),
          "_blank"
        );
      }
    },
  },
};
</script>

<style scoped>
.about-action-btn {
  min-width: 150px;
  min-height: 42px;
  white-space: nowrap;
}

@media (max-width: 599px) {
  .about-action-btn {
    min-width: 0;
  }
}
</style>
