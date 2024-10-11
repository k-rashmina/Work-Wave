import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Import vector icons
import axios from 'axios'; // Import axios
import ip from '../../../ipAddress'; 
import { auth } from "../../../firebaseConfig";
import PopupButton from "../../components/asiri/calanderbutton";

const Dashboard = () => {
  const navigation = useNavigation(); // Access navigation
  const [works, setWorks] = useState([]); // State to store works
  const [loading, setLoading] = useState(true); // State to manage loading

  const email = auth.currentUser.email;

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const response = await axios.get(`http://${ip}:5000/shedule/get-sorted-data/${email}`);
        setWorks(response.data); // Set works data
        // console.log(response.data);
      } catch (error) {
        console.error('Error fetching works:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchWorks(); // Fetch works when component mounts

    // Set interval for real-time fetch
    const intervalId = setInterval(fetchWorks, 1000); // Fetch every 10 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const handleReschedule = async (work) => {
    try {
      const requestData = {
        assignmentId: work._id,
        workerId: work.workerId,
      };
      await axios.put(`http://${ip}:5000/shedule/reschedule-worker`, requestData);
      // You can also handle success response here, like showing a message or updating the state
    } catch (error) {
      console.error('Error rescheduling work:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Upcoming Works Section */}
      <Text style={styles.sectionTitle}>On Going Tasks</Text>
     
      {/* First Row: Available, Unavailable Days */}
      <View style={styles.cardRow}>
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('availabledays')} // Navigate to the available days screen
        >
          <Ionicons name="calendar" size={24} color="#3498DB" style={styles.icon} />
          <Text style={styles.cardText}>Available Days</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('earnedpoints')} // Navigate to the unavailable days screen
        >
          <Ionicons name="pricetags" size={24} color="#3498DB" style={styles.icon} />
          <Text style={styles.cardText}>Earned Points</Text>
        </TouchableOpacity>
      </View>

      {/* Second Row: Scheduled, Rescheduled Works */}
      <View style={styles.cardRow}>
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('sheduledworks')} // Navigate to scheduled works screen
        >
          <Ionicons name="briefcase" size={24} color="#3498DB" style={styles.icon} />
          <Text style={styles.cardText}>Scheduled Works</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('shedulecancel')} // Navigate to rescheduled works screen
        >
          <Ionicons name="refresh-circle" size={24} color="#3498DB" style={styles.icon} />
          <Text style={styles.cardText}>Rescheduled Works</Text>
        </TouchableOpacity>
      </View>

      {/* Upcoming Works Section */}
      <Text style={styles.sectionTitle}>Next Upcoming Works</Text>
      <PopupButton />
      {/* Loading Indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#3498DB" />
      ) : (
        works.map((work) => (
          <View key={work.assignmentId} style={styles.workCard}>
            <Ionicons name="briefcase-outline" size={24} color="#3498DB" />
            <View style={styles.workDetails}>
              <Text style={styles.workName}>Customer: {work.jobOwner.firstName} {work.jobOwner.lastName}</Text>
              <Text style={styles.workAddress}>Location: {work.jobOwner.address}</Text>
              <Text style={styles.workMobile}>Mobile: {work.jobOwner.telephone}</Text>
              <Text style={styles.workDate}>Date: {new Date(work.assignedDate).toDateString()}</Text>
              <TouchableOpacity 
                style={styles.rescheduleButton} 
                onPress={() => handleReschedule(work)} // Reschedule work
              >
                <Text style={styles.rescheduleButtonText}>Reschedule</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498DB',
    marginVertical: 20,
    textAlign: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#f0f8ff', // Changed card background color for better visibility
    borderRadius: 10,
    paddingVertical: 30,
    paddingHorizontal: 15,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    position: 'relative',
  },
  cardText: {
    fontSize: 16,
    color: '#666', // Changed text color to white for contrast
    textAlign: 'center',
    marginTop: 10,
    fontWeight:'bold'
  },
  icon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3498DB',
    marginVertical: 10,
  },
  workCard: {
    flexDirection: 'row',
    backgroundColor: '#f0f8ff', // Light background color for work cards
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  workDetails: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 15,
  },
  workName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  workAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  workMobile: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  workDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  rescheduleButton: {
    backgroundColor: '#3498DB',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  rescheduleButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Dashboard;
