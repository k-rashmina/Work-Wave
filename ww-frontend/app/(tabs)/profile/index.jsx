import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, ScrollView, RefreshControl } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { logoutUser } from '../../(auth)/Auth';
import axios from 'axios';
import { auth } from '../../../firebaseConfig';
import ip from '../../../ipAddress';
import MembershipStatus from '../../components/chamath/membershipStatus';
import { useIsFocused } from '@react-navigation/native'; // Import useIsFocused

const Profile = () => {
  const router = useRouter();
  const isFocused = useIsFocused(); // Add isFocused to track when the screen is focused

  const [user, setUser] = useState({
    firstname: '',
    lastName: '',
    profileImageURL: '',
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh

  const email = auth.currentUser.email;

  // Function to fetch user details
  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`http://${ip}:5000/user/cusRead/${email}`);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      Alert.alert('Error', 'Failed to load user details.');
    } finally {
      setLoading(false);
    }
  };

  // useEffect that runs when the screen is focused
  useEffect(() => {
    if (isFocused) {
      fetchUserDetails(); // Re-fetch user details when the screen is focused
    }
  }, [isFocused]); // Dependency on isFocused

  // Pull-to-refresh function
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserDetails().then(() => setRefreshing(false)); // Stop refreshing once the data is fetched
  }, []);

  // Logout handler
  const handleLogout = () => {
    logoutUser().then(() => {
      router.push("/login");
    });
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={ // Adding pull-to-refresh
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Displaying user profile picture and name */}
      {user.profileImageURL ? (
        <Image
          source={{ uri: user.profileImageURL }}
          style={styles.profileImage}
        />
      ) : (
        <Text>No profile picture available</Text>
      )}
      <Text>Welcome,</Text>
      <Text style={styles.heading}>{user.firstName} {user.lastName}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/profile/userRating')}
      >
        <Text style={styles.buttonText}>Ratings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/profile/userDetails')}
      >
        <Text style={styles.buttonText}>User Details</Text>
      </TouchableOpacity>

      {/* MembershipStatus Component */}
      <MembershipStatus />

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 50,
    color: '#333',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginBottom: 20,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#3498DB',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: -10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 40,
    width: '50%',
    alignItems: 'center',
  },
});
