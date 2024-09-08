<template>
  <q-card style="width: 100%; height: auto;" class="q-pa-xs">
      <q-card-section class="q-pa-none">
        <div class="row flex">
          <div class="col-1"></div>
          <div class="col flex items-center">
            <strong style="font-size: 4vw;">{{ game.name }}</strong>
            <q-space />
            <span class="text-caption text-grey-8" style="font-size: 2.5vw;">{{ game.timestamp }}</span>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <div v-for="scorecard in game.scoreCards" :key="scorecard.id" class="q-py-none">
          <ScoreCardRecord :scorecard="scorecard" />
          <div class="q-py-xs"></div>
        </div>
      </q-card-section>
    </q-card>
</template>

<script>
import Game from 'src/models/Game';
import ScoreCardRecord from './ScoreCardRecord.vue';

export default {
  name: 'GameRecord',
  props: {
    game: {
      type: Game,
      required: true
    }
  },
  components: {
    ScoreCardRecord
  },
  setup () {
    return {}
  }
}
</script>
