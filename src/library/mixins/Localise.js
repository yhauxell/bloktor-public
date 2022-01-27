export default {
  methods: {
    currency(value, currencyCode = 'EUR') {
      return new Intl.NumberFormat(navigator.browserLanguage, {
        style: 'currency',
        currency: currencyCode,
      }).format(value || 0);
    },
  },
};
