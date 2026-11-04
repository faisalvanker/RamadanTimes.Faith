<template>
  <q-layout view="lHh Lpr lFf" class="bg-app-surface">
    <q-header elevated>
      <q-toolbar class="bg-green-8">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title
          class="row items-center no-wrap cursor-pointer"
          @click="$router.push('/')"
        >
          <img
            src="icons/Icon-128.png"
            :alt="isRamadanActive ? 'Ramadan Times' : 'Salaah Times'"
            class="header-mosque-icon q-mr-sm"
          />
          <span class="text-weight-bold">
            {{ isRamadanActive ? "Ramadan Times" : "Salaah Times" }}
          </span>
          <q-badge
            v-if="isRamadanActive"
            color="green-10"
            text-color="white"
            :label="`${hijriYear} AH`"
            class="q-ml-sm text-caption text-weight-bold"
          />
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-app-surface"
    >
      <q-list>
        <q-item-label header class="text-grey-8"> Menu </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
          @click="leftDrawerOpen = false"
        />
      </q-list>
      <div class="q-pa-md text-caption text-grey-6">
        Ramadan Times v{{ appVersion }}
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink.vue";
import {
  APP_VERSION,
  SHARE_URL,
  RAMADAN_CONFIG,
  isCurrentlyRamadan,
} from "src/constants/appConfig";

export default {
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  data() {
    const isRamadanActive = isCurrentlyRamadan();
    return {
      appVersion: APP_VERSION,
      hijriYear: RAMADAN_CONFIG.HIJRI_YEAR,
      isRamadanActive,
      leftDrawerOpen: false,
      essentialLinks: [
        {
          title: isRamadanActive ? "Ramadan Times" : "Salaah Times",
          caption: "Home",
          icon: "home",
          link: "#/",
        },
        {
          title: "Tasbeeh",
          caption: "Counter",
          icon: "format_list_numbered",
          link: "#/Tasbeeh",
        },
        {
          title: "Preferences",
          caption: "Choose your city",
          icon: "settings",
          link: "#/Settings",
        },
        {
          title: "Share",
          caption: "share on whats app",
          class: "mobile-only",
          icon: "share",
          link: `whatsapp://send?text=${encodeURIComponent(SHARE_URL)}`,
        },
        {
          title: "About",
          caption: "info about this app",
          icon: "info",
          link: "#/About",
        },
      ],
    };
  },
};
</script>

<style scoped>
.header-mosque-icon {
  height: 28px;
  width: 28px;
  object-fit: contain;
  filter: brightness(0) invert(1);
}
</style>
