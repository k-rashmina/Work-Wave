import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import axios from "axios";
import ip from "../../../ipAddress";
import { auth } from "../../../firebaseConfig";

const ScheduledWorks = () => {
  const [scheduledWorks, setScheduledWorks] = useState([]);
  const [error, setError] = useState(null);

  const email = auth.currentUser.email;

  // Fetch assigned dates when component mounts
  useEffect(() => {
    const fetchAssignedDates = async () => {
      try {
        const response = await axios.get(
          `http://${ip}:5000/shedule/get-scheduled-dates/${email}`
        );
        setScheduledWorks(response.data); // Assuming the API returns an array of scheduled works
        // console.log("Fetched scheduled works:", response.data);
      } catch (err) {
        setError("Error fetching assigned dates");
      }
    };

    // Initial fetch on component mount
    fetchAssignedDates();

    // Set up an interval to fetch data every 30 seconds
    const intervalId = setInterval(fetchAssignedDates, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const handleReschedule = async (work) => {
    // Show confirmation dialog
    Alert.alert(
      "Confirm Reschedule",
      "Are you sure you want to reschedule this work?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Reschedule cancelled"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              const requestData = {
                assignmentId: work._id,
                workerId: work.workerId,
              };

              const response = await axios.put(
                `http://${ip}:5000/shedule/reschedule-worker`,
                requestData
              );

              if (response.data.success) {
                setScheduledWorks((prevWorks) =>
                  prevWorks.map((existingWork) =>
                    existingWork._id === work._id
                      ? {
                          ...existingWork,
                          assignedDate: response.data.updatedAssignment.assignedDate,
                        }
                      : existingWork
                  )
                );
                alert("Work rescheduled successfully!");
              }
            } catch (err) {
              console.error("Error rescheduling work:", err);
              alert("An error occurred while rescheduling the work.");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  // Show error message if applicable
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {scheduledWorks.map((work, index) => (
        <View key={index} style={styles.card}>
          {/* Row 1: Customer Name and Date */}
          <View style={styles.row}>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>
                {work.jobOwner.firstName + " " + work.jobOwner.lastName}
              </Text>
              <Text style={styles.infoSubtitle}>Customer Name</Text>
              <Text style={styles.infoText}>
                {work.jobOwner.telephone || "+94754538287"}
              </Text>
              <Text style={styles.infoSubtitle}>Mobile Number</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>
                {new Date(work.assignedDate).toDateString()}
              </Text>
              <Text style={styles.infoSubtitle}>Scheduled Date</Text>
            </View>
          </View>

          {/* Row 2: Service Type and Address */}
          <View style={styles.row}>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>
                {work.jobOwner.category || "Plumbing"}
              </Text>
              <Text style={styles.infoSubtitle}>Service Type</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>
                {work.jobOwner.address || "44, Peterson Ave, Nugegoda"}
              </Text>
              <Text style={styles.infoSubtitle}>Customer Address</Text>
            </View>
          </View>

          {/* Buttons: Cancel and Reschedule */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.rescheduleButton}
              onPress={() => handleReschedule(work)}
            >
              <Text style={styles.rescheduleButtonText}>Reschedule Work</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoBox: {
    width: "48%",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  infoSubtitle: {
    fontSize: 12,
    color: "#888",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  rescheduleButton: {
    backgroundColor: "#3498DB",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    width: "100%",
  },
  rescheduleButtonText: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
});

export default ScheduledWorks;

