<template lang="pug">
.container  
  .resize-container(@click.self="active = {}")
    resizable(
      v-for="item in items"
      :key="item.id"
      :width="item.width"
      :height="item.height"
      :left="item.left"
      :top="item.top"
      :fit-parent="true"
      :class="{ 'active': item.id === active.id }"
      drag-selector=".resizable-content"
      @resize:move="value => handler(item, value)"
      @resize:start="value => handler(item, value)"
      @resize:end="value => handler(item, value)"
      @drag:move="value => handler(item, value)"
      @drag:start="value => handler(item, value)"
      @drag:end="value => handler(item, value)"
    )
      .resizable-content
        .close(
          v-if="item.id === active.id"
          @click="remove"
        ) ×
  .resize-sidebar
    button(@click="create") add
    ul
      li id: {{ active.id }}
      li
        label width:
        input(
          v-model.number="active.width"
          type="number"
          :step="step"
          @keydown.shift="setStep(10)"
          @keyup.shift="setStep(1)"
        )
      li
        label height:
        input(
          v-model.number="active.height"
          type="number"
          :step="step"
          @keydown.shift="setStep(10)"
          @keyup.shift="setStep(1)"
        )
      li
        label top:
        input(
          v-model.number="active.top"
          type="number"
          :step="step"
          @keydown.shift="setStep(10)"
          @keyup.shift="setStep(1)"
        )
      li
        label left:
        input(
          v-model.number="active.left"
          type="number"
          :step="step"
          @keydown.shift="setStep(10)"
          @keyup.shift="setStep(1)"
        )
    button(@click="copy") copy
    textarea(id="css") {{ styles }}
    pre {{ styles }}
</template>

<script setup>
import { ref, computed, watch, onMounted, useContext } from 'vue';
import resizable from './Resizable.vue';

const items = ref([]);
const fallback = { width: 100, height: 100, left: 0, top: 0 };
const active = ref({});
const step = ref(1);
const timeout = ref(null);
const { attrs } = useContext();

const images = computed(() => items.value.map((item) => `linear-gradient(#ECEAED ${item.height}, transparent 0)`));
const sizes = computed(() => items.value.map((item) => `${item.width}px ${item.height}px`));
const positions = computed(() => items.value.map((item) => `${item.top}px ${item.left}px`));
const styles = computed(() => `
background-image:
  ${images.value.join(',\n  ')};
background-size:
  ${sizes.value.join(',\n  ')};
background-position:
  ${positions.value.join(',\n  ')};
`);

const handler = (item, data) => {
  item.width = data.width;
  item.height = data.height;
  item.left = data.left;
  item.top = data.top;
  active.value = item;
};
const create = () => {
  items.value.push({ ...(active.value.id ? active.value : fallback), id: items.value.length + 1 });
};
const remove = () => {
  items.value.splice(items.value.findIndex(item => item.id === active.value.id), 1);
  active.value = items.value.length ? items.value[items.value.length - 1] : {};
};
const copy = () => {
  document.getElementById('css').select();
  document.execCommand('copy');
};
const setStep = (amount) => {
  step.value = amount;
};

onMounted(() => items.value = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : []);

watch(
  () => active,
  ({ value }) => items.value[items.value.findIndex((item) => item.id === value.id)] = value,
  { deep: true },
);

watch(
  () => items,
  ({ value }) => {
    if (timeout.value) clearTimeout(timeout.value);
    timeout.value = setTimeout(() => localStorage.setItem('items', JSON.stringify(value)), 1000);
  },
  { deep: true },
);
</script>

<style>
body {
  margin: 0;
  font-family: sans-serif;
}
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  position: relative;
}
.resize-container {
  width: 100%;
}
.resize-sidebar {
  width: 500px;
  height: 100%;
}
.resizable-content {
  height: 100%;
  width: 100%;
  border: 1px solid #ECEAED;
  background: #ECEAED;
  position: relative;
}
.resizable-component.active .resizable-content {
  border: 1px solid lightgray;
  z-index: 10;
}
.close {
  position: absolute;
  top: 3px;
  right: 3px;
  z-index: 10;
  font-size: 12px;
  line-height: 16px;
  background: red;
  color: white;
  width: 15px;
  height: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}
textarea {
  height: 0;
  width: 0;
  opacity: 0;
  position: fixed;
  right: -20px;
  top: -20px;
  border: none;
}
</style>
