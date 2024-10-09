import React, { useEffect, useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios'; 
import ip from '../../../ipAddress'; 
import { auth } from "../../../firebaseConfig";

const AvailableDays = ({ userId }) => {
  // State to manage toggle switches for each day
  const [availableDays, setAvailableDays] = useState({
    Sunday: false,
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
  });

  const email = auth.currentUser.email;
  console.log('Email:', email);

  // Fetch available days for the specific user when the component mounts
  useEffect(() => {
    const fetchAvailableDays = async () => {
      try {
        const response = await axios.get(`http://${ip}:5000/shedule/get-available-days/${email}`); 
        console.log('Fetched available days:', response.data);

        const updatedDays = { 
          Sunday: false,
          Monday: false,
          Tuesday: false,
          Wednesday: false,
          Thursday: false,
          Friday: false,
          Saturday: false,
        };

        // Set toggles for fetched days to true
        response.data.forEach(day => {
          if (updatedDays.hasOwnProperty(day)) {
            updatedDays[day] = true;
          }
        });

        setAvailableDays(updatedDays);
      } catch (error) {
        console.error('Error fetching available days:', error);
      }
    };

    fetchAvailableDays();
  }, [userId]);

  // Handle toggle for each day
  const handleToggle = (day) => {
    setAvailableDays((prevDays) => ({
      ...prevDays,
      [day]: !prevDays[day], // Toggle the state for the selected day
    }));
  };

  // Show confirmation dialog before updating
  const showConfirmationDialog = () => {
    Alert.alert(
      "Confirm Update",
      "Are you sure you want to update your available days?",
      [
        {
          text: "No",
          onPress: () => console.log("Update cancelled"),
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: handleUpdate, // Call the update function if confirmed
          style: "default"
        }
      ]
    );
  };

  // Handle the update button
  const handleUpdate = async () => {
    const selectedDays = Object.keys(availableDays).filter((day) => availableDays[day]);

    try {
      const response = await axios.put(`http://${ip}:5000/shedule/update-available-days/${email}`, {
        availableDays: selectedDays, // Send the selected days to the backend
      });

      if (response.status === 200) {
        console.log('Successfully updated available days:', selectedDays);
        // Optionally, you can show a success message or handle further actions
      }
    } catch (error) {
      console.error('Error updating available days:', error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* <Text style={styles.title}>Update Your Availability</Text> */}
        {Object.keys(availableDays).map((day) => (
          <View key={day} style={styles.dayContainer}>
            <Text style={styles.dayText}>{day}</Text>
            <Switch
              value={availableDays[day]}
              onValueChange={() => handleToggle(day)}
              trackColor={{ false: '#767577', true: '#3498DB' }}
              thumbColor={availableDays[day] ? '#ffffff' : '#f4f3f4'}
            />
          </View>
        ))}
        <TouchableOpacity style={styles.updateButton} onPress={showConfirmationDialog}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    // backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3498DB',
    textAlign: 'center',
  },
  dayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  dayText: {
    fontSize: 16,
    color: '#333',
  },
  updateButton: {
    backgroundColor: '#3498DB',
    paddingVertical: 12,
    borderRadius: 50,
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AvailableDays;
