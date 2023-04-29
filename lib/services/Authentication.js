import React from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import app from '../../firebaseConfig';
import { saveOnlineStatusOnSignIn } from './onlinePresence';

const auth = getAuth(app);

export function useAuthentication() {
  const [user, setUser] = React.useState();

  React.useEffect(() => {
    const unsubscribeFromAuthStatuChanged = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUser(user);
        console.log('logged in');
        saveOnlineStatusOnSignIn(user);
      } else {
        // User is signed out
        setUser(undefined);
        console.log('not logged in');
      }
    });

    return unsubscribeFromAuthStatuChanged;
  }, []);

  return {
    user
  };
}