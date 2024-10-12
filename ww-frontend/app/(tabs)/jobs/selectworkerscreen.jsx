import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Button,
  Image,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { getNearbyWorkers } from "../../../lib/apiRequests/jobsApiClient";
import { useLocalSearchParams, useRouter } from "expo-router";

const workers = [
  {
    id: 1,
    name: "Aron Jayathilaka",
    rating: 4.9,
    jobs: 102,
    jobCategory: "Electrical Job Category",
    location: { latitude: 6.9271, longitude: 79.8612 }, // Worker 1 Location
    hourlyRate: 400,
    area: "Hanwella, Colombo",
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "Peter Parker",
    rating: 4.9,
    jobs: 102,
    jobCategory: "Electrical Job Category",
    location: { latitude: 6.931, longitude: 79.8577 }, // Worker 2 Location
    hourlyRate: 400,
    area: "Hanwella, Colombo",
    imageUrl: "https://via.placeholder.com/150",
  },
];

const customerLocation = { latitude: 6.9271, longitude: 79.8612 }; // Current customer location

const WorkerSelectionScreen = () => {
  const router = useRouter();
  const {
    jobTitle,
    jobDescription,
    jobImages,
    jobCategory,
    jobType,
    jobBudget,
    jobStatus,
    jobOwner,
    jobLocation,
  } = useLocalSearchParams();

  const cusLocation = JSON.parse(jobLocation);

  const [nearbyWorkers, setNearbyWorkers] = useState([]);
  const [selectedWorkers, setSelectedWorkers] = useState([]);

  useEffect(() => {
    const cusDetails = {
      jobOwner,
      cusLocation,
      jobCategory,
    };

    const nearbyWorkers = async () => {
      const nearbyWorkerDetails = await getNearbyWorkers(cusDetails);
      setNearbyWorkers(nearbyWorkerDetails);
    };
    nearbyWorkers();
  }, []);

  // Function to toggle worker selection
  const toggleWorkerSelection = (workerId) => {
    setSelectedWorkers(
      (prevSelected) =>
        prevSelected.includes(workerId)
          ? prevSelected.filter((id) => id !== workerId) // Deselect if already selected
          : [...prevSelected, workerId] // Add to selected
    );
  };

  // Check if a worker is selected
  const isWorkerSelected = (workerId) => selectedWorkers.includes(workerId);

  // console.log(selectedWorkers);

  return (
    <View style={styles.container}>
      {/* MapView */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: cusLocation.lat,
          longitude: cusLocation.lng,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
      >
        {/* Customer Location Marker */}
        <Marker
          coordinate={{
            latitude: cusLocation.lat,
            longitude: cusLocation.lng,
          }}
          title="You are here"
          pinColor="blue"
        />

        {/* Worker Markers */}
        {nearbyWorkers.map((worker) => (
          <Marker
            key={worker.workerDetails._id}
            coordinate={{
              latitude: worker.workerDetails.location.coordinates[1],
              longitude: worker.workerDetails.location.coordinates[0],
            }}
            title={worker.workerDetails.firstName}
            description={`${worker.distanceValues.distance.text} - ${worker.distanceValues.duration.text}`}
            pinColor={"red"}
          />
        ))}
      </MapView>

      {/* Filter and Worker List */}
      {/* <View style={styles.filterContainer}>
        <Text>Filter Workers</Text>
        <Button title="Nearby" />
      </View> */}

      <Text style={styles.subHeaderText}>Select Workers</Text>

      {/* Worker Selection List */}
      <ScrollView style={styles.workerList}>
        {nearbyWorkers.map((worker) => (
          <TouchableOpacity
            key={worker.workerDetails._id}
            style={[
              styles.workerCard,
              isWorkerSelected(worker.workerDetails._id) && {
                backgroundColor: "#3498DB",
              }, // Change color on selection
            ]}
            onPress={() => toggleWorkerSelection(worker.workerDetails._id)}
          >
            <Image
              source={{
                uri:
                  worker.workerDetails.profileImageURL ||
                  "https://via.placeholder.com/150",
              }}
              style={styles.workerImage}
            />
            <View style={styles.workerDetails}>
              <Text style={styles.workerName}>
                {worker.workerDetails.firstName} {worker.workerDetails.lastName}
              </Text>
              <Text
                style={[
                  styles.workerInfo,
                  isWorkerSelected(worker.workerDetails._id) && {
                    color: "#fff",
                  },
                ]}
              >{`${worker.workerDetails.rating} (${worker.workerDetails.experience} years)`}</Text>
              <Text
                style={[
                  styles.workerInfo,
                  isWorkerSelected(worker.workerDetails._id) && {
                    color: "#fff",
                  },
                ]}
              >
                {worker.workerDetails.category}
              </Text>
              <Text
                style={[
                  styles.workerInfo,
                  isWorkerSelected(worker.workerDetails._id) && {
                    color: "#fff",
                  },
                ]}
              >{`${worker.workerDetails.address}, LKR 100/h`}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Start Bidding Button */}
      <TouchableOpacity
        style={styles.biddingButton}
        disabled={selectedWorkers.length === 0}
        onPress={() => alert(`Selected Workers: ${selectedWorkers.join(", ")}`)}
      >
        <Text style={styles.biddingButtonText}>Start Bidding Process</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    height: "40%", // Adjust map height
    width: "100%",
  },
  filterContainer: {
    padding: 10,
    backgroundColor: "#fff",
  },
  workerList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  workerCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  workerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  workerDetails: {
    flex: 1,
  },
  workerName: {
    fontWeight: "bold",
  },
  workerInfo: {
    fontSize: 12,
    color: "#777",
  },
  biddingButton: {
    backgroundColor: "#3498DB",
    padding: 15,
    alignItems: "center",
  },
  biddingButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  subHeaderText: {
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
    color: "#3498DB",
    fontWeight: "bold",
  },
});

export default WorkerSelectionScreen;
