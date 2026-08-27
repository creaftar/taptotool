import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: "AIzaSyC3S_v3XTrwKrAAQyHt4DFZ1Hz3LdLoUfk",
  authDomain: "elobetter9595.firebaseapp.com",
  projectId: "elobetter9595",
  storageBucket: "elobetter9595.firebasestorage.app",
  messagingSenderId: "381856521042",
  appId: "1:381856521042:web:5f638166ecefdcb854b88b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);