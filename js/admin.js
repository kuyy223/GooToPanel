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
  getDocs,
  query,
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* =========================
   PROTEKSI HALAMAN ADMIN
========================= */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {
    const userRef = doc(
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

    if (data.role !== "admin") {
      alert("Akses ditolak.");
      window.location.href =
        "dashboard.html";
      return;
    }

    console.log(
      "Admin login:",
      data
    );

    const adminName =
      document.getElementById(
        "adminName"
      );

    if (adminName) {
      adminName.textContent =
        data.name ||
        "Administrator";
    }

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

    await loadDashboard();

  } catch (error) {
    console.error(error);

    alert(
      error.message +
      "\n" +
      error.stack
    );
  }
});

/* =========================
   LOAD DASHBOARD
========================= */
async function loadDashboard() {
  await loadTotalUsers();
  await loadTotalOrders();
  await loadTotalBalance();
  await loadTotalIncome();
  await loadRecentActivity();
}

/* =========================
   TOTAL USER
========================= */
async function loadTotalUsers() {
  try {
    const snapshot =
      await getDocs(
        collection(db, "users")
      );

    const el =
      document.getElementById(
        "totalUsers"
      );

    if (el) {
      el.textContent =
        snapshot.size;
    }
  } catch (error) {
    console.error(error);
  }
}

/* =========================
   TOTAL ORDER
========================= */
async function loadTotalOrders() {
  try {
    const snapshot =
      await getDocs(
        collection(db, "orders")
      );

    const el =
      document.getElementById(
        "totalOrders"
      );

    if (el) {
      el.textContent =
        snapshot.size;
    }
  } catch (error) {
    console.error(error);
  }
}

/* =========================
   TOTAL SALDO
========================= */
async function loadTotalBalance() {
  try {
    const snapshot =
      await getDocs(
        collection(db, "users")
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
  } catch (error) {
    console.error(error);
  }
}

/* =========================
   TOTAL PENDAPATAN
========================= */
async function loadTotalIncome() {
  try {
    const snapshot =
      await getDocs(
        collection(db, "orders")
      );

    let total = 0;

    snapshot.forEach((doc) => {
      const data =
        doc.data();

      if (
        data.status ===
        "Completed"
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
  } catch (error) {
    console.error(error);
  }
}

/* =========================
   AKTIVITAS TERBARU
========================= */
async function loadRecentActivity() {
  try {
    const recentBox =
      document.querySelector(
        ".recent"
      );

    if (!recentBox) return;

    const q = query(
      collection(db, "orders"),
      orderBy(
        "createdAt",
        "desc"
      ),
      limit(5)
    );

    const snapshot =
      await getDocs(q);

    if (snapshot.empty) {
      return;
    }

    recentBox.innerHTML =
      `
      <h3>Aktivitas Terbaru</h3>
      <div id="activityList"></div>
      `;

    const activityList =
      document.getElementById(
        "activityList"
      );

    snapshot.forEach((doc) => {
      const data =
        doc.data();

      const item =
        document.createElement(
          "div"
        );

      item.className =
        "activity-item";

      item.innerHTML =
        `
        <p>
          Order
          <b>${data.serviceName}</b>
        </p>

        <small>
          Target:
          ${data.target}
        </small>

        <br>

        <small>
          Status:
          ${data.status}
        </small>
        `;

      activityList.appendChild(
        item
      );
    });

  } catch (error) {
    console.error(error);
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

/* =========================
   LOGOUT
========================= */
const logoutBtn =
  document.getElementById(
    "logoutBtn"
  );

if (logoutBtn) {
  logoutBtn.addEventListener(
    "click",
    async () => {
      const keluar =
        confirm(
          "Yakin ingin logout?"
        );

      if (!keluar) return;

      try {
        await signOut(auth);
        window.location.href =
          "login.html";
      } catch (error) {
        console.error(error);
      }
    }
  );
}
