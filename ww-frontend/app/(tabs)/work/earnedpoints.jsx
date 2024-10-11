import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, View, Text, ScrollView, StyleSheet, Alert, Dimensions, RefreshControl } from 'react-native';
import axios from 'axios';
import { auth } from '../../../firebaseConfig'; // Firebase Auth for email
import ip from '../../../ipAddress'; // Your backend IP address
import { useFocusEffect } from '@react-navigation/native'; // For triggering fetch on screen focus

const UserRatingAndReviews = () => {
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // For pull-to-refresh

  const email = auth.currentUser.email;

  const fetchRatingAndReviews = async () => {
    try {
      const response = await axios.get(`http://${ip}:5000/user/cusRead/${email}`);
      const { rating, reviews } = response.data;

      // Filter out null reviews
      const filteredReviews = reviews.filter((review) => review !== null && review !== '');

      setRating(parseFloat(rating).toFixed(1)); // Ensure the rating is displayed with one decimal place
      setReviews(filteredReviews);
    } catch (error) {
      console.error('Error fetching rating and reviews:', error);
      Alert.alert('Error', 'Failed to load rating and reviews.');
    } finally {
      setLoading(false);
      setRefreshing(false); // Stop the refresh indicator
    }
  };

  // Use useFocusEffect to refetch data when the screen is focused
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchRatingAndReviews();
    }, [])
  );

  // Pull-to-refresh function
  const onRefresh = () => {
    setRefreshing(true);
    fetchRatingAndReviews();
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Main card for rating */}
          <View style={styles.mainCard}>
            <Text style={styles.ratingText}>{rating}</Text>
            <Text style={styles.ratingHeading}>YOUR CURRENT RATING</Text>
          </View>

          <Text style={styles.reviewHeading}>CUSTOMER REVIEWS</Text>

          {/* Review cards */}
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <View key={index} style={styles.reviewCard}>
                <Text style={styles.reviewText}>{review}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noReviewsText}>No reviews available.</Text>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  mainCard: {
    backgroundColor: '#3498DB',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    width: Dimensions.get('window').width - 32,
  },
  ratingText: {
    fontSize: 60,
    color: '#fff',
    fontWeight: 'bold',
  },
  ratingHeading: {
    fontSize: 25,
    color: '#fff',
    marginTop: 10,
  },
  reviewHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reviewCard: {
    backgroundColor: '#3498DB',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: Dimensions.get('window').width - 32,
  },
  reviewText: {
    fontSize: 16,
    color: '#fff',
  },
  noReviewsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default UserRatingAndReviews;
