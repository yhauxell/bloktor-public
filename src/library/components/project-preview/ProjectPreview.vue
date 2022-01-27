<template>
  <div class="flex justify-between">
    <div class="mr-2">
      <slot name="header"></slot>
      <div class="flex flex-wrap">
        <img
          :src="`/coins/${model.ticker}.svg`"
          :alt="model.ticker"
          onerror="this.onerror=null;this.src='/coins/unknown.svg'"
          class="mr-2 w-6 h-6"
        />
        <span class="mr-2">{{ model.name }}</span>
      </div>
    </div>
    <ChangeValue
      class="text-xl md:text-2xl w-1/3 md:w-auto"
      :value="model[insight]"
      :converter="converter"
    ></ChangeValue>
  </div>
</template>

<script>
import Percentage from "@/library/mixins/Percentage.js";
import Localise from "@/library/mixins/Localise.js";
import { mapState } from "vuex";

export default {
  mixins: [Percentage, Localise],
  props: {
    model: {
      type: Object,
      default: () => ({})
    },
    insight: {
      type: String,
      default: "change_24h"
    }
  },
  computed: {
    converter() {
      switch (this.insight) {
        case "change_24h":
        case "change_percentage":
          return this.percentage;
        case "profitloss":
          return value => this.currency(value, this.curr);
        case "change_x":
          return value => `${value}x`;
      }

      return value => value;
    },
    ...mapState({
      curr: state => state.currency
    })
  }
};
</script>

<style>
</style>