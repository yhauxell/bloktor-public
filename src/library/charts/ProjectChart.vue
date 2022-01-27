<template>
  <canvas id="projectChart" ref="chart"></canvas>
</template>

<script>
import Chart from "chart.js";
import Localise from "@/library/mixins/Localise.js";

export default {
  mixins: [Localise],
  props: {
    values: {
      type: Array,
      default: () => []
    }
  },
  mounted() {
    const [invested, value] = this.values;
    const ctx = this.$refs.chart.getContext("2d");
    const investedGradient = ctx.createLinearGradient(0, 0, 500, 0);
    const valueGradient = ctx.createLinearGradient(0, 0, 500, 0);

    investedGradient.addColorStop(0, "#60a5fa");
    investedGradient.addColorStop(1, "#818cf8");

    valueGradient.addColorStop(0, value > invested ? "#34d399" : "#f97db2");
    valueGradient.addColorStop(1, value > invested ? "#2ab481" : "#d9035e");

    this.chart = new Chart(ctx, {
      type: "horizontalBar",
      data: {
        labels: ["Invested", "Value"],
        datasets: [
          {
            data: this.values,
            backgroundColor: [investedGradient, valueGradient],
            borderColor: ["rgba(79, 70, 229, 1)", "rgba(54, 162, 235, 1)"],
            borderWidth: 0
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        responsive: true,
        scales: {
          xAxes: [
            {
              ticks: {
                beginAtZero: true,
                callback: value => {
                  return this.currency(value);
                }
              }
            },
            {
              gridLines: {
                drawBorder: true,
                display: false
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                drawBorder: true,
                display: false
              }
            }
          ]
        },
        tooltips: {
          callbacks: {
            label: tooltipItem => {
              return this.currency(tooltipItem.xLabel);
            }
          }
        }
      }
    });
  }
};
</script>

<style>
</style>