import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";

const Pay = () => {
  return (
    <View style={styles.container}>
      <Text>Work</Text>
      <Link href={"/work/availabledays"}>Go to Available Days</Link>
      <Link href={"/work/sheduledashboard"}>Go to Shedule Dashboard</Link>
      <Link href={"/work/availableWorks"}>Go to Available Works</Link>
    </View>
  );
};

export default Pay;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});
