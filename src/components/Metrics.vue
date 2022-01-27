<template>
  <div class="p-2 sm:p-0 text-left">
    <h2 class="mb-4 font-bold">Metrics</h2>
    <div class="flex mb-4 flex-col sm:flex-row">
      <div class="flex-1 mb-3 sm:mb-0">
        <h4 class="font-medium">All time high on</h4>
        <p>{{ withDateFormat(allTimeHigh.at) }}</p>
      </div>
      <div class="flex-1 mb-3 sm:mb-0">
        <h4 class="font-medium">All time high price</h4>
        <p>{{ currency(allTimeHigh.price, curr) }}</p>
      </div>
      <div class="flex-1 mb-3 sm:mb-0">
        <h4 class="font-medium">Percentage down</h4>
        <p>
          <ChangeValue
            :value="allTimeHigh.percent_down * -1"
            :converter="percentage"
          ></ChangeValue>
        </p>
      </div>
    </div>
    <h2 class="mb-4 font-bold">ROI</h2>
    <div class="flex mb-4 flex-col sm:flex-row">
      <div class="flex-1 mb-3 sm:mb-0">
        <h4 class="font-medium">Change 1 week</h4>
        <p>
          <ChangeValue
            :value="roi.percent_change_last_1_week"
            :converter="percentage"
          ></ChangeValue>
        </p>
      </div>
      <div class="flex-1 mb-3 sm:mb-0">
        <h4 class="font-medium">Change 1 month</h4>
        <p>
          <ChangeValue
            :value="roi.percent_change_last_1_month"
            :converter="percentage"
          ></ChangeValue>
        </p>
      </div>
      <div class="flex-1 mb-3 sm:mb-0">
        <h4 class="font-medium">Change 1 year</h4>
        <p>
          <ChangeValue
            :value="roi.percent_change_last_1_year"
            :converter="percentage"
          ></ChangeValue>
        </p>
      </div>
    </div>
    <div class="flex w-1/3">
      Powered by
      <img
        class="ml-4 sm:w-1/3 w-3/4"
        src="https://data.messari.io/docs/logo_messari_black_horizontal.svg"
        alt="Messari API"
      />
    </div>
  </div>
</template>

<script>
import moment from "moment";
import Localise from "@/library/mixins/Localise.js";
import Percentage from "@/library/mixins/Percentage.js";
import MessaryService from "@/api/MessariService.js";
import { mapState } from "vuex";

export default {
  mixins: [Localise, Percentage],
  props: {
    project: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      metrics: null
    };
  },
  computed: {
    allTimeHigh() {
      return this.metrics?.all_time_high || {};
    },
    roi() {
      return this.metrics?.roi_data || {};
    },
    ...mapState({
      curr: state => state.currency
    })
  },
  async created() {
    try {
      this.metrics = await MessaryService.metrics(this.project.id);
    } catch (error) {
      this.metrics = null;
    }
  },
  methods: {
    withSign(value) {
      const formatted = this.currency(value, this.curr);
      return value > 0 ? `+${formatted}` : `-${formatted}`;
    },
    withDateFormat(date) {
      return moment(date).format("DD-MM-yyyy");
    }
  }
};
</script>

<style>
</style>