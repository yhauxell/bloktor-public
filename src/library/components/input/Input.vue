<template>
  <input
    class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    :type="type"
    :value="modelValue"
    v-bind="$attrs"
    @input="onInput"
  />
</template>
<script>
export default {
  name: "Input",
  props: {
    type: {
      type: String,
      default: "text"
    },
    modelValue: {
      type: null,
      default: null
    }
  },methods:{
    onInput($event){
      let value = $event.target.value;
      if(this.type === "number"){
        value = Number(value);
      }
      this.$emit('update:modelValue', value);
    }
  }
};
</script>