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
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const pageInfo = document.getElementById("page-info");

let currentPage = 0;

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

searchInput.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    searchContacts(searchInput.value.trim());
  }
});

searchBtn.addEventListener("click", async () => {
  searchContacts(searchInput.value.trim());
});

resetBtn.addEventListener("click", async () => {
  searchInput.value = "";
  currentPage = 0;
  await loadContacts();
});

async function searchContacts(name) {
  try {
    showLoading(true);
    const data = await request(
      `/contacts/search?name=${encodeURIComponent(name)}`,
    );
    renderContacts(data.content);
    renderPagination(null);
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

async function loadContacts(page = 0) {
  currentPage = page;
  try {
    showLoading(true);
    const data = await request(`/contacts?page=${page}&size=10`);
    renderContacts(data.content);
    renderPagination(data);
  } catch (err) {
    showError("contacts-error", getFriendlyError(err));
  } finally {
    showLoading(false);
  }
}

function renderPagination(data) {
  if (!data || data.totalPages <= 1) {
    pageInfo.textContent = "";
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
    return;
  }

  prevBtn.style.display = "inline-block";
  nextBtn.style.display = "inline-block";
  pageInfo.textContent = `Page ${data.number + 1} of ${data.totalPages}`;
  prevBtn.disabled = data.first;
  nextBtn.disabled = data.last;
}

prevBtn.addEventListener("click", async () => {
  currentPage--;
  await loadContacts(currentPage);
});

nextBtn.addEventListener("click", async () => {
  currentPage++;
  await loadContacts(currentPage);
});

// Initialize page
loadContacts();
