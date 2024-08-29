<template>
  <q-page>
    <q-card style="width: 100%; height: auto;" class="q-pa-xs">
      <q-card-section class="q-pa-none">
        <div class="row flex">
          <div class="col flex">
            <strong>Game 1</strong>
            <q-space />
            <span class="text-caption text-grey-8">June 8, 2024 7:36pm</span>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <!-- row -->
        <div class="row">
          <div class="col-1 justify-center items-center flex scorecard">
            <q-avatar size="sm" color="red" text-color="white">D</q-avatar>
          </div>
          <template v-for="frame in 10" :key="frame">
            <div :class="frame == 10 ? 'col-2' : 'col-1'">
              <div class="row">
                <div v-for="(char, index) in bs.getFrame(frame)" :key="index" class="col scorecard">
                  {{ char }}
                </div>
              </div>
              <div class="row">
                <div class="col scorecard">
                  {{ bs.getFrameScore(frame) }}
                </div>
              </div>
            </div>
          </template>
        </div>
        <!-- row -->
        <div class="row">
          <div class="col-1 justify-center items-center flex scorecard">
            <q-avatar size="sm" color="warning" text-color="white">B</q-avatar>
          </div>
          <template v-for="frame in 10" :key="frame">
            <div :class="frame == 10 ? 'col-2' : 'col-1'">
              <div class="row">
                <div v-for="(char, index) in bs.getFrame(frame)" :key="index" class="col scorecard">
                  {{ char }}
                </div>
              </div>
              <div class="row">
                <div class="col scorecard">
                  {{ bs.getFrameScore(frame) }}
                </div>
              </div>
            </div>
          </template>
        </div>
        <!-- row -->
        <div class="row">
          <div class="col-1 justify-center items-center flex scorecard">
            <q-avatar size="sm" color="green" text-color="white">L</q-avatar>
          </div>
          <template v-for="frame in 10" :key="frame">
            <div :class="frame == 10 ? 'col-2' : 'col-1'">
              <div class="row">
                <div v-for="(char, index) in bs.getFrame(frame)" :key="index" class="col scorecard">
                  {{ char }}
                </div>
              </div>
              <div class="row">
                <div class="col scorecard">
                  {{ bs.getFrameScore(frame) }}
                </div>
              </div>
            </div>
          </template>
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
</style>

<script setup>
import { ref } from 'vue';
import PinDiagram from 'components/PinDiagram.vue';
import BowlingScore from 'src/models/BowlingScore.js';
const pindata = ref([false, false, false, false, false, false, false, false, false, false]);

const bs = ref(new BowlingScore('72⑦/5/X-63X-X-6/7/⑦/X'));

defineOptions({
  name: 'IndexPage'
})

</script>
