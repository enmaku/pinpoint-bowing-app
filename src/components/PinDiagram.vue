<template>
  <div style="min-width: 115px; min-height: 115px;">
          <div class="flex row q-py-none" style="flex-wrap: nowrap;">
            <div class="col text-center flex pin-cell">
              <q-btn
                round
                :color="pindata[6] ? 'positive' : 'dark'"
                class="text-weight-bolder pin"
                label="7"
                @click="pindata[6] = !pindata[6]"
              />
            </div>
            <div class="col text-center flex pin-cell">
              <q-btn
                round
                :color="pindata[7] ? 'positive' : 'dark'"
                label="8"
                class="text-weight-bolder pin"
                @click="pindata[7] = !pindata[7]"
              />
            </div>
            <div class="col text-center flex pin-cell">
              <q-btn
                round
                :color="pindata[8] ? 'positive' : 'dark'"
                label="9"
                class="text-weight-bolder pin"
                @click="pindata[8] = !pindata[8]"
              />
            </div>
            <div class="col text-center flex pin-cell">
              <q-btn
                round
                :color="pindata[9] ? 'positive' : 'dark'"
                label="10"
                class="text-weight-bolder pin"
                @click="pindata[9] = !pindata[9]"
              />
            </div>
          </div>
          <div class="flex row q-py-none" style="flex-wrap: nowrap;">
            <div class="col flex pin-cell" style="flex-grow: 1; min-width: 22px;"></div>
            <div class="col text-center flex pin-cell">
              <q-btn
                round
                :color="pindata[3] ? 'positive' : 'dark'"
                label="4"
                class="text-weight-bolder pin"
                @click="pindata[3] = !pindata[3]"
              />
            </div>
            <div class="col text-center flex pin-cell">
              <q-btn
                round
                :color="pindata[4] ? 'positive' : 'dark'"
                label="5"
                class="text-weight-bolder pin"
                @click="pindata[4] = !pindata[4]"
              />
            </div>
            <div class="col text-center flex pin-cell">
              <q-btn
                round
                :color="pindata[5] ? 'positive' : 'dark'"
                label="6"
                class="text-weight-bolder pin"
                @click="pindata[5] = !pindata[5]"
              />
            </div>
            <div class="col flex pin-cell" style="flex-grow: 1; min-width: 22px;"></div>
          </div>
          <div class="flex row q-py-none" style="flex-wrap: nowrap;">
            <div class="col flex pin-cell"></div>
            <div class="col text-center flex pin-cell">
              <q-btn
                round
                :color="pindata[1] ? 'positive' : 'dark'"
                label="2"
                class="text-weight-bolder pin"
                @click="pindata[1] = !pindata[1]"
              />
            </div>
            <div class="col text-center flex pin-cell">
              <q-btn
                round
                :color="pindata[2] ? 'positive' : 'dark'"
                label="3"
                class="text-weight-bolder pin"
                @click="pindata[2] = !pindata[2]"
              />
            </div>
            <div class="col flex pin-cell"></div>
          </div>
          <div class="flex row q-py-none" style="flex-wrap: nowrap;">
            <div class="col flex pin-cell" style="flex-grow: 1; min-width: 22px;"></div>
            <div class="col flex pin-cell"></div>
            <div class="col text-center flex pin-cell">
              <q-btn
                round
                :color="pindata[0] ? 'positive' : 'dark'"
                label="1"
                class="text-weight-bolder pin"
                @click="pindata[0] = !pindata[0]"
              />
            </div>
            <div class="col flex pin-cell"></div>
            <div class="col flex pin-cell" style="flex-grow: 1; min-width: 22px;"></div>
          </div>
        </div>
</template>

<style scoped>
  .pin-cell {
    /* border: 1px solid black; */
    align-items: center;
    justify-content: center;
    aspect-ratio: 1/1;
    flex-grow: 2;
    min-width: 44px;
  }
  .pin {
    height: 90%;
    width: 90%;
  }
</style>

<script>
export default {
  name: 'PinDiagram',
  props: {
    pindata: {
      type: Array,
      required: true
    }
  },
  setup () {
    return {}
  }
}
</script>
