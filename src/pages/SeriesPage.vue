<template>
  <q-page class="q-pb-md">
    <div class="q-pa-none">
      <div v-if="series.length > 0" class="q-pa-none series-list">
        <div v-for="seriesItem in series" :key="seriesItem.id">
          <q-expansion-item
            group="series"
            expand-icon-class="text-primary"
            class="q-py-none"
            dense
          >
            <template #header>
              <div class="column full-width series-header">
                <div class="row items-start justify-between no-wrap q-mb-xs">
                  <div class="col text-primary text-h6">{{ seriesItem._name }}</div>
                  <div class="col-auto text-caption no-wrap q-ml-sm" style="min-width: 85px; text-align: right">{{ formatDate(seriesItem._timestamp) }}</div>
                </div>
                <div class="row items-center q-gutter-x-xs">
                  <q-chip
                    v-for="bowlerId in seriesItem._bowlerIds"
                    :key="bowlerId"
                    :label="getBowlerName(bowlerId)"
                    :color="getBowlerColor(bowlerId)"
                    text-color="white"
                    size="sm"
                    class="q-ma-none"
                  />
                </div>
              </div>
            </template>

            <q-card>
              <q-card-section class="q-pa-sm">
                <div class="text-subtitle2">Location: {{ seriesItem._location }}</div>
                <div v-for="game in seriesItem._games" :key="game._id" class="q-mt-sm">
                  <GameRecord :game="game" />
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </div>
      </div>

      <div v-else class="text-center q-pa-sm">
        <p class="text-h6">No series yet!</p>
        <p>Start a new series or generate sample series to get started.</p>
      </div>

      <q-dialog v-model="showDialog" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Generate Series</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
              v-model.number="numSeries"
              type="number"
              label="Number of series to generate"
              :rules="[val => val > 0 || 'Please enter a number greater than 0']"
            />
            <q-input
              v-model.number="gamesPerSeries"
              type="number"
              label="Games per series"
              class="q-mt-md"
              :rules="[val => val > 0 || 'Please enter a number greater than 0']"
            />
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn flat label="Generate" @click="generateSeries" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-page-sticky position="bottom" :offset="[18, 18]">
        <q-fab icon="add" direction="up" color="primary">
          <q-fab-action
            color="primary"
            @click="router.push('/series/create')"
            icon="sports_score"
            label="Create New Series"
          />
          <q-fab-action
            color="primary"
            @click="showDialog = true"
            icon="casino"
            label="Generate Sample Series"
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
    </div>
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
const numSeries = ref(1);
const gamesPerSeries = ref(3);

const series = computed(() => {
  return [...store.series].sort((a, b) => new Date(b._timestamp) - new Date(a._timestamp));
});

const hasData = computed(() => store.bowlers.length > 0 || store.series.length > 0);

function getBowlerName(bowlerId) {
  const bowler = store.getBowlerById(bowlerId);
  return bowler ? bowler._name : 'Unknown Bowler';
}

function getBowlerColor(bowlerId) {
  const bowler = store.getBowlerById(bowlerId);
  return bowler ? bowler.color : 'primary';
}

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString();
}

function addGameToSeries(series) {
  store.setCurrentSeries(series._id);
  store.startNewGame();
}

