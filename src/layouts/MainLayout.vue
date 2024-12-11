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
import { ref } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';
import { mapBowlingAlley } from 'quasar-extras-svg-icons/map-icons';

defineOptions({
  name: 'MainLayout'
});

const linksList = [
  {
    title: 'Home',
    icon: 'home',
    link: '/'
  },
  // Will be implemented later
  // {
  //   title: 'User Profile',
  //   icon: 'person',
  //   link: '/profile'
  // },
  {
    title: 'Games',
    //caption: 'quasar.dev',
    icon: mapBowlingAlley,
    link: '/games/'
  },
  {
    title: 'Bowlers',
    //caption: 'github.com/quasarframework',
    icon: 'people',
    link: '/bowlers'
  }
  // Will be implemented later
  //{
  //  title: 'Statistics',
  //  //caption: 'chat.quasar.dev',
  //  icon: 'analytics',
  //  link: '/stats'
  //}
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
