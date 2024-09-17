import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const PayLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='index' options={{headerShown: true, title: 'Work', headerTitleAlign: 'center'}} />
    </Stack>
  )
}

export default PayLayout

const styles = StyleSheet.create({})