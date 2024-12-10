<template>
  <q-item
    clickable
    tag="router-link"
    :to="props.link"
    :exact="true"
    class="text-primary"
    active-class="bg-primary text-white"
  >
    <q-item-section>
      <q-item-label><q-icon :name="props.icon" size="sm" class="q-pr-sm" />{{ props.title }}</q-item-label>
      <q-item-label caption>{{ props.caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
defineOptions({
  name: 'EssentialLink'
});

const props = defineProps({
  title: {
    type: String,
    required: true
  },

  caption: {
    type: String,
    default: ''
  },

  link: {
    type: String,
    default: '/'
  },

  icon: {
    type: String,
    default: ''
  }
});
</script>
