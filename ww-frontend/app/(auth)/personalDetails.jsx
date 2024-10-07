import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  TextInput,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Location from "expo-location";
import { Picker } from "@react-native-picker/picker";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { createUser } from "../../lib/apiRequests/userApiClient";

const PersonalDetails = () => {
  const { email, password } = useLocalSearchParams();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [telephone, setTelephone] = useState("");
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [errorMessages, setErrorMessages] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    telephone: "",
    location: "",
  });
  const router = useRouter();

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMessages((prev) => ({
        ...prev,
        location: "Permission to access location was denied",
      }));
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);

    try {
      const addressResults = await Location.reverseGeocodeAsync(loc.coords);
      if (addressResults.length > 0) {
        const { street, city, region, country, postalCode } = addressResults[0];
        const fullAddress = `${street ? street + ", " : ""}${
          city ? city + ", " : ""
        }${region ? region + ", " : ""}${
          postalCode ? postalCode + ", " : ""
        }${country}`;
        setAddress(fullAddress.trim());
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setErrorMessages((prev) => ({
        ...prev,
        location: "Could not retrieve address.",
      }));
    }
  };

  useEffect(() => {
    if (location) {
      console.log(location);
    }
  }, [location]);

  const validateField = (fieldName, value) => {
    const newErrorMessages = { ...errorMessages };

    switch (fieldName) {
      case "firstName":
        newErrorMessages.firstName = value.trim()
          ? ""
          : "First name cannot be empty.";
        break;
      case "lastName":
        newErrorMessages.lastName = value.trim()
          ? ""
          : "Last name cannot be empty.";
        break;
      case "age":
        const ageNumber = parseInt(value);
        if (!value) {
          newErrorMessages.age = "Age is required.";
        } else if (ageNumber < 18 || ageNumber > 100) {
          newErrorMessages.age = "Age must be between 18 and 100.";
        } else {
          newErrorMessages.age = "";
        }
        break;
      case "gender":
        newErrorMessages.gender = value ? "" : "Gender is required.";
        break;
      case "telephone":
        const phoneRegex = /^0\d{9}$/;
        newErrorMessages.telephone = phoneRegex.test(value)
          ? ""
          : "Telephone must start with 0 and contain 10 digits.";
        break;
      default:
        break;
    }

    setErrorMessages(newErrorMessages);
  };

  const handleSignUp = () => {
    const allValid = Object.values(errorMessages).every((msg) => msg === "");
    if (
      !allValid ||
      !firstName ||
      !lastName ||
      !age ||
      !gender ||
      !telephone ||
      !location
    ) {
      setErrorMessages((prev) => ({
        ...prev,
        location: !location ? "Location is required." : prev.location,
        gender: !gender ? "Gender is required." : prev.gender,
      }));
      return;
    }
    const userDetails = {
      email,
      password,
      firstName,
      lastName,
      age,
      gender,
      telephone,
      location: {
        type: "Point",
        coordinates: [location.longitude, location.latitude],
      },
      address,
    };

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        router.push("/login");
        console.log("Registered as:", userCredential.user.email);
        createUser(userDetails);
      })
      .catch((error) => {
        console.error("Error signing up:", error.message);
      });
  };

  const handleServiceProvider = () => {
    const allValid = Object.values(errorMessages).every((msg) => msg === "");
    if (
      !allValid ||
      !firstName ||
      !lastName ||
      !age ||
      !gender ||
      !telephone ||
      !location
    ) {
      setErrorMessages((prev) => ({
        ...prev,
        location: !location ? "Location is required." : prev.location,
        gender: !gender ? "Gender is required." : prev.gender,
      }));
      return;
    }
    router.push({
      pathname: "/serviceProviderDetails",
      params: {
        email,
        password,
        firstName,
        lastName,
        age,
        gender,
        telephone,
        location: JSON.stringify({
          type: "Point",
          coordinates: [location.longitude, location.latitude],
        }),
        address,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.heading}>ENTER PERSONAL DETAILS</Text>
          <View style={styles.nameContainer}>
            <TextInput
              placeholder="First Name"
              value={firstName}
              onChangeText={(text) => {
                setFirstName(text);
                validateField("firstName", text);
              }}
              style={[styles.input, styles.inputHalf]}
            />
            <View style={styles.spacer} />
            <TextInput
              placeholder="Last Name"
              value={lastName}
              onChangeText={(text) => {
                setLastName(text);
                validateField("lastName", text);
              }}
              style={[styles.input, styles.inputHalf]}
            />
          </View>
          {errorMessages.firstName ? (
            <Text style={styles.errorText}>{errorMessages.firstName}</Text>
          ) : null}
          {errorMessages.lastName ? (
            <Text style={styles.errorText}>{errorMessages.lastName}</Text>
          ) : null}
          <TextInput
            placeholder="Age"
            value={age}
            onChangeText={(text) => {
              setAge(text);
              validateField("age", text);
            }}
            keyboardType="numeric"
            style={styles.input}
          />
          {errorMessages.age ? (
            <Text style={styles.errorText}>{errorMessages.age}</Text>
          ) : null}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => {
                setGender(itemValue);
                validateField("gender", itemValue);
              }}
              style={styles.picker}
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>
          {errorMessages.gender ? (
            <Text style={styles.errorText}>{errorMessages.gender}</Text>
          ) : null}
          <TextInput
            placeholder="Telephone"
            value={telephone}
            onChangeText={(text) => {
              setTelephone(text);
              validateField("telephone", text);
            }}
            keyboardType="phone-pad"
            style={styles.input}
          />
          {errorMessages.telephone ? (
            <Text style={styles.errorText}>{errorMessages.telephone}</Text>
          ) : null}
          <TextInput
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
            style={styles.addressInput}
            editable={true}
          />
          {errorMessages.location ? (
            <Text style={styles.errorText}>{errorMessages.location}</Text>
          ) : null}

          <TouchableOpacity
            style={styles.buttonGetAddress}
            onPress={getLocation}
          >
            <Text style={styles.buttonText}>GET ADDRESS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonProvider}
            onPress={handleServiceProvider}
          >
            <Text style={styles.buttonText}>BECOME A PROVIDER</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonSignupCus}
            onPress={handleSignUp}
          >
            <Text style={styles.buttonText}>SIGN UP AS CUSTOMER</Text>
          </TouchableOpacity>
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
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  spacer: {
    width: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 18,
    marginBottom: 15,
    fontSize: 16,
  },
  inputHalf: {
    width: "48%",
  },
  addressInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 50,
    marginBottom: 15,
    fontSize: 16,
    paddingHorizontal: 18,
    paddingVertical: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 50,
    marginBottom: 15,
    justifyContent: "center",
    paddingVertical: 5,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonGetAddress: {
    backgroundColor: "#009688",
    padding: 18,
    borderRadius: 50,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#009688",
    marginBottom: 15,
  },

  buttonSignupCus: {
    backgroundColor: "#3498DB",
    padding: 18,
    borderRadius: 50,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#3498DB",
    marginBottom: 15,
  },
  buttonProvider: {
    backgroundColor: "#6F42C1",
    padding: 18,
    borderRadius: 50,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#6F42C1",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PersonalDetails;
