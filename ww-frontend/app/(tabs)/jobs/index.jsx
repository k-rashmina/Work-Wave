import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";

const index = () => {
  return (
    <View>
      <Link href={"/jobs/jobpostingscreen"}>post</Link>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
