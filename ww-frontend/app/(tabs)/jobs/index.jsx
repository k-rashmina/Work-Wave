import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { getJobsForJobOwner } from "../../../lib/apiRequests/jobApiClient";
import Icon from "react-native-vector-icons/FontAwesome";
import capitalizeFirstLetter from "../../utils/yohan/capitalizeFirstLetter";
import { formatDistanceToNow } from "date-fns";

const Dashboard = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchMyJobs = async () => {
    setLoading(true);
    try {
      const jobs = await getJobsForJobOwner();
      setMyJobs(jobs);
    } catch (error) {
      console.log("Error getting jobs for job owner", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const refreshJobs = async () => {
    await fetchMyJobs();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: `jobs/jobdetailsscreen`,
          params: { job: JSON.stringify(item) },
        })
      }
    >
      {item.jobImages && item.jobImages.length > 0 && item.jobImages[0] ? (
        <Image
          source={{ uri: item.jobImages[0] }}
          style={styles.jobImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholderImage}>
          <Icon name="image" size={30} color="#bbb" />
        </View>
      )}
      <View style={styles.jobDetails}>
        <Text style={styles.jobCategory}>
          {capitalizeFirstLetter(item.jobCategory)}
        </Text>
        <Text style={styles.jobTitle}>{item.jobTitle}</Text>

        <Text style={styles.jobBudget}>Budget: {item.jobBudget} LKR</Text>
        <Text style={styles.jobStatus}>{item.jobStatus}</Text>
        <Text style={styles.timeAgo}>
          Posted {formatDistanceToNow(new Date(item.createdAt))} ago
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={myJobs}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.container}
        refreshing={loading}
        onRefresh={refreshJobs}
        ListHeaderComponent={<Text style={styles.header}>My Jobs</Text>}
      />
      {/* Floating Button for Creating Job */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => router.push("/jobs/jobpostingscreen")} // Navigate to the CreateJob page
      >
        <Icon name="plus" size={30} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "sans-serif-condensed",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  imageContainer: {
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  jobImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  placeholderImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 15,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  jobDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e67e22",
    fontFamily: "sans-serif-condensed",
  },
  jobCategory: {
    fontSize: 16,
    color: "#7d7d7d",
    fontWeight: "600",
    fontFamily: "sans-serif-condensed",
  },
  jobBudget: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3498DB",
    fontFamily: "sans-serif-condensed",
  },
  jobStatus: {
    fontSize: 14,
    color: "#009688",
    fontFamily: "sans-serif-condensed",
  },
  timeAgo: {
    fontSize: 12,
    color: "#999",
    fontWeight: "10000",
    fontFamily: "sans-serif-condensed",
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#3498DB",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
