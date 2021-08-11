<template>
  <div
    tabindex="0"
    :style="{ minWidth: `${settings.width}px`, height: `${settings.height}px` }"
    class="container"
    @click.self="clearActive"
    @keydown="keyboard"
  >
    <resizable
      v-for="item in items"
      :key="item.id"
      :width="item.width"
      :height="item.height"
      :left="item.left"
      :top="item.top"
      :fit-parent="true"
      :active="activeHandlers(item)"
      :class="{ 'active': item.id === active.id }"
      drag-selector=".content"
      @resize:end="value => handler(item, value)"
      @drag:end="value => handler(item, value)"
      @click="focus"
    >
      <div :style="styles(item)" class="content">
        <i v-if="item.id === active.id" class="material-icons close" @click="remove">close</i>
      </div>
    </resizable>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import resizable from '@/components/Resizable.vue';

const props = defineProps({ items: Array, active: Object, settings: Object });
const emit = defineEmit(['update:items', 'update:active']);

const containerSize = computed(() => {
  const resizeContainer = document.getElementById('resize-container');

  return { width: resizeContainer?.clientWidth, height: resizeContainer?.clientHeight };
});
const activeHandlers = (item) => {
  if (item.type === 'radial') {
    return ['rb', 'lb', 'lt', 'rt'];
  }
  return ['r', 'rb', 'b', 'lb', 'l', 'lt', 't', 'rt'];
};

const styles = (item) => {
  const radius = item.type === 'radial' ? { borderRadius: '50%' } : {};

  return { ...radius, backgroundColor: item.color };
};

const clearActive = () => emit('update:active', {});
const keyboard = (event) => {
  if (props.active.id === undefined) return false;

  const steps = event.shiftKey ? 10 : 1;

  if (event.keyCode === 38) props.active.top -= (props.active.top < steps ? props.active.top : steps);
  if (event.keyCode === 39) {
    const rightPosition = props.active.left + props.active.width;
    const rightSpaceLeft = containerSize.value.width - rightPosition;
    
    props.active.left += (rightPosition + steps > containerSize.value.width ? rightSpaceLeft : steps)
  };
  if (event.keyCode === 40) {
    const topPosition = props.active.top + props.active.height;
    const topSpaceLeft = containerSize.value.height - topPosition;
    
    props.active.top += (topPosition + steps > containerSize.value.height ? topSpaceLeft : steps)
  };
  if (event.keyCode === 37) props.active.left -= (props.active.left < steps ? props.active.left : steps);
  if (event.keyCode === 8) remove();

  localStorage.setItem('items', JSON.stringify(props.items));
};
const handler = (item, { width, height, left, top }) => {
  emit('update:active', { ...item, width, height: item.type === 'radial' ? width : height, left, top });
};
const remove = () => {
  props.items.splice(props.items.findIndex(item => item.id === props.active.id), 1);
  emit('update:active', props.items.length ? props.items[props.items.length - 1] : {});
};
const focus = () => document.getElementsByClassName('container')[0].focus();

</script>

<style>
.container {
  outline: none;
  overflow: auto;
  background: var(--white);
  box-shadow: var(--shadow);
  margin: 0 400px 80px 0;
}
.content {
  height: 100%;
  width: 100%;
  background-color: var(--grey-200);
  position: relative;
}
.close {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 10;
  font-size: 11px;
  background: var(--red);
  color: var(--white);
  width: 13px;
  height: 13px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 2px;
  cursor: pointer;
}
</style>