import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  Button,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import DateTimePicker from "@react-native-community/datetimepicker";
import { getUserId } from "../../../lib/apiRequests/userApiClient";
import { SafeAreaView } from "react-native-safe-area-context";
import Icons from "react-native-vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";

const JobPostingScreen = () => {
  const router = useRouter();

  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobBudget, setJobBudget] = useState(null);
  const [jobType, setJobType] = useState(true);
  const [jobCategory, setJobCategory] = useState("plumbing");
  const [jobLocation, setJobLocation] = useState({});
  const [jobImages, setJobImages] = useState(null);
  const [jobOwner, setJobOwner] = useState(null);
  const [address, setAddress] = useState("");

  const [mapModal, setMapModal] = useState(false);

  let initialRegion;

  useEffect(() => {
    try {
      const saveUserDetails = async () => {
        const userId = await getUserId();
        setJobOwner(userId.id);
        setJobLocation({
          lat: userId.location[1],
          lng: userId.location[0],
        });
        initialRegion = {};
        setAddress(userId.address);
      };
      saveUserDetails();
    } catch (e) {
      console.log(e);
    }
  }, []);
  // console.log(jobLocation);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    // console.log(result.assets[0].uri);

    if (result.canceled) {
      return;
    }

    const response = await fetch(result.assets[0].uri);
    const blob = await response.blob();

    const storage = getStorage();
    const storageRef = ref(storage, `jobImages/${Date.now()}`);

    try {
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      // console.log("Image uploaded successfully:", downloadURL);
      setJobImages(downloadURL);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const validateFields = () => {
    if (
      jobTitle &&
      jobDescription &&
      jobCategory &&
      jobType &&
      jobBudget &&
      jobOwner &&
      jobLocation
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleJobPost = () => {
    // console.log("validateFields()", validateFields());
    if (validateFields()) {
      console.lo;
      router.push({
        pathname: "jobs/selectworkerscreen",
        params: {
          jobTitle,
          jobDescription,
          jobImages,
          jobCategory,
          jobType: jobType ? "bid" : "fixed",
          jobBudget,
          jobStatus: "pending",
          jobOwner,
          jobLocation: JSON.stringify(jobLocation),
        },
      });
    } else {
      Alert.alert("Please fill all the fields");
    }
  };

  const handleAddress = async (lat, lng) => {
    const coords = {
      latitude: lat,
      longitude: lng,
    };
    const addressResults = await Location.reverseGeocodeAsync(coords);
    if (addressResults.length > 0) {
      const { street, city, region, country, postalCode } = addressResults[0];
      const fullAddress = `${street ? street + ", " : ""}${
        city ? city + ", " : ""
      }${region ? region + ", " : ""}${
        postalCode ? postalCode + ", " : ""
      }${country}`;
      setAddress(fullAddress.trim());
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, position: "relative" }}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.headerText}>Create a new Job</Text>

        <Text style={styles.label}>Job Title</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Provide a title for the job"
          value={jobTitle}
          onChangeText={setJobTitle}
          multiline={true}
        />
        <Text style={styles.label}>Job Description</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Provide a detailed description of the job"
          value={jobDescription}
          onChangeText={setJobDescription}
          multiline={true}
        />

        <Text style={styles.label}>Attach Photos</Text>
        <TouchableOpacity style={styles.chooseFileButton} onPress={pickImage}>
          <Text style={styles.chooseFileText}>Choose files</Text>
        </TouchableOpacity>
        {jobImages && (
          <Image source={{ uri: jobImages }} style={styles.previewImage} />
        )}

        <Text style={styles.label}>Suggested Pricing</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter a starting price"
          keyboardType="numeric"
          value={jobBudget}
          onChangeText={setJobBudget}
        />

        <View style={styles.biddingOptionContainer}>
          <Text style={styles.label}>Bidding Option</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#3498DB" }}
            thumbColor={"#ffffff"}
            value={jobType}
            onValueChange={setJobType}
          />
        </View>

        <Text style={styles.label}>Job Category</Text>
        <Picker
          selectedValue={jobCategory}
          style={[styles.picker]}
          onValueChange={(itemValue) => setJobCategory(itemValue)}
        >
          <Picker.Item label="Cleaning" value="cleaning" />
          <Picker.Item label="Plumbing" value="plumbing" />
          <Picker.Item label="Electrical" value="electrical" />
          <Picker.Item label="Other" value="other" />
        </Picker>

        {/* <Text style={styles.label}>Start Date and Time</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <TextInput
            style={styles.textInput}
            placeholder="dd/mm/yyyy"
            value={startDate.toLocaleDateString()}
            editable={false}
          />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )} */}
        <Text style={styles.label}>Location</Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={[styles.textInput, { width: "80%" }]}
            placeholder="Enter location"
            value={address}
            editable={true}
          >
            {address}
          </Text>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={() => setMapModal((prev) => !prev)}
          >
            <Icons
              name={`${mapModal ? "close-outline" : "location-outline"}`}
              size={30}
              color={"#fff"}
            />
          </TouchableOpacity>
        </View>

        {mapModal && (
          <>
            <Text
              style={[
                styles.label,
                { color: "#3498DB", alignSelf: "center", fontWeight: "bold" },
              ]}
            >
              Select a Location
            </Text>
            <View
              style={{
                height: 400,
                borderStyle: "solid",
                borderWidth: 1,
              }}
            >
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: jobLocation.lat,
                  longitude: jobLocation.lng,
                  latitudeDelta: 0.02,
                  longitudeDelta: 0.03,
                }}
                provider={MapView.PROVIDER_GOOGLE}
                onPress={({ nativeEvent }) => {
                  console.log("pressed....");
                  setJobLocation({
                    lat: nativeEvent.coordinate.latitude,
                    lng: nativeEvent.coordinate.longitude,
                  });
                  handleAddress(
                    nativeEvent.coordinate.latitude,
                    nativeEvent.coordinate.longitude
                  );
                  return;
                }}
              >
                <Marker
                  coordinate={{
                    latitude: jobLocation.lat,
                    longitude: jobLocation.lng,
                  }}
                  title="Marker Title"
                  description="Marker description"
                  draggable
                  onDragEnd={({ nativeEvent }) => {
                    setJobLocation({
                      lat: nativeEvent.coordinate.latitude,
                      lng: nativeEvent.coordinate.longitude,
                    });
                    handleAddress(
                      nativeEvent.coordinate.latitude,
                      nativeEvent.coordinate.longitude
                    );
                    return;
                  }}
                />
              </MapView>
            </View>
          </>
        )}

        <TouchableOpacity style={styles.postButton} onPress={handleJobPost}>
          <Text style={styles.postButtonText}>Select Workers</Text>
          <Icons name={"arrow-forward-outline"} size={30} color={"#fff"} />
        </TouchableOpacity>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
  },
  textInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#3498DB",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  chooseFileButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  chooseFileText: {
    fontSize: 16,
    color: "#007bff",
  },
  previewImage: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  biddingOptionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  picker: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  postButton: {
    dsiplay: "flex",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#3498DB",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  postButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 12,
  },
  locationButton: {
    backgroundColor: "#3498DB",
    justifyContent: "center",
    width: 50,
    height: 50,
    alignItems: "center",
    borderRadius: 10,
  },
  map: {
    width: "100%",
    height: "100%",
  },
};

export default JobPostingScreen;
