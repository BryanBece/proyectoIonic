import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

defineCustomElements(window);

import firebase from 'firebase/compat/app';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyAgGayoiomwlCbZXu6kMuxmycoWBaEJD3k",
  authDomain: "tallertriumviratusapp.firebaseapp.com",
  projectId: "tallertriumviratusapp",
  storageBucket: "tallertriumviratusapp.appspot.com",
  messagingSenderId: "614986730977",
  appId: "1:614986730977:web:3a6d63472271484c92d6a0",
  measurementId: "G-5QFST2SR8Y"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);