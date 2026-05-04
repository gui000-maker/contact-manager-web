import { login, register } from "./auth.js";
import { showError, hideError, showToast, getFriendlyError } from "./ui.js";

const showRegister = document.getElementById("show-register");
const showLogin = document.getElementById("show-login");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const registerSection = document.getElementById("register-section");
const loginSection = document.getElementById("login-section");

document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("input", () => {
    hideError("login-error");
    hideError("register-error");
  });
});

showRegister.addEventListener("click", (e) => {
  e.preventDefault();
  loginSection.classList.add("hidden");
  registerSection.classList.remove("hidden");
  loginForm.reset();
  hideError("login-error");
  hideError("register-error");
});

showLogin.addEventListener("click", (e) => {
  e.preventDefault();
  loginSection.classList.remove("hidden");
  registerSection.classList.add("hidden");
  registerForm.reset();
  hideError("login-error");
  hideError("register-error");
});

loginForm.addEventListener("submit", async (e) => {
  console.log("Submitting login form");
  e.preventDefault();
  const formData = new FormData(loginForm);
  const username = formData.get("username");
  const password = formData.get("password");
  try {
    await login(username, password);
  } catch (err) {
    showError("login-error", getFriendlyError(err));
  }
});

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(registerForm);
  const username = formData.get("username");
  const password = formData.get("password");
  try {
    await register(username, password);
  } catch (err) {
    showError("register-error", getFriendlyError(err));
  }
});
