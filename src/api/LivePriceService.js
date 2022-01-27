const PriceWorker = new Worker("@/library/workers/PriceWorker.js", { type: 'module' });

export default {
  async ping() {
    return '';
  },
  /**
   * Live price from Coingecko through web worker
   * 
   * @param {object} params - Parameters to pass through to the request
   * @param {array|string} params.ids - (Required) A single id or a list of coin ids to filter if you want specific results. Use coins.list() for a list of coin ids.
   * @param {array|string} params.vs_currencies [default: usd] - A single id or a list of ids. Use simple.supportedVsCurrencies() for a list of vsCurrency ids.
   * @param {boolean} params.include_24hr_vol [default: false] - To include 24hr_vol (true/false)
   * @param {boolean} params.include_24hr_change [default: false] - To include include_24hr_change (true/false)
   * @param {boolean} params.include_last_updated_at [default: false] - To include last_updated_at of price (true/false)
   * @param {*} onUpdateFn
   */
  live(params = {}, onUpdateFn) {
    PriceWorker.postMessage({ run: 'live_price', params });
    PriceWorker.onmessage = function(feed) {
      const { live_price } = feed.data;
      if (live_price) {
        return onUpdateFn(live_price);
      }
    };
  },
};