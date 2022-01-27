<template>
  <ul class="no-list flex">
    <li v-for="(link, index) of links" :key="index" class="mr-2">
      <a :href="link.link" target="_blank" class="capital text-blue-700 hover:text-indigo-700" :title="link.name">{{ link.name }}</a>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    links: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    withCapital(input) {
      return String(input)
        .toCa()
        .replace(" ", "_");
    }
  }
};
</script>
