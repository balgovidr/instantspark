import React, { useState } from 'react';
import { View, Text, Pressable, Button } from 'react-native';
import styles from '../styles';
import DateTimePickerModal from "react-native-modal-datetime-picker";
// import Moment from 'react-moment';
// import moment from 'moment';

export default function DatePicker({ onSelect }) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState(null);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (value) => {
    let date=value.getDate() + "-"+ parseInt(value.getMonth()+1) +"-"+value.getFullYear()
    setDate(date);
    onSelect(date);
    // console.warn("A date has been picked: ", date);
    hideDatePicker();
  };

  return (
    <View style={styles.clearButtonContainer}>
      <Pressable onPress={showDatePicker} style={styles.clearButton}>
        <Text style={styles.clearButtonText}> {date===null ? "Show Date Picker" : date}</Text>
      </Pressable>
      <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" locale="en_GB" onConfirm={handleConfirm} onCancel={hideDatePicker} />
      {/* <Text color="#FFFFFF"> User option: {date} </Text> */}
    </View>
  );
}