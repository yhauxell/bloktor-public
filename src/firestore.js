import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/functions';
import Config from '@/config';

let app = null;

if (!app) {
  app = firebase.initializeApp(Config.getFirebaseEnvVars());
}

firebase.functions().useEmulator("localhost", 5001);

const db = firebase.firestore();
const fn = firebase.functions();

export {db, fn, firebase};
