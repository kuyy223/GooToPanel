import {
  auth,
  db
} from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

onAuthStateChanged(
  auth,
  async (user) => {

    if (!user) {
      window.location.href =
        "login.html";
      return;
    }

    const userRef =
      doc(
        db,
        "users",
        user.uid
      );

    const userSnap =
      await getDoc(userRef);

    if (!userSnap.exists()) {
      return;
    }

    const data =
      userSnap.data();

    if (
      data.role === "admin"
    ) {
      window.location.href =
        "admin.html";
    } else {
      window.location.href =
        "dashboard.html";
    }
  }
);