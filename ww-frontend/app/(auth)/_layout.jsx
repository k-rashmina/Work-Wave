import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: "Registration",
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="emailPassword" />
      <Stack.Screen name="personalDetails" />
      <Stack.Screen name="serviceProviderDetails" />
    </Stack>
  );
};

export default AuthLayout;

const styles = StyleSheet.create({});
