<template>
  <div class="dashboard">
    <div class="py-8 flex w-full flex-1 justify-end">
      <Button @click="showAddPortfolio = true" variant="primary"
        >New portfolio</Button
      >
      <CreatePortfolioModal
        :show="showAddPortfolio"
        @close="showAddPortfolio = false"
      ></CreatePortfolioModal>
    </div>
    <div class="">
      <Portfolio :model="currentPortfolio"></Portfolio>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import CreatePortfolioModal from "@/components/CreatePortfolioModal.vue";
import Portfolio from "@/components/Portfolio.vue";

export default {
  name: "Home",
  components: {
    Portfolio,
    CreatePortfolioModal
  },
  data() {
    return {
      showAddPortfolio: false
    };
  },
  computed: {
    ...mapState(["portfolios", "currentPortfolio"])
  },
  watch:{
    currentPortfolio(value){
    }
  },
};
</script>
