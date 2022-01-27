<template>
  <button
    :type="type"
    class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md sm:mt-0 sm:ml-3"
    :class="variantCSS"
    v-bind="$attrs"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "submit"
    },
    variant: {
      type: String,
      default: null
    }
  },
  computed: {
    variantCSS() {
      switch (this.variant) {
        case "primary":
          return "text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
        case "destructive":
          return "bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm";
        default:
          return "border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm";
      }
    }
  }
};
</script>

<style>
</style>