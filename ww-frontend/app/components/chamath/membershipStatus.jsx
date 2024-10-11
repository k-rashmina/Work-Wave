import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Alert } from 'react-native';
import * as Progress from 'react-native-progress';
import { auth } from '../../../firebaseConfig'; // Firebase Authentication
import axios from 'axios'; // To make API requests
import ip from '../../../ipAddress'; // Your server IP address
import { useIsFocused } from '@react-navigation/native'; // Import useIsFocused from react-navigation

const MembershipStatus = () => {
  const [membershipDetails, setMembershipDetails] = useState(null); // For storing membership details
  const [loading, setLoading] = useState(true); // For managing loading state
  const isFocused = useIsFocused(); // This will return true if the screen is focused

  // Hardcoded expiry date
  const hardcodedExpiryDate = "2024-12-31"; // Example expiry date

  // Fetch the logged-in user's email from Firebase
  const getCurrentUserEmail = () => {
    const user = auth.currentUser;
    return user ? user.email : null;
  };

  // Fetch membership data from the backend
  const fetchMembershipDetails = async (email) => {
    try {
      const response = await axios.get(`http://${ip}:5000/user/cusRead/${email}`);
      setMembershipDetails(response.data);
    } catch (error) {
      console.error("Error fetching membership details:", error);
      Alert.alert('Error', 'Failed to load membership details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const email = getCurrentUserEmail();
    if (isFocused && email) {
      setLoading(true); // Set loading to true before fetching data
      fetchMembershipDetails(email); // Re-fetch membership details every time the screen is focused
    }
  }, [isFocused]); // Trigger useEffect when the screen focus changes

  if (loading) {
    return <ActivityIndicator size="large" color="#3498DB" />;
  }

  if (!membershipDetails) {
    return <Text style={styles.errorText}>Unable to fetch membership details.</Text>;
  }

  // Extract relevant details from the fetched data
  const { points, membership, membershipDiscount } = membershipDetails;

  // Function to calculate points needed to reach the next level
  const getNextLevelInfo = () => {
    let nextLevel = '';
    let pointsToNextLevel = 0;

    if (points <= 5) {
      nextLevel = 'Silver';
      pointsToNextLevel = 6 - points;
    } else if (points <= 10) {
      nextLevel = 'Gold';
      pointsToNextLevel = 11 - points;
    } else if (points <= 15) {
      nextLevel = 'Platinum';
      pointsToNextLevel = 16 - points;
    } else if (points <= 20) {
      nextLevel = 'Complete Platinum';
      pointsToNextLevel = 20 - points;
    }

    return { nextLevel, pointsToNextLevel };
  };

  // Get the next level information based on current points
  const { nextLevel, pointsToNextLevel } = getNextLevelInfo();

  // Calculate progress to the next level
  const maxPoints = 20; // Maximum points for Platinum level
  const progress = points / maxPoints; // Calculate progress (e.g., 0.5 for 50%)

  // Convert discount to percentage display (e.g., 0.05 -> 5%) and round to no decimal places
  const discountPercentage = (membershipDiscount * 100).toFixed(0);

  return (
    <View style={styles.membershipContainer}>
      {/* Membership Information */}
      <Text style={styles.membershipTitle}>Membership - {membership}</Text>
      <Text style={styles.pointsText}>
        {pointsToNextLevel} Points more to {nextLevel}
      </Text>

      {/* Progress Bar */}
      <Progress.Bar
        progress={progress}
        width={null} // Full width of the container
        color="#3498DB"
        height={10}
        borderRadius={5}
      />

      {/* Membership Levels */}
      <View style={styles.levelsContainer}>
        <Text style={styles.levelText}>Bronze</Text>
        <Text style={styles.levelText}>Silver</Text>
        <Text style={styles.levelText}>Gold</Text>
        <Text style={styles.levelText}>Platinum</Text>
      </View>

      {/* Expiry Date and Discount Information */}
      <Text style={styles.expiryText}>Date of Expiry: {hardcodedExpiryDate}</Text>
      <Text style={styles.discountText}>
        *You can take {discountPercentage}% discount for {membership} Membership
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  membershipContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: '100%',
  },
  membershipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pointsText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#808080',
  },
  levelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  levelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#808080',
    marginTop: 5,
  },
  expiryText: {
    fontSize: 14,
    color: '#808080',
    marginBottom: 10,
  },
  discountText: {
    fontSize: 14,
    color: '#808080',
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default MembershipStatus;
