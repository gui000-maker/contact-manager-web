import {
  showError,
  hideError,
  showLoading,
  showToast,
  getFriendlyError,
} from "./ui.js";
import { request } from "./api.js";
import { logout, isLoggedIn } from "./auth.js";

// ─── Auth Guard ───────────────────────────────────────────
if (!isLoggedIn()) {
  window.location.href = "/pages/login.html";
}

// ─── DOM Elements ─────────────────────────────────────────
const logoutBtn = document.getElementById("logout-btn");
const contactForm = document.getElementById("contact-form");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const resetBtn = document.getElementById("reset-btn");
const contactsList = document.getElementById("contacts-list");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const pageInfo = document.getElementById("page-info");

// ─── State ────────────────────────────────────────────────
let currentPage = 0;

// ─── Functions ────────────────────────────────────────────
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

async function searchContacts(name) {
  try {
    showLoading(true);
    const data = await request(`/contacts/search?name=${encodeURIComponent(name)}`);
    renderContacts(data.content);
    renderPagination(null);
  } catch (err) {
    showError("contacts-error", getFriendlyError(err));
  } finally {
    showLoading(false);
  }
}

async function editContact(id) {
  try {
    const contact = await request(`/contacts/${id}`);
    document.getElementById("contact-id").value = contact.id;
    document.getElementById("name").value = contact.name;
    document.getElementById("age").value = contact.age;
    document.getElementById("email").value = contact.email || "";
    document.getElementById("phoneNumber").value = contact.phoneNumber || "";
    document.getElementById("form-title").textContent = "Edit contact";
    document.getElementById("submit-btn").textContent = "Save changes";
    document.getElementById("cancel-btn").style.display = "inline-block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    showError("contacts-error", getFriendlyError(err));
  }
}

async function deleteContact(id) {
  if (!confirm("Are you sure you want to delete this contact?")) return;
  try {
    await request(`/contacts/${id}`, { method: "DELETE" });
    showToast("Contact deleted!");
    await loadContacts(currentPage);
  } catch (err) {
    showError("contacts-error", getFriendlyError(err));
  }
}

function resetForm() {
  contactForm.reset();
  document.getElementById("contact-id").value = "";
  document.getElementById("form-title").textContent = "Add contact";
  document.getElementById("submit-btn").textContent = "Add contact";
  document.getElementById("cancel-btn").style.display = "none";
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
      <p>Email: ${contact.email || "—"}</p>
      <p>Phone: ${contact.phoneNumber || "—"}</p>
      <div class="contact-actions">
        <button class="edit-btn" data-id="${contact.id}">Edit</button>
        <button class="delete-btn" data-id="${contact.id}">Delete</button>
      </div>
    `;
    contactsList.appendChild(contactEl);
  });
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

// ─── Event Listeners ──────────────────────────────────────
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
  const contactId = document.getElementById("contact-id").value;
  const formData = new FormData(contactForm);
  const contact = {
    name: formData.get("name"),
    age: Number(formData.get("age")),
    email: formData.get("email"),
    phoneNumber: formData.get("phoneNumber"),
  };
  try {
    if (contactId) {
      await request(`/contacts/${contactId}`, {
        method: "PUT",
        body: JSON.stringify(contact),
      });
      showToast("Contact updated successfully!");
    } else {
      await request("/contacts", {
        method: "POST",
        body: JSON.stringify(contact),
      });
      showToast("Contact added successfully!");
    }
    resetForm();
    await loadContacts(currentPage);
  } catch (err) {
    showError("form-error", getFriendlyError(err));
  }
});

document.getElementById("cancel-btn").addEventListener("click", () => {
  resetForm();
});

contactsList.addEventListener("click", async (e) => {
  const editBtn = e.target.closest(".edit-btn");
  const deleteBtn = e.target.closest(".delete-btn");
  if (editBtn) await editContact(editBtn.dataset.id);
  if (deleteBtn) await deleteContact(deleteBtn.dataset.id);
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchContacts(searchInput.value.trim());
});

searchBtn.addEventListener("click", () => {
  searchContacts(searchInput.value.trim());
});

resetBtn.addEventListener("click", async () => {
  searchInput.value = "";
  currentPage = 0;
  await loadContacts();
});

prevBtn.addEventListener("click", async () => {
  currentPage--;
  await loadContacts(currentPage);
});

nextBtn.addEventListener("click", async () => {
  currentPage++;
  await loadContacts(currentPage);
});

// ─── Initialize ───────────────────────────────────────────
loadContacts(currentPage);