import { auth, db } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// LOGIN EMAIL
window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Lengkapi email dan password.");
    return;
  }

  try {
    const userCredential =
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

    const uid = userCredential.user.uid;

    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();

      if (data.role === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "dashboard.html";
      }
    } else {
      alert("Data user tidak ditemukan.");
    }
  } catch (err) {
    alert(err.message);
  }
};

// LOGIN GOOGLE
window.googleLogin = async function () {
  try {
    const provider = new GoogleAuthProvider();

    const result =
      await signInWithPopup(auth, provider);

    const uid = result.user.uid;

    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();

      if (data.role === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "dashboard.html";
      }
    } else {
      alert(
        "Akun Google belum terdaftar."
      );
    }
  } catch (err) {
    alert(err.message);
  }
};

// login.js

window.login = async function() {
  alert("Tombol login diklik");
};