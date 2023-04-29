import React, { useState } from 'react';
import { View, Text } from 'react-native';
import {Pressable} from 'react-native';
import styles from '../styles';

export default function RadioButton({ data, onSelect }) {
  const [userOption, setUserOption] = useState(null);
  const [count, setCount] = useState(0);
  const selectHandler = (value) => {
    onSelect(value);
    setUserOption(value);
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
            <Pressable key={item+count} onPress={() => selectHandler(item)} style={item === userOption ? styles.clearButtonSelected : styles.clearButton}>
          <Text style={item === userOption ? styles.clearButtonTextSelected : styles.clearButtonText}> {item}</Text>
        </Pressable>
        )
      })}
      {/* <Text> User option: {userOption}</Text> */}
    </View>
  );
}