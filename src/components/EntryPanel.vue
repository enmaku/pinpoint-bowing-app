<template>
  <div class="row">
    <div class="col inputcell" v-for="n in 3" :key="n">
      <q-btn
        color="primary"
        class="text-weight-bolder inputbutton"
        :label="n.toString()"
        @click="enterScore(n)"
      />
    </div>
    <div class="col inputcell">
      <q-btn
        color="primary"
        class="text-weight-bolder inputbutton"
        label="S"
        @click="selectBowler"
      />
    </div>
  </div>
  <div class="row">
    <div class="col inputcell" v-for="n in [4, 5, 6]" :key="n">
      <q-btn
        color="primary"
        class="text-weight-bolder inputbutton"
        :label="n.toString()"
        @click="enterScore(n)"
      />
    </div>
    <div class="col inputcell">
      <q-btn
        color="primary"
        class="text-weight-bolder inputbutton"
        label="F"
        @click="enterScore(0)"
      />
    </div>
  </div>
  <div class="row">
    <div class="col inputcell" v-for="n in [7, 8, 9]" :key="n">
      <q-btn
        color="primary"
        class="text-weight-bolder inputbutton"
        :label="n.toString()"
        @click="enterScore(n)"
      />
    </div>
    <div class="col inputcell">
      <q-btn
        color="primary"
        class="text-weight-bolder inputbutton"
        icon="keyboard_arrow_up"
        @click="previousFrame"
      />
    </div>
  </div>
  <div class="row">
    <div class="col inputcell">
      <q-btn
        color="primary"
        class="text-weight-bolder inputbutton"
        label="/"
        @click="enterSpare"
      />
    </div>
    <div class="col inputcell">
      <q-btn
        color="primary"
        class="text-weight-bolder inputbutton"
        label="0"
        @click="enterScore(0)"
      />
    </div>
    <div class="col inputcell">
      <q-btn
        color="primary"
        class="text-weight-bolder inputbutton"
        label="X"
        @click="enterStrike"
      />
    </div>
    <div class="col inputcell">
      <q-btn
        color="primary"
        class="text-weight-bolder inputbutton"
        icon="keyboard_arrow_down"
        @click="nextFrame"
      />
    </div>
  </div>
  <div class="row">
    <div class="col inputcell">
      <q-btn
        color="primary"
        class="text-weight-bolder inputbutton"
        icon="keyboard_arrow_left"
        @click="previousBowler"
      />
    </div>
    <div class="col inputcell" >
      <q-btn
        color="primary"
        class="text-weight-bolder inputbutton"
        :icon="mapBowlingAlley"
        @click="showPins = !showPins"
      />
    </div>
    <div class="col inputcell">
      <q-btn
        color="primary"
        class="text-weight-bolder inputbutton"
        icon="keyboard_arrow_right"
        @click="nextBowler"
      />
    </div>
  </div>
  <q-dialog v-model="showPins">
    <q-card style="width: 75vw !important;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Pin Diagram/Entry</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <PinDiagram :pindata="pins" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style>
  .inputcell {
    text-align: center;
    font-weight: bolder;
    padding: 0.25vw;
  }

  .inputbutton {
    height: 100% !important;
    width: 100% !important;
  }
</style>

<script setup>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import PinDiagram from './PinDiagram.vue';
import { mapBowlingAlley } from 'quasar-extras-svg-icons/map-icons';
import { useBowlingStore } from 'src/stores/bowling-store';

const $q = useQuasar();
const store = useBowlingStore();
const showPins = ref(false);
const pins = ref([0,0,0,0,0,0,0,0,0,0]);
const currentBowlerIndex = ref(0);
const currentFrame = ref(1);

// Computed properties
const currentGame = computed(() => store.getCurrentGame);
const bowlers = computed(() => store.getBowlersInCurrentGame);
const currentBowler = computed(() => bowlers.value[currentBowlerIndex.value]);

// Methods for frame navigation
const nextFrame = () => {
  if (currentFrame.value < 10) {
    currentFrame.value++;
  }
};

const previousFrame = () => {
  if (currentFrame.value > 1) {
    currentFrame.value--;
  }
};

// Methods for bowler navigation
const nextBowler = () => {
  if (currentBowlerIndex.value < bowlers.value.length - 1) {
    currentBowlerIndex.value++;
  }
};

const previousBowler = () => {
  if (currentBowlerIndex.value > 0) {
    currentBowlerIndex.value--;
  }
};

// Methods for score entry
const enterScore = (pins) => {
  if (currentGame.value && currentBowler.value) {
    const scoreCard = currentGame.value.scoreCards.find(
      sc => sc.bowlerId === currentBowler.value.id
    );
    if (scoreCard) {
      const frame = scoreCard.frames[currentFrame.value - 1];
      const roll = frame.rolls.findIndex(r => r.pins === null) + 1;
      if (roll > 0) {
        scoreCard.setScore(currentFrame.value, roll, pins);
        // Auto-advance if appropriate
        if (pins === 10 && roll === 1 && currentFrame.value < 10) {
          nextFrame();
        } else if (roll === 2 || (currentFrame.value === 10 && roll === 3)) {
          nextFrame();
        }
      }
    }
  }
};

const enterStrike = () => {
  enterScore(10);
};

const enterSpare = () => {
  if (currentGame.value && currentBowler.value) {
    const scoreCard = currentGame.value.scoreCards.find(
      sc => sc.bowlerId === currentBowler.value.id
    );
    if (scoreCard) {
      const frame = scoreCard.frames[currentFrame.value - 1];
      if (frame.rolls[0].pins !== null && frame.rolls[1].pins === null) {
        const remainingPins = 10 - frame.rolls[0].pins;
        scoreCard.setScore(currentFrame.value, 2, remainingPins);
        nextFrame();
      }
    }
  }
};

const selectBowler = async () => {
  const bowlerOptions = bowlers.value.map(b => ({
    label: b.name,
    value: bowlers.value.indexOf(b)
  }));

  try {
    const selected = await $q.dialog({
      title: 'Select Bowler',
      message: 'Choose a bowler:',
      options: {
        type: 'radio',
        model: currentBowlerIndex.value,
        items: bowlerOptions
      },
      cancel: true,
      persistent: true
    });

    if (selected !== undefined) {
      currentBowlerIndex.value = selected;
    }
  } catch (error) {
    // Dialog was cancelled
  }
};

defineOptions({
  name: 'EntryPanel',
  components: {
    PinDiagram
  }
})
</script>
