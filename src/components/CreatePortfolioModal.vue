<template>
  <form @submit.prevent="send">
    <Modal v-if="show" title="Create portfolio" @close="close">
      <template #content>
        <div class="grid grid-cols-6 gap-6">
          <div class="col-span-6 sm:col-span-4">
              <label>Theme</label>
              <ColorPicker :current-theme="model.theme" @select="model.theme = $event.value"/>
          </div>
          <div class="col-span-6 sm:col-span-4">
            <label for="name">
              Name
              <Input type="text" v-model="model.name" id="name" />
            </label>
          </div>
        </div>
      </template>
      <template #actions>
        <Button variant="primary">Save</Button>
        <Button @click="close">Cancel</Button>
      </template>
    </Modal>
  </form>
</template>

<script>
import ColorPicker from "@/library/components/color-picker/ColorPicker.vue";
import { mapActions } from 'vuex';

export default {
  components: { ColorPicker },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      model: {
        name: null,
        theme: 'BLUE'
      }
    };
  },
  methods: {
    async send() {
      const newPortfolio = await this.addPortfolio(this.model);
      console.log("saved :>", newPortfolio);
    },
    close() {
      this.$emit("close");
    },
    debug(data) {
      console.debug(data);
    },
    ...mapActions(["addPortfolio"])

  }
};
</script>

<style>
</style>