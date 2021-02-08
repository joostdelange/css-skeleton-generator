<template>
  <div class="modal" :class="{ 'open': modelValue }">
    <div v-if="modelValue" class="modal__backdrop" @click="close" />
    <div v-if="modelValue" class="modal__card">
      <i class="material-icons modal__close" @click="close">close</i>
      <slot />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmit } from 'vue';

const props = defineProps({ modelValue: Boolean });
const emit = defineEmit(['update:modelValue']);

const close = () => emit('update:modelValue', false);
</script>

<style>
.modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -10;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.modal.open {
  z-index: 100;
}
.modal__backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  background: var(--black);
  opacity: .4;
}
.modal__card {
  padding: 20px;
  background: var(--white);
  z-index: 100;
  width: 100%;
  max-width: 400px;
  border-radius: 4px;
  position: fixed;
  top: 40%;
  left: 0;
  right: 0;
  margin: auto;
  transform: translateY(-40%);
  box-shadow: var(--shadow);
}
.modal__close {
  cursor: pointer;
  font-size: 20px;
  position: absolute;
  top: 20px;
  right: 20px;
}
</style>