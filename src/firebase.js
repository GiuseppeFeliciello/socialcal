import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB0UeG4J8byv5zyPtnG2VAyQlcZ_J64zNs",
  authDomain: "socialcal-e2742.firebaseapp.com",
  databaseURL: "https://socialcal-e2742-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "socialcal-e2742",
  storageBucket: "socialcal-e2742.firebasestorage.app",
  messagingSenderId: "1010428316266",
  appId: "1:1010428316266:web:99ea8e64b28e1b4dfd1813"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
