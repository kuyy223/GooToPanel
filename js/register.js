import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

window.register = async function () {
  const name =
    document.getElementById("name").value.trim();

  const email =
    document.getElementById("email").value.trim();

  const password =
    document.getElementById("password").value;

  if (!name || !email || !password) {
    alert("Lengkapi semua data.");
    return;
  }

  try {
    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    const user =
      userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
      role: "member",
      balance: 0,
      totalOrder: 0,
      completedOrder: 0,
      createdAt: serverTimestamp()
    });

    alert("Registrasi berhasil.");

    window.location.href =
      "login.html";

  } catch (error) {
    console.error(error);

    alert(
      "Kode Error : " +
      error.code +
      "\nPesan : " +
      error.message
    );
  }
};