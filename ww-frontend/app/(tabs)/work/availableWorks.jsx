import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { getPendingJobsForServiceProvider } from "../../../lib/apiRequests/jobApiClient";
import { formatDistanceToNow } from "date-fns";
import capitalizeFirstLetter from "../../utils/yohan/capitalizeFirstLetter";
import { getUser } from "../../../lib/apiRequests/userApiClient";
import Icon from "react-native-vector-icons/FontAwesome";

const AvailableWorks = () => {
  const [pendingJobs, setPendingJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [maxDistance, setMaxDistance] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const router = useRouter();

  const fetchPendingJobs = async () => {
    try {
      const user = await getUser();
      const uId = user._id;
      const jobs = await getPendingJobsForServiceProvider();

      const updatedJobs = jobs.map((job) => {
        let userBid = null;
        if (job.bidders && job.bidders.length > 0) {
          userBid = job.bidders.find((bidder) => bidder.bidderId === uId);
          if (userBid) {
            return {
              ...job,
              distance: userBid.distance,
              userBidAmount: userBid.bidAmount || 0,
            };
          }
        }
        return { ...job, distance: null, userBidAmount: null };
      });
      setPendingJobs(updatedJobs);
      setFilteredJobs(updatedJobs);
    } catch (error) {
      console.log("Error getting pending jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingJobs();
  }, []);

  const filterJobs = () => {
    const distance = parseFloat(maxDistance);
    const budget = parseFloat(minBudget);

    const filtered = pendingJobs.filter((job) => {
      const isWithinDistance =
        !distance || (job.distance && job.distance <= distance);
      const isWithinBudget = !budget || job.jobBudget >= budget;
      return isWithinDistance && isWithinBudget;
    });

    setFilteredJobs(filtered);
  };

  const refreshJobs = async () => {
    setLoading(true);
    setMaxDistance("");
    setMinBudget("");
    await fetchPendingJobs();
    setLoading(false);
  };

  const renderItem = ({ item }) => {
    let bidStatusColor = "#e67e22";
    let bidStatusText = "Bid Not Placed";

    if (item.userBidAmount > 0) {
      bidStatusColor = "#81C784";
      bidStatusText = "Already Bidded";
    }

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`work/workDetails/${item._id}`)}
      >
        <Image source={{ uri: item.jobImages[0] }} style={styles.jobImage} />
        <View style={styles.jobDetails}>
          <Text style={styles.jobCategory}>
            {capitalizeFirstLetter(item.jobCategory)}
          </Text>
          <Text style={styles.jobTitle}>{item.jobTitle}</Text>
          <Text style={styles.jobBudget}>Max Budget: {item.jobBudget} LKR</Text>
          {item.distance && (
            <Text style={styles.jobDistance}>Distance: {item.distance} km</Text>
          )}
          {item.userBidAmount > 0 && (
            <View
              style={[
                styles.bidStatusContainer,
                { borderColor: bidStatusColor },
              ]}
            >
              <Text style={[styles.bidStatus, { color: bidStatusColor }]}>
                {bidStatusText}
              </Text>
            </View>
          )}
          <Text style={styles.timeAgo}>
            Posted {formatDistanceToNow(new Date(item.createdAt))} ago
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.filterContainer}>
        <TextInput
          placeholder="Max Distance (km)"
          style={styles.input}
          value={maxDistance}
          onChangeText={setMaxDistance}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Min Budget (LKR)"
          style={styles.input}
          value={minBudget}
          onChangeText={setMinBudget}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.button} onPress={filterJobs}>
          <View style={styles.buttonContent}>
            <Icon name="filter" size={20} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>Filter</Text>
          </View>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredJobs}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.container}
        refreshing={loading}
        onRefresh={refreshJobs}
      />
    </SafeAreaView>
  );
};

export default AvailableWorks;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 16,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginRight: 5,
    borderRadius: 5,
    flex: 1,
  },
  button: {
    flex: 1,
    backgroundColor: "#3498DB",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
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
  jobImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  jobDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  jobCategory: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7d7d7d",
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e67e22",
    fontFamily: "sans-serif-condensed",
  },
  jobBudget: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3498DB",
  },
  jobDistance: {
    fontSize: 14,
    color: "#009688",
  },
  bidStatusContainer: {
    borderWidth: 1,
    borderRadius: 50,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
    alignSelf: "flex-start",
  },
  bidStatus: {
    fontSize: 10,
    fontWeight: "500",
    textAlign: "center",
  },
  timeAgo: {
    fontSize: 12,
    color: "#999",
    fontWeight: "10000",
  },
});
