import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={[styles.container, {flexGrow: 1}]}>
        <Link href="/login" style={{ color: "blue", marginBottom: 40 }}>
          Go to Login
        </Link> 
        <Link href="/home" style={{ color: "blue" }}>
          Go to Home
        </Link> 
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
