<template>
  <q-page>
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
        <!-- row -->
        <div v-for="scorecard in game.scoreCards" :key="scorecard.id">
          <div class="row">
            <div class="col-1 justify-center items-center flex">
              <q-avatar class="scaleavatar" :color="scorecard.bowlerColor" text-color="white">{{ scorecard.bowlerName.substring(0, 1) }}</q-avatar>
            </div>
            <template v-for="frame in scorecard.frames" :key="frame.frameNumber">
              <div :class="frame.frameNumber == 10 ? 'col-2' : 'col-1'">
                <div class="row">
                  <div v-for="roll in frame.getRollScores()" :key="roll.rollNumber" class="col scorecard">
                    {{ roll.strike ? 'X' : roll.spare ? '/' : roll.pins == 0 ? '-' : roll.pins }}
                  </div>
                </div>
                <div class="row">
                  <div class="col scorecard">
                    {{ frame.frameScore == 0 ? '-' : frame.frameScore }}
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style>
  .scorecard {
    border: 1px solid black;
    text-align: center;
    font-size: 3.2vw;
    font-weight: bolder;
  }

  .scaleavatar {
    height: 7vw;
    width: 7vw;
    font-size: 7vw;
  }
</style>

<script setup>
import { ref } from 'vue';
// import PinDiagram from 'components/PinDiagram.vue';
import Bowler from 'src/models/Bowler.js';
import Game from 'src/models/Game.js';

const bowler1 = ref(new Bowler());
bowler1.value.name = 'Dave';
bowler1.value.color = 'red';
const bowler2 = ref(new Bowler());
bowler2.value.name = 'Lisa';
bowler2.value.color = 'green';
const game = ref(new Game());
game.value.addBowler(bowler1.value);
bowler1.value.addGame(game.value.id);
game.value.addBowler(bowler2.value);
bowler2.value.addGame(game.value.id);

game.value.scoreCards[0].setScore(1, 1, 7);
game.value.scoreCards[0].setScore(1, 2, 3);
game.value.scoreCards[0].setScore(2, 1, 6);
game.value.scoreCards[0].setScore(2, 2, 2);
game.value.scoreCards[0].setScore(3, 1, 10);
game.value.scoreCards[0].setScore(4, 1, 5);
game.value.scoreCards[0].setScore(4, 2, 2);
game.value.scoreCards[0].setScore(5, 1, 0);
game.value.scoreCards[0].setScore(5, 2, 10);
game.value.scoreCards[0].setScore(6, 1, 6);
game.value.scoreCards[0].setScore(6, 2, 4);
game.value.scoreCards[0].setScore(7, 1, 9);
game.value.scoreCards[0].setScore(7, 2, 0);
game.value.scoreCards[0].setScore(8, 1, 10);
game.value.scoreCards[0].setScore(9, 1, 8);
game.value.scoreCards[0].setScore(9, 2, 2);
game.value.scoreCards[0].setScore(10, 1, 10);
game.value.scoreCards[0].setScore(10, 2, 10);
game.value.scoreCards[0].setScore(10, 3, 10);

game.value.scoreCards[1].setScore(1, 1, 6);
game.value.scoreCards[1].setScore(1, 2, 3);
game.value.scoreCards[1].setScore(2, 1, 7);
game.value.scoreCards[1].setScore(2, 2, 3);
game.value.scoreCards[1].setScore(3, 1, 10);
game.value.scoreCards[1].setScore(3, 2, 0);
game.value.scoreCards[1].setScore(4, 1, 5);
game.value.scoreCards[1].setScore(4, 2, 5);
game.value.scoreCards[1].setScore(5, 1, 10);
game.value.scoreCards[1].setScore(5, 2, 0);
game.value.scoreCards[1].setScore(6, 1, 10);
game.value.scoreCards[1].setScore(6, 2, 0);
game.value.scoreCards[1].setScore(7, 1, 0);
game.value.scoreCards[1].setScore(7, 2, 10);
game.value.scoreCards[1].setScore(8, 1, 10);
game.value.scoreCards[1].setScore(8, 2, 0);
game.value.scoreCards[1].setScore(9, 1, 8);
game.value.scoreCards[1].setScore(9, 2, 2);
game.value.scoreCards[1].setScore(10, 1, 10);
game.value.scoreCards[1].setScore(10, 2, 10);
game.value.scoreCards[1].setScore(10, 3, 10);

console.log(JSON.stringify(game.value));

defineOptions({
  name: 'IndexPage'
})

</script>
