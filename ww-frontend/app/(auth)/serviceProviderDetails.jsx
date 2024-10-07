import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  TextInput,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Button,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Ionicons } from "@expo/vector-icons"; // Importing icon library
import { registerUser } from "../(auth)/Auth";
import { createUser } from "../../lib/apiRequests/userApiClient";

const daysOfWeek = [
  { label: "SUN", value: "sun" },
  { label: "MON", value: "mon" },
  { label: "TUE", value: "tue" },
  { label: "WED", value: "wed" },
  { label: "THU", value: "thu" },
  { label: "FRI", value: "fri" },
  { label: "SAT", value: "sat" },
];

const ServiceProviderDetails = () => {
  const {
    email,
    password,
    firstName,
    lastName,
    age,
    gender,
    telephone,
    location,
    address,
  } = useLocalSearchParams();
  const [category, setCategory] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [availableDays, setAvailableDays] = useState([]);
  const [experience, setExperience] = useState("");
  const [image, setImage] = useState(null);
  const [certImageURL, setCertImageURL] = useState(""); // State to store the image URL
  const [errorMessages, setErrorMessages] = useState({
    category: "",
    availableDays: "",
    experience: "",
  });
  const router = useRouter();

  const pickAndUploadImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.canceled) {
      return;
    }

    const selectedImageUri = result.assets[0].uri;
    setImage(selectedImageUri); // Set the selected image URI

    const response = await fetch(selectedImageUri);
    const blob = await response.blob(); // Convert image to blob

    const storage = getStorage(); // Initialize Firebase Storage
    const storageRef = ref(storage, `certifications/${Date.now()}`); // Create a reference with a unique name

    try {
      // Upload the image
      await uploadBytes(storageRef, blob);
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      console.log("Image uploaded successfully:", downloadURL);
      setCertImageURL(downloadURL); // Save the download URL to state
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const validateField = (fieldName, value) => {
    const newErrorMessages = { ...errorMessages };
    switch (fieldName) {
      case "category":
        newErrorMessages.category = value ? "" : "Category is required.";
        break;
      case "availableDays":
        newErrorMessages.availableDays =
          availableDays.length > 0 ? "" : "Available days are required.";
        break;
      case "experience":
        newErrorMessages.experience = value ? "" : "Experience is required.";
        break;
      default:
        break;
    }
    setErrorMessages(newErrorMessages);
  };

  const toggleDaySelection = (day) => {
    if (availableDays.includes(day)) {
      setAvailableDays(availableDays.filter((d) => d !== day));
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };

  const handleSignUp = () => {
    const allValid = Object.values(errorMessages).every((msg) => msg === "");
    if (!allValid || !category || availableDays.length === 0 || !experience) {
      setErrorMessages((prev) => ({
        ...prev,
        category: !category ? "Category is required." : prev.category,
        availableDays:
          availableDays.length === 0
            ? "Available days are required."
            : prev.availableDays,
        experience: !experience ? "Experience is required." : prev.experience,
      }));
      return;
    }

    const serviceProviderDetails = {
      email,
      password,
      firstName,
      lastName,
      age,
      gender,
      telephone,
      location,
      address,
      category,
      availableDays,
      experience,
      certImageURL,
    };

    console.log("Service Provider Details:", serviceProviderDetails);
    // Handle Firebase sign up or submission
    registerUser(email, password);
    createUser(serviceProviderDetails);
    router.replace("/login");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.heading}>ENTER PROVIDER DETAILS</Text>

          {/* Category Picker */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => {
                setCategory(itemValue);
                validateField("category", itemValue);
              }}
              style={styles.picker}
            >
              <Picker.Item label="Select Category" value="" />
              <Picker.Item label="Plumbing" value="plumbing" />
              <Picker.Item label="Electrical" value="electrical" />
              <Picker.Item label="Cleaning" value="cleaning" />
              {/* Add more categories as needed */}
            </Picker>
          </View>
          {errorMessages.category ? (
            <Text style={styles.errorText}>{errorMessages.category}</Text>
          ) : null}

          {/* Available Days Picker */}
          <Text style={styles.subHeading}>Select Available Days:</Text>
          <View style={styles.dayPickerContainer}>
            {daysOfWeek.map((day) => (
              <TouchableOpacity
                key={day.value}
                style={[
                  styles.dayButton,
                  availableDays.includes(day.value) && styles.selectedDay,
                ]}
                onPress={() => toggleDaySelection(day.value)}
              >
                <Text
                  style={[
                    styles.dayText,
                    availableDays.includes(day.value) && styles.selectedDayText,
                  ]}
                >
                  {day.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errorMessages.availableDays ? (
            <Text style={styles.errorText}>{errorMessages.availableDays}</Text>
          ) : null}

          {/* Experience Input */}
          <TextInput
            placeholder="Years of Experience"
            value={experience}
            onChangeText={(text) => {
              setExperience(text);
              validateField("experience", text);
            }}
            keyboardType="numeric"
            style={styles.input}
          />
          {errorMessages.experience ? (
            <Text style={styles.errorText}>{errorMessages.experience}</Text>
          ) : null}

          <View style={styles.certificationPlaceholder}>
            {image ? (
              <Image
                source={{ uri: image }}
                style={{ width: 200, height: 200 }}
              />
            ) : (
              <View style={styles.placeholderContent}>
                <Ionicons name="document-attach" size={50} color="#aaa" />
                <Text style={styles.placeholderText}>
                  No Certification Selected
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={pickAndUploadImage}
          >
            <Text style={styles.uploadButtonText}>UPLOAD CERTIFICATION</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>SIGN UP AS PROVIDER</Text>
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
  subHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "left",
    color: "#3498DB",
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 50,
    paddingHorizontal: 18,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  dayPickerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  dayButton: {
    padding: 10,
    borderWidth: 2,
    borderColor: "#3498DB",
    borderRadius: 50,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  selectedDay: {
    backgroundColor: "#3498DB",
  },
  dayText: {
    color: "#3498DB",
    fontWeight: "bold",
  },
  selectedDayText: {
    color: "white",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginVertical: 10,
    fontSize: 18,
    marginBottom: 20,
  },
  certificationPlaceholder: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  placeholderContent: {
    alignItems: "center",
  },
  placeholderText: {
    marginTop: 10,
    color: "#aaa",
  },
  uploadButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 50,
    padding: 18,
    alignItems: "center",
    marginBottom: 20,
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#3498DB",
    borderRadius: 50,
    padding: 18,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ServiceProviderDetails;
