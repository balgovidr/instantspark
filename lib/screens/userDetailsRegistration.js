import React, { useState, useEffect } from 'react';
import styles from '../styles';
import RadioButton from '../widgets/RadioButton';
import { Text, Box, Heading, ActivityIndicator, Pressable, Button, TouchableOpacity,  Overlay, View } from "native-base";
import { Alert, TextInput, Image, ScrollView } from 'react-native';
import CheckBox from '../widgets/CheckBox';
import DatePicker from '../widgets/DatePicker';
import { updateFirestore } from '../services/Firestore';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../../firebaseConfig';

export function PictureUpload({navigation}) {
  const [images, setImages] = useState([null,null,null,null,null,null]);
  const [downloadURLs, setDownloadURLs] = useState([null,null,null,null,null,null]);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const storage = getStorage(app);
  const auth = getAuth(app);

  // useEffect(() => {
  //   setHeight((feet===null?0:feet)*30.48+(inches===null?0:inches)*2.54);
  // });

  async function selectImage(index) {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });


    if (!result.canceled) {
      const nextImage = images.map((c,i) => {
        if (i === index) {
          return result.assets[0].uri;
        } else {
          return c;
        }
      })
      setImages(nextImage);
    }
  };

  function uploadImage() {
    images.map(async (image, index) => {
      if (image !== null) {
        const uri = images[index];
        const fileName = uri.substring(uri.lastIndexOf('/') + 1);
        const extension = uri.substring(uri.lastIndexOf('.') + 1);
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        const storageRef = ref(storage, 'userImages/'+auth.currentUser.uid+'/'+index+'.'+extension);

        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function (e) {
            console.log(e);
            reject(new TypeError("Network request failed"));
          };
          xhr.responseType = "blob";
          xhr.open("GET", uploadUri, true);
          xhr.send(null);
        });

        setTransferred(0);

        const uploadTask = uploadBytesResumable(storageRef, blob);

        uploadTask.on('state_changed', 
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            setTransferred(
              Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                // console.log('Upload is running');
                break;
            }
          },
          (error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break;
              case 'storage/canceled':
                // User canceled the upload
                break;
        
              // ...
        
              case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                break;
            }
          }, 
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              const varName = 'image' + index + 'URL';
              updateFirestore('userData', {[varName]: downloadURL});
              
              blob.close();
              setUploading(false);
            });
          }
        );
      }
    });
  };

  return (
            <Box style={styles.container}>
                <Box p="8">
                  <ScrollView>
                    <Text style={styles.heading5}>Add your images</Text>
                    <Box style={styles.imageContainer1}>
                      {images.map((image,i) => {
                        if (image===null) {
                          return (
                            <Box style={styles.imageBox} key={i}>
                              <Pressable onPress={() => selectImage(i)} style={styles.imageButton}>
                                <Ionicons name="add-outline" style={styles.imageButtonIcon}size={50}/>
                              </Pressable>
                            </Box>
                          )
                        } else {
                          return (
                            <Box style={styles.imageContainer2outer} key={i}>
                              <Image source={{ uri: image }} style={styles.imageContainer2inner}/>
                            </Box>
                          )
                        }
                      })}
                    </Box>
                  </ScrollView>
                </Box>
                <Box style={styles.buttonContainer}>
                    
                    <Pressable style={styles.button}
                    title="Next"
                    onPress={() => {
                      console.log(images);
                      uploadImage();
                      navigation.navigate('UserDetailsRegistration2')
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
                    navigation.navigate('HomeScreen2')
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

export function UserDetailsRegistration1({navigation}) {    
  const genderData = ['Man', 'Woman'];
  const [gender, setGender] = useState(null);
  const partnerGenderData = ['Men','Women'];
  const [partnerGender, setPartnerGender] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [relationshipPreference, setRelationshipPreference] = useState(null);
  const relationshipPreferenceData = ['Relationship', 'Something casual', "Don't know yet", 'Marriage'];
  const [maritalStatus, setMaritalStatus] = useState(null);
  const maritalStatusData = ['Single', 'Married', 'Living together', 'Divorced', 'Widowed', 'Separated'];

  return (
            <Box style={styles.container}>
                <Box p="8">
                  <ScrollView>
                    <Text style={styles.heading5}>I am a:</Text>
                    <RadioButton data={genderData} onSelect={(value) => {setGender(value)}}/>
                    <Text style={styles.heading5}>I'm interested in:</Text>
                    <CheckBox data={partnerGenderData} onSelect={(value) => {setPartnerGender(value)}}/>
                    <Text style={styles.heading5}>Date of birth:</Text>
                    <DatePicker onSelect={(value) => {setDateOfBirth(value)}}/>
                    <Text style={styles.heading5}>Location:</Text>
                    <Pressable onPress={() => {Alert.alert('This app is not available outside of London yet...')}} on style={styles.clearButton}>
                      <Text style={styles.clearButtonText}>London</Text>
                    </Pressable>
                    <Box height="8" />
                    <Text style={styles.heading5}>I'm looking for:</Text>
                    <RadioButton data={relationshipPreferenceData} onSelect={(value) => {setRelationshipPreference(value)}}/>
                    <Text style={styles.heading5}>Marital status:</Text>
                    <RadioButton data={maritalStatusData} onSelect={(value) => {setMaritalStatus(value)}}/>
                  </ScrollView>
                </Box>
                <Box style={styles.buttonContainer}>
                    
                    <Pressable style={styles.button}
                    title="Next"
                    onPress={() => {
                        updateFirestore('userData', {'gender': gender, 'partnerGender': partnerGender, 'dateOfBirth': dateOfBirth, 'city': 'London', 'relationshipPreference': relationshipPreference, 'maritalStatus': maritalStatus});
                        navigation.navigate('PictureUpload')
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
                    navigation.navigate('HomeScreen2')
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

export function UserDetailsRegistration2({navigation}) {    
  const [feet, setFeet] = useState(null);
  const [inches, setInches] = useState(null);
  const [height, setHeight] = useState(null);
  const [weight, setWeight] = useState(null);
  const eyeColourData = ['Brown','Hazel', 'Blue', 'Green', 'Gray', 'Amber', 'Other'];
  const [eyeColour, setEyeColour] = useState(null);
  const hairColourData = ['Black','Brown', 'Blond', 'Red', 'Gray', 'Bald', 'Other'];
  const [hairColour, setHairColour] = useState(null);
  const buildData = ['Thin','Athletic', 'Average', 'Curvy', 'Prefer not to say'];
  const [build, setBuild] = useState(null);

  useEffect(() => {
    setHeight((feet===null?0:feet)*30.48+(inches===null?0:inches)*2.54);
  });

  return (
            <Box style={styles.container}>
              <ScrollView showsVerticalScrollIndicator={true} persistentScrollbar={true}>
                <Box p="8">
                  <Text style={styles.heading5}>Height:</Text>
                  <Box flexDirection={'row'} paddingLeft="2">
                    <View width="40px">
                      <TextInput style={styles.inputStyle2} keyboardType='numeric' onChangeText={(val) => {isNumeric(val) ? setFeet(val) : Alert.alert('Please input a number') }}/>
                    </View>
                    <Text style={styles.alignedFormText}>ft</Text>
                    <View width="40px">
                      <TextInput style={styles.inputStyle2} keyboardType='numeric' onChangeText={(val) => {isNumeric(val) ? setInches(val) : Alert.alert('Please input a number') }}/>
                    </View>
                    <Text style={styles.alignedFormText}>in</Text>
                    <Text style={styles.alignedFormText}>or {height}cm</Text>
                    <View /> 
                  </Box>
                  <Box height="8" />
                    <Text style={styles.heading5}>Weight:</Text>
                    {NotDisplayed()}
                    <Box flexDirection={'row'} paddingLeft="2">
                      <View width="40px">
                        <TextInput style={styles.inputStyle2} keyboardType='numeric' onChangeText={(val) => {isNumeric(val) ? setWeight(val) : Alert.alert('Please input a number') }}/>
                      </View>
                      <Text style={styles.alignedFormText}>kg</Text>
                    </Box>
                    <Box height="8" />
                    <Text style={styles.heading5}>Eye colour:</Text>
                    <RadioButton data={eyeColourData} onSelect={(value) => {setEyeColour(value)}}/>
                    <Text style={styles.heading5}>Hair colour:</Text>
                    <RadioButton data={hairColourData} onSelect={(value) => {setHairColour(value)}}/>
                    <Text style={styles.heading5}>Your build:</Text>
                    <RadioButton data={buildData} onSelect={(value) => {setBuild(value)}}/>
                  </Box>
                </ScrollView>
                <Box style={styles.buttonContainer}>
                    
                    <Pressable style={styles.button}
                    title="Next"
                    onPress={() => {
                        updateFirestore('userData', {'height': height, 'weight': weight, 'eyeColour': eyeColour, 'hairColour': hairColour, 'build': build});
                        navigation.navigate('UserDetailsRegistration3')
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
                    navigation.navigate('HomeScreen2')
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

export function UserDetailsRegistration3({navigation}) {    
  const [exercise, setExercise ] = useState(null);
  const [alcohol, setAlcohol ] = useState(null);
  const [smoking, setSmoking ] = useState(null);
  const [drugs, setDrugs ] = useState(null);
  const [hasKids, setHasKids ] = useState(null);
  const [wantKids, setWantKids ] = useState(null);
  const [languages, setLanguages ] = useState(null);
  const [ethnicity, setEthnicity ] = useState(null);
  const exerciseData = ['Active', 'Sometimes', 'Almost never'];
  const alcoholData = ['No', 'Socially', 'Often'];
  const smokingData = ['No', 'Occasionally', 'Often'];
  const drugsData = ['No', 'Socially', 'Often'];
  const languagesData = ['Mandarin', 'Spanish', 'English', 'Hindi/Urdu', 'Bengali', 'Portuguese', 'Russian', 'Japanese', 'Cantonese', 'Turkish', 'Korean', 'French', 'Tamil', 'German', 'Arabic', 'Italian', 'Gujarati', 'Polish', 'Punjabi', 'Lithuanian', 'Other'];
  const ethnicityData = ['Caucasian', 'East Asian', 'Black', 'South Asian', 'Latin/Hispanic', 'Middle Eastern', 'Mixed', 'Other/prefer not to say'];
  const hasKidsData = ['Yes', 'No', 'Kids are over 18'];
  const wantKidsData = ['Yes', 'No', 'Undecided'];

  return (
            <Box style={styles.container}>
              <ScrollView>
                <Box p="8">
                  <Text style={styles.heading5}>Exercise:</Text>
                  <RadioButton data={exerciseData} onSelect={(value) => {setExercise(value)}}/>
                  <Text style={styles.heading5}>Alcohol:</Text>
                  <RadioButton data={alcoholData} onSelect={(value) => {setAlcohol(value)}}/>
                  <Text style={styles.heading5}>Smoking:</Text>
                  <RadioButton data={smokingData} onSelect={(value) => {setSmoking(value)}}/>
                  <Text style={styles.heading5}>Drugs:</Text>
                  <RadioButton data={drugsData} onSelect={(value) => {setDrugs(value)}}/>
                  <Text style={styles.heading5}>Has kids?:</Text>
                  <RadioButton data={hasKidsData} onSelect={(value) => {setHasKids(value)}}/>
                  <Text style={styles.heading5}>Want kids:</Text>
                  <RadioButton data={wantKidsData} onSelect={(value) => {setWantKids(value)}}/>
                  <Text style={styles.heading5}>Languages:</Text>
                  <CheckBox data={languagesData} onSelect={(value) => {setLanguages(value)}}/>
                  <Text style={styles.heading5}>Ethnicity:</Text>
                  <RadioButton data={ethnicityData} onSelect={(value) => {setEthnicity(value)}}/>
                </Box>
              </ScrollView>
              <Box style={styles.buttonContainer}>
                  
                  <Pressable style={styles.button}
                  title="Next"
                  onPress={() => {
                      updateFirestore('userData', {'exercise': exercise, 'alcohol': alcohol, 'smoking': smoking, 'drugs': drugs, 'hasKids': hasKids, 'wantKids': wantKids, 'languages': languages, 'ethnicity': ethnicity, 
                    });
                      navigation.navigate('UserDetailsRegistration4')
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
                  navigation.navigate('HomeScreen2')
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

export function UserDetailsRegistration4({navigation}) {    
  const [otherCharacterestics, setOtherCharacterestics ] = useState(null);
  const otherCharacteresticsData = ['Tattooed', 'Heavy tattooed', 'Piercing', 'Beard', 'Disabled', 'Freckles'];

  return (
            <Box style={styles.container}>
              <ScrollView>
                <Box p="8">
                  <Text style={styles.heading5}>Other characterestics:</Text>
                  <CheckBox data={otherCharacteresticsData} onSelect={(value) => {setOtherCharacterestics(value)}}/>
                </Box>
              </ScrollView>
              <Box style={styles.buttonContainer}>
                  
                  <Pressable style={styles.button}
                  title="Next"
                  onPress={() => {
                      updateFirestore('userData', {'otherCharacteristics': otherCharacterestics, 
                    });
                      navigation.navigate('UserDetailsRegistration5')
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
                  navigation.navigate('HomeScreen2')
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

export function UserDetailsRegistration5({navigation}) {    
  const [education, setEducation ] = useState(null);
  const educationData = ['High school', "Bachelor's degree", "Master's degree", 'PhD'];
  const [profession, setProfession ] = useState(null);
  const [annualIncome, setAnnualIncome ] = useState(null);
  const [ambitious, setAmbitious ] = useState(null);
  const ambitiousData = ['No', 'Yes', 'Very'];


  return (
            <Box style={styles.container}>
              <ScrollView>
                <Box p="8">
                  <Text style={styles.heading5}>Education:</Text>
                  <RadioButton data={educationData} onSelect={(value) => {setEducation(value)}}/>
                  <Text style={styles.heading5}>Profession:</Text>
                  <TextInput style={styles.inputStyle2} onChangeText={(val) => setProfession(val)}/>
                  <Box height="8" />
                  <Text style={styles.heading5}>Annual income:</Text>
                  {NotDisplayed()}
                  <Box flexDirection={'row'} paddingLeft="2">
                    <Text style={styles.alignedFormText}>£</Text>
                    <View width="80px">
                      <TextInput style={styles.inputStyle2} keyboardType='numeric' onChangeText={(val) => {isNumeric(val) ? setFeet(val) : Alert.alert('Please input a number') }}/>
                    </View>
                  </Box>
                  <Box height="8" />
                  <Text style={styles.heading5}>Ambitious?</Text>
                  <RadioButton data={ambitiousData} onSelect={(value) => {setAmbitious(value)}}/>
                </Box>
              </ScrollView>
              <Box style={styles.buttonContainer}>
                  
                  <Pressable style={styles.button}
                  title="Next"
                  onPress={() => {
                      updateFirestore('userData', {'education' :education, 'profession' :profession, 'annualIncome' :annualIncome, 'ambitious' :ambitious,
                    });
                      navigation.navigate('UserDetailsRegistration6')
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
                  navigation.navigate('HomeScreen2')
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

export function UserDetailsRegistration6({navigation}) {    
  const [pets, setPets ] = useState(null);
  const petsData = ['None', 'Dog', 'Cat', 'Rabbit', 'Bird', 'Parrot', 'Fish', 'Guinea Pig', 'Hamster', 'Mouse', 'Horse', 'Donkey', 'Pig', 'Hen', 'Duck', 'Turtle', 'Frog', 'Snake', 'Lizard'];

  return (
            <Box style={styles.container}>
              <ScrollView>
                <Box p="8">
                  <Text style={styles.heading5}>Pet:</Text>
                  <CheckBox data={petsData} onSelect={(value) => {setPets(value)}}/>
                </Box>
              </ScrollView>
              <Box style={styles.buttonContainer}>
                  
                  <Pressable style={styles.button}
                  title="Next"
                  onPress={() => {
                      updateFirestore('userData', {'pets': pets,
                    });
                      navigation.navigate('UserDetailsRegistration7')
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
                  navigation.navigate('HomeScreen2')
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

export function UserDetailsRegistration7({navigation}) {    
  const [food, setFood ] = useState(null);
  const foodData = ['Eat everything', 'Fast food', 'Healthy', 'Flexitarian', 'Vegan', 'Vegetarian', 'Gluten-free', 'Halal', 'Kosher', 'French cuisine', 'Italian cuisine', 'Spanish cuisine', 'British cuisine', 'Chinese cuisine', 'African cuisine', 'Indian cuisine', 'Mexican cuisine'];

  return (
            <Box style={styles.container}>
              <ScrollView>
                <Box p="8">
                  <Text style={styles.heading5}>Favourite food:</Text>
                  <CheckBox data={foodData} onSelect={(value) => {setFood(value)}}/>
                </Box>
              </ScrollView>
              <Box style={styles.buttonContainer}>
                  
                  <Pressable style={styles.button}
                  title="Next"
                  onPress={() => {
                      updateFirestore('userData', {'food': food,
                    });
                      navigation.navigate('UserDetailsRegistration8')
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
                  navigation.navigate('HomeScreen2')
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

export function UserDetailsRegistration8({navigation}) {    
  const [religion, setReligion ] = useState(null);
  const religionData = ['Non-religious', 'Anglican', 'Baptist', 'Buddhist', 'Catholic', 'Christian-other', 'Hindu', 'Jewish', 'Muslim', 'Sikh', 'Other'];

  return (
            <Box style={styles.container}>
              <ScrollView>
                <Box p="8">
                  <Text style={styles.heading5}>Religion:</Text>
                  <RadioButton data={religionData} onSelect={(value) => {setReligion(value)}}/>
                </Box>
              </ScrollView>
              <Box style={styles.buttonContainer}>
                  
                  <Pressable style={styles.button}
                  title="Next"
                  onPress={() => {
                      updateFirestore('userData', {'religion': religion,
                    });
                      navigation.navigate('UserDetailsRegistration9')
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
                  navigation.navigate('HomeScreen2')
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

export function UserDetailsRegistration9({navigation}) {    
  const [qualities, setQualities ] = useState(null);
  const qualitiesData = ['Adventurous', 'Affectionate', 'Affectionate', 'Altruistic', 'Ambitious', 'Anxious', 'Articulate', 'Awkward', 'Blunt', 'Cheerful', 'Clever', 'Confident', 'Considerate', 'Creative', 'Curious', 'Daring', 'Determined', 'Distrustful', 'Energetic', 'Forgiving', 'Friendly', 'Goal-oriented', 'Hard-working', 'Helpful', 'Humble', 'Imaginative', 'Impulsive', 'Insightful', 'Intellectual', 'Jealous', 'Kind', 'Loyal', 'Moody', 'Organized', 'Outgoing', 'Patient', 'Perceptive', 'Persistent', 'Polite', 'Procrastinating', 'Quiet', 'Reliable', 'Resourceful', 'Sarcastic', 'Self-conscious', 'Self-critical', 'Self-disciplined', 'Selfish', 'Talkative', 'Thoughtful', 'Timid', 'Traditional', 'Trusting', 'Unreliable', 'Warm'];


  return (
            <Box style={styles.container}>
              <ScrollView>
                <Box p="8">
                  <Text style={styles.heading5}>Qualities:</Text>
                  <CheckBox data={qualitiesData} onSelect={(value) => {setQualities(value)}}/>
                </Box>
              </ScrollView>
              <Box style={styles.buttonContainer}>
                  
                  <Pressable style={styles.button}
                  title="Next"
                  onPress={() => {
                      updateFirestore('userData', {'qualities': qualities,
                    });
                      navigation.navigate('UserDetailsRegistration10')
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
                  navigation.navigate('HomeScreen2')
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

export function UserDetailsRegistration10({navigation}) {    
  const [hobbies, setHobbies ] = useState(null);
  const hobbiesData = ['Board Games', 'Collecting', 'Cooking', 'Cycling', 'Dancing', 'Eating Out', 'Fishing', 'Gardening', 'Golf', 'Martial Arts', 'Movies', 'Music', 'Painting', 'Playing Cards', 'Podcasts', 'Reading', 'Running', 'Shopping', 'Skiing & Snowboarding', 'Socializing', 'Television', 'Tennis', 'Traveling', 'Video Games', 'Volunteer Work', 'Walking', 'Watching Sports', 'Woodworking', 'Writing', 'Yoga'];

  return (
            <Box style={styles.container}>
              <ScrollView>
                <Box p="8">
                  <Text style={styles.heading5}>Hobbies:</Text>
                  <CheckBox data={hobbiesData} onSelect={(value) => {setHobbies(value)}}/>
                </Box>
              </ScrollView>
              <Box style={styles.buttonContainer}>
                  
                  <Pressable style={styles.button}
                  title="Next"
                  onPress={() => {
                      updateFirestore('userData', {'hobbies': hobbies,
                    });
                      navigation.navigate('UserDetailsRegistration11')
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
                  navigation.navigate('HomeScreen2')
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

export function UserDetailsRegistration11({navigation}) {    
  const [sports, setSports ] = useState(null);
  const sportsData = ['Archery', 'Athletics', 'Badminton', 'Baseball', 'Basketball', 'Bowling', 'Boxing', 'Cricket', 'Dance', 'Darts', 'Dodgeball', 'Equine Sports', 'Fencing', 'Football', 'Golf', 'Gymnastics', 'Hockey', 'Ice Hockey', 'Lacrosse', 'Martial Arts', 'Netball', 'Polo', 'Pool', 'Rock climbing', 'Rowing', 'Rugby', 'Sailing', 'Skateboarding', 'Skiing', 'Snowboarding', 'Softball', 'Squash', 'Surfing', 'Swimming', 'Table tennis', 'Tennis', 'Ultimate Frisbee', 'Volleyball', 'Water Polo', 'Wrestling'];

  return (
            <Box style={styles.container}>
              <ScrollView>
                <Box p="8">
                  <Text style={styles.heading5}>Sports:</Text>
                  <CheckBox data={sportsData} onSelect={(value) => {setSports(value)}}/>
                </Box>
              </ScrollView>
              <Box style={styles.buttonContainer}>
                  
                  <Pressable style={styles.button}
                  title="Next"
                  onPress={() => {
                      updateFirestore('userData', {'sports': sports,
                    });
                      navigation.navigate('Home')
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
                  navigation.navigate('HomeScreen2')
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

function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

function NotDisplayed() {
  return (
    <Box flexDirection={'row'} paddingLeft="2" style={{ alignItems: "flex-end"}}>
      <Ionicons name="eye-off-outline" size={15} color="#999999" />
      <Text style={styles.dimmedAlignedFormText}> This will not be shown on your profile.</Text>
    </Box>
  )
  };