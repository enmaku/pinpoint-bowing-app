<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          PinPoint
        </q-toolbar-title>

        <div>v0.1a</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list class="q-py-sm">
        <EssentialLink
          v-for="link in linksList"
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

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { mapBowlingAlley } from 'quasar-extras-svg-icons/map-icons';

defineOptions({
  name: 'MainLayout'
})

const linksList = [
  {
    title: 'User Profile',
    icon: 'person'
  },
  {
    title: 'Games',
    //caption: 'quasar.dev',
    icon: mapBowlingAlley,
    //link: 'https://quasar.dev'
  },
  {
    title: 'Friends',
    //caption: 'github.com/quasarframework',
    icon: 'people',
    //link: 'https://github.com/quasarframework'
  },
  {
    title: 'Statistics',
    //caption: 'chat.quasar.dev',
    icon: 'analytics',
    //link: 'https://chat.quasar.dev'
  }
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
