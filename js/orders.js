import {
  auth,
  db
} from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  getDoc
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const table =
  document.getElementById(
    "ordersTable"
  );

onAuthStateChanged(
  auth,
  async (user) => {

    if (!user) {
      location.href =
        "login.html";
      return;
    }

    const userSnap =
      await getDoc(
        doc(
          db,
          "users",
          user.uid
        )
      );

    if (
      !userSnap.exists()
    ) {
      await signOut(auth);

      location.href =
        "login.html";

      return;
    }

    const data =
      userSnap.data();

    if (
      data.role !== "admin"
    ) {
      location.href =
        "dashboard.html";

      return;
    }

    loadOrders();
  }
);

function loadOrders() {

  onSnapshot(
    collection(
      db,
      "orders"
    ),
    (snapshot) => {

      table.innerHTML = "";

      snapshot.forEach(
        (docSnap) => {

          const data =
            docSnap.data();

          table.innerHTML += `
          <tr>
            <td>
              ${data.serviceName}
            </td>

            <td>
              ${data.target}
            </td>

            <td>
              ${data.quantity}
            </td>

            <td>
              Rp${Number(
                data.totalPrice
              ).toLocaleString(
                "id-ID"
              )}
            </td>

            <td>
              ${data.status}
            </td>

            <td>

              ${
                data.status ===
                "Pending"
                ?
                `
                <button
                  class="confirm-btn"
                  onclick="
                    confirmOrder(
                      '${docSnap.id}'
                    )
                  ">
                  Konfirmasi
                </button>

                <button
                  class="cancel-btn"
                  onclick="
                    rejectOrder(
                      '${docSnap.id}'
                    )
                  ">
                  Tolak
                </button>
                `
                :
                "-"
              }

            </td>
          </tr>
          `;
        }
      );
    }
  );
}

window.rejectOrder =
async function(id) {

  await updateDoc(
    doc(
      db,
      "orders",
      id
    ),
    {
      status:
        "Cancelled"
    }
  );
};

window.confirmOrder =
async function(id) {

  alert(
    "Tahap berikutnya:\nMengirim order ke IndosMM."
  );
};
