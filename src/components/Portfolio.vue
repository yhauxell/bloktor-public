<template>
  <div>
    <div
      class="flex md:flex-row flex-col-reverse justify-between justify-items-center mb-2"
    >
      <SearchInput
        :dataset="searchProjectsResult"
        dataset-label="name"
        @search="onSearchInput"
        @select="onSelect"
        placeholder="Add a project"
        class="mb-2 md:mb-0 md:w-1/4 sm:w-screen"
      >
        <template #element="{ element }">
          <div class="flex content-center">
            <img
              :src="`/coins/${element.ticker}.svg`"
              :alt="element.name"
              onerror="this.onerror=null;this.src='/coins/unknown.svg'"
              class="mr-2 w-6 h-6"
            />
            <div class="flex">
              <span class="truncate">
                {{ element.name }}
              </span>
              &nbsp;
              <small>({{ element.ticker.toUpperCase() }})</small>
            </div>
          </div>
        </template>
      </SearchInput>
      <span class="text-right mb-2">Updated {{ since }}</span>
    </div>
    <header :class="theme" class="flex rounded-xl p-10 text-left">
      <div class="flex-1">
        <p class="text-lx font-semibold">Value</p>
        <h1
          class="text-3xl md:text-9xl font-extrabold tracking-tight text-indigo-900 sm:text-4xl"
        >
          {{ currency(model.value, curr) }}
        </h1>
        <h2>Net value {{ currency(model.net_value, curr) }}</h2>
      </div>
      <div class="flex flex-col">
        <p class="font-bold">Gains</p>
        <h2>
          {{ withSign(gains.value) }}
        </h2>
        <ChangeValue
          :value="gains.percentage"
          :converter="percentage"
          class="text-xs font-semibold rounded-full px-2 py-1 mt-1"
          :class="gains.percentage ? 'bg-green-50' : 'bg-red-50'"
        ></ChangeValue>
        <div v-if="model.performance">
          <p class="mt-2 font-bold">24H</p>
          <ChangeValue
            :value="model.performance.change_24h"
            :converter="percentage"
            class="text-xs font-semibold rounded-full px-2 py-1 mt-1"
            :class="model.performance.change_24h ? 'bg-green-50' : 'bg-red-50'"
          ></ChangeValue>
        </div>
      </div>
    </header>
    <section class="mt-4 flex md:flex-row flex-col" v-if="model.performance">
      <div
        class="items-start mb-4 sm:mb-0 md:mr-4 bg-gray-100 p-4 rounded-2xl text-left"
      >
        <ProjectPreview :model="model.performance.top_24h">
          <template #header>
            <div class="mb-2">
              <strong>24H Top gainer</strong>
            </div>
          </template>
        </ProjectPreview>
      </div>
      <div
        class="items-start bg-gray-100 p-4 rounded-2xl text-left mb-4 md:mr-4 sm:mb-0"
      >
        <ProjectPreview :model="model.performance.bottom_24h">
          <template #header>
            <div class="mb-2">
              <strong>24H Top loser</strong>
            </div>
          </template>
        </ProjectPreview>
      </div>
      <div class="items-start bg-gray-100 p-4 rounded-2xl text-left">
        <ProjectPreview
          insight="change_x"
          :model="model.performance.top_profit"
        >
          <template #header>
            <div class="mb-2">
              <strong>Most profitable</strong>
            </div>
          </template>
        </ProjectPreview>
      </div>
    </section>
    <section class="mt-8">
      <Projects :portfolio-id="model.id" :projects="model.projects"></Projects>
    </section>
  </div>
</template>

<script>
import moment from "moment";
import Localise from "@/library/mixins/Localise.js";
import Percentage from "@/library/mixins/Percentage.js";
import { throttle } from "lodash";
import { mapActions, mapState } from "vuex";
import Projects from "./Projects.vue";
import ProjectPreview from "@/library/components/project-preview/ProjectPreview.vue";

export default {
  components: {
    Projects,
    ProjectPreview
  },
  mixins: [Localise, Percentage],
  props: {
    model: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      since: null
    };
  },
  computed: {
    theme() {
      return `theme-${this.model?.theme?.toLowerCase() || "blue"}`;
    },
    gains() {
      const value = this.model.value - this.model.net_value;
      return {
        value,
        percentage: (value / this.model.net_value) * 100
      };
    },
    ...mapState({
      curr: state => state.currency,
      searchProjectsResult: state => state.searchProjectsResult,
      livePriceUpdated: state => state.livePriceUpdated
    })
  },
  created() {
    this.onSearchInput = throttle(this.onSearchInput, 300);

    this.since = moment(this.livePriceUpdated || Date.now()).fromNow();
    this.interval = setInterval(() => {
      this.since = moment(this.livePriceUpdated).fromNow();
    }, 60000);
  },
  unmounted() {
    clearInterval(this.interval);
  },
  methods: {
    ...mapActions(["searchProjects", "addProjectToPortfolio"]),
    async onSearchInput(term) {
      this.searchProjects(term);
    },
    onSelect(project) {
      this.addProjectToPortfolio(project);
    },
    withSign(value) {
      const formatted = this.currency(value, this.curr);
      return value > 0 ? `+${formatted}` : `-${formatted}`;
    }
  }
};
</script>

<style>
.theme-blue {
  @apply bg-gradient-to-b;
  @apply from-blue-400;
  @apply to-indigo-400;
}
</style>