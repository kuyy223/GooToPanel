// =====================================
// GOOToPANEL MAIN SCRIPT
// =====================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    initNavbar();
    initPasswordToggle();
    initLoading();
    initSearchTable();
    initModal();
    initCounter();
    initOrderCalculator();
    initAutoAlert();

  }
);

// =====================================
// NAVBAR HIDE ON SCROLL
// =====================================

function initNavbar(){

  const navbar =
  document.querySelector(".navbar");

  if(!navbar) return;

  let lastScroll = 0;

  window.addEventListener(
    "scroll",
    () => {

      const current =
      window.pageYOffset;

      if(current <= 0){
        navbar.classList.remove("hide");
        return;
      }

      if(current > lastScroll){
        navbar.classList.add("hide");
      }else{
        navbar.classList.remove("hide");
      }

      lastScroll = current;

    }
  );

}

// =====================================
// TOGGLE PASSWORD
// =====================================

function initPasswordToggle(){

  const password =
  document.getElementById("password");

  const confirm =
  document.getElementById(
    "confirmPassword"
  );

  const togglePassword =
  document.getElementById(
    "togglePassword"
  );

  const toggleConfirm =
  document.getElementById(
    "toggleConfirmPassword"
  );

  if(togglePassword && password){

    togglePassword.onclick =
    function(){

      if(password.type === "password"){
        password.type = "text";
        this.classList.remove("fa-eye");
        this.classList.add("fa-eye-slash");
      }else{
        password.type = "password";
        this.classList.remove("fa-eye-slash");
        this.classList.add("fa-eye");
      }

    };

  }

  if(toggleConfirm && confirm){

    toggleConfirm.onclick =
    function(){

      if(confirm.type === "password"){
        confirm.type = "text";
        this.classList.remove("fa-eye");
        this.classList.add("fa-eye-slash");
      }else{
        confirm.type = "password";
        this.classList.remove("fa-eye-slash");
        this.classList.add("fa-eye");
      }

    };

  }

}

// =====================================
// LOADING SCREEN
// =====================================

function initLoading(){

  const forms =
  document.querySelectorAll("form");

  forms.forEach(form => {

    form.addEventListener(
      "submit",
      () => {

        const loading =
        document.getElementById(
          "loading"
        );

        if(loading){
          loading.classList.add(
            "show"
          );
        }

      }
    );

  });

}

// =====================================
// FORMAT RUPIAH
// =====================================

function formatRupiah(number){

  return "Rp " +
  Number(number)
  .toLocaleString("id-ID");

}

// =====================================
// ORDER CALCULATOR
// =====================================

function initOrderCalculator(){

  const jumlah =
  document.getElementById(
    "jumlah"
  );

  const harga =
  document.getElementById(
    "harga"
  );

  const total =
  document.getElementById(
    "total"
  );

  if(
    !jumlah ||
    !harga ||
    !total
  ) return;

  function hitung(){

    const h =
    Number(harga.value);

    const j =
    Number(jumlah.value);

    total.innerText =
    formatRupiah(h * j);

  }

  jumlah.addEventListener(
    "input",
    hitung
  );

  harga.addEventListener(
    "input",
    hitung
  );

}

// =====================================
// SEARCH TABLE
// =====================================

function initSearchTable(){

  const search =
  document.getElementById(
    "searchInput"
  );

  const table =
  document.getElementById(
    "tableBody"
  );

  if(!search || !table)
    return;

  search.addEventListener(
    "keyup",
    function(){

      const value =
      this.value
      .toLowerCase();

      const rows =
      table.querySelectorAll("tr");

      rows.forEach(row => {

        const text =
        row.innerText
        .toLowerCase();

        row.style.display =
        text.includes(value)
        ? ""
        : "none";

      });

    }
  );

}

// =====================================
// MODAL
// =====================================

function initModal(){

  const buttons =
  document.querySelectorAll(
    "[data-modal]"
  );

  buttons.forEach(btn => {

    btn.onclick = () => {

      const id =
      btn.dataset.modal;

      const modal =
      document.getElementById(
        id
      );

      if(modal){
        modal.classList.add(
          "show"
        );
      }

    };

  });

  document
  .querySelectorAll(
    ".modal-close"
  )
  .forEach(btn => {

    btn.onclick =
    function(){

      this.closest(".modal")
      .classList.remove("show");

    };

  });

}

// =====================================
// ALERT
// =====================================

function showAlert(
  message,
  type = "success"
){

  const alert =
  document.createElement("div");

  alert.className =
  "alert alert-" + type;

  alert.innerText =
  message;

  document.body.appendChild(
    alert
  );

  setTimeout(() => {
    alert.remove();
  },3000);

}

// =====================================
// AUTO CLOSE ALERT
// =====================================

function initAutoAlert(){

  const alert =
  document.querySelector(
    ".alert"
  );

  if(!alert) return;

  setTimeout(() => {
    alert.remove();
  },3000);

}

// =====================================
// COUNTER ANIMATION
// =====================================

function initCounter(){

  const counters =
  document.querySelectorAll(
    ".counter"
  );

  counters.forEach(counter => {

    const target =
    Number(
      counter.dataset.target
    );

    let value = 0;

    const interval =
    setInterval(() => {

      value +=
      Math.ceil(target / 50);

      if(value >= target){
        value = target;
        clearInterval(
          interval
        );
      }

      counter.innerText =
      value.toLocaleString(
        "id-ID"
      );

    },20);

  });

}

// =====================================
// COPY RECEIPT
// =====================================

window.copyReceipt =
function(id){

  const text =
  document.getElementById(
    id
  ).innerText;

  navigator.clipboard
  .writeText(text);

  showAlert(
    "Berhasil disalin"
  );

};

// =====================================
// PRINT RECEIPT
// =====================================

window.printReceipt =
function(){

  window.print();

};

// =====================================
// LOGOUT
// =====================================

window.logout =
function(){

  localStorage.clear();

  sessionStorage.clear();

  location.href =
  "login.html";

};

// =====================================
// SCROLL TOP
// =====================================

window.scrollTop =
function(){

  window.scrollTo({
    top:0,
    behavior:"smooth"
  });

};

// =====================================
// DEPOSIT SIMULATOR
// =====================================

window.topupSaldo =
function(){

  showAlert(
    "Permintaan deposit dikirim."
  );

};

// =====================================
// ORDER SUCCESS
// =====================================

window.orderSuccess =
function(){

  showAlert(
    "Order berhasil dibuat."
  );

};