import {
  showError,
  hideError,
  showLoading,
  showToast,
  getFriendlyError,
} from "./ui.js";
import { request } from "./api.js";
import { logout, isLoggedIn } from "./auth.js";

if (!isLoggedIn()) {
  window.location.href = "/pages/login.html";
}

const logoutBtn = document.getElementById("logout-btn");
const contactForm = document.getElementById("contact-form");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const resetBtn = document.getElementById("reset-btn");
const contactsList = document.getElementById("contacts-list");

document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("input", () => {
    hideError("form-error");
    hideError("contacts-error");
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
    await loadContacts();
  } catch (err) {
    showError("form-error", getFriendlyError(err));
  }
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchContacts(searchInput.value.trim());
  }
});

searchBtn.addEventListener("click", () => {
  searchContacts(searchInput.value.trim());
});

resetBtn.addEventListener("click", () => {
  searchInput.value = "";
  loadContacts();
});

async function searchContacts(name) {
  try {
    showLoading(true);
    const data = await request(
      `/contacts/search?name=${encodeURIComponent(name)}`,
    );
    renderContacts(data.content);
  } catch (err) {
    showError("contacts-error", getFriendlyError(err));
  } finally {
    showLoading(false);
  }
}

function renderContacts(contacts = []) {
  contactsList.innerHTML = "";
  if (contacts.length === 0) {
    contactsList.innerHTML = "<p>No contacts found.</p>";
    return;
  }
  contacts.forEach((contact) => {
    const contactEl = document.createElement("div");
    contactEl.className = "contact";
    contactEl.innerHTML = `
      <h3>${contact.name}</h3>
      <p>Age: ${contact.age}</p>
      <p>Email: ${contact.email}</p>
      <p>Phone: ${contact.phoneNumber}</p>
    `;
    contactsList.appendChild(contactEl);
  });
}

async function loadContacts() {
  try {
    showLoading(true);
    const data = await request("/contacts");
    renderContacts(data.content);
  } catch (err) {
    showError("contacts-error", getFriendlyError(err));
  } finally {
    showLoading(false);
  }
}

// Initialize page
loadContacts();
