// Firebase Configuration
// TODO: Replace with your Firebase project credentials
// Get these from: https://console.firebase.google.com

import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDwVSYATGQZlqJiNhgayBHZE6M27OK4zWs",
    authDomain: "sof3081-ae56e.firebaseapp.com",
    projectId: "sof3081-ae56e",
    storageBucket: "sof3081-ae56e.firebasestorage.app",
    messagingSenderId: "1007935364960",
    appId: "1:1007935364960:web:add2dd69945ca41a194805",
    measurementId: "G-230PQ9TXXT"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication
export const auth = getAuth(app)

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider()
