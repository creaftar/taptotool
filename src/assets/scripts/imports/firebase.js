import { initializeApp, getApps } from "@firebase/app";
import { getFirestore } from "@firebase/firestore";

let app;
let db;

if (getApps().length == 0) {
    const firebaseConfig = {
        apiKey: "AIzaSyCLObeCp3fH9X0QwATy79rMPNCIEMaq-b0",
        authDomain: "taptotool.firebaseapp.com",
        projectId: "taptotool",
        storageBucket: "taptotool.firebasestorage.app",
        messagingSenderId: "568799969829",
        appId: "1:568799969829:web:6c159f50d9c2388ad3f5cc"
    };
      
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
}

export { db };