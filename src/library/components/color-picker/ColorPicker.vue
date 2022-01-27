<template>
  <ul class="flex">
    <li
      v-for="theme of themes"
      :key="theme.id"
      @click="select(theme.id)"
      class="cursor-pointer rounded-full w-10 h-10 m-2 mx-3 ring ring-white ring-offset-2 ring-offset-purple-100"
      :class="{
        'theme-selected': currentTheme === theme.id,
        [theme.cssClass]: true,
      }"
    >
      <span></span>
    </li>
  </ul>
</template>

<script>
import THEMES from "@/library/themes";

export default {
  props: {
    currentTheme: {
      type: String
    }
  },
  data() {
    return {
      themes: THEMES
    };
  },
  methods: {
    select(e) {
      this.$emit("select", { value: e });
    }
  }
};
</script>
<style scoped>
.theme-blue {
    @apply bg-gradient-to-b;
    @apply from-blue-400; 
    @apply to-indigo-400;
}
.theme-green {
    @apply bg-gradient-to-b;
    @apply from-green-400; 
    @apply to-indigo-400;
}
.theme-red {
    @apply bg-gradient-to-b;
    @apply from-red-400; 
    @apply to-indigo-400;
}
.theme-black {
    @apply bg-gradient-to-b;
    @apply from-gray-900; 
    @apply to-indigo-400;
}
.theme-selected {
  @apply ring-indigo-700;
}
</style>