<template>
  <div class="sidebar">
    <div class="sidebar__row">
      <button class="sidebar__button success" @click="create('linear')">
        <i class="material-icons sidebar__button-icon">add_box</i>
        rectangle
      </button>
      <button class="sidebar__button success" @click="create('radial')">
        <i class="material-icons sidebar__button-icon">add_circle</i>
        circle
      </button>
    </div>
    <h3 class="sidebar__title">Item</h3>
    <div class="sidebar__row spacing-small">
      <div class="sidebar__group">
        <label class="sidebar__label">Width</label>
        <input v-model.number="active.width" type="number" :disabled="active.id === undefined" :min="0" class="sidebar__input">
      </div>
      <div class="sidebar__group">
        <label class="sidebar__label">Height</label>
        <input v-model.number="active.height" type="number" :disabled="active.id === undefined" :min="0" class="sidebar__input">
      </div>
    </div>
    <div class="sidebar__row">
      <div class="sidebar__group">
        <label class="sidebar__label">Top</label>
        <input v-model.number="active.top" type="number" :disabled="active.id === undefined" :min="0" class="sidebar__input">
      </div>
      <div class="sidebar__group">
        <label class="sidebar__label">Left</label>
        <input v-model.number="active.left" type="number" :disabled="active.id === undefined" :min="0" class="sidebar__input">
      </div>
    </div>
    <div class="sidebar__row">
      <div class="sidebar__group">
        <label class="sidebar__label">Color</label>
        <input v-model="color" type="color" :disabled="active.id === undefined" class="sidebar__input color-picker">
      </div>
    </div>
    <h3 class="sidebar__title">Container</h3>
    <div class="sidebar__row">
      <div class="sidebar__group">
        <label class="sidebar__label">Width</label>
        <input v-model.number="settings.width" type="number" class="sidebar__input">
      </div>
      <div class="sidebar__group">
        <label class="sidebar__label">Height</label>
        <input v-model.number="settings.height" type="number" class="sidebar__input">
      </div>
    </div>
    <div class="sidebar__row">
      <div class="sidebar__group">
        <label class="sidebar__label">Generated css ({{ !copied ? 'click to copy' : 'copied!' }})</label>
        <textarea :value="styles" id="backgrounds" readonly :rows="8" class="sidebar__textarea" @click="copy" />
      </div>
    </div>
    <div class="sidebar__row fixed-bottom">
      <button class="sidebar__button" @click="keyboardPopup = true">
        <i class="material-icons sidebar__button-icon">keyboard</i>
        keyboard shortcuts
      </button>
      <button class="sidebar__button error" @click="clear">
        <i class="material-icons sidebar__button-icon">remove_circle</i>
        clear
      </button>
    </div>
    <Teleport to="body">
      <modal v-model="keyboardPopup">
        <h3 class="sidebar__title">Keyboard shortcuts</h3>
        <p class="sidebar__text">
          Some actions can be done in multiple ways,
          like moving around selected items by either using your mouse
          or the arrow keys in, optionally in combination with shift for quicker use.
        </p>
        <keyboardShortcuts />
      </modal>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import modal from '@/components/Modal.vue';
import keyboardShortcuts from '@/components/KeyboardShortcuts.vue';

const props = defineProps({ items: Array, active: Object, settings: Object });
const emit = defineEmit(['update:items', 'update:active']);

const copied = ref(false);
const keyboardPopup = ref(false);
const fallback = { width: 100, height: 100, left: 0, top: 0 };

const images = computed(() => props.items.map((item) => {
  const radialShape = `circle ${item.width / 2}px at ${item.width / 2}px ${item.width / 2}px`;
  const radialSize = `${item.color} ${item.width / 2}px`;
  const radialBlur = `transparent ${item.width / 2}px`;

  if (item.type === 'radial') return `radial-gradient(${radialShape}, ${radialSize}, ${radialBlur})`;
  return `linear-gradient(${item.color} ${item.height}px, transparent 0)`;
}).join(',\n  '));
const sizes = computed(() => props.items.map((item) => 
  `${item.width}px ${props.settings.height}px`).join(',\n  '));
