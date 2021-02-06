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
    textarea(ref="css") {{ styles }}
    pre {{ styles }}
</template>

<script>
import resizable from './Resizable.vue';

export default {
  name: "App",
  components: { resizable },
  data() {
    return {
      items: [],
      default: { width: 100, height: 100, left: 0, top: 0 },
      active: {},
      step: 1,
      timeout: null,
    };
  },
  computed: {
    images() {
      return this.items.map((item) => `linear-gradient(#ECEAED ${item.height}, transparent 0)`);
    },
    sizes() {
      return this.items.map((item) => `${item.width}px ${item.height}px`);
    },
    positions() {
      return this.items.map((item) => `${item.top}px ${item.left}px`);
    },
    styles() {
      return `
background-image:
  ${this.images.join(',\n  ')};
background-size:
  ${this.sizes.join(',\n  ')};
background-position:
  ${this.positions.join(',\n  ')};
      `;
    },
  },
  watch: {
    active: {
      handler(value) {
        if (value.id) {
          this.items[this.items.findIndex((item) => item.id === value.id)] = value;
        }
      },
      deep: true,
    },
    items: {
      handler(value) {
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => localStorage.setItem('items', JSON.stringify(value)), 1000);
      },
      deep: true,
    },
  },
  mounted() {
    this.items = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
  },
  methods: {
    handler(item, data) {
      item.width = data.width;
      item.height = data.height;
      item.left = data.left;
      item.top = data.top;
      this.active = item;
    },
    create() {
      this.items.push({ ...(this.active.id ? this.active : this.default), id: this.items.length + 1 });
    },
    remove() {
      this.items.splice(this.items.findIndex(item => item.id === this.active.id), 1);
      this.active = this.items.length ? this.items[this.items.length - 1] : {};
    },
    copy() {
      this.$refs.css.select();
      document.execCommand('copy');
    },
    setStep(amount) {
      this.step = amount;
    },
  },
};
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
