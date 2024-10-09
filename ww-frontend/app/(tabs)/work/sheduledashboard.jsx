// import React from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
// import { useNavigation } from '@react-navigation/native'; // Import navigation hook

// const Dashboard = () => {
//   const navigation = useNavigation(); // Access navigation

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Dashboard</Text>

//       {/* First Row: Available, Unavailable Days */}
//       <View style={styles.cardRow}>
//         <TouchableOpacity 
//           style={styles.card} 
//           onPress={() => navigation.navigate('availabledays')} // Navigate to the available days screen
//         >
//           <Text style={styles.cardNumber}>15</Text>
//           <Text style={styles.cardText}>Available Days</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={styles.card} 
//           onPress={() => navigation.navigate('UnavailableDaysScreen')} // Navigate to the unavailable days screen
//         >
//           <Text style={styles.cardNumber}>3</Text>
//           <Text style={styles.cardText}>Unavailable Days</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Second Row: Scheduled, Rescheduled Works */}
//       <View style={styles.cardRow}>
//         <TouchableOpacity 
//           style={styles.card} 
//           onPress={() => navigation.navigate('sheduledworks')} // Navigate to scheduled works screen
//         >
//           <Text style={styles.cardNumber}>15</Text>
//           <Text style={styles.cardText}>Scheduled Works</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={styles.card} 
//           onPress={() => navigation.navigate('RescheduledWorksScreen')} // Navigate to rescheduled works screen
//         >
//           <Text style={styles.cardNumber}>5</Text>
//           <Text style={styles.cardText}>Rescheduled Works</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Third Row: Completed, Canceled Works */}
//       <View style={styles.cardRow}>
//         <TouchableOpacity 
//           style={styles.card} 
//           onPress={() => navigation.navigate('CompletedWorksScreen')} // Navigate to completed works screen
//         >
//           <Text style={styles.cardNumber}>20</Text>
//           <Text style={styles.cardText}>Completed Works</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={styles.card} 
//           onPress={() => navigation.navigate('CanceledWorksScreen')} // Navigate to canceled works screen
//         >
//           <Text style={styles.cardNumber}>2</Text>
//           <Text style={styles.cardText}>Canceled Works</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Upcoming Works Section */}
//       <Text style={styles.sectionTitle}>Next Upcoming Works</Text>

//       {/* Work Cards */}
//       <View style={styles.workCard}>
//         <Image source={{uri: 'https://via.placeholder.com/150'}} style={styles.workImage} />
//         <View style={styles.workDetails}>
//           <Text style={styles.workTitle}>Job with Client A</Text>
//           <Text style={styles.workTime}>Scheduled for 10:00 AM</Text>
//           <TouchableOpacity 
//             style={styles.rescheduleButton} 
//             onPress={() => navigation.navigate('RescheduleWorkScreen', { client: 'Client A' })} // Navigate to reschedule work screen
//           >
//             <Text style={styles.rescheduleButtonText}>Reschedule</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       <View style={styles.workCard}>
//         <Image source={{uri: 'https://via.placeholder.com/150'}} style={styles.workImage} />
//         <View style={styles.workDetails}>
//           <Text style={styles.workTitle}>Job with Client B</Text>
//           <Text style={styles.workTime}>Scheduled for 11:30 AM</Text>
//           <TouchableOpacity 
//             style={styles.rescheduleButton} 
//             onPress={() => navigation.navigate('RescheduleWorkScreen', { client: 'Client B' })} // Navigate to reschedule work screen
//           >
//             <Text style={styles.rescheduleButtonText}>Reschedule</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     paddingHorizontal: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#3498DB',
//     marginVertical: 20,
//     textAlign: 'center',
//   },
//   cardRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 15,
//   },
//   card: {
//     backgroundColor: '#f8f8f8',
//     borderRadius: 10,
//     padding: 20,
//     width: '48%',
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//     elevation: 3,
//   },
//   cardNumber: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#3498DB',
//     marginBottom: 10,
//   },
//   cardText: {
//     fontSize: 16,
//     color: '#333',
//     textAlign: 'center',
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#3498DB',
//     marginVertical: 10,
//   },
//   workCard: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 2,
//   },
//   workImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 10,
//     marginRight: 15,
//   },
//   workDetails: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   workTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 5,
//   },
//   workTime: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 10,
//   },
//   rescheduleButton: {
//     backgroundColor: '#3498DB',
//     paddingVertical: 8,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//   },
//   rescheduleButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// });

// export default Dashboard;


import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Import vector icons

const Dashboard = () => {
  const navigation = useNavigation(); // Access navigation

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
          onPress={() => navigation.navigate('UnavailableDaysScreen')} // Navigate to the unavailable days screen
        >
          <Ionicons name="calendar-number" size={24} color="#3498DB" style={styles.icon} />
          <Text style={styles.cardText}>Calander View</Text>
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
          onPress={() => navigation.navigate('RescheduledWorksScreen')} // Navigate to rescheduled works screen
        >
          <Ionicons name="refresh-circle" size={24} color="#3498DB" style={styles.icon} />
          <Text style={styles.cardText}>Rescheduled Works</Text>
        </TouchableOpacity>
      </View>

      {/* Third Row: Completed, Canceled Works */}
      <View style={styles.cardRow}>
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('CompletedWorksScreen')} // Navigate to completed works screen
        >
          <Ionicons name="checkmark-circle" size={24} color="#3498DB" style={styles.icon} />
          <Text style={styles.cardText}>Completed Works</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('CanceledWorksScreen')} // Navigate to canceled works screen
        >
          <Ionicons name="close-circle" size={24} color="#3498DB" style={styles.icon} />
          <Text style={styles.cardText}>Canceled Works</Text>
        </TouchableOpacity>
      </View>

      {/* Upcoming Works Section */}
      <Text style={styles.sectionTitle}>Next Upcoming Works</Text>

      {/* Work Cards */}
      <View style={styles.workCard}>
        <Ionicons name="briefcase-outline" size={24} color="#3498DB" />
        <View style={styles.workDetails}>
          <Text style={styles.workTitle}>Job with Client A</Text>
          <Text style={styles.workTime}>Scheduled for 10:00 AM</Text>
          <TouchableOpacity 
            style={styles.rescheduleButton} 
            onPress={() => navigation.navigate('RescheduleWorkScreen', { client: 'Client A' })} // Navigate to reschedule work screen
          >
            <Text style={styles.rescheduleButtonText}>Reschedule</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.workCard}>
        <Ionicons name="briefcase-outline" size={24} color="#3498DB" />
        <View style={styles.workDetails}>
          <Text style={styles.workTitle}>Job with Client B</Text>
          <Text style={styles.workTime}>Scheduled for 11:30 AM</Text>
          <TouchableOpacity 
            style={styles.rescheduleButton} 
            onPress={() => navigation.navigate('RescheduleWorkScreen', { client: 'Client B' })} // Navigate to reschedule work screen
          >
            <Text style={styles.rescheduleButtonText}>Reschedule</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    backgroundColor: '#f8f8f8',
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
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
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
    backgroundColor: '#fff',
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
  workTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  workTime: {
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
