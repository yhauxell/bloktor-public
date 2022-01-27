export default {
  /**
   * Returns important project values computed
   * @param {Array} transactions
   * @returns {{net_value: Number, total_holdings: Number, ave_pph: Number}} Net value, Total number of holdings, Average price per holding
   */
  compute(transactions) {
    /** 
        currency: "EUR"
        fee: "3"
        holdings: "1"
        operation: "BUY"
        price: "2"
    */
    let computed = {
      net_value: 0,
      total_holdings: 0,
      changed_value: 0,
    };

    if (Array.isArray(transactions) && transactions.length > 0) {
      computed = transactions.reduce(
        (
          { net_value, total_holdings },
          { operation, fee, holdings, price }
        ) => {
          let netValue, totalHoldings;
          const cost = holdings * price;
          switch (operation) {
            case 'BUY':
            case 'TRANSFER':
              netValue = net_value + fee + cost;
              totalHoldings = total_holdings + holdings;

              break;
            case 'SELL':
              netValue = net_value + fee - cost;
              totalHoldings = total_holdings - holdings;
              break;
          }

          return {
            net_value: netValue,
            total_holdings: totalHoldings,
          };
        },
        computed
      );
    }
    computed.ave_pph = computed.net_value
      ? computed.net_value / computed.total_holdings
      : 0;

    return computed;
  },
  value() {},
};
