import React, { Component, useState, useEffect } from 'react';
import { Text, Box, Heading, ActivityIndicator, Pressable, Overlay } from "native-base";
import { StyleSheet, TextInput, View, Button, Alert, Modal } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "firebase/auth";
import { contains } from '@firebase/util';
import styles from '../styles';

export default class LogIn extends Component {
  
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
    signInUser = () => {
      if(this.state.email === '' && this.state.password === '') {
        Alert.alert('Enter details to sign in!')
      } else {
        this.setState({
          isLoading: true,
        })
        const auth = getAuth();
        signInWithEmailAndPassword(auth, this.state.email, this.state.password)
        .then((userCredential) => {
          const user = userCredential.user;
          this.props.navigation.navigate('Home');
            console.log('Creating profile')
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
                Log In
              </Heading>
              <Box height="30px" />
                <TextInput
                style={styles.inputStyle}
                placeholder="Email"
                value={this.state.email}
                placeholderTextColor="#FFFFFF" 
                onChangeText={(val) => this.updateInputVal(val, 'email')}
                />
                <Box height="10px" />
                <TextInput
                style={styles.inputStyle}
                placeholder="Password"
                value={this.state.password}
                placeholderTextColor="#FFFFFF" 
                onChangeText={(val) => this.updateInputVal(val, 'password')}
                maxLength={15}
                secureTextEntry={true}
                />
                <Box height="50px" />
                <Box style={styles.clearButtonContainer}>
                  <Pressable title="SignUp" style={styles.clearButton} onPress={() => this.props.navigation.navigate('SignUp')}>
                    <Text style={styles.clearButtonText}>Create an account</Text>
                  </Pressable>
                  <Pressable title="ResetPasswordEmail" style={styles.clearButton} onPress={() => this.props.navigation.navigate('ResetPasswordEmail')}>
                    <Text style={styles.clearButtonText}>Reset password</Text>
                  </Pressable>
                </Box>
            </Box>
            <Box style={styles.buttonContainer}>
                
                <Pressable style={styles.button} title="Next" onPress={() => this.signInUser()}>
                    <Text style={styles.buttonText}>
                        Sign In
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