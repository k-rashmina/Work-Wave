import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getStorage } from "firebase/storage"; // Import getStorage for Firebase Storage
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwbPNjdmQv-aKtF2C-onCWCl3OhS7QRIY",
  authDomain: "work-wave-app.firebaseapp.com",
  projectId: "work-wave-app",
  storageBucket: "work-wave-app.appspot.com",
  messagingSenderId: "327029689028",
  appId: "1:327029689028:web:31c81a416417a23e495791",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firebase Storage
export const storage = getStorage(app);
