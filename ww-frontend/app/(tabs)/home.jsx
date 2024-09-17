import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const Home = () => {
  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <Link style={{marginTop: 10, color: 'blue'}} href={'jobs'}>Go to jobs</Link>
      <Link style={{marginTop: 10, color: 'blue'}} href={'work'}>Go to work</Link>
      <Link style={{marginTop: 10, color: 'blue'}} href={'profile'}>Go to profile</Link>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})