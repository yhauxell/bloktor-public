<template>
  <div class="relative" :class="$attrs.class">
    <Input
      type="search"
      aria-label="Search"
      @focus="focus"
      @blur.prevent="blur"
      v-model="term"
      :placeholder="$attrs.placeholder"
    />
    <ul
      v-if="showResults"
      class="no-list origin-top-left absolute left-0 mt-2 w-72 max-h-96 overflow-auto rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
      role="menu"
      aria-orientation="vertical"
    >
      <li
        v-for="(result, index) in dataset"
        :key="index"
        v-on="{
          click: $attrs.onSelect ? ()=> select(result) : null,
        }"
        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
        role="menuitem"
      >
        <slot name="element" :element="result">
          {{ result[dataLabel] }}
        </slot>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    dataset: {
      type: Array,
      default: () => []
    },
    datasetLabel: {
      type: String,
      default: null,
      required: true
    }
  },
  data() {
    return {
      term: null,
      focused: false
    };
  },
  computed: {
    showResults() {
      return this.dataset && this.dataset.length > 0 && this.focused;
    }
  },
  watch: {
    term(value) {
      this.search(value);
    }
  },
  methods: {
    search(term) {
      this.$emit("search", term);
    },
    select(element) {
      this.term = null;
      console.log('element', element)
      this.$emit("select", element);
    },
    focus() {
      this.focused = true;
    },
    blur() {
      if (!this.dataset) {
        this.focused = false;
      }
    }
  }
};
</script>

<style>
</style>