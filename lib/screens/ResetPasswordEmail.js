import React, { Component, useState, useEffect } from 'react';
import { Text, Box, Heading, ActivityIndicator, Pressable, Overlay } from "native-base";
import { StyleSheet, TextInput, View, Button, Alert, Modal } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { contains } from '@firebase/util';
import styles from '../styles';

export default class ResetPasswordEmail extends Component {
  
    constructor() {
      super();
      this.state = {
        email: '',
        isLoading: false,
      }
    }
    updateInputVal = (val, prop) => {
      const state = this.state;
      state[prop] = val;
      this.setState(state);
    }
    resetPasswordEmail = () => {
      if(this.state.email === '') {
        Alert.alert('Enter your email')
      } else {
        this.setState({
          isLoading: true,
        })
        const auth = getAuth();
        sendPasswordResetEmail(auth, this.state.email)
        .then(() => {
          Alert.alert('Check your email.')
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
      return (
        <Box style={styles.container}>
            <Box p="12">
              <Heading style={styles.heading}>
                Reset Password
              </Heading>
              <Box height="30px" />
                <TextInput
                style={styles.inputStyle}
                placeholder="Email"
                value={this.state.email}
                placeholderTextColor="#FFFFFF" 
                onChangeText={(val) => this.updateInputVal(val, 'email')}
                />
            </Box>
            <Box style={styles.buttonContainer}>
                
                <Pressable style={styles.button} title="Next" onPress={() => this.resetPasswordEmail()}>
                    <Text style={styles.buttonText}>
                        Send link
                    </Text>
                </Pressable>
                <Box width="33%" />
                <Pressable style={styles.button}
                title="LogIn"
                onPress={() =>
                this.props.navigation.navigate('LogIn')
                }
            >
                    <Text style={styles.buttonText}>
                        Sign In
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