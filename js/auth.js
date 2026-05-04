import { request } from "./api.js";

async function login(username, password) {
  try {
    const data = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    localStorage.setItem("token", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);
    window.location.href = "/pages/contacts.html";
  } catch (err) {
    throw err; // re-throw so login.js can catch and display it
  }
}

async function register(username, password) {
  try {
    await request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    await login(username, password);
  } catch (err) {
    throw err; // re-throw so login.js can catch and display it
  }
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
