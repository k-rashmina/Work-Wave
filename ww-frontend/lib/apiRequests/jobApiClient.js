import ip from "../../ipAddress";
import { auth } from "../../firebaseConfig";
import axios from "axios";
import { Alert } from "react-native";

const PORT = 5000;
const BASE_URL = `http://${ip}:${PORT}`;

//get all jobs for a specific job owner
export const getJobsForJobOwner = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      const email = user.email;
      const response = await axios.get(`${BASE_URL}/job/jo/${email}`);
      if (response.status === 200) {
        return response.data;
      } else {
        console.log("Error getting jobs for job owner");
      }
    } else {
      console.log("No user found");
      return [];
    }
  } catch (error) {
    console.log("Error getting jobs for job owner: ", error.response.data);
    return error.response.data;
  }
};

//accept a specific bidder's bid amount and reject all other bidders' bids
export const acceptBidForJob = async (jobId, bidderId) => {
  try {
    const response = await axios.put(`${BASE_URL}/job/jo/accept`, {
      jobId,
      bidderId,
    });
    if (response.status === 200) {
      Alert.alert("Success", "Bid accepted successfully!");
      return response.data;
    } else {
      Alert.alert("Error", "Could not accept bid. Please try again.");
      console.log("Error accepting bid for job");
    }
  } catch (error) {
    console.log("Error accepting bid for job: ", error.response.data);
    return error.response.data;
  }
};

//get all pending jobs for a specific service provider
export const getPendingJobsForServiceProvider = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      const email = user.email;
      const response = await axios.get(`${BASE_URL}/job/jsp/pending/${email}`);
      if (response.status === 200) {
        return response.data;
      } else {
        console.log("Error getting pending jobs for service provider");
      }
    } else {
      console.log("No user found");
      return [];
    }
  } catch (error) {
    console.log(
      "Error getting pending jobs for service provider: ",
      error.response.data
    );
    return error.response.data;
  }
};

//update bidder's bid amount, bid description
export const updateBidForJob = async (jobId, bidAmount, bidDescription) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const email = user.email;
      const response = await axios.put(`${BASE_URL}/job/jsp/${email}`, {
        jobId,
        bidAmount,
        bidDescription,
      });
      if (response.status === 200) {
        Alert.alert("Success", "Bid updated successfully!");
        return response.data;
      } else {
        Alert.alert("Error", "Could not update bid. Please try again.");
        console.log("Error updating bid for job");
      }
    } else {
      console.log("No user found");
      return [];
    }
  } catch (error) {
    console.log("Error updating bid for job: ", error.response.data);
    return error.response.data;
  }
};

//get all jobs for a specific service provider
export const getJobsForServiceProvider = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      const email = user.email;
      const response = await axios.get(`${BASE_URL}/job/jsp/${email}`);
      if (response.status === 200) {
        return response.data;
      } else {
        console.log("Error getting jobs for service provider");
      }
    } else {
      console.log("No user found");
      return [];
    }
  } catch (error) {
    console.log(
      "Error getting jobs for service provider: ",
      error.response.data
    );
    return error.response.data;
  }
};

//get all accepted jobs for a specific service provider
export const getAcceptedJobsForServiceProvider = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      const email = user.email;
      const response = await axios.get(`${BASE_URL}/job/jsp/accepted/${email}`);
      if (response.status === 200) {
        return response.data;
      } else {
        console.log("Error getting accepted jobs for service provider");
      }
    } else {
      console.log("No user found");
      return [];
    }
  } catch (error) {
    console.log(
      "Error getting accepted jobs for service provider: ",
      error.response.data
    );
    return error.response.data;
  }
};

module.exports = {
  getJobsForJobOwner,
  acceptBidForJob,
  getPendingJobsForServiceProvider,
  updateBidForJob,
  getJobsForServiceProvider,
  getAcceptedJobsForServiceProvider,
};
