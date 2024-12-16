<template>
  <q-page class="flex flex-center">
    <div class="column items-center q-gutter-y-sm">
      <!-- Will be implemented later
      <q-btn
        flat
        dense
        class="nav-button"
        to="/profile"
      >
        <div class="row full-width items-center">
          <q-icon name="person" size="24px" class="q-mr-md" />
          <div class="text-h6">USER PROFILE</div>
        </div>
      </q-btn>
      -->

      <q-btn
        flat
        dense
        class="nav-button"
        to="/series/"
      >
        <div class="row full-width items-center">
          <q-icon :name="mapBowlingAlley" size="24px" class="q-mr-md" />
          <div class="text-h6">SERIES</div>
        </div>
      </q-btn>

      <q-btn
        flat
        dense
        class="nav-button"
        to="/bowlers"
      >
        <div class="row full-width items-center">
          <q-icon name="people" size="24px" class="q-mr-md" />
          <div class="text-h6">BOWLERS</div>
        </div>
      </q-btn>

      <!-- Will be implemented later
      <q-btn
        flat
        dense
        class="nav-button"
        to="/stats"
      >
        <div class="row full-width items-center">
          <q-icon name="analytics" size="24px" class="q-mr-md" />
          <div class="text-h6">STATISTICS</div>
        </div>
      </q-btn>
      -->
    </div>
  </q-page>
</template>

<script setup>
import { mapBowlingAlley } from 'quasar-extras-svg-icons/map-icons';
</script>

<style scoped>
.nav-button {
  width: 280px;
  height: 60px;
  background-color: #4285f4;
  color: white;
  border-radius: 8px;
  padding: 0 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.nav-button:hover {
  background-color: #3367d6;
}

.text-h6 {
  letter-spacing: 1px;
  font-size: 1.1rem;
}
</style>
