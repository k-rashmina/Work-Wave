import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SearchBar = () => {
  return (
    <View>
      {/* Heading Section for "Discover Job Categories" */}
      <Text style={styles.heading}>
        <Text style={styles.discoverText}>Discover</Text> Job Categories
      </Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color="gray" />
        <TextInput
          style={styles.searchInput}
          placeholder="What do you need done?"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Styles for the Heading Section
  heading: {
    fontSize: 20,
    marginBottom: 5,
    color: "#3498DB",
    fontFamily: "sans-serif-condensed",
  },
  discoverText: {
    fontWeight: "bold",
    color: "#3498DB",
    fontFamily: "sans-serif-condensed",
    fontSize: 24,
  },

  // Styles for the Search Bar
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#3498DB",
    padding: 10,
    borderRadius: 100,
    marginBottom: 10,
    marginTop: 5,
  },
  searchInput: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
    fontFamily: "sans-serif-condensed", // Matching font style
  },
});

export default SearchBar;
