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
  getDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* =========================
   PROTEKSI HALAMAN ADMIN
========================= */
onAuthStateChanged(
  auth,
  async (user) => {
    if (!user) {
      window.location.href =
        "login.html";
      return;
    }

    try {
      const userRef =
        doc(
          db,
          "users",
          user.uid
        );

      const userSnap =
        await getDoc(userRef);

      if (!userSnap.exists()) {
        await signOut(auth);

        window.location.href =
          "login.html";
        return;
      }

      const data =
        userSnap.data();

      if (
        data.role !== "admin"
      ) {
        alert(
          "Akses ditolak."
        );

        window.location.href =
          "dashboard.html";
        return;
      }

      console.log(
        "Admin login:",
        data
      );

      /* Tampilkan nama admin */
      const adminName =
        document.getElementById(
          "adminName"
        );

      if (adminName) {
        adminName.textContent =
          data.name ||
          "Administrator";
      }

      /* Tampilkan foto admin */
      const adminPhoto =
        document.getElementById(
          "adminPhoto"
        );

      if (
        adminPhoto &&
        data.photoURL
      ) {
        adminPhoto.src =
          data.photoURL;
      }

      /* Load statistik */
      await loadTotalUsers();
      await loadTotalOrders();
      await loadTotalBalance();
      await loadTotalIncome();

    } catch(error){
  console.error(error);

  alert(
    error.message +
    "\n" +
    error.stack
  );
    }
  }
);

/* =========================
   TOTAL USER
========================= */
async function loadTotalUsers() {
  const snapshot =
    await getDocs(
      collection(
        db,
        "users"
      )
    );

  const el =
    document.getElementById(
      "totalUsers"
    );

  if (el) {
    el.textContent =
      snapshot.size;
  }
}

/* =========================
   TOTAL ORDER
========================= */
async function loadTotalOrders() {
  const snapshot =
    await getDocs(
      collection(
        db,
        "orders"
      )
    );

  const el =
    document.getElementById(
      "totalOrders"
    );

  if (el) {
    el.textContent =
      snapshot.size;
  }
}

/* =========================
   TOTAL SALDO
========================= */
async function loadTotalBalance() {
  const snapshot =
    await getDocs(
      collection(
        db,
        "users"
      )
    );

  let total = 0;

  snapshot.forEach((doc) => {
    const data =
      doc.data();

    total += Number(
      data.balance || 0
    );
  });

  const el =
    document.getElementById(
      "totalBalance"
    );

  if (el) {
    el.textContent =
      "Rp" +
      total.toLocaleString(
        "id-ID"
      );
  }
}

/* =========================
   TOTAL PENDAPATAN
========================= */
async function loadTotalIncome() {
  const snapshot =
    await getDocs(
      collection(
        db,
        "orders"
      )
    );

  let total = 0;

  snapshot.forEach((doc) => {
    const data =
      doc.data();

    if (
      data.status ===
      "completed"
    ) {
      total += Number(
        data.totalPrice || 0
      );
    }
  });

  const el =
    document.getElementById(
      "totalIncome"
    );

  if (el) {
    el.textContent =
      "Rp" +
      total.toLocaleString(
        "id-ID"
      );
  }
}

/* =========================
   SIDEBAR MOBILE
========================= */
const menuBtn =
  document.getElementById(
    "menuBtn"
  );

const sidebar =
  document.querySelector(
    ".sidebar"
  );

const overlay =
  document.getElementById(
    "overlay"
  );

if (
  menuBtn &&
  sidebar &&
  overlay
) {
  menuBtn.addEventListener(
    "click",
    () => {
      sidebar.classList.toggle(
        "show"
      );

      overlay.classList.toggle(
        "show"
      );
    }
  );

  overlay.addEventListener(
    "click",
    () => {
      sidebar.classList.remove(
        "show"
      );

      overlay.classList.remove(
        "show"
      );
    }
  );

  window.addEventListener(
    "resize",
    () => {
      if (
        window.innerWidth >
        768
      ) {
        sidebar.classList.remove(
          "show"
        );

        overlay.classList.remove(
          "show"
        );
      }
    }
  );
}