<template>
  <q-item class="bowler-record q-py-sm">
    <q-item-section avatar>
      <q-avatar
        :color="bowler._color || 'primary'"
        text-color="white"
      >
        {{ bowler._name ? bowler._name.charAt(0) : '?' }}
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ bowler._name }}</q-item-label>
      <q-item-label caption>
        Games: {{ gamesCount }} | Avg: {{ averageScore }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
defineProps({
  bowler: {
    type: Object,
    required: true,
    validator: (prop) => {
      return prop._name && typeof prop._name === 'string' && prop._color;
    }
  },
  gamesCount: {
    type: Number,
    required: true
  },
  averageScore: {
    type: Number,
    required: true
  }
});
</script>

<style scoped>
.bowler-record {
  min-height: unset;
  padding: 4px;
}
</style>
