<template>
  <div class="shortcuts">
    <div v-for="shortcut in shortcuts" :key="shortcut.title" class="shortcut">
      <div class="shortcut__title">{{ shortcut.title }}</div>
      <div class="shortcut__icons">
        <i v-for="icon in shortcut.icons" :key="icon" class="material-icons shortcut__icon">{{ icon }}</i>
      </div>
    </div>
  </div>
</template>

<script setup>
const shortcuts = [
  { title: 'Move item', icons: ['mouse', 'keyboard', 'open_with'] },
  { title: 'Resize item', icons: ['mouse', 'keyboard', 'zoom_out_map'] },
  { title: 'Delete item', icons: ['mouse', 'keyboard', 'backspace'] },
  { title: 'Copy CSS', icons: ['mouse', 'keyboard'] },
  { title: 'Resize canvas', icons: ['keyboard'] },
  { title: 'Clear canvas', icons: ['keyboard'] },
];
</script>

<style>
.shortcuts {
  display: flex;
  flex-direction: column;
  margin: 10px 0;
}
.shortcut {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
}
.shortcut:not(:last-child) {
  border-bottom: 1px solid var(--grey-200);
}
.shortcut__title {
  font-size: 16px;
}
.shortcut__icon {
  margin: 0 5px;
}
</style>