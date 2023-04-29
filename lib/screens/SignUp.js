import React, { Component, useState, useEffect } from 'react';
import { Text, Box, Heading, ActivityIndicator, Pressable, Overlay } from "native-base";
import { StyleSheet, TextInput, View, Button, Alert, Modal } from 'react-native';
import app from "../../firebaseConfig";
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { contains } from '@firebase/util';
import styles from '../styles';

export default class SignUp extends Component {
  
    constructor() {
      super();
      this.state = { 
        displayName: '',
        email: '', 
        password: '',
        isLoading: false,
      }
    }
    updateInputVal = (val, prop) => {
      const state = this.state;
      state[prop] = val;
      this.setState(state);
    }
    registerUser = () => {
      if(this.state.email === '' && this.state.password === '') {
        Alert.alert('Enter details to signup!')
      } else {
        this.setState({
          isLoading: true,
        })
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, this.state.email, this.state.password)
        .then((res) => {
            console.log('Creating profile')
            updateProfile(res.user, {displayName: this.state.displayName}).then(() => {
                console.log('User registered successfully!');
                sendEmailVerification(auth.currentUser)
                .then(() => {
                  Alert.alert('Please check your email to confirm')
                });
                this.setState({
                    isLoading: false,
                    displayName: '',
                    email: '', 
                    password: ''
                });
                this.props.navigation.navigate('UserDetailsRegistration1')
            }).catch(error => {this.setState({ errorMessage: error.message })
                Alert.alert(error.message)});
          
        })
        .catch(error => {this.setState({ errorMessage: error.message })
        if (contains(error.message, "email")) {
            Alert.alert('Please provide a valid email');
        } else if (contains(error.message, "Password should be at least 6 characters")) {
            Alert.alert('Password should be at least 6 characters');
        } else if (contains(error.message, "email-already-in-use")) {
            Alert.alert('Email is already in use. Try logging in instead');
        } else {
            Alert.alert(error.message)
        }
        })      
      }
    }
    render() {
    //   if(this.state.isLoading){
    //     return(
    //       <View style={styles.preloader}>
    //         <ActivityIndicator size="large" color="#9E9E9E"/>
    //       </View>
    //     )
    //   }
      return (
        <Box style={styles.container}>
            <Box p="12">
              <Heading style={styles.heading}>
                Sign Up
              </Heading>
                <TextInput
                style={styles.inputStyle}
                placeholder="Name"
                value={this.state.displayName}
                placeholderTextColor="#FFFFFF" 
                onChangeText={(val) => this.updateInputVal(val, 'displayName')}
                />      
                <TextInput
                style={styles.inputStyle}
                placeholder="Email"
                value={this.state.email}
                placeholderTextColor="#FFFFFF" 
                onChangeText={(val) => this.updateInputVal(val, 'email')}
                />
                <TextInput
                style={styles.inputStyle}
                placeholder="Password"
                value={this.state.password}
                placeholderTextColor="#FFFFFF" 
                onChangeText={(val) => this.updateInputVal(val, 'password')}
                maxLength={15}
                secureTextEntry={true}
                />
                {/* <Text 
                style={styles.loginText}
                onPress={() => this.props.navigation.navigate('Login')}>
                Already Registered? Click here to login
                </Text>                           */}
            </Box>
            <Box style={styles.buttonContainer}>
                
                <Pressable style={styles.button}
                title="Next"
                onPress={() => {
                    this.registerUser()
                }}
                >
                    <Text style={styles.buttonText}>
                        Next
                    </Text>
                </Pressable>
                <Box width="33%" />
                <Pressable style={styles.button}
                title="Previous"
                onPress={() =>
                this.props.navigation.navigate('HomeScreen2')
                }
            >
                    <Text style={styles.buttonText}>
                        Previous
                    </Text>
                </Pressable>
            </Box>
      </Box>
      );
    }
  }

  // const styles = StyleSheet.create({
  //   container: {
  //       backgroundColor: "#231942",
  //       flexDirection: "column",
  //       justifyContent: "space-between",
  //       width: "100%",
  //       height: "100%",
  //   },
  //   heading: {
  //       fontSize: 40,
  //       fontWeight: "200",
  //       color: "#FFFFFF",
  //       lineHeight: 50,
  //   },
  //   heading3: {
  //       color: "#FFFFFF",
  //       fontSize: 25,
  //       padding: 30,
  //       paddingTop: 50,
  //       lineHeight: 35,
  //       fontWeight: "300"
  //   },
  //   highlight1: {
  //       color: "#9F86C0",
  //       fontWeight: "400",
  //       // textTransform: "uppercase"
  //   },
  //   buttonContainer: {
  //       // justifyContent: "flex-end",
  //       alignContent: "space-between",
  //       paddingBottom: 30,
  //       paddingHorizontal:30,
  //       flexWrap: "wrap",
  //       // backgroundColor: "#000000",
  //       height: 80,
  //       width: "100%",
  //       flexDirection: "row-reverse"
  //   },
  //   button: {
  //       width: "33%",
  //       padding:15,
  //       alignItems: 'center',
  //       justifyContent: 'center',
  //       borderRadius: 4,
  //       elevation: 9,
  //       backgroundColor: '#FFFFFF',
  //   },
  //   buttonText: {
  //       fontSize:20,
  //       color: "#5E548E"
  //   },
  //   inputStyle: {
  //     color: "#FFFFFF",
  //     borderBottomWidth: 1,
  //     borderBottomColor: "#FFFFFF",
  //     placeholderTextColor: "#FFFFFF",
  //     paddingTop: 15
  //   },
  //   loginText: {
  //     color: "#FFFFFF",
  //     paddingVertical: 15
  //   },
  //   overlay: {
  //       backgroundColor: "#FFFFFF"
  //   }
  // });