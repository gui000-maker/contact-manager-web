function showError(elementId, message) {
  const el = document.getElementById(elementId);
  el.textContent = message;
  el.style.display = 'block';
}

function hideError(elementId) {
  document.getElementById(elementId).style.display = 'none';
}

function showLoading(show = true) {
  document.getElementById('loading').style.display = show ? 'block' : 'none';
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function getFriendlyError(message) {
  if (!message) return 'Something went wrong. Please try again.';

  // 400 - validation
  if (message.includes('must be a valid email'))
    return 'Please enter a valid email address.';
  if (message.includes('cannot be empty') || message.includes('must not be blank'))
    return 'Please fill in all required fields.';
  if (message.includes('Name must be at most'))
    return 'Name must be at most 50 characters.';
  if (message.includes('Age must be'))
    return 'Age must be between 0 and 120.';
  if (message.includes('Invalid phone number'))
    return 'Please enter a valid phone number (e.g. +123456789).';

  // 401 - unauthorized
  if (message.includes('Authentication required'))
    return 'Please log in to continue.';
  if (message.includes('Bad credentials') || message.includes('User not found'))
    return 'Invalid username or password.';

  // 403 - forbidden
  if (message.includes('do not have permission'))
    return 'You do not have permission to do this.';

  // 404 - not found
  if (message.includes('Contact not found'))
    return 'Contact not found.';
  if (message.includes('User not found'))
    return 'Account not found.';

  // 409 - conflict
  if (message.includes('Contact already exists'))
    return 'This contact already exists.';
  if (message.includes('Username already') || message.includes('already taken'))
    return 'This username is already taken.';

  // 429 - rate limit
  if (message.includes('Too many login attempts'))
    return 'Too many attempts. Please wait 1 minute.';

  // 500
  if (message.includes('Unexpected server error'))
    return 'Server error. Please try again later.';

  return 'Something went wrong. Please try again.';
}

export { showError, hideError, showLoading, showToast, getFriendlyError };