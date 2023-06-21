// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getDatabase} from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBP9aGT_jVoElT8jSxzA9SIA0dirqmKOew",
    authDomain: "animdle.firebaseapp.com",
    databaseURL: "https://animdle-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "animdle",
    storageBucket: "animdle.appspot.com",
    messagingSenderId: "302796057185",
    appId: "1:302796057185:web:7a72d13225efeba5881820",
    measurementId: "G-4SKVJVCM0N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

export default firebaseConfig;
