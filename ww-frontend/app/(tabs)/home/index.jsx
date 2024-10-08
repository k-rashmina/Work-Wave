import { StyleSheet, Text, View, BackHandler, Alert } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { useFocusEffect  } from "@react-navigation/native";

const Home = () => {

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert("Hold on!", "Are you sure you want to exit the app?", [
          { text: "Cancel", onPress: () => null, style: "cancel" },
          { text: "YES", onPress: () => BackHandler.exitApp() },
        ]);
        return true; // Prevent default back button behavior
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
      return () => backHandler.remove();
    }, [])
  );
  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <Link style={{ marginTop: 10, color: "blue" }} href={"jobs"}>
        Go to jobs
      </Link>
      <Link style={{ marginTop: 10, color: "blue" }} href={"work"}>
        Go to work
      </Link>
      <Link style={{ marginTop: 10, color: "blue" }} href={"profile"}>
        Go to profile
      </Link>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});
