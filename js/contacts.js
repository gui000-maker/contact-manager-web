import {
  showError,
  hideError,
  showLoading,
  showToast,
  getFriendlyError,
} from './ui.js';
import { request } from './api.js';
import { logout, isLoggedIn } from './auth.js';

const logoutBtn = document.getElementById('logout-btn');
const contactForm = document.getElementById('contact-form');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const resetBtn = document.getElementById('reset-btn');
const contactsList = document.getElementById('contacts-list');

let contacts = [];

if (!isLoggedIn()) {
  window.location.href = '/pages/login.html';
}

document.querySelectorAll('input').forEach((input) => {
  input.addEventListener('input', () => {
    hideError('form-error');
    hideError('contacts-error');
  });
});

logoutBtn.addEventListener('click', async () => {
  await logout();
});

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(contactForm);
  const contact = {
    name: formData.get('name'),
    age: Number(formData.get('age')),
    email: formData.get('email'),
    phoneNumber: formData.get('phoneNumber'),
  };

  try {
    await request('/contacts', {
      method: 'POST',
      body: JSON.stringify(contact),
    });
    showToast('Contact added successfully!');
    contactForm.reset();
    loadContacts();
  } catch (err) {
    showError('form-error', getFriendlyError(err));
  }
});

searchBtn.addEventListener('click', () => {
  loadContacts(searchInput.value.trim());
});

resetBtn.addEventListener('click', () => {
  searchInput.value = '';
  loadContacts();
});

async function loadContacts(searchTerm = '') {
  showLoading(true);
  contactsList.innerHTML = '';
  hideError('contacts-error');

  try {
    const allContacts = await request('/contacts');
    contacts = Array.isArray(allContacts) ? allContacts : [];

    const filteredContacts = searchTerm
      ? contacts.filter((contact) =>
          contact.name?.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : contacts;

    if (!filteredContacts.length) {
      contactsList.innerHTML = '<p>No contacts found.</p>';
      return;
    }

    contactsList.innerHTML = filteredContacts
      .map(
        (contact) => `
          <div class='contact-card'>
            <div><strong>Name:</strong> ${contact.name || ''}</div>
            <div><strong>Age:</strong> ${contact.age || ''}</div>
            <div><strong>Email:</strong> ${contact.email || ''}</div>
            <div><strong>Phone:</strong> ${contact.phoneNumber || ''}</div>
          </div>`,
      )
      .join('');
  } catch (err) {
    showError('contacts-error', getFriendlyError(err));
  } finally {
    showLoading(false);
  }
}

loadContacts();
