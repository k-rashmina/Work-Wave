import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Home",
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
};

export default _layout;
