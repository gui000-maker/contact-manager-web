import { request } from "./api.js";

async function login(username, password) {
  const data = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  localStorage.setItem("token", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);
  window.location.href = "/pages/contacts.html";
}

async function register(username, password) {
  if (isLoggedIn()) {
    alert(
      "You are already logged in. Please log out before registering a new account.",
    );
    return;
  }
  await request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  alert("Registration successful! You can now log in.");
}

function isLoggedIn() {
  return !!localStorage.getItem("token");
}

async function logout() {
  try {
    await request("/api/auth/logout", {
      method: "POST",
      body: JSON.stringify({
        refreshToken: localStorage.getItem("refreshToken"),
      }),
    });
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location.href = "/pages/login.html";
  }
}

export { login, register, isLoggedIn, logout };
