import { Text, Box, Heading, View, Alert, ActivityIndicator, Pressable } from "native-base";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, { Component, useEffect, useState } from 'react';
import { StyleSheet, TextInput, Switch } from "react-native";
import styles, { darkColour1, darkColour2, lightColour1, lightColour2, mediumColour } from '../styles';
import app from "../../firebaseConfig";
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, get, child, onValue, push, onDisconnect, set, serverTimestamp } from "firebase/database";
import useOnlinePresence, { saveLastOnlineOnSignOut, toggleToActive, toggleToInactive } from "../services/onlinePresence";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { collection, getFirestore, query, where } from "firebase/firestore";
import { findMatch, saveMatch } from "../services/findMatch";
import { Video } from "../services/Caller";



const Stack = createNativeStackNavigator();
const auth = getAuth(app);
const db = getFirestore();
const dbr = getDatabase();

const Tab = createBottomTabNavigator();

export function Home() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'VideoPrefs') {
              iconName = focused
                ? 'videocam'
                : 'videocam-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          headerShown: false,
          tabBarActiveTintColor: darkColour2,
          tabBarInactiveTintColor: darkColour1,
        })}
      >
        <Tab.Screen name="VideoPrefs" component={VideoPrefs} />
        <Tab.Screen name="Settings" component={Video} />
      </Tab.Navigator>
    );
}

function VideoPrefs ({navigation}) {
  const [matchUid, setMatchUid] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);
  
  findMatch().then((data) => setMatchUid(data))
  
  const toggleSwitch = () => {
    const dbrRef = ref(dbr);
    get(child(dbrRef, getAuth().currentUser.uid+'/active')).then((snapshot) => {
      // console.log(snapshot.exists())
      if (!snapshot.exists()) {
      toggleToActive(getAuth().currentUser.uid);
      setIsEnabled(true);
    } else {
      console.log(snapshot.val())
      if (snapshot.val()) {
      toggleToInactive(getAuth().currentUser.uid);
      setIsEnabled(false);
    } else {
      toggleToActive(getAuth().currentUser.uid);
      setIsEnabled(true);
    }}})
  }

  return (
    <Box style={styles.container}>
      <Heading p="12" paddingTop="180" style={styles.heading}>
        Ready to start receiving calls?
      </Heading>
        <Switch
          trackColor={{false: '#767577', true: mediumColour}}
          thumbColor={isEnabled ? darkColour1 : darkColour1}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
          style={{ transform:[{ scaleX: 4 }, { scaleY: 4 }] }}
        />
      <Text color='#ffffff'>Text {matchUid}</Text>
      <Box style={styles.buttonContainer}>
        <Pressable style={styles.button} title="signOut" onPress={() => {SignOut(getAuth().currentUser.uid, navigation)}}>
          <Text style={styles.buttonText}>
            Sign out
          </Text>
        </Pressable>
      </Box>
    </Box>
  );
};
  
function SignOut (userId, navigation) {
  auth.signOut(auth).then(()=>{
    saveLastOnlineOnSignOut(userId)
    navigation.navigate('HomeScreen1')
  })
}