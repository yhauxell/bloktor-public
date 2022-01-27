<template>
  <div class="p-2 sm:p-0 text-left">
    <div class="h-3/4 min-h-3/4 p-2">
      <TradingViewTicker :symbol="project.exchange"></TradingViewTicker>
    </div>
    <h2 class="mb-4 font-bold">Profile</h2>
    <div class="flex mb-4 overflow-auto">
      <h3 class="font-medium mr-2">Official links:</h3>
      <SocialLinks :links="links"></SocialLinks>
    </div>
    <div class="flex mb-4 flex-col">
      <div>
        <h4 class="font-medium">General</h4>
        <p v-if="details" v-html="details"></p>
        <LoadingBox v-else class="w-full h-36"> </LoadingBox>
      </div>
    </div>
    <div class="flex sm:w-1/3 w-2/4">
      Powered by
      <img
        class="ml-4 w-3/4 sm:w-1/3"
        src="https://data.messari.io/docs/logo_messari_black_horizontal.svg"
        alt="Messari API"
      />
    </div>
  </div>
</template>

<script>
import Localise from "@/library/mixins/Localise.js";
import Percentage from "@/library/mixins/Percentage.js";
import MessaryService from "@/api/MessariService.js";
import SocialLinks from "./SocialLinks.vue";
import TradingViewTicker from "@/library/widgets/TradingViewTicker.vue";

export default {
  components: {
    TradingViewTicker,
    SocialLinks
  },
  mixins: [Localise, Percentage],
  props: {
    project: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      profile: null
    };
  },
  computed: {
    details() {
      return (
        this.profile?.general?.overview?.project_details ||
        "No information related to this project has been found"
      );
    },
    links() {
      return this.profile?.general?.overview?.official_links || null;
    }
  },
  async created() {
    try {
      this.profile = await MessaryService.profile(this.project.id);
    } catch (error) {
      this.profile = null;
    }
  }
};
</script>

<style>
</style>