const positions = computed(() => props.items.map((item) => 
  `${item.left}px ${item.top}px`).join(',\n  '));

const styles = computed(() => 
`width: ${props.settings.width}px;
height: ${props.settings.height}px;
background-image:
  ${images.value};
background-size:
  ${sizes.value};
background-position:
  ${positions.value};
background-repeat: repeat-y;`);

const color = computed({
  get: () => props.active.color || '#f9f9f9',
  set: (value) => props.active.color = value,
});

const copy = () => {
  document.getElementById('backgrounds').select();
  document.execCommand('copy');
  document.getSelection().removeAllRanges();
  copied.value = true;
  setTimeout(() => copied.value = false, 2000);
};
const create = (type) => {
  const item = props.active.id !== undefined ? props.active : fallback;
  const id = props.items.length ? props.items[props.items.length - 1].id + 1 : 0;
  const created = { ...item, id, type, color: '#ECEAED' };

  emit('update:items', [...props.items, created]);
  emit('update:active', created);
  document.getElementsByClassName('container')[0].focus();
};
const clear = () => {
  emit('update:items', []);
  emit('update:active', {});
};
</script>

<style>
.sidebar {
  min-width: 350px;
  max-width: 350px;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  background: var(--white);
  z-index: 100;
  overflow: auto;
  border-left: 1px solid var(--grey-200);
}
.sidebar__title {
  margin: 0 0 20px 0;
}
.sidebar__text {
  font-size: 15px;
  line-height: 20px;
  margin: 0 0 20px 0;
}
.sidebar__button {
  background: var(--blue);
  border: none;
  color: var(--white);
  padding: 8px 16px 8px 10px;
  font-size: 16px;
  outline: none;
  border-radius: 4px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: var(--transition);
}
.sidebar__button.success {
  background: var(--green);
}
.sidebar__button.error {
  background: var(--red);
}
.sidebar__button:hover {
  filter: brightness(95%);
}
.sidebar__button-icon {
  margin: 0 6px 0 0;
  font-size: 18px;
}
.sidebar__row {
  display: flex;
  margin: 0 0 20px 0;
}
.sidebar__row.spacing-small {
  margin: 0 0 10px 0;
}
.sidebar__row.fixed-bottom {
  position: fixed;
  bottom: 0;
  right: 0;
}
.sidebar__row .sidebar__button {
  margin: 0 10px 0 0;
}
.sidebar__row .sidebar__group:first-child {
  margin: 0 5px 0 0;
}
.sidebar__row .sidebar__group:last-child {
  margin: 0 0 0 5px;
}
.sidebar__row .sidebar__group:only-child {
  margin: 0;
}
.sidebar__group {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 0 5px;
}
.sidebar__label {
  padding: 0 0 4px 0;
  font-size: 12px;
}
.sidebar__textarea, .sidebar__input {
  width: 100%;
  box-sizing: border-box;
  font-size: 14px;
  padding: 8px;
  background-color: var(--white);
  border: 1px solid var(--grey-200);
  border-radius: 4px;
  outline: none;
  transition: var(--transition);
}
.sidebar__textarea:disabled, .sidebar__input:disabled {
  background: var(--grey-100);
}
.sidebar__textarea:focus, .sidebar__input:focus {
  border: 1px solid var(--grey-300);
}
.sidebar__input.color-picker {
  border: none;
  padding: 0;
  height: 45px;
  background: none;
}
.sidebar__input.color-picker::-webkit-color-swatch {
  border: 1px solid var(--grey-200);
  border-radius: 4px;
}
.sidebar__textarea {
  resize: vertical;
  min-height: 100px;
}
</style>