function generateSeries() {
  const seriesCount = parseInt(numSeries.value);
  const gamesCount = parseInt(gamesPerSeries.value);

  if (seriesCount > 0 && gamesCount > 0) {
    // First ensure we have some bowlers
    if (store.bowlers.length === 0) {
      store.addBowler('Alice', 'bowler_alice');   // Pro (0.9)
      store.addBowler('Bob', 'bowler_bob');       // Pro (0.8)
      store.addBowler('Carol', 'bowler_carol');   // Intermediate (0.6)
      store.addBowler('Dave', 'bowler_dave');     // Beginner (0.4)
      store.addBowler('Eve', 'bowler_eve');       // Beginner (0.2)
      store.addBowler('Mallory', 'bowler_mallory'); // Novice (0.0)
    }

    const locations = [
      'Sunset Lanes',
      'Golden Pin Bowl',
      'Strike City',
      'Starlight Bowling',
      'Pacific Lanes',
      'Lucky Strike'
    ];

    // Create series in reverse order so newer ones appear at the top
    for (let i = seriesCount - 1; i >= 0; i--) {
      // Select 2-4 random bowlers for this series
      const numBowlers = Math.floor(Math.random() * 3) + 2;
      const availableBowlers = [...store.bowlers];
      const selectedBowlers = [];

      for (let j = 0; j < numBowlers && availableBowlers.length > 0; j++) {
        const index = Math.floor(Math.random() * availableBowlers.length);
        selectedBowlers.push(availableBowlers.splice(index, 1)[0]);
      }

      // Calculate base timestamp for this series (days ago)
      // Make gaps between series more distinct: 2-4 days between series
      const daysAgo = i * (Math.floor(Math.random() * 3) + 2);
      // Vary the time of day: between 11 AM and 10 PM
      const hoursOffset = Math.floor(Math.random() * 11) + 11;
      const minutesOffset = Math.floor(Math.random() * 60);
      
      const now = new Date();
      const seriesDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - daysAgo,
        hoursOffset,
        minutesOffset
      );
      
      // Generate series name from bowlers
      const location = locations[Math.floor(Math.random() * locations.length)];
      let seriesName;
      if (selectedBowlers.length === 2) {
        seriesName = `${selectedBowlers[0]._name} & ${selectedBowlers[1]._name}`;
      } else if (selectedBowlers.length === 3) {
        seriesName = `${selectedBowlers[0]._name}, ${selectedBowlers[1]._name} & ${selectedBowlers[2]._name}`;
      } else {
        seriesName = `${selectedBowlers[0]._name}, ${selectedBowlers[1]._name}, ${selectedBowlers[2]._name} & ${selectedBowlers[3]._name}`;
      }
      seriesName += ` at ${location}`;

      // Create the series with the selected bowlers
      const series = store.startNewSeries(
        selectedBowlers.map(b => b._id),
        seriesName,
        location,
        true,  // Generate scores for the first game
        seriesDate  // Pass the timestamp directly
      );

      // Set first game timestamp
      store.currentSeries._games[0]._timestamp = seriesDate.toISOString();

      // Generate additional games for this series with realistic timestamps
      // Each game takes 12-15 minutes per player, plus 5-10 minutes between games
      const minutesPerGame = (numBowlers * (12 + Math.floor(Math.random() * 4))) + 
                           (5 + Math.floor(Math.random() * 6));
      
      for (let j = 0; j < gamesCount - 1; j++) {
        store.startNewGame(true);
        // Set game timestamp to be after the previous game
        const gameTime = new Date(seriesDate.getTime() + ((j + 1) * minutesPerGame * 60 * 1000));
        store.currentSeries._games[store.currentSeries._games.length - 1]._timestamp = gameTime.toISOString();
      }
    }

    numSeries.value = 1;
    gamesPerSeries.value = 3;
  }
}

onMounted(() => {
  store.initializeStore();
});
</script>

<style>
.series-list {
  padding-bottom: 80px;
}

.q-expansion-item {
  border-bottom: 1px solid #e0e0e0;
  border-radius: 0;
  margin: 0;
}

.q-expansion-item:first-child {
  border-top: 1px solid #e0e0e0;
}

.series-header {
  padding: 8px;
}

.q-expansion-item__container {
  padding: 0;
}

.q-expansion-item__content {
  padding: 8px;
  background: #f8f8f8;
  border-top: 1px solid #e0e0e0;
}

.q-chip {
  min-width: 32px;
}

.text-h6 {
  font-size: 1.15rem;
  line-height: 1.2;
  margin: 0;
}

.text-subtitle2 {
  font-size: 0.9rem;
  line-height: 1.2;
  margin: 0;
}
</style>
