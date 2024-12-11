<template>
  <q-card style="width: 100%; height: auto;" class="q-pa-xs">
      <q-card-section class="q-pa-none">
        <div class="game-record">
          <div class="game-header">
            <div class="game-title">{{ game._name }}</div>
            <div class="game-timestamp">{{ formattedTimestamp }}</div>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <div v-for="scorecard in game._scorecards" :key="scorecard.id" class="q-py-none">
          <ScoreCardRecord :scorecard="scorecard" />
          <div class="q-py-xs"></div>
        </div>
      </q-card-section>
    </q-card>
</template>

<script setup>
import { computed } from 'vue';
import ScoreCardRecord from './ScoreCardRecord.vue';

const props = defineProps({
  game: {
    type: Object,
    required: true,
    validator: function(value) {
      return value &&
             typeof value._id === 'string' &&
             typeof value._name === 'string' &&
             Array.isArray(value._bowlerIds) &&
             Array.isArray(value._scorecards);
    }
  }
});

const formattedTimestamp = computed(() => {
  const date = new Date(props.game._timestamp);
  return new Intl.DateTimeFormat('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
});
</script>

<style scoped>
.game-record {
  padding: 8px;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.game-title {
  font-weight: bold;
  font-size: 1.1em;
}

.game-timestamp {
  color: #666;
  font-size: 0.9em;
}
</style>
