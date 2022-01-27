<template>
  <div class="p-2 sm:p-0">
    <h2 class="mb-4 font-bold flex">
      <div class="flex">
        Profit/loss 
      <ChangeValue
      class="ml-2"
        :value="project.profitloss"
        :converter="(value)=> { return currency(value, curr)}"
      ></ChangeValue
      >
      </div>
      <div class="text-right flex-1 mr-6">
        Performance
        <strong>{{project.change_x}}x</strong>
      </div>
    </h2>
    <div>
      <ProjectChart
        style="height: 16vh; width: 100%"
        :values="[project.net_value, project.value]"
      ></ProjectChart>
    </div>
    <div class="flex flex-col p-2 sm:p-0 mt-6">
      <div class="flex mb-4">
        <div class="flex-1 text-left">
          <h4 class="font-medium">Market value</h4>
          <p>
            {{ currency(project.value, curr) }}
          </p>
        </div>
        <div class="flex-1 text-left">
          <h4 class="font-medium">Holdings</h4>
          <p>
            {{ project.total_holdings }}
          </p>
        </div>
      </div>
      <div class="flex mb-4">
        <div class="flex-1 text-left">
          <h4 class="font-medium">Net cost</h4>
          <p>
            {{ currency(project.net_value, curr) }}
          </p>
        </div>
        <div class="flex-1 text-left">
          <h4 class="font-medium">Ave net cost</h4>
          <p>
            {{ currency(project.net_value / project.total_holdings, curr) }}
          </p>
        </div>
      </div>
      <div class="flex mb-4">
        <div class="flex-1 text-left">
          <h4 class="font-medium">Profit/loss</h4>
          <p>
            {{ withSign(project.value - project.net_value) }}
          </p>
        </div>
        <div class="flex-1 text-left">
          <h4 class="font-medium">Percentage change</h4>
          <p>
            <ChangeValue
              :value="project.change_percentage"
              :converter="percentage"
            ></ChangeValue>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Localise from "@/library/mixins/Localise.js";
import Percentage from "@/library/mixins/Percentage.js";
import { mapState } from "vuex";
import ProjectChart from "@/library/charts/ProjectChart.vue";

export default {
  components: {
    ProjectChart
  },
  mixins: [Localise, Percentage],
  props: {
    project: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapState({
      curr: state => state.currency
    }),
  },
  methods: {
    withSign(value) {
      const formatted = this.currency(value, this.curr);
      return value > 0 ? `+${formatted}` : `${formatted}`;
    }
  }
};
</script>

<style>
</style>