/* eslint-disable prettier/prettier */
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import 'firebase/compat/firestore';
// import "firebase/compat/storage";
import { initializeApp } from '@firebase/app';
import { getFirestore, initializeFirestore} from "@firebase/firestore";

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyAXruJ7USASd4hQFS_cB0uGO5RGgQnJGuY',
  authDomain: 'instantspark-ec2b8.firebaseapp.com',
  databaseURL: 'https://instantspark-ec2b8-default-rtdb.europe-west1.firebasedatabase.app/',
  projectId: 'instantspark-ec2b8',
  storageBucket: 'instantspark-ec2b8.appspot.com',
  messagingSenderId: '733749835380',
  appId: '1:733749835380:android:a1643a7417ceedd8da0321',
  measurementId: 'G-measurement-id',
};


const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export default app;
// export const auth = getAuth(app);
// export const db = getFirestore(app);
// export const storage = getStorage(app);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
