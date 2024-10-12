import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For rating icons

const { width } = Dimensions.get("window");

const serviceProviders = [
  {
    id: 1,
    name: "Aron Jayathilaka",
    category: "Electrical Job Category",
    location: "Hanwella, Colombo",
    rating: 4.9,
    reviews: 102,
    price: "LKR 400/h",
    image: require("../../assets/provider1.png"),
  },
  {
    id: 2,
    name: "Kamal Perera",
    category: "Plumbing Job Category",
    location: "Kottawa, Colombo",
    rating: 4.8,
    reviews: 92,
    price: "LKR 500/h",
    image: require("../../assets/provider2.png"),
  },
  {
    id: 3,
    name: "Nimal Silva",
    category: "Mason Job Category",
    location: "Kaduwela, Colombo",
    rating: 4.7,
    reviews: 98,
    price: "LKR 450/h",
    image: require("../../assets/provider3.png"),
  },
  {
    id: 4,
    name: "Sunil Perera",
    category: "Painting Job Category",
    location: "Malabe, Colombo",
    rating: 4.6,
    reviews: 85,
    price: "LKR 550/h",
    image: require("../../assets/provider4.png"),
  },
];

const ServiceProviderCard = ({ provider }) => (
  <TouchableOpacity style={styles.card}>
    {/* Left Aligned Image */}
    <Image source={provider.image} style={styles.image} />
    {/* Right Aligned Info */}
    <View style={styles.info}>
      <Text style={styles.name}>{provider.name}</Text>
      <Text style={styles.details}>{provider.category}</Text>
      <Text style={styles.details}>{provider.location}</Text>
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={16} color="#f1c40f" />
        <Text style={styles.ratingText}>{provider.rating}</Text>
        <Text style={styles.reviewsText}>({provider.reviews} reviews)</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const PopularServiceProviders = () => {
  return (
    <View>
      {/* Header Section */}
      <Text style={styles.heading}>Popular Service Providers</Text>

      {/* Service Provider Cards with Pagination */}
      <FlatList
        data={serviceProviders}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ServiceProviderCard provider={item} />}
        pagingEnabled // Enable swiping pagination
        showsHorizontalScrollIndicator={true}
        snapToInterval={width * 0.95} // Adjust card snapping for smoother swipe
        decelerationRate="fast" // Faster swipe experience
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // Header styles
  heading: {
    fontSize: 24,
    marginTop: 20,
    marginBottom: 15,
    fontWeight: "bold",
    color: "#3498DB",
    fontFamily: "sans-serif-condensed",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginRight: 15,
    width: width * 0.85,
    borderWidth: 2,
    borderColor: "#3498DB",
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 10,
  },
  info: {
    marginLeft: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  details: {
    fontSize: 14,
    color: "#888",
    fontWeight: "bold",
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: "bold",
    color: "#f1c40f",
  },
  reviewsText: {
    marginLeft: 5,
    fontSize: 12,
    color: "gray",
  },
});

export default PopularServiceProviders;
