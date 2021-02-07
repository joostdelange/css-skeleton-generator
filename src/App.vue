<template>
  <div v-if="!loading" class="default">
    <container v-model:items="items" v-model:active="active" v-model:settings="settings" />
    <sidebar v-model:items="items" v-model:active="active" v-model:settings="settings" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import sidebar from '@/components/Sidebar.vue';
import container from '@/components/Container.vue';

const items = ref([]);
const settings = ref({});
const active = ref({});
const loading = ref(true);

onMounted(() => {
  items.value = JSON.parse(localStorage.getItem('items')) || [];
  settings.value = JSON.parse(localStorage.getItem('settings')) || { width: 800, height: 600 };
  loading.value = false;
});

watch(
  () => active,
  ({ value }) => {
    items.value[items.value.findIndex((item) => item.id === value.id)] = value;
    localStorage.setItem('items', JSON.stringify(items.value));
  },
  { deep: true },
);
watch(
  () => settings,
  ({ value }) => localStorage.setItem('settings', JSON.stringify(settings.value)),
  { deep: true },
);
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  font-size: 16px;
  background: var(--white);
}
:root {
  --white: #ffffff;
  --grey-100: #f9f9f9;
  --grey-200: #eceaed;
  --grey-300: #d3d3d3;
  --red: #ef476f;
  --yellow: #ffd166;
  --green: #06d6a0;
  --blue: #118ab2;
  --dark-blue: #073b4c;
  --black: #000000;
  --shadow: 0 0 5px rgba(0, 0, 0, .2);
  --transition: all .2s ease;
}
.default {
  min-width: 100%;
  width: min-content;
  min-height: 100vh;
  display: flex;
  position: relative;
  background: var(--grey-100);
}
</style>
