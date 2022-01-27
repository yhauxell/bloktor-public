<template>
  <div>
    <h2 class="mb-4 font-bold">Transactions</h2>
    <Table :cols="cols" :rows="project.transactions"> 
        <template #cell-price="{data: {currency: currencyCode, price}}">
            {{currency(price, currencyCode)}}
        </template>
        <template #cell-creation_datetime="{data: {creation_datetime}}">
            {{humanDate(creation_datetime)}}
        </template>
    </Table>
  </div>
</template>

<script>
import Localise from "@/library/mixins/Localise.js";
import moment from 'moment';

export default {
  mixins: [Localise],
  props: {
    project: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      cols: [
        {
          name: "creation_datetime",
          label:"Created at"
        },
        {
          name: "operation"
        },
        { name: "price" },
        {
          name: "holdings"
        }
      ]
    };
  },
  methods:{
    humanDate(datetime){
        return datetime && moment(datetime.seconds * 1000).format('DD-MM-yyyy hh:mm a');
    }
  }
};
</script>

<style>
</style>