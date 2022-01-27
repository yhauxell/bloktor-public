<template>
  <i :class="styles.classes" :style="styles.vars"></i>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "arrow-up"
    },
    color: {
        type: String,
        default: '#000000'
    }
  },
  computed: {
    styles() {
      switch (this.type) {
        case "arrow-up":
          return {classes: ["indicator-arrow", "indicator-arrow--up"], vars: `--indicator-color: ${this.color}`};
        case "arrow-down":
          return {classes: ["indicator-arrow", "indicator-arrow--down"], vars: `--indicator-color: ${this.color}`};
        default:
          return {classes: '', vars: ''};
      }
    }
  }
};
</script>

<style>
.indicator-arrow {
  width: 0; 
  height: 0;
}

.indicator-arrow--up {

  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 5px solid var(--indicator-color);
}

.indicator-arrow--down {

  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid var(--indicator-color);
}
</style>