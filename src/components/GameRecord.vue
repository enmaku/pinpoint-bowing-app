<template>
  <q-card style="width: 100%; height: auto;" class="q-pa-xs">
      <q-card-section class="q-pa-none">
        <div class="game-record">
          <div class="game-header">
            <div class="game-title">{{ game._name }}</div>
            <div class="game-timestamp">{{ game._timestamp }}</div>
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

<script>
import { defineComponent } from 'vue';
import ScoreCardRecord from './ScoreCardRecord.vue';

export default defineComponent({
  name: 'GameRecord',
  components: {
    ScoreCardRecord
  },
  props: {
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
  }
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
  font-size: 1.2em;
  font-weight: bold;
  color: #2c3e50;
}

.game-timestamp {
  font-size: 0.9em;
  color: #666;
}
</style>
