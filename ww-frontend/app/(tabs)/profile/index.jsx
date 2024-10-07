import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import {logoutUser} from '../../(auth)/Auth'
import { useRouter } from 'expo-router'

const Profile = () => {
  const router = useRouter()

  const handleLogout = () => {

    logoutUser()
    router.replace({pathname: '/login'})
  

    
  };

  

  return (
    <View>
      <Text>Profile</Text>
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

const styles = StyleSheet.create({})