export default {
  methods: {
    percentage(value, decimals = 2) {
      return `${Number(value || 0).toFixed(decimals)} %`;
    },
  },
};
