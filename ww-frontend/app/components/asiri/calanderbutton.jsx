
import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, PanResponder, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ensure Ionicons is installed
import CalendarPopupComponent from './calander'; // Adjust the path

const { width, height } = Dimensions.get('window'); // Get device dimensions for boundaries

const PopupButton = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  // Animated value for tracking the position
  const pan = useRef(new Animated.ValueXY()).current;

  // Show the date picker modal
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  // Hide the date picker modal
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  // Handle the date selection
  const handleConfirm = (date) => {
    console.log("Selected Date: ", date);
    hideDatePicker();
  };

  // Create a PanResponder to handle dragging with boundaries
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true, // Activate when the user touches the button
      onPanResponderGrant: () => {
        // Reset pan values when dragging starts
        pan.setValue({ x: 0, y: 0 });
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: (e, gestureState) => {
        // Prevent dragging outside screen boundaries
        let newX = gestureState.dx + pan.x._offset;
        let newY = gestureState.dy + pan.y._offset;

        // Boundaries to prevent the button from going off-screen
        if (newX < 0) newX = 0;
        if (newY < 0) newY = 0;
        if (newX > width - 60) newX = width - 60; // 60 is the width/height of the button
        if (newY > height - 60) newY = height - 60;

        pan.setValue({ x: newX, y: newY });
      },
      onPanResponderRelease: () => {
        // Flatten the offset after dragging ends (to reset the position reference)
        pan.flattenOffset();
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      {/* Draggable Calendar Icon Button */}
      <Animated.View
        style={[styles.floatingButton, { transform: [{ translateX: pan.x }, { translateY: pan.y }], zIndex: 9999 }]}
        {...panResponder.panHandlers} // Attach the panHandlers
      >
        <TouchableOpacity onPress={showDatePicker} style={styles.touchableArea}>
          <Ionicons name="calendar" size={28} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      {/* Calendar Popup (pass visibility and handlers as props) */}
      <CalendarPopupComponent
        isVisible={isDatePickerVisible}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingButton: {
    position: 'absolute', // Absolute positioning to enable floating
    bottom: -1,           // Initial position (you can tweak this)
    right: 5,           // Initial position
    backgroundColor: '#3498DB', // Background color of the button
    borderRadius: 30,     // Make the button circular
    width: 60,            // Size of the button
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',  // Shadow for the button
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,         // Shadow for Android
    zIndex: 9999,         // Ensure the button stays on top
  },
  touchableArea: {
    padding: 10,          // Increase the touchable area
  },
});

export default PopupButton;

