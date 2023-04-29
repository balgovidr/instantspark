import { useEffect, useRef, useState } from "react";
import { getDatabase, ref, onValue, push, onDisconnect, set, serverTimestamp } from "firebase/database";
import { getAuth, signOut } from "firebase/auth";
import { AppState, StyleSheet, Text, View } from "react-native";


export function useOnlinePresence () {
  const [appState, setAppState] = useState(AppState.currentState);
  // const user = useAuthentication();

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
    // return () => {
    //   AppState.removeEventListener('change', handleAppStateChange);
    // };
  }, []);

  const handleAppStateChange = (nextAppState) => {
    console.log('App State: ' + nextAppState);
    saveOnlineStatus(nextAppState);
    if (appState != nextAppState) {
      if (appState.match(/inactive|background/) 
            && nextAppState === 'active') {
        console.log(
          'App State: ' +
          'App has come to the foreground!'
        );
      }
      setAppState(nextAppState);
    }
  };

    const saveOnlineStatus = (nextAppState) => {
      const db = getDatabase();
      const user = getAuth();
      if (user.currentUser) {
        const userId = user.currentUser.uid;
        const reference = ref(db, `/${userId}/online`);
        if (nextAppState==='active') {
          set(reference, 'online')
        } else {
          set(reference, serverTimestamp())
        }
      }
    }
}

export const saveOnlineStatusOnSignIn = (user) => {
  const db = getDatabase();
    const userId = user.uid;
    const reference = ref(db, `/${userId}/online`);
    set(reference, 'online')
}

export const saveLastOnlineOnSignOut = (userId) => {
  const db = getDatabase();
    const reference = ref(db, `/${userId}/online`);
    set(reference, serverTimestamp())
}

export const toggleToActive = (userId) => {
  const db = getDatabase();
    const reference = ref(db, `/${userId}/active`);
    set(reference, true)
}
export const toggleToInactive = (userId) => {
  const db = getDatabase();
    const reference = ref(db, `/${userId}/active`);
    set(reference, false)
}