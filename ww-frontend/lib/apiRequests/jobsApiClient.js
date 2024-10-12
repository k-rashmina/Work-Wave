import ip from "../../ipAddress";
import { auth } from "../../firebaseConfig";
import axios from "axios";
import { Alert } from "react-native";

const PORT = 5000;
const BASE_URL = `http://${ip}:${PORT}`;

export const getNearbyWorkers = async (cusDetails) => {
  try {
    if (cusDetails) {
      cusDetails = JSON.stringify(cusDetails);
      const response = await axios.get(
        `${BASE_URL}/job/nearbyworkers?cusDetails=${cusDetails}`
      );
      return response.data;
    } else {
      console.log("No cusDetails");
      return false;
    }
  } catch (error) {
    console.log("Error getting nearby workers: ", error.response.data);
    return error.response.data;
  }
};

module.exports = {
  getNearbyWorkers,
};
