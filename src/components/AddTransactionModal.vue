<template>
  <form @submit.prevent="send">
    <Modal v-if="show" title="Create transaction" @close="close">
      <template #header>
        <header class="text-lg leading-6 font-medium text-gray-900">
          <h1 class="mx-8 my-4">New transaction</h1>
          <h2 class="flex  mx-8 my-4">
            <img
              :src="`/coins/${project.ticker}.svg`"
              :alt="project.ticker"
              onerror="this.onerror=null;this.src='/coins/unknown.svg'"
              class="mr-2 w-6 h-6"
            />
            {{ project.name }}
          </h2>
        </header>
      </template>
      <template #content>
        <div class="grid grid-cols-6 gap-6">
          <div class="col-span-6 sm:col-span-4">
            <label>Operation</label>
            <select class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option v-for="(value, key) of operationTypes" :key="key">
                {{ value }}
              </option>
            </select>
          </div>
          <div class="col-span-6 sm:col-span-4">
            <label for="holdings">
              Holdings
              <Input type="number" v-model="model.holdings" id="holdings" step="0.00001"/>
            </label>
          </div>
          <div class="col-span-6 sm:col-span-4">
            <label for="currency">Currency</label>
            <select id="currency" v-model="model.currency" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option v-for="(value, key) of currencies" :key="key">
                {{ value }}
              </option>
            </select>
          </div>
          <div class="col-span-6 sm:col-span-4">
            <label for="price">
              Price
              <Input type="number" v-model="model.price" id="price" step="0.00001" required />
            </label>
          </div>
          <div class="col-span-6 sm:col-span-4">
            <label for="fee">
              Fee
              <Input type="number" v-model="model.fee" id="fee" />
            </label>
          </div>
          <div class="col-span-6 sm:col-span-4 flex">
            <label for="creation_date">
              Creation date
              <Input type="date" v-model="model.creation_date" id="creation_date" />
            </label>
            <label for="creation_time" class="ml-1">
              time
              <Input type="time" v-model="model.creation_time" id="creation_time" />
            </label>
          </div>
          <div class="col-span-6 sm:col-span-4">
            <label for="notes">
              Notes
              <textarea v-model="model.notes" id="notes" rows="2" class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
            </label>
          </div>
        </div>
      </template>
      <template #actions>
        <Button variant="primary">Save</Button>
        <Button @click="close">Cancel</Button>
      </template>
    </Modal>
  </form>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/firestore';
import { mapActions } from "vuex";

const OPERATIONS = {
  BUY: "BUY",
  SELL: "SELL",
  TRANSFER: "TRANSFER"
};

const CURRENCIES = {
  USD:'USD',
  EUR: 'EUR',
  USDT: 'USDT',
  BTC: 'BTC',
  ETH: 'ETH',
}

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    portfolio: {
      type: String,
      default: null
    },
    project: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      operationTypes: OPERATIONS,
      currencies: CURRENCIES,
      model: {
        operation: OPERATIONS.BUY,
        holdings: null,
        price: null,
        fee: null,
        currency: "EUR"
      }
    };
  },
  methods: {
    async send() {

      const creation_datetime = new firebase.firestore.Timestamp.fromDate(new Date(this.model.creation_date + ' ' + this.model.creation_time));

      delete this.model.creation_date;
      delete this.model.creation_time;

      await this.addTransactionToProject({project:this.project.id, transaction: {
        ...this.model,
        creation_datetime
      }});

      alert("Transaction saved!");

      this.close();
    },
    close() {
      this.$emit("close");
    },
    ...mapActions(["addTransactionToProject"])
  }
};
</script>

<style>
</style>