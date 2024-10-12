import ip from "../../ipAddress";
import { auth } from "../../firebaseConfig";
import axios from "axios";
import { Alert } from "react-native";

const PORT = 5000;
const BASE_URL = `http://${ip}:${PORT}`;

// Create a new user
export const createUser = async (userDetails) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/user/cusCreate`,
      userDetails
    );
    if (response.status === 200) {
      Alert.alert("Success", "Signup successful!");
    } else {
      Alert.alert("Error", "Signup failed. Please try again.");
    }
    return response.data;
  } catch (error) {
    console.error("Error signing up:", error);
    Alert.alert(
      "Error",
      "An error occurred during signup. Please try again later."
    );
  }
};

// Get user details
export const getUser = async () => {
  const user = auth.currentUser;
  try {
    if (user) {
      const email = user.email;
      const response = await axios.get(`${BASE_URL}/user/cusRead/${email}`);
      return response.data;
    } else {
      console.log("No user found");
      return [];
    }
  } catch (error) {
    console.log("Error getting user: ", error.response.data);
    return error.response.data;
  }
};

//Update user details
export const updateUser = async (userDetails) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const email = user.email;
      const response = await axios.put(`${BASE_URL}/user/cusUpdate/${email}`, {
        userDetails,
      });
      return response.data;
    }
  } catch (error) {
    console.log("Error updating user: ", error.response.data);
    return error.response.data;
  }
};

// Delete user
export const deleteUser = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      const email = user.email;
      const response = await axios.delete(
        `${BASE_URL}/user/cusDelete/${email}`
      );
      return response.data;
    } else {
      console.log("No user found");
      return [];
    }
  } catch (error) {
    console.log("Error deleting user: ", error.response.data);
    return error.response.data;
  }
};

//get all users
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/user/getAll`);
    return response.data;
  } catch (error) {
    console.log("Error getting users: ", error.response.data);
    return error.response.data;
  }
};

// Get user id give the email
export const getUserId = async () => {
  const user = auth.currentUser;
  try {
    if (user) {
      const email = user.email;
      const response = await axios.get(`${BASE_URL}/user/getcusid/${email}`);
      return response.data;
    } else {
      console.log("No user found");
      return false;
    }
  } catch (error) {
    console.log("Error getting user: ", error.response.data);
    return error.response.data;
  }
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserId,
};
