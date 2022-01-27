<template>
  <div class="h-full flex flex-col">
    <div ref="tradingview" :id="container" class="tradingview-widget-container">
      <div class="tradingview-widget-container__widget"></div>
      <div class="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/symbols/EURUSD/?exchange=FX"
          rel="noopener"
          target="_blank"
        >
          <span class="blue-text">{{ this.symbol }}</span>
        </a>
        by TradingView
      </div>
    </div>
    <div class="block">
      <ul class="list-none flex my-6 -ml-3">
        <li>
          <Button
            @click="updateRange('1D')"
            :variant="range === '1D' ? 'primary' : 'secondary'"
            >1D</Button
          >
        </li>
        <li>
          <Button
            @click="updateRange('1M')"
            :variant="range === '1M' ? 'primary' : 'secondary'"
            >1M</Button
          >
        </li>
        <li>
          <Button
            @click="updateRange('3M')"
            :variant="range === '3M' ? 'primary' : 'secondary'"
            >3M</Button
          >
        </li>
        <li>
          <Button
            @click="updateRange('1Y')"
            :variant="range === '1Y' ? 'primary' : 'secondary'"
            >1Y</Button
          >
        </li>
        <li>
          <Button
            @click="updateRange('ALL')"
            :variant="range === 'ALL' ? 'primary' : 'secondary'"
            >ALL</Button
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
const SCRIPT_ID = "tradingview-widget-script";
const CONTAINER_ID = "tradingview-widget-container";

export default {
  data() {
    return {
      container: CONTAINER_ID,
      range: "1D"
    };
  },
  props: {
    symbol: {
      type: String,
      default: "COINBASE:BTCUSD"
    }
  },
  methods: {
    canUseDOM() {
      return (
        typeof window !== "undefined" &&
        window.document &&
        window.document.createElement
      );
    },
    getScriptElement() {
      return document.getElementById(SCRIPT_ID);
    },
    updateOnloadListener(onload) {
      const script = this.getScriptElement();
      const oldOnload = script.onload;
      return (script.onload = () => {
        oldOnload();
        onload();
      });
    },
    scriptExists() {
      return this.getScriptElement() !== null;
    },
    appendScript(onload) {
      if (!this.canUseDOM()) {
        onload();
        return;
      }

      if (this.scriptExists()) {
        if (typeof TradingView === "undefined") {
          this.updateOnloadListener(onload);
          return;
        }
        onload();
        return;
      }
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.type = "text/javascript";
      script.async = true;
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
      script.onload = onload;
      script.textContent = JSON.stringify({
        symbol: this.symbol,
        width: "100%",
        height: "100%",
        locale: "en",
        dateRange: this.range,
        colorTheme: "light",
        trendLineColor: "rgba(79, 70, 229, 1)",
        underLineColor: "rgba(79, 70, 229, 0.1)",
        isTransparent: true,
        autosize: true,
        largeChartUrl: ""
      });

      this.$refs.tradingview.appendChild(script);
    },

    initWidget() {
      console.log("[widget-economic-calendar] loaded");
    },

    updateRange(range) {
      document.getElementById(SCRIPT_ID).remove();
      this.range = range;
      this.appendScript(this.initWidget);
    }
  },
  mounted() {
    setTimeout(() => {
      this.appendScript(this.initWidget);
    }, 300);
  }
};
</script>