<template>
  <div class="row q-py-none">
    <div class="col-1 justify-center items-center flex q-py-none q-pr-xs">
      <q-avatar class="scaleavatar" :color="scorecard.bowlerColor" text-color="white">{{ scorecard.bowlerName.substring(0, 1) }}</q-avatar>
    </div>
    <template v-for="frame in scorecard.frames" :key="frame.frameNumber">
      <div :class="frame.frameNumber === 10 ? 'col-2 q-pa-none' : 'col-1 q-pa-none'">
        <div class="row">
          <div v-for="roll in frame.rolls" :key="roll.rollNumber" class="col scorecard">
            {{ roll.strike ? 'X' :
               roll.spare ? '/' :
               roll.foul ? 'F' :
               !roll.pins ? '-' :
               roll.split ? String.fromCharCode(9311 + roll.pins) :
               roll.pins }}
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

<script>
import ScoreCard from 'src/models/ScoreCard';

export default {
  name: 'ScoreCardRecord',
  props: {
    scorecard: {
      type: ScoreCard,
      required: true
    }
  },
  setup () {
    return {};
  }
};
</script>
