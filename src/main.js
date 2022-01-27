import { createApp } from 'vue';
import firebase from 'firebase/app';
import 'firebase/auth';
import '@/firestore';

import router from './router';
import store from './store';

import App from './App.vue';

import './assets/modern-normalize.min.css';
import './assets/tailwind.css';
import './assets/extra.css';

import { registerDirectives } from './library/directives';
import { registerComponents } from './library/components';
import './registerServiceWorker'

firebase.auth().onAuthStateChanged(async (user) => {
  let token;
  if (user) {
    token = await firebase.auth().currentUser.getIdToken();
  }
  store.dispatch('updateUser', { ...firebase.auth().currentUser, token });
});

const app = createApp(App);

registerDirectives(app);
registerComponents(app);

app
  .use(store)
  .use(router)
  .mount('#app');
