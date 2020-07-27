<template>
  <q-layout
    view="lHh Lpr lFf"
    class="bg-lime-1"
  >
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

        <q-toolbar-title>
          Ramadan Times
        </q-toolbar-title>

        <!--<div>Ramadan Times</div>-->

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Menu
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink'

export default {
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: [
        {
          title: 'Ramadan Times',
          caption: 'Home',
          icon: 'home',
          link: ''
        },
        {
          title: 'Tasbeeh',
          caption: 'Counter',
          icon: 'format_list_numbered',
          link: '#/Tasbeeh'
        },
        {
          title: 'Preferences',
          caption: 'Choose your city',
          icon: 'settings',
          link: '#/Settings'
        },
        {
          title: 'Contact',
          caption: 'send us a message',
          icon: 'chat',
          link: '#/Contact'
        },
        {
          title: 'Share',
          caption: 'share on whats app',
          class: 'mobile-only',
          icon: 'share',
          link: 'whatsapp://send?text=https://www.ramadantimes.faith'
        },
        {
          title: 'About',
          caption: 'info about this app',
          icon: 'info',
          link: '#/About'
        }
      ]
    }
  }
}
</script>
