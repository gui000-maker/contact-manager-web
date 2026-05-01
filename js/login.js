const showRegister = document.getElementById("show-register");
const showLogin = document.getElementById("show-login");
const registerSection = document.getElementById("register-section");
const loginSection = document.getElementById("login-section");

showRegister.addEventListener("click", (e) => {
  e.preventDefault();
  loginSection.classList.add("hidden");
  registerSection.classList.remove("hidden");
});

showLogin.addEventListener("click", (e) => {
  e.preventDefault();
  loginSection.classList.remove("hidden");
  registerSection.classList.add("hidden");
});
