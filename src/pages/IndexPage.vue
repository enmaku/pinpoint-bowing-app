<template>
  <q-page>
    <GameRecord :game="game" style="height: 50% !important;" />
      <q-card class="fixed-bottom" style="width: 100% !important;">
        <q-card-section>
          <q-expansion-item
            dense
            dense-toggle
            icon="keyboard"
            label="Scoring"
            expand-icon="keyboard_arrow_up"
            expanded-icon="keyboard_arrow_down"
          >
            <EntryPanel />
          </q-expansion-item>
        </q-card-section>
      </q-card>
  </q-page>
</template>

<style>

</style>

<script setup>
import { ref } from 'vue';
import Bowler from 'src/models/Bowler.js';
import Game from 'src/models/Game.js';
import GameRecord from 'src/components/GameRecord.vue';
import EntryPanel from 'src/components/EntryPanel.vue';

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

console.log(JSON.stringify(game.value.scoreCards[0]));

defineOptions({
  name: 'IndexPage'
})

</script>
