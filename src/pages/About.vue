<template>
  <div class="q-pa-md">
    <div class="text-h5 text-weight-bold q-mb-md">Welcome</div>
    <q-card>
      <q-card-section class="q-gutter-y-md">
        <div class="text-body1">
          Ramadan Kareem {{ hijriYear }}. May this sacred month of Ramadan be of
          benefit to us and our family. May all our good deeds, prayers and acts
          of devotion be accepted during this month. Contact us on
          {{ contactEmail }}
        </div>
        <div class="text-body1">
          Share this app with your family and friends. Click the button below to
          get started
        </div>

        <div class="row items-center q-gutter-sm">
          <q-btn
            color="primary"
            label="Preferences"
            icon="settings"
            @click="RedirectToSettings"
          />
          <q-btn
            outline
            color="primary"
            label="Share App"
            icon="share"
            @click="ShareApp"
          />
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
} from "src/constants/appConfig";

export default {
  name: "AboutPage",
  data() {
    return {
      hijriYear: RAMADAN_CONFIG.HIJRI_YEAR,
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
