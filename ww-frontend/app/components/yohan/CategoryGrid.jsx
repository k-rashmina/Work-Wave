import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

// Define the categories with their respective icons
const categories = [
  { name: "Electrical", icon: require("../../assets/electrical.png") },
  { name: "Plumbing", icon: require("../../assets/plumbing.png") },
  { name: "Mason", icon: require("../../assets/mason.png") },
  { name: "Painting", icon: require("../../assets/painting.png") },
  { name: "Roofing", icon: require("../../assets/roofing.png") },
  { name: "Gardening", icon: require("../../assets/gardening.png") },
  { name: "Cleaning", icon: require("../../assets/cleaning.png") },
  { name: "Washing", icon: require("../../assets/washing.png") },
];

const CategoryGrid = () => {
  return (
    <View style={styles.container}>
      {/* Header Section with 'Job Categories' and 'See All' */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Job Categories</Text>
        <Text style={styles.seeAllText}>See All</Text>
      </View>

      {/* Categories Grid */}
      <FlatList
        data={categories}
        numColumns={4}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.categoryContainer}>
            <View style={styles.categoryItem}>
              <Image source={item.icon} style={styles.categoryIcon} />
            </View>
            <Text style={styles.categoryText}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
};

// Define the styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between", // Align 'Job Categories' and 'See All'
    alignItems: "center",
    marginBottom: 5,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold", // Higher font weight
    color: "#3498DB", // Color for header text
    fontFamily: "sans-serif-condensed", // Use sans-serif-condensed
  },
  seeAllText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3498DB",
    fontFamily: "sans-serif-condensed",
  },
  categoryContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 10,
  },
  categoryItem: {
    width: 75,
    height: 75,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(52, 152, 219, 0.1)",
  },
  categoryIcon: {
    width: 38,
    height: 38,
  },
  categoryText: {
    marginTop: 5,
    fontSize: 14,
    fontFamily: "sans-serif-condensed",
    color: "#888",
    fontWeight: "bold",
  },
});

export default CategoryGrid;
