import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import Header from "../../components/common/Header";

const ProfileLayout = () => {
  const headerOptions = Header();
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        headerRight: headerOptions.headerRight,
        headerShadowVisible: false,
        headerTitleStyle: {
          fontSize: 24,
          fontWeight: "bold",
          fontFamily: "sans-serif-condensed",
          color: "#3498DB",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Profile",
        }}
      />
    </Stack>
  );
};

export default ProfileLayout;

const styles = StyleSheet.create({});
