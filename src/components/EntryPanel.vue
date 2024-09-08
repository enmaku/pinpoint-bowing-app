<template>
  <div class="row">
    <div class="col inputcell">
      <q-btn
        color="primary"
        class="text-weight-bolder inputbutton"
        label="1"
      />
    </div>
    <div class="col inputcell">
      <q-btn
        color="primary"
        class="text-weight-bolder inputbutton"
        label="2"
      />
    </div>
    <div class="col inputcell">
      <q-btn
        color="primary"
        class="text-weight-bolder inputbutton"
        label="3"
      />
    </div>
    <div class="col inputcell">
      <q-btn
        color="primary"
        class="text-weight-bolder inputbutton"
        label="S"
      />
    </div>
  </div>
  <div class="row">
    <div class="col inputcell">
      <q-btn
        color="primary"
        class="text-weight-bolder inputbutton"
        label="4"
      /></div>
    <div class="col inputcell">
      <q-btn
        color="primary"
        class="text-weight-bolder inputbutton"
        label="5"
      />
    </div>
    <div class="col inputcell">
      <q-btn
        color="primary"
        class="text-weight-bolder inputbutton"
        label="6"
      />
    </div>
    <div class="col inputcell">
      <q-btn
        color="primary"
        class="text-weight-bolder inputbutton"
        label="F"
      />
    </div>
  </div>
  <div class="row">
    <div class="col inputcell">
      <q-btn
        color="primary"
        class="text-weight-bolder inputbutton"
        label="7"
      />
    </div>
    <div class="col inputcell">
      <q-btn
        color="primary"
        class="text-weight-bolder inputbutton"
        label="8"
      />
    </div>
    <div class="col inputcell">
      <q-btn
        color="primary"
        class="text-weight-bolder inputbutton"
        label="9"
      />
    </div>
    <div class="col inputcell">
      <q-btn
        color="primary"
        class="text-weight-bolder inputbutton"
        icon="keyboard_arrow_up"
      />
    </div>
  </div>
  <div class="row">
    <div class="col inputcell">
      <q-btn
        color="primary"
        class="text-weight-bolder inputbutton"
        label="/"
      />
    </div>
    <div class="col inputcell">
      <q-btn
        color="primary"
        class="text-weight-bolder inputbutton"
        label="0"
      />
    </div>
    <div class="col inputcell">
      <q-btn
        color="primary"
        class="text-weight-bolder inputbutton"
        label="X"
      />
    </div>
    <div class="col inputcell">
      <q-btn
        color="primary"
        class="text-weight-bolder inputbutton"
        icon="keyboard_arrow_down"
      />
    </div>
  </div>
  <div class="row">
    <div class="col inputcell">
      <q-btn
        color="primary"
        class="text-weight-bolder inputbutton"
        icon="keyboard_arrow_left"
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
    /* border: 0.25vmin solid black; */
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
import { ref } from 'vue';
import PinDiagram from './PinDiagram.vue';
import { mapBowlingAlley } from 'quasar-extras-svg-icons/map-icons'

const showPins = ref(false);
const pins = ref([0,0,0,0,0,0,0,0,0,0]);

defineOptions({
  name: 'EntryPanel',
  components: {
    PinDiagram
  }
})
</script>
