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
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let services = [];

/* =========================
   LOAD SERVICES
========================= */
async function loadServices() {
  const category =
    document.getElementById(
      "category"
    );

  if (!category) return;

  try {
    const snap =
      await getDocs(
        collection(
          db,
          "services"
        )
      );

    services = [];

    category.innerHTML =
      '<option value="">Pilih Kategori</option>';

    const categories =
      new Set();

    snap.forEach((docSnap) => {
      const data =
        docSnap.data();

      if (
        data.status === false
      ) {
        return;
      }

      services.push({
        id: docSnap.id,
        ...data
      });

      categories.add(
        data.category
      );
    });

    categories.forEach(
      (item) => {
        category.innerHTML += `
          <option value="${item}">
            ${item}
          </option>
        `;
      }
    );
  } catch (error) {
    console.error(error);
  }
}

/* =========================
   CEK LOGIN
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

      console.log(
        "Member login:",
        data
      );

      const userName =
        document.getElementById(
          "userName"
        );

      const userEmail =
        document.getElementById(
          "userEmail"
        );

      const userBalance =
        document.getElementById(
          "userBalance"
        );

      const userPhoto =
        document.getElementById(
          "userPhoto"
        );

      if (userName) {
        userName.textContent =
          data.name ||
          "Member";
      }

      if (userEmail) {
        userEmail.textContent =
          data.email ||
          "-";
      }

      if (userBalance) {
        userBalance.textContent =
          "Rp" +
          Number(
            data.balance || 0
          ).toLocaleString(
            "id-ID"
          );
      }

      if (
        userPhoto &&
        data.photoURL
      ) {
        userPhoto.src =
          data.photoURL;
      }

      await loadServices();

    } catch (error) {
      console.error(error);

      alert(
        error.message
      );
    }
  }
);

/* =========================
   PILIH KATEGORI
========================= */
const category =
  document.getElementById(
    "category"
  );

const service =
  document.getElementById(
    "service"
  );

if (
  category &&
  service
) {
  category.addEventListener(
    "change",
    () => {
      service.innerHTML =
        '<option value="">Pilih Layanan</option>';

      services
        .filter(
          (item) =>
            item.category ===
            category.value
        )
        .forEach((item) => {
          service.innerHTML += `
            <option value="${item.id}">
              ${item.name}
            </option>
          `;
        });
    }
  );
}

/* =========================
   HITUNG HARGA
========================= */
const quantity =
  document.getElementById(
    "quantity"
  );

const totalPrice =
  document.getElementById(
    "totalPrice"
  );

function calculatePrice() {
  const selected =
    services.find(
      (item) =>
        item.id ===
        service.value
    );

  const qty =
    Number(
      quantity.value
    );

  if (
    !selected ||
    !qty
  ) {
    totalPrice.value =
      "Rp0";
    return;
  }

  const total =
    selected.price *
    qty;

  totalPrice.value =
    "Rp" +
    total.toLocaleString(
      "id-ID"
    );
}

if (service) {
  service.addEventListener(
    "change",
    calculatePrice
  );
}

if (quantity) {
  quantity.addEventListener(
    "input",
    calculatePrice
  );
}

/* =========================
   BUAT PESANAN
========================= */
const orderBtn =
  document.getElementById(
    "orderBtn"
  );

if (orderBtn) {
  orderBtn.addEventListener(
    "click",
    async () => {
      try {
        const selected =
          services.find(
            (item) =>
              item.id ===
              service.value
          );

        if (!selected) {
          alert(
            "Pilih layanan terlebih dahulu."
          );
          return;
        }

        const target =
          document
            .getElementById(
              "target"
            )
            .value
            .trim();

        const qty =
          Number(
            quantity.value
          );

        if (
          !target ||
          !qty
        ) {
          alert(
            "Lengkapi data pesanan."
          );
          return;
        }

        if (
          qty < selected.min
        ) {
          alert(
            "Minimal order " +
              selected.min
          );
          return;
        }

        if (
          qty > selected.max
        ) {
          alert(
            "Maksimal order " +
              selected.max
          );
          return;
        }

        const total =
          selected.price *
          qty;

        await addDoc(
          collection(
            db,
            "orders"
          ),
          {
            uid:
              auth.currentUser.uid,

            serviceId:
              selected.id,

            serviceName:
              selected.name,

            category:
              selected.category,

            target:
              target,

            quantity:
              qty,

            price:
              selected.price,

            totalPrice:
              total,

            status:
              "Pending",

            createdAt:
              serverTimestamp()
          }
        );

        try {
  const response =
    await fetch(
      "https://gootopanel-api.tiyovalentino.workers.dev/discord",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          serviceName:
            selected.name,
          target:
            target,
          quantity:
            qty,
          totalPrice:
            total
        })
      }
    );

  const text =
    await response.text();

  alert(
    "Discord Status: " +
      response.status +
      "\n\nResponse:\n" +
      text
  );

} catch (err) {
  alert(
    "Discord Error:\n" +
    err.message
  );

  console.error(
    "Discord webhook error:",
    err
  );
        }

        alert(
          "Pesanan berhasil dibuat."
        );

        document.getElementById(
          "target"
        ).value = "";

        quantity.value = "";

        totalPrice.value =
          "Rp0";

      } catch (error) {
        console.error(error);

        alert(
          error.message
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

        alert(
          error.message
        );
      }
    }
  );
}
