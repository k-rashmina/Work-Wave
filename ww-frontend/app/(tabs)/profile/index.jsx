import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { logoutUser } from '../../(auth)/Auth';
import axios from 'axios';
import { auth } from '../../../firebaseConfig';
import ip from '../../../ipAddress';

const Profile = () => {
  const router = useRouter()

  const [user, setUser] = useState({
    firstname: '',
    lastName: '',
    profileImageURL: '',
  });
  const [loading, setLoading] = useState(true);

  const email = auth.currentUser.email;

  useEffect(() => {
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

    fetchUserDetails();
  }, []);


  const handleLogout = () => {
    logoutUser().then(() => {
      router.push("/login");
    });
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }


  

  return (
    <View style={styles.container}>
      
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
        onPress={() => router.push('/profile/inqlist')}
      >
        <Text style={styles.buttonText}>Inquiries</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push( '/profile/userDetails')}
      >
        <Text style={styles.buttonText}>User Details</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
    backgroundColor: '#4CAF50', // Theme color
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginBottom: 20,
    width: '90%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#d9534f', // Red for logout
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginTop: 150,
    width: '90%',
    alignItems: 'center',
  },

})