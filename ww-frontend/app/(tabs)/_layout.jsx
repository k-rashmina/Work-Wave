import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Icons from "react-native-vector-icons/Ionicons"

const TabIcon = ({icon, iconFilled, color, title, focused}) => {
  return(
    <View style={styles.tabIcon}>
      {
        focused ? 
          <Icons name={iconFilled} size={25} color={color} /> :
          <Icons name={icon} size={25} color={color} /> 
      }
      {
        focused &&
       <Text style={{fontWeight: `${focused ? 'bold' : 'normal'}`, color: color}}>{title}</Text>
      }
    </View>
  )
}

const TabsLayout = () => {
  return (
    <>
      <Tabs screenOptions={{
        tabBarShowLabel: false, 
        tabBarStyle: {
          height: 84,
          backgroundColor: '#3498DB',
          borderTopWidth: 1,
          borderTopColor: '#EEEEEE'
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#fff',
        }}>
        <Tabs.Screen 
          name="home" 
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon color={color} icon={'home-outline'} iconFilled={'home'} title="Home" focused={focused} />
            )
          }} 
        />

        <Tabs.Screen 
          name="jobs" 
          options={{
            title: "Jobs",
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon color={color} icon={'briefcase-outline'} iconFilled={'briefcase'} title="Jobs" focused={focused} />
            )
          }} 
        />

        <Tabs.Screen 
          name="work" 
          options={{
            title: "Work",
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon color={color} icon={'construct-outline'} iconFilled={'construct'} title="Work" focused={focused} />
            )
          }} 
        />       

        <Tabs.Screen 
          name="profile" 
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon color={color} icon={'person-outline'} iconFilled={'person'} title="Profile" focused={focused} />
            )
          }} 
        />

      </Tabs>
    </>
  )
}

export default TabsLayout

const styles = StyleSheet.create({
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  }
})