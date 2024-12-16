<template>
  <q-page class="q-pa-md">
    <div class="text-h6 q-mb-md">Bowlers</div>

    <div v-if="bowlers.length > 0" class="bowlers-container">
      <q-list bordered separator>
        <BowlerRecord
          v-for="bowler in bowlers"
          :key="bowler._id"
          :bowler="bowler"
          :games-count="bowler.gamesCount"
          :average-score="Math.round(bowler.averageScore)"
        />
      </q-list>
    </div>

    <div v-else class="text-center q-pa-md">
      <p class="text-subtitle1">No bowlers yet!</p>
      <p>Generate some games to see bowlers here.</p>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        icon="add"
        color="primary"
        @click="showDialog = true"
      />
    </q-page-sticky>

    <!-- Add Bowler Dialog -->
    <q-dialog v-model="showDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Add Bowler</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="newBowlerName"
            label="Bowler Name"
            :rules="[val => !!val || 'Name is required']"
            @keyup.enter="addBowler"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Add" @click="addBowler" :disable="!newBowlerName" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useBowlingStore } from 'src/stores/bowling-store';
import BowlerRecord from 'components/BowlerRecord.vue';

const store = useBowlingStore();
const bowlers = computed(() => {
  return store.bowlers.map(bowler => ({
    ...bowler,
    gamesCount: store.getBowlerGamesCount(bowler.id),
    averageScore: store.getBowlerAverageScore(bowler.id)
  }));
});

const showDialog = ref(false);
const newBowlerName = ref('');

function addBowler() {
  if (newBowlerName.value) {
    store.addBowler(newBowlerName.value);
    newBowlerName.value = '';
    showDialog.value = false;
  }
}
</script>

<style scoped>
.q-list {
  max-width: 600px;
  margin: 0 auto;
}

.bowlers-container {
  /* Add padding at the bottom to account for FAB */
  padding-bottom: 80px;
}
</style>
