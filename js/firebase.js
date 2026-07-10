import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDb3T8GzMwp81dUQf0KAG0U2Vy4kSEmujs",
  authDomain: "gootopanel.firebaseapp.com",
  databaseURL: "https://gootopanel-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "gootopanel",
  storageBucket: "gootopanel.firebasestorage.app",
  messagingSenderId: "31009605719",
  appId: "1:31009605719:web:4ee341dcdfa66472e3fb12"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();