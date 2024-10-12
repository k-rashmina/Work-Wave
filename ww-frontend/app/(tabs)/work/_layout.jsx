import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import Header from "../../components/common/Header";
import { Link } from "expo-router";
const PayLayout = () => {
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
          title: "Work",
        }}
      />
      <Stack.Screen
        name="sheduledashboard"
        options={{
          title: "Dashboard",
        }}
      />

      <Stack.Screen
        name="availabledays"
        options={{
          title: "Available Days",
        }}
      />
      <Stack.Screen
        name="sheduledworks"
        options={{
          title: "Scheduled Works",
        }}
      />
      <Stack.Screen
        name="shedulecancel"
        options={{
          title: "Re-Scheduled Works",
        }}
      />
      <Stack.Screen
        name="earnedpoints"
        options={{
          title: "Customer Ratings",
        }}
      />
      <Stack.Screen
        name="availableWorks"
        options={{
          title: "Available Works",
        }}
      />
      <Stack.Screen
        name="workDetails/[workId]"
        options={{
          title: "Work Details",
        }}
      />

      <Stack.Screen
        name="myWorks"
        options={{
          title: "My Works",
        }}
      />

      <Stack.Screen
        name="myBids"
        options={{
          title: "My Bids",
        }}
      />
    </Stack>
  );
};

export default PayLayout;

const styles = StyleSheet.create({});
