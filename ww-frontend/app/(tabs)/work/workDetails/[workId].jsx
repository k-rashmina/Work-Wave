import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  getJobById,
  updateBidForJob,
} from "../../../../lib/apiRequests/jobApiClient";
import { getUser } from "../../../../lib/apiRequests/userApiClient";
import { formatDistanceToNow, addHours } from "date-fns";
import Swiper from "react-native-swiper";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Location from "expo-location";

const { width } = Dimensions.get("window");

const WorkDetails = () => {
  const { workId } = useLocalSearchParams();
  const [jobDetails, setJobDetails] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [bidDescription, setBidDescription] = useState("");
  const [city, setCity] = useState("");
  const [hasUserBid, setHasUserBid] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchJobDetails = async () => {
    setRefreshing(true);
    try {
      // Fetch job details by ID
      const details = await getJobById(workId);

      // Calculate the number of bidders, total bid amount, average bid amount, and minimum bid amount
      let count = details.bidders.filter(
        (bidder) => bidder.bidAmount !== null
      ).length;
      let totalBid = details.jobBudget;
      let avgBid = 0;
      let minBid = details.jobBudget;

      if (details.bidders && details.bidders.length > 0) {
        details.bidders.forEach((bidder) => {
          if (bidder.bidAmount) {
            totalBid += bidder.bidAmount;
            if (bidder.bidAmount < minBid) {
              minBid = bidder.bidAmount;
            }
          }
        });
        avgBid = totalBid / (count + 1);
      }

      const updatedDetails = { ...details, avgBid, minBid, count };
      setJobDetails(updatedDetails);

      // Get city from jobLocation latitude and longitude
      const { lat, lng } = details.jobLocation;
      const location = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng,
      });
      if (location.length > 0) {
        setCity(location[0].city);
      }

      // Get the current user's ID
      const user = await getUser();
      const uId = user._id;

      // Check if the current user has submitted a bid
      const currentUserBid = details.bidders.find(
        (bidder) => bidder.bidderId === uId && bidder.bidAmount !== null
      );

      if (currentUserBid) {
        setHasUserBid(true);
        setBidAmount(
          currentUserBid.bidAmount != null
            ? currentUserBid.bidAmount.toString()
            : ""
        );
        setBidDescription(currentUserBid.bidDescription || "");
      }
    } catch (error) {
      console.log("Error fetching job details:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [workId]);

  const handleSubmitBid = async () => {
    try {
      await updateBidForJob(workId, bidAmount, bidDescription);
      router.push("work/availableWorks");
    } catch (error) {
      console.log("Error submitting bid:", error);
    }
  };

  const handleEditBid = () => {
    setIsEditable(true);
  };

  if (!jobDetails) {
    return <Text>Loading...</Text>;
  }

  // Calculate when the bid ends (createdAt + 24 hours)
  const bidEndsAt = addHours(new Date(jobDetails.createdAt), 24);
  const timeRemaining = formatDistanceToNow(bidEndsAt, { addSuffix: true });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchJobDetails} />
        }
      >
        <Text style={styles.title}>{jobDetails.jobTitle}</Text>

        <Swiper
          style={styles.wrapper}
          showsButtons={false}
          dot={<View style={styles.dot} />}
          activeDot={<View style={styles.activeDot} />}
          paginationStyle={styles.pagination}
        >
          {jobDetails.jobImages.length > 0 ? (
            jobDetails.jobImages.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image
                  source={{ uri: image }}
                  style={styles.jobImage}
                  resizeMode="cover"
                />
              </View>
            ))
          ) : (
            <View style={styles.placeholderContainer}>
              <Icon name="image" size={80} color="#ccc" />
              <Text style={styles.placeholderText}>No Images Available</Text>
            </View>
          )}
        </Swiper>

        <View style={styles.jobDetails}>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Max Budget</Text>
            <Text style={styles.infoValue}>
              {" "}
              LKR {jobDetails.jobBudget.toFixed(2)}
            </Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoValue}>{city || "Unknown"}</Text>
          </View>

          {/* Conditional rendering for bidders */}
          {jobDetails.count > 0 ? (
            <>
              <View style={styles.infoContainer}>
                <Text style={styles.infoLabel}>Number of Bidders</Text>
                <Text style={styles.infoValue}>{jobDetails.count}</Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.infoLabel}>Average Bid</Text>
                <Text style={styles.infoValue}>
                  LKR {jobDetails.avgBid.toFixed(2)}
                </Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.infoLabel}>Minimum Bid</Text>
                <Text style={styles.infoValue}>
                  {jobDetails.minBid.toFixed(2)} LKR
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.noBidsContainer}>
              <Text style={styles.noBidsText}>No one has bidded yet</Text>
            </View>
          )}

          <Text style={styles.infoLabelD}>Job Description</Text>
          <TextInput
            style={styles.descriptionInput}
            multiline
            numberOfLines={1}
            value={jobDetails.jobDescription}
            editable={false}
            scrollEnabled
          />

          <View style={styles.bidEndsContainer}>
            <Text style={styles.bidEndsText}>Bid Ends {timeRemaining}</Text>
          </View>
        </View>

        {hasUserBid ? (
          <>
            <TouchableOpacity style={styles.editButton} onPress={handleEditBid}>
              <Text style={styles.editButtonText}>Edit Bid</Text>
            </TouchableOpacity>
            <TextInput
              placeholder="Enter Bid Amount"
              style={styles.input}
              value={bidAmount}
              onChangeText={setBidAmount}
              keyboardType="numeric"
              editable={isEditable}
            />
            <TextInput
              placeholder="Enter Bid Description"
              style={styles.input}
              value={bidDescription}
              onChangeText={setBidDescription}
              editable={isEditable} // Disable if not in edit mode
            />
          </>
        ) : (
          <>
            <Text style={styles.infoLabelP}>Place Bid</Text>
            <TextInput
              placeholder="Enter Bid Amount"
              style={styles.input}
              value={bidAmount}
              onChangeText={setBidAmount}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Enter Bid Description"
              style={styles.input}
              value={bidDescription}
              onChangeText={setBidDescription}
            />
          </>
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitBid}>
          <View style={styles.buttonContent}>
            <Icon name="send" size={20} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>Submit Bid</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WorkDetails;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#777",
    fontFamily: "sans-serif-condensed",
  },
  wrapper: {
    height: 250,
    marginBottom: 20,
  },
  imageContainer: {
    width: width * 0.9,
    height: 250,
    borderRadius: 12,
    overflow: "hidden",
    alignSelf: "center",
  },
  jobImage: {
    width: "100%",
    height: "100%",
    borderRadius: 0,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%", // Adjust height for centering
  },
  placeholderText: {
    marginTop: 8,
    color: "#ccc",
    fontSize: 16,
  },
  dot: {
    backgroundColor: "rgba(0,0,0,.2)",
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  activeDot: {
    backgroundColor: "#3498DB",
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 3,
  },
  pagination: {
    bottom: -10,
  },
  jobDetails: {
    marginVertical: 16,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoLabel: {
    fontSize: 18,
    color: "#999",
    flex: 1,
    fontFamily: "sans-serif-condensed",
    fontWeight: "bold",
  },
  infoLabelD: {
    fontSize: 16,
    color: "#555",
    flex: 1,
    fontFamily: "sans-serif-condensed",
    textAlign: "center",
    fontWeight: "bold",
  },
  infoLabelP: {
    fontSize: 18,
    color: "#3498DB",
    flex: 1,
    fontFamily: "sans-serif-condensed",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: "#555",
    fontWeight: "bold",
    textAlign: "right",
    flex: 1,
    fontFamily: "sans-serif-condensed",
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: "100%",
    maxHeight: 200,
    fontFamily: "sans-serif-condensed",
    color: "#888",
  },
  noBidsContainer: {
    borderWidth: 1,
    borderColor: "#e74c3c",
    borderRadius: 5,
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#f9c2c2",
    width: "100%",
  },
  noBidsText: {
    fontSize: 16,
    color: "#e74c3c",
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "sans-serif-condensed",
  },
  bidEndsContainer: {
    borderWidth: 1,
    borderColor: "#e74c3c",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    width: "100%",
    alignItems: "center",
  },
  bidEndsText: {
    fontSize: 16,
    color: "#e74c3c",
    fontFamily: "sans-serif-condensed",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#777",
    padding: 10,
    marginVertical: 8,
    borderRadius: 5,
    fontFamily: "sans-serif-condensed",
  },
  submitButton: {
    backgroundColor: "#3498DB",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    marginTop: 20,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "sans-serif-condensed",
  },
  editButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "sans-serif-condensed",
    fontSize: 16,
  },
});
