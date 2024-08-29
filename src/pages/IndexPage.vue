<template>
  <q-page class="flex flex-center">
    <q-card style="width: 50%; min-width: 115px;" class="q-pa-xs">
      <q-card-section class="q-pa-xs">
        <div class="text-h6">Pin Diagram</div>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-py-xs q-px-none">
        <PinDiagram :pindata="pindata" />
      </q-card-section>
      <q-card-section>
        {{ pindata }}
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import PinDiagram from 'components/PinDiagram.vue';
const pindata = ref([false, false, false, false, false, false, false, false, false, false]);

defineOptions({
  name: 'IndexPage'
})

</script>
