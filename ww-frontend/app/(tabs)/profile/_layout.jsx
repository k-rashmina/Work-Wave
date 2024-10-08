import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const ProfileLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='index' options={{headerShown: true, title: 'Profile', headerTitleAlign: 'center', headerTintColor:'#3498DB'}} />
      <Stack.Screen name= 'userDetails' options={{headerShown:true,title:'User Details',headerTitleAlign:'center', headerTintColor:'#3498DB'}}/>
    </Stack>
  )
}

export default ProfileLayout

const styles = StyleSheet.create({})