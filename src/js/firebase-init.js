// src/js/firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
// Optional: import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyBp4rdQb5XtYnHUsAXmC3MMAf49c5a3z5c",
  authDomain: "mingunidreamland.firebaseapp.com",
  projectId: "mingunidreamland",
  storageBucket: "mingunidreamland.firebasestorage.app",
  messagingSenderId: "179111115251",
  appId: "1:179111115251:web:f48d9ef6234eee63d67a86",
  measurementId: "G-9XMYE0M6BN"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
