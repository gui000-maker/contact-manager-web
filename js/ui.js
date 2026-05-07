function showError(elementId, message) {
  const el = document.getElementById(elementId);
  el.textContent = message;
  el.style.display = "block";
}

function hideError(elementId) {
  document.getElementById(elementId).style.display = "none";
}

function showLoading(show = true) {
  document.getElementById("loading").style.display = show ? "block" : "none";
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function getFriendlyError(err) {
  switch (err.status) {
    case 400:
      return "Please check your input and try again.";
    case 401:
      return "Invalid username or password.";
    case 403:
      return "You do not have permission to do this.";
    case 404:
      return "Not found.";
    case 409:
      return "This username is already taken.";
    case 429:
      return "Too many attempts. Please wait 1 minute.";
    case 500:
      return "Server error. Please try again later.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export { showError, hideError, showLoading, showToast, getFriendlyError };
