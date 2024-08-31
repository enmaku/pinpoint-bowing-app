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
        <div v-for="scorecard in game.scoreCards" :key="scorecard.id" class="q-py-none">
          <div class="row q-py-none">
            <div class="col-1 justify-center items-center flex q-py-none q-pr-xs">
              <q-avatar class="scaleavatar" :color="scorecard.bowlerColor" text-color="white">{{ scorecard.bowlerName.substring(0, 1) }}</q-avatar>
            </div>
            <template v-for="frame in scorecard.frames" :key="frame.frameNumber">
              <div :class="frame.frameNumber == 10 ? 'col-2 q-pa-none' : 'col-1 q-pa-none'">
                <div class="row">
                  <div v-for="roll in frame.getRollScores()" :key="roll.rollNumber" class="col scorecard">
                    {{ roll.strike ? 'X' : roll.spare ? '/' : roll.pins == null ? '-' : roll.pins }}
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
          <div class="q-py-xs"></div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style>
  .scorecard {
    border: 0.25vmin solid black;
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

const game = ref(new Game());

const bowler1 = ref(new Bowler());
bowler1.value.name = 'Dave';
bowler1.value.color = 'red';
game.value.addBowler(bowler1.value);
bowler1.value.addGame(game.value.id);

const bowler2 = ref(new Bowler());
bowler2.value.name = 'Lisa';
bowler2.value.color = 'green';
game.value.addBowler(bowler2.value);
bowler2.value.addGame(game.value.id);

const bowler3 = ref(new Bowler());
bowler3.value.name = 'Brian';
bowler3.value.color = 'warning';
game.value.addBowler(bowler3.value);
bowler3.value.addGame(game.value.id);

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
game.value.scoreCards[0].setScore(10, 1, 7);
game.value.scoreCards[0].setScore(10, 2, 3);
game.value.scoreCards[0].setScore(10, 3, 10);

game.value.scoreCards[1].setScore(1, 1, 6);
game.value.scoreCards[1].setScore(1, 2, 3);
game.value.scoreCards[1].setScore(2, 1, 7);
game.value.scoreCards[1].setScore(2, 2, 3);
game.value.scoreCards[1].setScore(3, 1, 10);
game.value.scoreCards[1].setScore(4, 1, 5);
game.value.scoreCards[1].setScore(4, 2, 5);
game.value.scoreCards[1].setScore(5, 1, 10);
game.value.scoreCards[1].setScore(6, 1, 10);
game.value.scoreCards[1].setScore(7, 1, 0);
game.value.scoreCards[1].setScore(7, 2, 10);
game.value.scoreCards[1].setScore(8, 1, 10);
game.value.scoreCards[1].setScore(9, 1, 8);
game.value.scoreCards[1].setScore(9, 2, 2);
game.value.scoreCards[1].setScore(10, 1, 9);
game.value.scoreCards[1].setScore(10, 2, 0);

game.value.scoreCards[2].setScore(1, 1, 9);
game.value.scoreCards[2].setScore(1, 2, 0);
game.value.scoreCards[2].setScore(2, 1, 7);
game.value.scoreCards[2].setScore(2, 2, 2);
game.value.scoreCards[2].setScore(3, 1, 10);
game.value.scoreCards[2].setScore(4, 1, 8);
game.value.scoreCards[2].setScore(4, 2, 2);
game.value.scoreCards[2].setScore(5, 1, 10);
game.value.scoreCards[2].setScore(6, 1, 10);
game.value.scoreCards[2].setScore(7, 1, 2);
game.value.scoreCards[2].setScore(7, 2, 6);
game.value.scoreCards[2].setScore(8, 1, 10);
game.value.scoreCards[2].setScore(9, 1, 8);
game.value.scoreCards[2].setScore(9, 2, 2);
game.value.scoreCards[2].setScore(10, 1, 9);
game.value.scoreCards[2].setScore(10, 2, 1);
game.value.scoreCards[2].setScore(10, 3, 10);

console.log(JSON.stringify(game.value));

defineOptions({
  name: 'IndexPage'
})

</script>
