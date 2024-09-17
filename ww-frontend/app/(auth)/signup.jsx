import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Link, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

const Signup = () => {
  return (
    <SafeAreaView>
      <Text style={{fontSize: 30, textAlign: 'center', marginBottom: 40}}>Signup</Text>
      <TouchableOpacity onPress={() => router.replace('/home')} style={{backgroundColor: 'blue', marginBottom: 40, width: 200, padding: 20, alignSelf: 'center', borderRadius: 20}}><Text style={{fontSize: 20, color: 'white', textAlign: 'center'}}>Signup</Text></TouchableOpacity>
      <Link href={'login'} style={{textAlign: 'center'}}>already have an account <Text style={{color: 'blue'}}>Login</Text></Link>
    </SafeAreaView>
  )
}

export default Signup

const styles = StyleSheet.create({})