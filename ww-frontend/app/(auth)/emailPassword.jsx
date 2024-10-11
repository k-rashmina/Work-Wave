import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  TextInput,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import { auth } from "../../firebaseConfig";

const EmailPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const router = useRouter();

  const handleNext = async () => {
    setIsCheckingEmail(true);

    try {
      // Normalize the email (trim spaces and convert to lowercase)
      const normalizedEmail = email.trim().toLowerCase();
      const signInMethods = await fetchSignInMethodsForEmail(
        auth,
        normalizedEmail
      );

      console.log("Sign in methods: ", signInMethods);

      if (signInMethods.length > 0) {
        setErrorMessage("Email already in use. Please use a different email.");
      } else if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match.");
      } else {
        setErrorMessage("");
        router.push({
          pathname: "/personalDetails",
          params: { email: normalizedEmail, password },
        });
      }
    } catch (error) {
      console.error("Firebase error: ", error.code, error.message);
      // Handle specific Firebase errors
      if (error.code === "auth/invalid-email") {
        setErrorMessage("Invalid email format.");
      } else if (error.code === "auth/network-request-failed") {
        setErrorMessage("Network error. Please check your connection.");
      } else {
        setErrorMessage(
          "An error occurred while checking the email. Please try again."
        );
      }
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate passwords match
  const validatePasswords = () => {
    if (
      (password && confirmPassword && password === confirmPassword) ||
      (!password && !confirmPassword)
    ) {
      setErrorMessage("");
    } else if (password && confirmPassword && password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
    }
  };

  // Check if passwords match on input change
  useEffect(() => {
    validatePasswords();
  }, [confirmPassword, password]);

  // Validate email on input change
  useEffect(() => {
    if (email && !validateEmail(email)) {
      setErrorMessage("Invalid email format.");
    } else {
      setErrorMessage((prev) => (prev === "Invalid email format." ? "" : prev));
    }
  }, [email]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.heading}>ENTER EMAIL & PASSWORD</Text>
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
            onChangeText={(text) => {
              setPassword(text);
              validatePasswords();
            }}
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              validatePasswords();
            }}
            secureTextEntry
            style={styles.input}
          />
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
          <TouchableOpacity
            style={styles.button}
            onPress={handleNext}
            disabled={
              !email ||
              !password ||
              !confirmPassword ||
              errorMessage ||
              isCheckingEmail
            }
          >
            <Text style={styles.buttonText}>
              {isCheckingEmail ? "CHECKING..." : "NEXT"}
            </Text>
          </TouchableOpacity>
          <Link href={"login"} style={{ textAlign: "center" }}>
            Already have an account?{" "}
            <Text style={{ color: "blue" }}>LOG IN</Text>
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
    marginBottom: 20,
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

export default EmailPassword;
