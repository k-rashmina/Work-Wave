import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";

import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Pay = () => {
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Dashboard</Text> */}

      {/* Row 1 with two cards */}
      <View style={styles.cardRow}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            router.push("/work/sheduledashboard");
          }}
        >
          <Ionicons
            name="calendar"
            size={36}
            color="#3498DB"
            style={styles.icon}
          />
          <Text style={styles.cardText}>Work Shedules</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            router.push("/work/availableWorks");
          }}
        >
          <Ionicons
            name="search"
            size={36}
            color="#3498DB"
            style={styles.icon}
          />
          <Text style={styles.cardText}>Available Works</Text>
        </TouchableOpacity>
      </View>

      {/* Row 2 with two cards */}
      <View style={styles.cardRow}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            router.push("/work/myBids");
          }}
        >
          <Ionicons
            name="pricetags"
            size={36}
            color="#3498DB"
            style={styles.icon}
          />
          <Text style={styles.cardText}>My Bids</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            router.push("/work/myWorks");
          }}
        >
          <Ionicons
            name="briefcase"
            size={36}
            color="#3498DB"
            style={styles.icon}
          />
          <Text style={styles.cardText}>My Works</Text>
        </TouchableOpacity>
      </View>
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
    fontFamily: "sans-serif-condensed",
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
