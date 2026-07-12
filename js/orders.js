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
    collection(db, "orders"),
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
              <select
                class="status-select"
                data-id="${docSnap.id}"
                data-status="${data.status}"
              >
                <option value="Pending">
                  Pending
                </option>

                <option value="Processing">
                  Processing
                </option>

                <option value="Success">
                  Success
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>
              </select>
            </td>
          </tr>
          `;
        }
      );

      document
        .querySelectorAll(
          ".status-select"
        )
        .forEach((select) => {

          select.value =
            select.dataset.status;

          select.addEventListener(
            "change",
            async () => {

              try {
                await updateDoc(
                  doc(
                    db,
                    "orders",
                    select.dataset.id
                  ),
                  {
                    status:
                      select.value
                  }
                );

              } catch (err) {
                console.error(err);

                alert(
                  err.message
                );
              }
            }
          );
        });
    }
  );
            }
