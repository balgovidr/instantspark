import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import {Pressable} from 'react-native';
import styles from '../styles';

export default function CheckBox({ data, onSelect }) {
  const [userOptions, setUserOptions] = useState([]);
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    onSelect(userOptions)
  });

  const selectHandler = (value) => {
      setUserOptions(userOptions => [...userOptions, value]);
  };

  const unselectHandler = (value) => {
    setUserOptions(userOptions => userOptions.filter(item => { return item !== value; }))
  };

  const incrementCount = () => {
    // Update state with incremented value
    setCount(count + 1);
  };

  return (
    <View style={styles.clearButtonContainer}>
      {data.map((item) => {
        incrementCount;
        return (
            <Pressable key={item+count} onPress={() => {userOptions.includes(item) ? unselectHandler(item) : selectHandler(item)}} style={userOptions.includes(item) ? styles.clearButtonSelected : styles.clearButton}>
          <Text style={userOptions.includes(item) ? styles.clearButtonTextSelected : styles.clearButtonText}> {item}</Text>
        </Pressable>
        );
      })}
      {/* <Text color="#FFFFFF"> User option: {userOptions}</Text> */}
    </View>
  );
}