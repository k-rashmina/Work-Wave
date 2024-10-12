import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getJobById } from "../../../../lib/apiRequests/jobApiClient";
import Swiper from "react-native-swiper";
import { formatDistanceToNow } from "date-fns";

const { width } = Dimensions.get("window");

const AcceptedWork = () => {
  const { acceptedWorkId } = useLocalSearchParams();
  const [job, setJob] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const jobData = await getJobById(acceptedWorkId);
        setJob(jobData);
      } catch (error) {
        console.log("Error getting job:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [acceptedWorkId]);

  const handleViewCustomerDetails = () => {
    // Logic to navigate to customer details screen or show details
    router.push(`/customerDetails/${job.customerId}`); // Example routing, adjust as needed
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#6200ee" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.jobTitle}>{job.jobTitle}</Text>

        {/* Job Image Swiper */}
        {job.jobImages && job.jobImages.length > 0 ? (
          <Swiper style={styles.wrapper} showsButtons={true}>
            {job.jobImages.map((image, index) => (
              <View key={index} style={styles.slide}>
                <Image source={{ uri: image }} style={styles.image} />
              </View>
            ))}
          </Swiper>
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>No images available</Text>
          </View>
        )}

        <View style={styles.detailsContainer}>
          <Text style={styles.jobBudget}>Budget: {job.jobBudget} LKR</Text>
          <Text style={styles.bidAmount}>
            Accepted Price: {job.bidAmount} LKR
          </Text>
          <Text style={styles.jobDescription}>{job.jobDescription}</Text>
          <Text style={styles.jobStatus}>Status: {job.jobStatus}</Text>
          <Text style={styles.jobPosted}>
            Posted {formatDistanceToNow(new Date(job.jobCreatedAt))} ago
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={handleViewCustomerDetails}
            disabled={true}
          >
            <Text style={styles.buttonText}>View Customer Details</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AcceptedWork;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    padding: 16,
  },
  wrapper: {
    height: 250,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: width - 32, // Full width minus padding
    height: "100%",
    borderRadius: 12,
  },
  placeholderImage: {
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#e0e0e0",
    marginBottom: 16,
  },
  placeholderText: {
    color: "#888",
    fontSize: 16,
  },
  jobTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 12,
    textAlign: "center",
    color: "#333",
  },
  detailsContainer: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 12,
  },
  jobBudget: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#388e3c", // Green color for budget
    marginBottom: 8,
  },
  bidAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1976d2", // Blue color for accepted price
    marginBottom: 8,
  },
  jobDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
    color: "#444",
  },
  jobStatus: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#f57c00", // Orange color for status
  },
  jobPosted: {
    fontSize: 14,
    color: "#777",
    textAlign: "right",
  },
  button: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#6200ee",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
