import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';  // Make sure axios is installed
import { useRoute } from '@react-navigation/native'; // To get params from previous page
import { auth } from '../../../firebaseConfig'; // Import Firebase Authentication
import ip from '../../../ipAddress'; // Import the IP address

const ServiceRating = ({ navigation }) => {
  const route = useRoute(); // Get the route object to extract params
  const [serviceProviderEmail, setServiceProviderEmail] = useState('gimtharu@gmail.com'); // Email state
  const [rating, setRating] = useState(3);  // Default rating
  const [review, setReview] = useState('');
  const [loggedInCustomerEmail, setLoggedInCustomerEmail] = useState(''); // State to hold logged-in customer email

  // Set email from params and fetch logged-in user email once component mounts
  useEffect(() => {
    if (route.params && route.params.email) {
      setServiceProviderEmail(route.params.email);
    }

    // Get the current logged-in customer's email using Firebase Authentication
    const getCurrentUserEmail = () => {
      const email = auth.currentUser?.email;
      if (email) {
        setLoggedInCustomerEmail(email);
      } else {
        console.error("No user is logged in.");
        Alert.alert("Error", "Unable to retrieve logged-in customer information.");
      }
    };

    getCurrentUserEmail();
  }, [route.params]);

  const starIcons = Array(5).fill(0).map((_, index) => (
    <TouchableOpacity key={index} onPress={() => setRating(index + 1)}>
      <Icon
        name={index < rating ? 'star' : 'star-outline'}
        size={50}
        color={index < rating ? '#FFD700' : '#808080'}
      />
    </TouchableOpacity>
  ));

  const getRatingText = () => {
    switch (rating) {
      case 1:
        return 'Poor Experience!';
      case 2:
        return 'Average Experience!';
      case 3:
        return 'Good Experience!';
      case 4:
        return 'Awesome Experience!';
      case 5:
        return 'Great Experience!';
      default:
        return '';
    }
  };

  const handleSubmit = async () => {
    if (!serviceProviderEmail) {
      Alert.alert("Error", "Service provider's email is missing.");
      return;
    }

    if (!loggedInCustomerEmail) {
      Alert.alert("Error", "Unable to retrieve logged-in customer information.");
      return;
    }

    try {
      const response = await axios.put(`http://${ip}:5000/user/rating/${serviceProviderEmail}`, {
        rating: rating,
        review: review || "",  // Make review optional, send empty string if not provided
        customerEmail: loggedInCustomerEmail, // Pass the logged-in customer's email
      });

      if (response.data) {
        Alert.alert("Success", "Thank you for your feedback!");
        // Optionally navigate back after submission
        // navigation.goBack(); 
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not submit your review. Please try again later.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Rate Service Provider</Text>
      </View>

      <Text style={styles.thankYouText}>Thanks for using our service!</Text>

      <Text style={styles.questionText}>How was your experience with the worker?</Text>

      <Text style={styles.ratingText}>{getRatingText()}</Text>

      <View style={styles.starContainer}>
        {starIcons}
      </View>

      <TextInput
        style={styles.reviewInput}
        placeholder="Write a review "
        value={review}
        onChangeText={setReview}
        multiline
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  thankYouText: {
    textAlign: 'center',
    fontSize: 18,
    marginVertical: 10,
  },
  questionText: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  ratingText: {
    textAlign: 'center',
    fontSize: 25,
    marginVertical: 10,
    color: '#3498DB',
    fontWeight: 'bold',
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  reviewInput: {
    height: 150,
    borderColor: '#3498DB',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#3498DB',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ServiceRating;
