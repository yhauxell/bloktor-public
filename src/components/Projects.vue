<template>
  <div>
    <h3 class="mb-4 text-right font-bold">{{ rows.length }} projects</h3>
    <Table :cols="cols" :rows="rows">
      <template #cell-ticker="{ data: { ticker } }">
        <div class="flex">
          <img
            :src="`/coins/${ticker}.svg`"
            :alt="ticker"
            onerror="this.onerror=null;this.src='/coins/unknown.svg'"
            class="mr-2 w-6 h-6"
          />
          <span class="md:hidden uppercase">{{ ticker }}</span>
        </div>
      </template>
      <template #cell-price="{ data: { price } }">
        {{ currency(price, curr) }}
      </template>
      <template
        #cell-value="{ data: { value, profitloss, total_holdings, ticker } }"
      >
        <span class="block">{{ currency(value, curr) }}</span>
        <span class="block text-xs uppercase"
          >{{ total_holdings }} {{ ticker }}</span
        >
        <span class="text-xs flex row">
          P/L:
          <ChangeValue
            :value="profitloss"
            :converter="
              (value) => {
                return currency(value, curr);
              }
            "
          ></ChangeValue>
        </span>
      </template>
      <template #cell-change_24h="{ data: { change_24h } }">
        <ChangeValue :value="change_24h" :converter="percentage"></ChangeValue>
      </template>
      <template #cell-id="{ data }">
        <Button @click="viewProjectDetails(data)" variant="primary"
          >View</Button
        >
      </template>
    </Table>
    <ProjectDetailsModal
      :project="currentProject"
      :portfolio="portfolioId"
      :show="showProjectDetails"
      @close="closeProjectDetails"
    ></ProjectDetailsModal>
  </div>
</template>

<script>
import ProjectDetailsModal from "./ProjectDetailsModal.vue";
import Localise from "@/library/mixins/Localise.js";
import Percentage from "@/library/mixins/Percentage.js";
import { mapState } from "vuex";

export default {
  components: {
    ProjectDetailsModal
  },
  mixins: [Localise, Percentage],
  props: {
    portfolioId: {
      type: String,
      default: null
    },
    projects: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      cols: [
        { name: "ticker", label: false },
        {
          name: "change_24h",
          label: "Last 24H",
          cssClasses: ["hidden", "md:table-cell"]
        },
        { name: "name", cssClasses: ["hidden", "md:table-cell"] },
        { name: "price" },
        { name: "value", label: "Value" },
        { name: "id", label: false }
      ],
      showProjectDetails: false,
      currentProject: {},
      sortedIds: []
    };
  },
  computed: {
    rows() {
      if (this.projects instanceof Object) {
        return Object.values(this.projects);
      }
      return this.projects;
    },
    ...mapState({ curr: state => state.currency })
  },
  methods: {
    viewProjectDetails(project) {
      this.currentProject = project;
      this.showProjectDetails = true;
    },
    closeProjectDetails() {
      this.showProjectDetails = false;
      this.currentProject = null;
    }
  }
};
</script>

<style>
</style>