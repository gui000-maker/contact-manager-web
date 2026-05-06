import { showError, hideError, showLoading, showToast, getFriendlyError } from "./ui.js";
import { request } from "./api.js";
import { logout, isLoggedIn } from "./auth.js";

const contactForm = document.getElementById("contact-form");
const searchInput = document.getElementById("search-input");
const contactsList = document.getElementById("contacts-list");
const logoutBtn = document.getElementById("logout-btn");

if (!isLoggedIn()) {
  window.location.href = "/pages/login.html";
}

document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("input", () => {
    hideError("form-error");
  });
});

logoutBtn.addEventListener("click", async () => {
  await logout();
});

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(contactForm);
  const contact = {
    name: formData.get("name"),
    age: Number(formData.get("age")),
    email: formData.get("email"),
    phoneNumber: formData.get("phoneNumber"),
  };

  try {
    await request("/contacts", {
      method: "POST",
      body: JSON.stringify(contact),
    });
    showToast("Contact added successfully!");
    contactForm.reset();
  } catch (err) {
    showError("form-error", getFriendlyError(err));
  }
});
