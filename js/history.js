import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  collection,
  query,
  where,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* =========================
   CEK LOGIN
========================= */
onAuthStateChanged(
  auth,
  (user) => {
    if (!user) {
      window.location.href =
        "login.html";
      return;
    }

    loadHistory(user.uid);
  }
);

/* =========================
   LOAD HISTORY
========================= */
function loadHistory(uid) {
  const tbody =
    document.getElementById(
      "historyBody"
    );

  if (!tbody) return;

  tbody.innerHTML = `
    <tr>
      <td colspan="6">
        Memuat data...
      </td>
    </tr>
  `;

  const q = query(
    collection(db, "orders"),
    where("uid", "==", uid)
  );

  onSnapshot(
    q,

    (snapshot) => {
      tbody.innerHTML = "";

      if (snapshot.empty) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6">
              Belum ada pesanan.
            </td>
          </tr>
        `;
        return;
      }

      const rows = [];

      snapshot.forEach(
        (docSnap) => {
          const data =
            docSnap.data();

          rows.push(data);
        }
      );

      // Urutkan manual berdasarkan tanggal terbaru
      rows.sort(
        (a, b) => {
          const timeA =
            a.createdAt
              ? a.createdAt
                  .toDate()
                  .getTime()
              : 0;

          const timeB =
            b.createdAt
              ? b.createdAt
                  .toDate()
                  .getTime()
              : 0;

          return (
            timeB - timeA
          );
        }
      );

      rows.forEach(
        (data) => {
          let tanggal =
            "-";

          if (
            data.createdAt
          ) {
            tanggal =
              data.createdAt
                .toDate()
                .toLocaleString(
                  "id-ID"
                );
          }

          tbody.innerHTML += `
            <tr>
              <td>
                ${data.serviceName || "-"}
              </td>

              <td>
                ${data.target || "-"}
              </td>

              <td>
                ${data.quantity || 0}
              </td>

              <td>
                Rp${Number(
                  data.totalPrice || 0
                ).toLocaleString(
                  "id-ID"
                )}
              </td>

              <td>
                ${data.status || "Pending"}
              </td>

              <td>
                ${tanggal}
              </td>
            </tr>
          `;
        }
      );
    },

    (error) => {
      console.error(
        "History Error:",
        error
      );

      alert(
        "Kode: " +
          error.code +
          "\nPesan: " +
          error.message
      );

      tbody.innerHTML = `
        <tr>
          <td colspan="6">
            Gagal memuat data.
          </td>
        </tr>
      `;
    }
  );
}
