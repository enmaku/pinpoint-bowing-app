<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Create New Game</div>

    <q-form @submit="onSubmit" class="q-gutter-md">
      <!-- Game Name -->
      <q-select
        v-model="gameName"
        :options="gameNameOptions"
        label="Game Name"
        filled
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        @filter="filterGameNames"
        @input-value="setGameName"
        hint="Select an existing name or enter a new one"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              Press Enter to use "{{ inputValue || 'New Game' }}"
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <!-- Bowler Selection -->
      <q-select
        v-model="selectedBowlers"
        :options="bowlerOptions"
        label="Select Bowlers"
        filled
        multiple
        use-chips
        :rules="[val => val.length > 0 || 'Please select at least one bowler']"
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-item-label>{{ scope.opt.label }}</q-item-label>
              <q-item-label caption>
                Average: {{ getBowlerAverageScore(scope.opt.value) }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <!-- Submit Button -->
      <div class="row justify-end q-mt-md">
        <q-btn
          label="Cancel"
          flat
          class="q-mr-sm"
          to="/games/"
        />
        <q-btn
          label="Create Game"
          type="submit"
          color="primary"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useBowlingStore } from 'src/stores/bowling-store';

const router = useRouter();
const store = useBowlingStore();

// Game name handling
const gameName = ref('');
const inputValue = ref('');
const gameNameOptions = ref([]);

// Get unique game names from existing games
const existingGameNames = computed(() => {
  const names = store.games.map(game => game._name);
  return [...new Set(names)];
});

function filterGameNames(val, update) {
  inputValue.value = val;

  update(() => {
    if (val === '') {
      gameNameOptions.value = existingGameNames.value;
    } else {
      const needle = val.toLowerCase();
      gameNameOptions.value = existingGameNames.value.filter(
        v => v.toLowerCase().indexOf(needle) > -1
      );
    }
  });
}

function setGameName(val) {
  gameName.value = val;
  inputValue.value = val;
}

// Bowler selection handling
const selectedBowlers = ref([]);

const bowlerOptions = computed(() => {
  return store.bowlers.map(bowler => ({
    label: bowler.name,
    value: bowler.id
  }));
});

const getBowlerAverageScore = (bowlerId) => {
  return store.getBowlerAverageScore(bowlerId);
};

// Form submission
async function onSubmit() {
  if (selectedBowlers.value.length === 0) return;

  // Use the input value if no game name is selected from the dropdown
  const finalGameName = gameName.value || inputValue.value || 'New Game';

  // Do exactly what gameGenerator does:
  const bowlersInGame = [];
  for (const selected of selectedBowlers.value) {
    const bowler = store.getBowlerById(selected.value);
    if (bowler) {
      bowlersInGame.push(bowler);
    }
  }

  // Create game with bowlers, exactly like gameGenerator
  store.startNewGame(bowlersInGame.map(b => b.id), finalGameName);

  // Navigate back to the games list
  router.push('/games/');
}
</script>

<style scoped>
.q-page {
  max-width: 600px;
  margin: 0 auto;
}
</style>
