import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  FlatList,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { getAcceptedJobsForServiceProvider } from "../../../lib/apiRequests/jobApiClient";
import { getUser } from "../../../lib/apiRequests/userApiClient";
import { formatDistanceToNow } from "date-fns";
import Icon from "react-native-vector-icons/FontAwesome";

const MyWorks = () => {
  const [myWorks, setMyWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchMyWorks = async () => {
    try {
      setLoading(true);
      const jobs = await getAcceptedJobsForServiceProvider();
      setMyWorks(jobs);
    } catch (error) {
      console.log("Error getting my works:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchUser = async () => {
    try {
      const user = await getUser();
      setUser(user);
    } catch (error) {
      console.log("Error getting user:", error);
    }
  };

  useEffect(() => {
    fetchMyWorks();
    fetchUser();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMyWorks();
  }, []);

  const renderItem = ({ item }) => {
    let cardColor = "#FFFFFF"; // Default color
    let jobStatusText =
      item.jobStatus.charAt(0).toUpperCase() + item.jobStatus.slice(1); // Capitalize the first letter

    // Determine card color based on jobStatus
    if (item.jobStatus === "completed") {
      cardColor = "#DFF0D8"; // Light green for completed
    } else if (item.jobStatus === "onGoing") {
      cardColor = "#FFE4B5"; // Light orange for ongoing
    }

    console.log("itemID", item._id);
    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: cardColor }]}
        onPress={() => {
          router.push(`work/acceptedWorks/${item._id}`);
        }}
      >
        <View style={styles.jobDetails}>
          {item.jobImages && item.jobImages.length > 0 && item.jobImages[0] ? (
            <Image
              source={{ uri: item.jobImages[0] }} // Ensure the image URL is valid
              style={styles.jobImage}
            />
          ) : (
            <Icon
              name="image"
              size={100}
              color="#B0B0B0"
              style={styles.placeholderIcon}
            />
          )}
          <View style={styles.textContainer}>
            <Text style={styles.jobTitle}>{item.jobTitle}</Text>
            <Text style={styles.jobBudget}>
              Starting Price: {item.jobBudget} LKR
            </Text>
            <Text style={styles.myBid}>
              Accepted Price: {item.bidAmount} LKR
            </Text>
            {/* Wrap job status in a View for styling */}
            <View style={styles.jobStatusContainer}>
              <Text style={styles.jobStatus}>{jobStatusText}</Text>
            </View>
            <Text style={styles.timeAgo}>
              Posted {formatDistanceToNow(new Date(item.createdAt))} ago
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : myWorks.length > 0 ? (
        <FlatList
          data={myWorks}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <Text>No works found.</Text>
      )}
    </SafeAreaView>
  );
};

export default MyWorks;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 16,
  },
  card: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  jobDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  jobImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 15,
  },
  placeholderIcon: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "sans-serif-condensed",
  },
  jobBudget: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    fontFamily: "sans-serif-condensed",
  },
  myBid: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    fontFamily: "sans-serif-condensed",
  },
  jobStatusContainer: {
    backgroundColor: "#f0f0f0", // Background color for the status container
    borderRadius: 12, // Rounded corners
    padding: 5, // Padding around the text
    marginTop: 5, // Spacing above the status
    alignSelf: "flex-start", // Align to the start of the text container
  },
  jobStatus: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "sans-serif-condensed",
  },
  timeAgo: {
    fontSize: 12,
    fontWeight: "400",
    color: "#777",
    marginTop: 10,
    fontFamily: "sans-serif-condensed",
  },
});
