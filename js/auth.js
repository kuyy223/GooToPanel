import {
  auth,
  db,
  googleProvider
} from "./firebase.js";

import {
  signInWithEmailAndPassword,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

console.log("auth.js berhasil dimuat");

/* =========================
   FUNGSI REDIRECT ROLE
========================= */
function redirectByRole(role) {
  if (role === "admin") {
    window.location.href = "admin.html";
  } else {
    window.location.href =
      "dashboard.html";
  }
}

/* =========================
   LOGIN EMAIL
========================= */
const loginForm =
  document.getElementById(
    "loginForm"
  );

if (loginForm) {
  loginForm.addEventListener(
    "submit",
    async (e) => {
      e.preventDefault();

      const email =
        document
          .getElementById("email")
          .value
          .trim();

      const password =
        document
          .getElementById("password")
          .value;

      const loading =
        document.getElementById(
          "loading"
        );

      try {
        loading?.classList.add(
          "show"
        );

        const userCredential =
          await signInWithEmailAndPassword(
            auth,
            email,
            password
          );

        const user =
          userCredential.user;

        const userRef =
          doc(
            db,
            "users",
            user.uid
          );

        const userSnap =
          await getDoc(userRef);

        if (!userSnap.exists()) {
          alert(
            "Data pengguna tidak ditemukan."
          );
          return;
        }

        const userData =
          userSnap.data();

        console.log(
          "Login berhasil:",
          userData
        );

        alert("Login berhasil!");

        redirectByRole(
          userData.role
        );

      } catch (error) {
        console.error(error);

        alert(
          "Kode Error : " +
            error.code +
          "\nPesan : " +
            error.message
        );
      } finally {
        loading?.classList.remove(
          "show"
        );
      }
    }
  );
}

/* =========================
   LOGIN GOOGLE
========================= */
const googleBtn =
  document.getElementById(
    "googleLogin"
  );

if (googleBtn) {
  googleBtn.addEventListener(
    "click",
    async () => {
      const loading =
        document.getElementById(
          "loading"
        );

      try {
        loading?.classList.add(
          "show"
        );

        const result =
          await signInWithPopup(
            auth,
            googleProvider
          );

        const user =
          result.user;

        const userRef =
          doc(
            db,
            "users",
            user.uid
          );

        let userSnap =
          await getDoc(userRef);

        // Buat data member baru
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            name:
              user.displayName ||
              "Member",

            email:
              user.email || "",

            photoURL:
              user.photoURL || "",

            role: "member",

            balance: 0,

            totalOrder: 0,

            completedOrder: 0,

            createdAt:
              serverTimestamp()
          });

          userSnap =
            await getDoc(userRef);
        }

        const userData =
          userSnap.data();

        console.log(
          "Login Google berhasil:",
          userData
        );

        alert(
          "Login Google berhasil!"
        );

        redirectByRole(
          userData.role
        );

      } catch (error) {
        console.error(error);

        alert(
          "Kode Error : " +
            error.code +
          "\nPesan : " +
            error.message
        );
      } finally {
        loading?.classList.remove(
          "show"
        );
      }
    }
  );
}

/* =========================
   SHOW / HIDE PASSWORD
========================= */
const togglePassword =
  document.getElementById(
    "togglePassword"
  );

if (togglePassword) {
  togglePassword.addEventListener(
    "click",
    () => {
      const password =
        document.getElementById(
          "password"
        );

      if (!password) return;

      if (
        password.type ===
        "password"
      ) {
        password.type = "text";

        togglePassword.classList.remove(
          "fa-eye"
        );

        togglePassword.classList.add(
          "fa-eye-slash"
        );
      } else {
        password.type =
          "password";

        togglePassword.classList.remove(
          "fa-eye-slash"
        );

        togglePassword.classList.add(
          "fa-eye"
        );
      }
    }
  );
}

console.log(
  "Auth.js siap digunakan."
);