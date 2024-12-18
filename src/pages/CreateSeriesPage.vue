<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Create New Series</div>

    <q-form @submit="onSubmit" class="q-gutter-md">
      <!-- Series Name -->
      <q-select
        v-model="seriesName"
        :options="seriesNameOptions"
        label="Series Name"
        filled
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        @filter="filterSeriesNames"
        @input-value="setSeriesName"
        hint="Select an existing name or enter a new one"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              Press Enter to use "{{ inputValue || 'New Series' }}"
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <!-- Location -->
      <q-input
        v-model="location"
        label="Location"
        filled
        hint="Enter the bowling alley or location"
      />

      <!-- Bowler Selection -->
      <q-select
        ref="bowlerSelect"
        v-model="selectedBowlers"
        :options="filteredBowlerOptions"
        label="Select Bowlers"
        filled
        multiple
        use-chips
        use-input
        input-debounce="0"
        @filter="filterBowlers"
        @new-value="onAddNewBowler"
        @keyup.enter.prevent="onEnterPress"
        new-value-mode="add-unique"
        :rules="[val => val.length > 0 || 'Please select at least one bowler']"
      >
        <template v-slot:no-option="{ inputValue }">
          <q-item clickable v-close-popup @click="onAddNewBowler(inputValue)">
            <q-item-section>
              <q-item-label>Add "{{ inputValue || 'New Bowler' }}" as a new bowler</q-item-label>
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
          to="/series/"
        />
        <q-btn
          label="Create Series"
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

// Series name handling
const seriesName = ref('');
const location = ref('');
const inputValue = ref('');
const seriesNameOptions = ref([]);

// Get unique series names from existing series
const existingSeriesNames = computed(() => {
  const names = store.series.map(series => series._name);
  return [...new Set(names)];
});

function filterSeriesNames(val, update) {
  inputValue.value = val;

  update(() => {
    if (val === '') {
      seriesNameOptions.value = existingSeriesNames.value;
    } else {
      const needle = val.toLowerCase();
      seriesNameOptions.value = existingSeriesNames.value.filter(
        v => v.toLowerCase().indexOf(needle) > -1
      );
    }
  });
}

function setSeriesName(val) {
  seriesName.value = val || 'New Series';
}

// Bowler selection handling
const selectedBowlers = ref([]);
const filteredBowlerOptions = ref([]);
const bowlerSelect = ref(null);

const bowlerOptions = computed(() => {
  return store.bowlers.map(bowler => ({
    label: bowler._name,
    value: bowler
  }));
});

function filterBowlers(val, update) {
  update(() => {
    if (val === '') {
      filteredBowlerOptions.value = bowlerOptions.value;
    } else {
      const needle = val.toLowerCase();
      filteredBowlerOptions.value = store.bowlers
        .filter(bowler => bowler._name.toLowerCase().indexOf(needle) > -1)
        .map(bowler => ({
          label: bowler._name,
          value: bowler
        }));
    }
  });
}

function onAddNewBowler(name) {
  // Ensure name is a string and not empty
  const bowlerName = String(name || '').trim();
  if (!bowlerName) return;

  // Check if bowler already exists
  const existingBowler = store.bowlers.find(
    bowler => bowler._name.toLowerCase() === bowlerName.toLowerCase()
  );

  if (existingBowler) {
    // If bowler exists, just add to selection if not already selected
    const alreadySelected = selectedBowlers.value.some(
      selected => selected.value._id === existingBowler._id
    );
    if (!alreadySelected) {
      selectedBowlers.value.push({
        label: existingBowler._name,
        value: existingBowler
      });
    }
  } else {
    // Create new bowler and add to selection
    const newBowler = store.addBowler(bowlerName);
    selectedBowlers.value.push({
      label: newBowler._name,
      value: newBowler
    });
  }
}

function getBowlerAverageScore(bowlerId) {
  const bowler = typeof bowlerId === 'string' ? store.getBowlerById(bowlerId) : bowlerId;
  return store.getBowlerAverageScore(bowler._id);
}

function onEnterPress(e) {
  const input = e.target;
  const value = input.value?.trim();
  if (value) {
    onAddNewBowler(value);
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

async function onSubmit() {
  try {
    console.log('Selected bowlers:', selectedBowlers.value);
    const series = store.startNewSeries(
      selectedBowlers.value.map(bowler => bowler.value),
      seriesName.value || 'New Series',
      location.value,
      false,  // Don't generate scores for manually created series
      null    // Use current time for manually created series
    );

    if (series) {
      router.push('/series');
    }
  } catch (error) {
    console.error('Error creating series:', error);
  }
}
</script>

<style scoped>
.q-page {
  max-width: 600px;
  margin: 0 auto;
}
</style>
