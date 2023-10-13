import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA62pIQoytv6qD14tLdbhQV-fXHBY_-AVk",
    authDomain: "house-marketplace-app-8e24a.firebaseapp.com",
    projectId: "house-marketplace-app-8e24a",
    storageBucket: "house-marketplace-app-8e24a.appspot.com",
    messagingSenderId: "1093703010453",
    appId: "1:1093703010453:web:d2a312fd64dcbdebd3f39c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore()