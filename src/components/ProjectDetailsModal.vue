<template>
  <Modal
    v-if="show"
    title="Transactions"
    class="min-w-full min-h-full w-full h-full"
    @close="close"
  >
    <template #header>
      <header
        class="text-lg leading-6 font-medium text-gray-900 px-2 sm:px-6 mt-6 rounded-md flex justify-around items-center"
      >
        <h1 class="flex">
          <img
            :src="`/coins/${project.ticker}.svg`"
            :alt="project.ticker"
            onerror="this.onerror=null;this.src='/coins/unknown.svg'"
            class="mr-2 w-6 h-6"
          />
          {{ project.name }}
        </h1>
        <div class="justify-end flex-1 flex mr-4">
          <Button variant="primary" @click="addTransaction"
            >Add transaction</Button
          >
          <AddTransactionModal
            :portfolio="portfolio"
            :project="project"
            :show="showAddTransaction"
            @close="closeAddTransaction"
          ></AddTransactionModal>
        </div>
      </header>
    </template>
    <template #content>
      <ul class="list-none flex mb-8 sm:-ml-4">
        <li>
          <Button
            @click="switchTo(VIEWS.PROFIT_LOSS)"
            :variant="
              currentView === VIEWS.PROFIT_LOSS ? 'primary' : 'secondary'
            "
            >Profit/Loss</Button
          >
        </li>
        <li>
          <Button
            @click="switchTo(VIEWS.PROFILE)"
            :variant="currentView === VIEWS.PROFILE ? 'primary' : 'secondary'"
            >Profile</Button
          >
        </li>
        <li>
          <Button
            @click="switchTo(VIEWS.METRICS)"
            :variant="currentView === VIEWS.METRICS ? 'primary' : 'secondary'"
            >Metrics</Button
          >
        </li>
        <li>
          <Button
            @click="switchTo(VIEWS.TRANSACTIONS)"
            :variant="
              currentView === VIEWS.TRANSACTIONS ? 'primary' : 'secondary'
            "
            >Transactions</Button
          >
        </li>
      </ul>
      <component :is="currentView" :project="project"></component>
    </template>
    <template #actions>
      <Button @click="close">Close</Button>
    </template>
  </Modal>
</template>

<script>
import Transactions from "./Transactions.vue";
import ProfitLoss from "./ProfitLoss.vue";
import Profile from "./Profile.vue";
import Metrics from "./Metrics.vue";
import AddTransactionModal from "./AddTransactionModal";

export default {
  components: {
    Profile,
    Metrics,
    Transactions,
    ProfitLoss,
    AddTransactionModal
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    project: {
      type: Object,
      default: () => ({})
    },
    portfolio: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      currentView: "ProfitLoss",
      showAddTransaction: false,
      VIEWS: {
        PROFILE: "Profile",
        METRICS: "Metrics",
        PROFIT_LOSS: "ProfitLoss",
        TRANSACTIONS: "Transactions"
      }
    };
  },
  methods: {
    switchTo(view) {
      this.currentView = view;
    },
    close() {
      this.$emit("close");
    },
    addTransaction() {
      this.showAddTransaction = true;
    },
    closeAddTransaction() {
      this.showAddTransaction = false;
    }
  }
};
</script>

<style>
</style>