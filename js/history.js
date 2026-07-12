import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  loadHistory(user.uid);
});

function loadHistory(uid) {
  const tbody =
    document.getElementById(
      "historyBody"
    );

  if (!tbody) return;

  const q = query(
    collection(db, "orders"),
    where("uid", "==", uid),
    orderBy(
      "createdAt",
      "desc"
    )
  );

  onSnapshot(
    q,
    (snapshot) => {
      tbody.innerHTML = "";

      if (snapshot.empty) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7">
              Belum ada pesanan.
            </td>
          </tr>
        `;
        return;
      }

      snapshot.forEach(
        (docSnap) => {
          const data =
            docSnap.data();

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
              <td>${data.serviceName}</td>
              <td>${data.target}</td>
              <td>${data.quantity}</td>
              <td>
                Rp${Number(
                  data.totalPrice
                ).toLocaleString(
                  "id-ID"
                )}
              </td>
              <td>${data.status}</td>
              <td>${tanggal}</td>
            </tr>
          `;
        }
      );
    },
    (error) => {
  console.error(error);

  alert(
    "Kode: " +
      error.code +
      "\nPesan: " +
      error.message
  );

  tbody.innerHTML = `
    <tr>
      <td colspan="7">
        ${error.message}
      </td>
    </tr>
  `;
    }
  );
}
