import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert
} from "react-native";
import axios from "axios";
import ip from "../../../ipAddress";
import { auth } from "../../../firebaseConfig";

const ScheduledWorks = () => {
  const [scheduledWorks, setScheduledWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace this with the actual user's email
  const email = auth.currentUser.email;

  // Fetch assigned dates when component mounts
  useEffect(() => {
    const fetchAssignedDates = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://${ip}:5000/shedule/get-scheduled-dates/${email}`
        );
        setScheduledWorks(response.data); // Assuming the API returns an array of scheduled works
        console.log("Fetched scheduled works:", response.data);
      } catch (err) {
        setError("Error fetching assigned dates");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedDates();
  }, []);

//   const handleReschedule = async (work) => {
//     try {
//       // Prepare the request data with the full work object
//       const requestData = {
//         assignmentId: work._id, // Extracting workId from the work object
//         workerId: work.workerId, // Assuming the work object contains workerId
        
//       };

//       // Call the API to reschedule
//       const response = await axios.put(
//         `http://${ip}:5000/shedule/reschedule-worker`,
//         requestData
//       );

//       // Check response for success or handle accordingly
//       if (response.data.success) {
//         // Optionally update the state or fetch updated works
//         setScheduledWorks((prevWorks) =>
//           prevWorks.map((existingWork) =>
//             existingWork._id === work._id
//               ? {
//                   ...existingWork,
//                   assignedDate: response.data.updatedAssignment.assignedDate,
//                 } // Using updated date from response
//               : existingWork
//           )
//         );
//         alert("Work rescheduled successfully!");
//       } 
//     } catch (err) {
//       console.error("Error rescheduling work:", err);
//       alert("An error occurred while rescheduling the work.");
//     }
//   };



const handleReschedule = async (work) => {
    // Show confirmation dialog
    Alert.alert(
      "Confirm Reschedule",
      "Are you sure you want to reschedule this work?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Reschedule cancelled"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              // Prepare the request data with the full work object
              const requestData = {
                assignmentId: work._id, // Extracting workId from the work object
                workerId: work.workerId, // Assuming the work object contains workerId
              };
  
              // Call the API to reschedule
              const response = await axios.put(
                `http://${ip}:5000/shedule/reschedule-worker`,
                requestData
              );
  
              // Check response for success or handle accordingly
              if (response.data.success) {
                // Optionally update the state or fetch updated works
                setScheduledWorks((prevWorks) =>
                  prevWorks.map((existingWork) =>
                    existingWork._id === work._id
                      ? {
                          ...existingWork,
                          assignedDate: response.data.updatedAssignment.assignedDate,
                        } // Using updated date from response
                      : existingWork
                  )
                );
                alert("Work rescheduled successfully!");
              } 
            } catch (err) {
              console.error("Error rescheduling work:", err);
              alert("An error occurred while rescheduling the work.");
            }
          }
        }
      ],
      { cancelable: false } // Prevents dismissing the alert by tapping outside of it
    );
  };







  // Show loading spinner or error message if applicable
  if (loading) {
    return <ActivityIndicator size="large" color="#3498DB" />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Scheduled Works</Text>

      {scheduledWorks.map((work, index) => (
        <View key={index} style={styles.card}>
          {/* Row 1: Customer Name and Date */}
          <View style={styles.row}>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>{work.name || "John Doe"}</Text>
              <Text style={styles.infoSubtitle}>Customer Name</Text>
              <Text style={styles.infoText}>
                {work.mobile || "+94754538287"}
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
              <Text style={styles.infoTitle}>{work.service || "Plumbing"}</Text>
              <Text style={styles.infoSubtitle}>Service Type</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>
                {work.address || "44, Peterson Ave, Nugegoda"}
              </Text>
              <Text style={styles.infoSubtitle}>Customer Address</Text>
            </View>
          </View>

          {/* Buttons: Cancel and Reschedule */}
          <View style={styles.buttonRow}>
            {/* <TouchableOpacity style={styles.rescheduleButton}>
              <Text style={styles.rescheduleButtonText}>Reschedule Work</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.rescheduleButton}
              onPress={() => handleReschedule(work)} // Pass the entire work object
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3498DB",
    marginBottom: 20,
    textAlign: "center",
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
  cancelButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  rescheduleButton: {
    backgroundColor: "#3498DB",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    width: "100%", // Adjust width to make it look better in the center
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
