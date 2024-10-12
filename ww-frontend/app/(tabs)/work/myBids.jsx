import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { getJobsForServiceProvider } from "../../../lib/apiRequests/jobApiClient";
import { getUser } from "../../../lib/apiRequests/userApiClient";
import { formatDistanceToNow } from "date-fns";
import Icon from "react-native-vector-icons/FontAwesome";

const MyBids = () => {
  const [myBids, setMyBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const router = useRouter();

  const fetchMyBids = async () => {
    try {
      const jobs = await getJobsForServiceProvider();
      // Filter out jobs without valid bids
      const filteredJobs = jobs.filter((job) =>
        job.bidders.some((bidder) =>
          ["pending", "accepted", "rejected"].includes(bidder.bidStatus)
        )
      );
      setMyBids(filteredJobs);
    } catch (error) {
      console.log("Error getting my bids:", error);
    } finally {
      setLoading(false);
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
    fetchMyBids();
    fetchUser();
  }, []);
  const renderItem = ({ item }) => {
    // Find the current user's bid in the bidders array
    const currentUserBid = item.bidders.find(
      (bidder) => bidder.bidderId === user._id
    );

    // Ensure currentUserBid exists and has a valid bidStatus
    if (
      !currentUserBid ||
      !["pending", "accepted", "rejected"].includes(currentUserBid.bidStatus)
    ) {
      return null; // Skip rendering this item
    }

    // Default bid status text and card colors based on bid status
    let bidStatusText =
      currentUserBid.bidStatus.charAt(0).toUpperCase() +
      currentUserBid.bidStatus.slice(1); // Capitalize the first letter
    let cardColor, darkBorderColor, isRejected;

    switch (currentUserBid.bidStatus) {
      case "accepted":
        cardColor = "#DFF0D8"; // Light green for accepted
        darkBorderColor = "#B0CDAF"; // Darker green for border
        isRejected = false;
        break;
      case "rejected":
        cardColor = "#F2DEDE"; // Light red for rejected
        darkBorderColor = "#D6A6A6"; // Darker red for border
        isRejected = true; // Mark as rejected
        break;
      case "pending":
        cardColor = "#FFE4B5"; // Light orange for pending
        darkBorderColor = "#DDAA00"; // Darker orange for border
        isRejected = false;
        break;
      default:
        return null; // Skip rendering if status is unknown
    }

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: cardColor }]}
        onPress={() => {
          if (!isRejected) {
            router.push(`work/workDetails/${item._id}`);
          }
        }}
        disabled={isRejected} // Disable the touchable if the bid is rejected
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
            {item.bidAmount > 0 && (
              <Text style={styles.wonBid}>
                Won Bid Price: {item.bidAmount} LKR
              </Text>
            )}
            <Text style={styles.myBid}>
              My Bid: {currentUserBid.bidAmount} LKR
            </Text>
            <View
              style={[
                styles.bidStatusContainer,
                { borderColor: darkBorderColor },
              ]}
            >
              <Text style={styles.bidStatus}>{bidStatusText}</Text>
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
      ) : myBids.length > 0 ? (
        <FlatList
          data={myBids}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.container}
        />
      ) : (
        <Text>No bids found.</Text>
      )}
    </SafeAreaView>
  );
};

export default MyBids;

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
  wonBid: {
    fontSize: 14,
    color: "#555",
    fontFamily: "sans-serif-condensed",
  },
  myBid: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    fontFamily: "sans-serif-condensed",
  },
  bidStatusContainer: {
    borderWidth: 1, // Border width
    borderRadius: 25, // Border radius for the rectangle
    paddingVertical: 5, // Padding for the vertical text inside the border
    paddingHorizontal: 10, // Padding for the horizontal text inside the border
    marginTop: 5,
    alignSelf: "flex-start", // Aligns the container to the start (left)
    borderColor: "#DDAA00", // Example color; you can replace with dynamic color
  },
  bidStatus: {
    fontSize: 14,
    fontWeight: "600",
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
