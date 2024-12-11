<template>
  <q-item class="bowler-record q-py-sm">
    <q-item-section avatar>
      <q-avatar
        :color="props.bowler._color || 'primary'"
        text-color="white"
      >
        {{ props.bowler._name ? props.bowler._name.charAt(0) : '?' }}
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ props.bowler._name }}</q-item-label>
      <q-item-label caption>
        Games: {{ props.gamesCount }} | Avg: {{ props.averageScore }}
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-btn
        flat
        round
        color="red"
        icon="delete"
        size="sm"
        @click="confirmDelete"
      />
    </q-item-section>
  </q-item>

  <!-- Delete Confirmation Dialog -->
  <q-dialog v-model="showDeleteDialog">
    <q-card style="min-width: 300px">
      <q-card-section class="row items-center">
        <q-avatar icon="warning" color="warning" text-color="white" />
        <span class="q-ml-sm">Delete Bowler</span>
      </q-card-section>

      <q-card-section>
        Are you sure you want to delete {{ props.bowler._name }}? This action cannot be undone.
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn flat label="Delete" color="red" @click="deleteBowler" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useBowlingStore } from '../stores/bowling-store';

const showDeleteDialog = ref(false);

const props = defineProps({
  bowler: {
    type: Object,
    required: true
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

const store = useBowlingStore();

function confirmDelete() {
  showDeleteDialog.value = true;
}

function deleteBowler() {
  store.removeBowler(props.bowler._id);
}
</script>

<style scoped>
.bowler-record {
  min-height: unset;
}

.bowler-record:hover {
  background: rgba(0, 0, 0, 0.03);
}

.bowler-record .q-btn {
  opacity: 0.7;
}

.bowler-record .q-btn:hover {
  opacity: 1;
}
</style>
