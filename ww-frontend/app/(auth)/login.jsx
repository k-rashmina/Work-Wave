import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  TextInput,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  BackHandler,
  Alert,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { loginUser } from "../(auth)/Auth";
import { useFocusEffect  } from "@react-navigation/native";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setIsLoggingIn(true);

    try {
      
      await loginUser(email, password);
      router.replace("/home"); // Change to your desired page after login
    } catch (error) {
      console.error("Firebase login error: ", error.code, error.message);
      if (error.code === "auth/user-not-found") {
        setErrorMessage("No user found with this email.");
      } else if (error.code === "auth/wrong-password") {
        setErrorMessage("Incorrect password. Please try again.");
      } else if (error.code === "auth/invalid-email") {
        setErrorMessage("Invalid email format.");
      } else if (error.code === "auth/network-request-failed") {
        setErrorMessage("Network error. Please check your connection.");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.heading}>LOGIN</Text>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={!email || !password || isLoggingIn}
          >
            <Text style={styles.buttonText}>
              {isLoggingIn ? "LOGGING IN..." : "LOGIN"}
            </Text>
          </TouchableOpacity>
          <Link href={"/emailPassword"} style={{ textAlign: "center" }}>
        Don't have an account? <Text style={{ color: "blue" }}>SIGN UP</Text>
      </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  container: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#3498DB",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginVertical: 10,
    fontSize: 18,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginVertical: 15,
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "#3498DB",
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Login;