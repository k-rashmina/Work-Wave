import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { app } from "../../firebaseConfig";

const auth = getAuth(app);

export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await AsyncStorage.setItem("userToken", userCredential.user.uid);
  } catch (error) {
    console.log(error.message);
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    await AsyncStorage.setItem("userToken", userCredential.user.uid);
  } catch (error) {
    console.log(error.message);
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    await AsyncStorage.removeItem("userToken").then(console.log("logged out"));
  } catch (error) {
    console.log(error.message);
  }
};
