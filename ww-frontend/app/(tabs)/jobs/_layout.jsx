import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
import Header from "../../components/common/Header";

const BinsLayout = () => {
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
          title: "Jobs",
        }}
      />
      <Stack.Screen
        name="jobpostingscreen"
        options={{
          title: "Job Post",
        }}
      />
      <Stack.Screen
        name="selectworkerscreen"
        options={{
          title: "Workers",
        }}
      />

      <Stack.Screen
        name="jobdetailsscreen"
        options={{
          title: "Job Details",
        }}
      />
    </Stack>
  );
};

export default BinsLayout;

const styles = StyleSheet.create({});
