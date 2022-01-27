<template>
  <span
    class="flex items-center"
    :class="{
      'text-green-500': value > 0,
      'text-red-500': value < 0,
    }"
  >
    {{ converter(value) }}
    <Indicator
      class="ml-2"
      :type="value > 0 ? 'arrow-up' : 'arrow-down'"
      :color="value > 0 ? 'rgb(16, 185, 129)' : 'rgb(220, 38, 38)'"
    ></Indicator>
  </span>
</template>

<script>
export default {
    props: {
        value: {
            type: Number,
            default: 0
        },
        converter: {
            type: Function,
            default: (value)=>{
              return value;
            }
        }
    }
};
</script>

<style>
</style>