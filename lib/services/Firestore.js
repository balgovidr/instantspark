// import React from 'react';
import { getAuth, onAuthStateChanged, User } from '@firebase/auth';
import app from '../../firebaseConfig';
import { getFirestore, setDoc, doc } from "@firebase/firestore";

export function updateFirestore(collectionName, data) {
  const auth = getAuth(app);
  const db = getFirestore(app);

  setDoc(doc(db, collectionName, auth.currentUser.uid), data, { merge: true }).catch(error => {this.setState({ errorMessage: error.message })
  Alert.alert('There has been an error. Please skip and try again later.')});

}