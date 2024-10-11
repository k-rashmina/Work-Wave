import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";

import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';




const Pay = () => {
  return (
    <View style={styles.container}>

      {/* <Text style={styles.title}>Dashboard</Text> */}

      {/* Row 1 with two cards */}
      <View style={styles.cardRow}>
        <TouchableOpacity style={styles.card}>
          <Ionicons name="calendar" size={36} color="#3498DB" style={styles.icon} />
          <Text style={styles.cardText}>Work Shedules</Text>
          <Link href="/work/sheduledashboard" style={styles.cardLink}>Go to Dashboard</Link>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Ionicons name="cash" size={36} color="#3498DB" style={styles.icon} />
          <Text style={styles.cardText}>Bid System</Text>
          <Link href="/payments" style={styles.cardLink}>Go to View</Link>
        </TouchableOpacity>
      </View>

      {/* Row 2 with two cards */}
      <View style={styles.cardRow}>
        <TouchableOpacity style={styles.card}>
          <Ionicons name="briefcase" size={36} color="#3498DB" style={styles.icon} />
          <Text style={styles.cardText}>Other</Text>
          <Link href="/schedule" style={styles.cardLink}>Other</Link>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Ionicons name="settings" size={36} color="#3498DB" style={styles.icon} />
          <Text style={styles.cardText}>Settings</Text>
          <Link href="/settings" style={styles.cardLink}>Go to Settings</Link>
        </TouchableOpacity>
      </View>

      {/* <Text>Work</Text> */}

      {/* <Link href={"/work/availabledays"}>Go to Available Days</Link>
      <Link href={"/work/sheduledashboard"}>Go to Shedule Dashboard</Link>
      <Link href={"/work/availableWorks"}>Go to Available Works</Link>

      <Link href={"/work/sheduledashboard"}>Go to Shedule Dashboard</Link> */}

    </View>
  );
};

export default Pay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3498DB",
    textAlign: "center",
    marginBottom: 20,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#f0f8ff",
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 30,
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  cardLink: {
    color: "#3498DB",
    textDecorationLine: "underline",
  },
  icon: {
    marginBottom: 10,
  },
});
