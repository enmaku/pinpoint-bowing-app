<template>
  <q-page class="q-pb-xl">
    <div v-if="games.length > 0" class="q-pa-md">
      <div v-for="game in games" :key="game.id" class="q-mb-md">
        <GameRecord :game="game" />
      </div>
    </div>

    <div v-else class="text-center q-pa-md">
      <p class="text-h6">No games yet!</p>
      <p>Start a new game or generate sample games to get started.</p>
    </div>

    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Generate Games</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model.number="numGames"
            type="number"
            label="Number of games to generate"
            :rules="[val => val > 0 || 'Please enter a number greater than 0']"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Generate" @click="generateGames" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-page-sticky position="bottom" :offset="[18, 18]">
      <q-fab icon="add" direction="up" color="primary">
        <q-fab-action
          color="primary"
          @click="router.push('/games/create')"
          icon="sports_score"
          label="Create New Game"
        />
        <q-fab-action
          color="primary"
          @click="showDialog = true"
          icon="casino"
          label="Generate Sample Games"
        />
        <q-fab-action
          v-if="hasData"
          color="negative"
          @click="store.clearAllData"
          icon="delete_forever"
          label="Clear All Data"
        />
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import GameRecord from 'src/components/GameRecord.vue';
import { useBowlingStore } from 'src/stores/bowling-store';
import { generateSampleGame } from 'src/utils/gameGenerator';

const router = useRouter();
const store = useBowlingStore();
const showDialog = ref(false);
const numGames = ref(1);

const games = computed(() => {
  return [...store.games].sort((a, b) => new Date(b._timestamp) - new Date(a._timestamp));
});

const hasData = computed(() => store.bowlers.length > 0 || store.games.length > 0);

function generateGames() {
  const count = parseInt(numGames.value);
  if (count > 0) {
    for (let i = 0; i < count; i++) {
      generateSampleGame(store);
    }
    numGames.value = 1;
  }
}

onMounted(() => {
  store.initializeStore();
});
</script>
