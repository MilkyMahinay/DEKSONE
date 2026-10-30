const accountForm = document.getElementById("account-form");
const accountMessage = document.getElementById("account-message");
const accountTabs = document.querySelectorAll(".account-tab");
const accountPassword = document.getElementById("account-password");
const accountSubmit = document.querySelector(".account-submit");

let accountMode = "signin";

accountTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    accountMode = tab.dataset.mode;
    accountTabs.forEach(button => {
      const selected = button === tab;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    accountPassword.autocomplete = accountMode === "register" ? "new-password" : "current-password";
    accountSubmit.textContent = accountMode === "register" ? "CREATE ACCOUNT" : "SIGN IN";
    accountMessage.textContent = "";
  });
});

accountForm.addEventListener("submit", event => {
  event.preventDefault();
  if (!accountForm.reportValidity()) return;

  accountMessage.textContent = accountMode === "register"
    ? "Your details are ready. Connect a secure server to finish creating your account."
    : "Your details are ready. Connect a secure server to sign in.";
});
