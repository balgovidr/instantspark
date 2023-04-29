import { Text, Box, Heading, View, Alert, ActivityIndicator, Pressable } from "native-base";
import React, { Component } from 'react';
import styles from '../styles';
import { useAuthentication } from "../services/Authentication";
import app from "../../firebaseConfig";
import { getAuth, onAuthStateChanged } from '@firebase/auth';

export const HomeScreen1 = ({navigation}) => {
  const user = useAuthentication();
  const auth = getAuth(app);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      navigation.navigate('Home')
    }
  });

  return (
    <Box style={styles.container}>
      <Heading p="12" paddingTop="180" style={styles.heading}>
        Date the person, {" "}
        <Heading style={[styles.heading, styles.highlight1]}>
          not the profile.
        </Heading>
      </Heading>
      <Box style={styles.buttonContainer}>
        <Pressable style={styles.button} title="Next" onPress={
          () => navigation.navigate('HomeScreen 2')
        }>
          <Text style={styles.buttonText}>
            Next
          </Text>
        </Pressable>
        <Box width="33%" />
        <Pressable style={styles.button} title="LogIn" onPress={
          () => navigation.navigate('LogIn')
        }>
          <Text style={styles.buttonText}>
            Log in
          </Text>
        </Pressable>
      </Box>
    </Box>
  );
};
  
export const HomeScreen2 = ({navigation}) => {
  return (
    <Box style={styles.container} paddingTop="180">
      <Text style={styles.heading3}>
        Leave the matching to us and meet your true match "or matches!"
      </Text>
      <Box style={styles.buttonContainer}>
        <Pressable style={styles.button} title="Next" onPress={() =>
          navigation.navigate('SignUp')
        }>
          <Text style={styles.buttonText}>
            Next
          </Text>
        </Pressable>
        <Box width="33%" />
        <Pressable style={styles.button} title="Previous" onPress={() =>
          navigation.navigate('HomeScreen1')
        }>
          <Text style={styles.buttonText}>
              Previous
          </Text>
        </Pressable>
      </Box>
    </Box>
  );
};