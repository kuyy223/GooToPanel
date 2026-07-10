import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* =========================
   ELEMENT
========================= */
const serviceModal =
  document.getElementById(
    "serviceModal"
  );

const addServiceBtn =
  document.getElementById(
    "addServiceBtn"
  );

const closeModal =
  document.getElementById(
    "closeModal"
  );

const saveService =
  document.getElementById(
    "saveService"
  );

const serviceList =
  document.getElementById(
    "serviceList"
  );

/* =========================
   BUKA MODAL
========================= */
if (addServiceBtn) {
  addServiceBtn.addEventListener(
    "click",
    () => {
      serviceModal.classList.add(
        "show"
      );
    }
  );
}

/* =========================
   TUTUP MODAL
========================= */
if (closeModal) {
  closeModal.addEventListener(
    "click",
    () => {
      serviceModal.classList.remove(
        "show"
      );
    }
  );
}

window.addEventListener(
  "click",
  (e) => {
    if (e.target === serviceModal) {
      serviceModal.classList.remove(
        "show"
      );
    }
  }
);

/* =========================
   LOAD SERVICES
========================= */
async function loadServices() {
  if (!serviceList) return;

  serviceList.innerHTML = `
    <tr>
      <td colspan="7">
        Memuat data...
      </td>
    </tr>
  `;

  try {
    const snapshot =
      await getDocs(
        collection(
          db,
          "services"
        )
      );

    serviceList.innerHTML = "";

    if (snapshot.empty) {
      serviceList.innerHTML = `
        <tr>
          <td colspan="7">
            Belum ada layanan.
          </td>
        </tr>
      `;
      return;
    }

    snapshot.forEach((service) => {
      const data =
        service.data();

      serviceList.innerHTML += `
        <tr>
          <td>${data.name}</td>

          <td>${data.category}</td>

          <td>
            Rp${Number(
              data.price || 0
            ).toLocaleString("id-ID")}
          </td>

          <td>
            ${data.min || 0}
          </td>

          <td>
            ${data.max || 0}
          </td>

          <td>
            ${
              data.status
                ? "Aktif"
                : "Nonaktif"
            }
          </td>

          <td>
            <button
              onclick="deleteService('${service.id}')">
              Hapus
            </button>
          </td>
        </tr>
      `;
    });

  } catch (error) {
    console.error(error);

    serviceList.innerHTML = `
      <tr>
        <td colspan="7">
          Gagal memuat data.
        </td>
      </tr>
    `;
  }
}

/* =========================
   TAMBAH LAYANAN
========================= */
if (saveService) {
  saveService.addEventListener(
    "click",
    async () => {

      const name =
        document.getElementById(
          "serviceName"
        ).value.trim();

      const category =
        document.getElementById(
          "serviceCategory"
        ).value.trim();

      const price =
        Number(
          document.getElementById(
            "servicePrice"
          ).value
        );

      const min =
        Number(
          document.getElementById(
            "serviceMin"
          ).value
        );

      const max =
        Number(
          document.getElementById(
            "serviceMax"
          ).value
        );

      if (
        !name ||
        !category ||
        !price
      ) {
        alert(
          "Lengkapi semua data."
        );
        return;
      }

      try {
        await addDoc(
          collection(
            db,
            "services"
          ),
          {
            name,
            category,
            price,
            min,
            max,
            status: true,
            createdAt:
              serverTimestamp()
          }
        );

        alert(
          "Layanan berhasil ditambahkan."
        );

        document.getElementById(
          "serviceName"
        ).value = "";

        document.getElementById(
          "serviceCategory"
        ).value = "";

        document.getElementById(
          "servicePrice"
        ).value = "";

        document.getElementById(
          "serviceMin"
        ).value = "";

        document.getElementById(
          "serviceMax"
        ).value = "";

        serviceModal.classList.remove(
          "show"
        );

        loadServices();

      } catch (error) {
        console.error(error);

        alert(
          "Gagal menambahkan layanan."
        );
      }
    }
  );
}

/* =========================
   HAPUS LAYANAN
========================= */
window.deleteService =
  async function (id) {

    const yakin =
      confirm(
        "Hapus layanan ini?"
      );

    if (!yakin) return;

    try {
      await deleteDoc(
        doc(
          db,
          "services",
          id
        )
      );

      alert(
        "Layanan berhasil dihapus."
      );

      loadServices();

    } catch (error) {
      console.error(error);

      alert(
        "Gagal menghapus layanan."
      );
    }
  };

/* =========================
   LOAD AWAL
========================= */
loadServices();