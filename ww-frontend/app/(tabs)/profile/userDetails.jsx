import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions, ScrollView, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import axios from 'axios';
import { Link, Redirect, useRouter } from 'expo-router';
import { auth, storage } from '../../../firebaseConfig'; // Import Firebase Storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase Storage methods
import * as ImagePicker from 'expo-image-picker'; // Import Expo ImagePicker
import ip from '../../../ipAddress';

const UserDetails = ({ route, navigation }) => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    age: '',
    telephone: '',
    address: '',
    profileImageURL: ''
  });

  const [originalUser, setOriginalUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUploading, setImageUploading] = useState(false); // New state for image uploading
  const router = useRouter();

  const email = auth.currentUser.email;

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://${ip}:5000/user/cusRead/${email}`);
        setUser(response.data);
        setOriginalUser(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
        Alert.alert('Error', 'Failed to load user details.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  // Function to pick and upload image
  const pickImageAndUpload = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'Permission to access the gallery is required.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Crop to square aspect ratio
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;

        // Upload the selected image to Firebase Storage
        const uploadProfilePicture = async () => {
          setImageUploading(true);
          const storageRef = ref(storage, `profilePictures/${email}.jpg`); // Storage reference

          try {
            const response = await fetch(imageUri);
            const blob = await response.blob();

            // Upload the blob to Firebase
            await uploadBytes(storageRef, blob);
            console.log('Image uploaded successfully');

            // Get the download URL from Firebase
            const downloadURL = await getDownloadURL(storageRef);
            console.log('Image Download URL:', downloadURL);

            // Update user's profile picture URL in MongoDB
            const updatedUser = { ...user, profileImageURL: downloadURL };

            // Send PUT request to update MongoDB record
            await axios.put(`http://${ip}:5000/user/cusUpdate/${email}`, updatedUser);
            
            // Update frontend state with the new profile picture URL
            setUser(updatedUser);

            Alert.alert('Success', 'Profile picture updated successfully.');
          } catch (error) {
            console.error('Error uploading profile picture:', error);
            Alert.alert('Error', 'Failed to upload profile picture.');
          } finally {
            setImageUploading(false); 
          }
        };

        uploadProfilePicture();
      } else {
        Alert.alert('Cancelled', 'No image selected.');
      }
    } catch (error) {
      console.error('Error picking or uploading image:', error);
      Alert.alert('Error', 'Something went wrong while uploading the image.');
    }
  };

  const handleSaveChanges = async () => {
    try {
      // Use user's email for the request
      const response = await axios.put(`http://${ip}:5000/user/cusUpdate/${email}`, user);
      
      Alert.alert('Success', 'User details updated successfully.');
      setIsEditing(false); // Exit editing mode
      setOriginalUser(user); // Save the updated data as the original state
    } catch (error) {
      console.error('Error updating user details:', error);
      Alert.alert('Error', 'Failed to update user details.');
    }
  };

  const handleCancel = () => {
    setUser(originalUser); // Revert to original user data
    setIsEditing(false); // Exit editing mode
  };

  const handleDeleteProfile = async () => {
    try {
      await axios.delete(`http://${ip}:5000/user/cusDelete/${email}`);
      Alert.alert('Success', 'Profile deleted successfully.', [
        { text: 'OK', onPress: () => router.push('/login') },
      ]);
    } catch (error) {
      console.error('Error deleting profile:', error);
      Alert.alert('Error', 'Failed to delete profile.');
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!user) {
    return <Text>No user data found.</Text>;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        <View style={styles.profilePictureContainer}>
          <Image
            source={{ uri: user.profileImageURL || 'https://via.placeholder.com/150' }} // Placeholder if no profile picture
            style={styles.profilePicture}
          />
         
        </View>

        {/* User details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={user.firstName}
            editable={isEditing}
            onChangeText={(text) => setUser({ ...user, firstName: text })}
          />

          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={user.lastName}
            editable={isEditing}
            onChangeText={(text) => setUser({ ...user, lastName: text })}
          />

          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={user.age ? user.age.toString() : ''}
            editable={isEditing}
            onChangeText={(text) => setUser({ ...user, age: text })}
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={user.telephone? user.telephone.toString() : '' }
            editable={isEditing}
            onChangeText={(text) => setUser({ ...user, telephone: text })}
          />

          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={user.address}
            editable={isEditing}
            onChangeText={(text) => setUser({ ...user, address: text })}
          />
           {/* Button to change the profile picture */}
           <TouchableOpacity onPress={pickImageAndUpload} style={styles.changePictureButton}>
            <Text style={styles.buttonText}>
              {imageUploading ? 'Uploading...' : 'Change Profile Picture'}
            </Text>
          </TouchableOpacity>
        </View>

        

        {/* Edit, Save, Cancel buttons */}
        {isEditing ? (
          <View>
            <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <TouchableOpacity style={styles.button} onPress={() => setIsEditing(true)}>
              <Text style={styles.buttonText}>Edit Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.buttonText}>Delete Profile</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Confirmation Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Are you sure you want to delete your profile?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton} onPress={handleDeleteProfile}>
                  <Text style={styles.buttonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 0,
    paddingTop: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 15,
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 2,
    marginTop: 2,
    
  },
  changePictureButton: {
    backgroundColor: '#3498DB',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    padding : 15,
    marginTop: 10,
    
  },
  detailsContainer: {
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 1,
    marginLeft: 10,
    
  },
  input: {
    height: 40,
    borderColor: '#3498DB',
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#3498DB',
    padding: 15,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    marginTop: 20,
    marginBottom: 20,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center', // Ensures the text is centered
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center', // Centers the buttons horizontally
    alignItems: 'center', // Aligns buttons vertically in the center
    marginTop: 10, // Adds space above the buttons
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10, // Space between the buttons
    minWidth: 80, // Ensures buttons have a minimum width for uniformity
    alignItems: 'center', // Centers text inside the button
  },
  
});

export default UserDetails;
