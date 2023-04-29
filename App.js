import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from "react";
import { NativeBaseProvider, Text, Box, extendTheme, Heading } from "native-base";
import {HomeScreen1, HomeScreen2} from './lib/screens/Registration';
import {Home} from './lib/screens/Home';
import { useAuthentication } from './lib/services/Authentication';
import { UserDetailsRegistration1, UserDetailsRegistration2, UserDetailsRegistration3, UserDetailsRegistration4, UserDetailsRegistration5, UserDetailsRegistration6, UserDetailsRegistration7, UserDetailsRegistration8, UserDetailsRegistration9, UserDetailsRegistration10, UserDetailsRegistration11, PictureUpload} from "./lib/screens/userDetailsRegistration";
import LogIn from "./lib/screens/LogIn";
import ResetPasswordEmail from "./lib/screens/ResetPasswordEmail";
import SignUp from "./lib/screens/SignUp";
import app from './firebaseConfig';
import {getAuth} from '@firebase/auth'


const newColorTheme = {
  brand: {
    900: "#8287af",
    800: "#7c83db",
    700: "#b3bef6",
  },
};
const theme = extendTheme({ colors: newColorTheme });
const Stack = createNativeStackNavigator();
const auth = getAuth(app);

export default function App() {
  
  return(
    <NativeBaseProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="HomeScreen1">
          <Stack.Group>
            <Stack.Screen name="LogIn" component={LogIn} />
            <Stack.Screen name="ResetPasswordEmail" component={ResetPasswordEmail} />
            <Stack.Screen name="HomeScreen1" component={HomeScreen1}/>
            <Stack.Screen name="HomeScreen2" component={HomeScreen2}/>
            <Stack.Screen name="SignUp" component={SignUp}/>
            <Stack.Screen name="PictureUpload" component={PictureUpload}/>
            <Stack.Screen name="UserDetailsRegistration1" component={UserDetailsRegistration1}/>
            <Stack.Screen name="UserDetailsRegistration2" component={UserDetailsRegistration2}/>
            <Stack.Screen name="UserDetailsRegistration3" component={UserDetailsRegistration3}/>
            <Stack.Screen name='UserDetailsRegistration4' component={UserDetailsRegistration4}/>
            <Stack.Screen name='UserDetailsRegistration5' component={UserDetailsRegistration5}/>
            <Stack.Screen name='UserDetailsRegistration6' component={UserDetailsRegistration6}/>
            <Stack.Screen name='UserDetailsRegistration7' component={UserDetailsRegistration7}/>
            <Stack.Screen name='UserDetailsRegistration8' component={UserDetailsRegistration8}/>
            <Stack.Screen name='UserDetailsRegistration9' component={UserDetailsRegistration9}/>
            <Stack.Screen name='UserDetailsRegistration10' component={UserDetailsRegistration10}/>
            <Stack.Screen name='UserDetailsRegistration11' component={UserDetailsRegistration11}/>
          </Stack.Group>
          <Stack.Group>
            <Stack.Screen name="Home" component={Home}/>
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  )
}