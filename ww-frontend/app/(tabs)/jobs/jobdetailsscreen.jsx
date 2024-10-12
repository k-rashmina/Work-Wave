import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios"; // assuming you are using axios for API requests
import { TouchableOpacity } from "react-native";

const JobDetailsScreen = () => {
  const { job } = useLocalSearchParams();
  let jobDetails = JSON.parse(job);
  // console.log(jobDetails.bidders);

  const [selectedWorkers, setSelectedWorkers] = useState("");

  if (!jobDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text>Unable to fetch job details.</Text>
      </View>
    );
  }

  const toggleWorkerSelection = (workerId) => {
    setSelectedWorkers(workerId);
  };

  console.log(selectedWorkers);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{jobDetails.jobTitle}</Text>

      <Text style={styles.label}>Job Description:</Text>
      <Text style={styles.description}>{jobDetails.jobDescription}</Text>

      <Text style={styles.label}>Job Category:</Text>
      <Text>{jobDetails.jobCategory}</Text>

      <Text style={styles.label}>Budget:</Text>
      <Text>${jobDetails.jobBudget}</Text>

      <Text style={styles.label}>Job Status:</Text>
      <Text>{jobDetails.jobStatus}</Text>

      <Text style={styles.label}>Job Type:</Text>
      <Text>{jobDetails.jobType}</Text>

      {jobDetails.jobStatus == "pending" && (
        <>
          <Text style={styles.label}>Bid Closing Date:</Text>
          <Text>{new Date(jobDetails.bidClosingAt).toLocaleDateString()}</Text>
        </>
      )}

      <Text style={styles.label}>Bidders:</Text>
      {jobDetails.bidders && jobDetails.bidders.length > 0 ? (
        jobDetails.bidders.map((bidder, index) => (
          <TouchableOpacity
            key={index}
            style={styles.bidderContainer}
            onPress={() => toggleWorkerSelection(bidder.bidderId)}
          >
            <Text>Bidder ID: {bidder.bidderId}</Text>
            <Text>Bid Status: {bidder.bidStatus}</Text>
            <Text>Bid Amount: {bidder.bidAmount}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text>No bidders yet.</Text>
      )}

      <Text style={styles.label}>Job Created At:</Text>
      <Text>{new Date(jobDetails.jobCreatedAt).toLocaleDateString()}</Text>
    </ScrollView>
  );
};

export default JobDetailsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  label: {
    fontWeight: "bold",
    marginTop: 16,
  },
  description: {
    marginBottom: 16,
  },
  bidderContainer: {
    padding: 8,
    marginVertical: 8,
    borderColor: "#3498DB",
    borderWidth: 1,
    borderRadius: 5,
  },
});
