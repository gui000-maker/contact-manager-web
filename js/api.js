import config from "./config.js";

async function request(endpoint, options = {}) {
    const token = localStorage.getItem('token');

    const url = `${config.base_url}${endpoint}`;
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ... (token && { 'Authorization': `Bearer ${token}` }),
        },
        ...options,
    });

    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/pages/login.html';
        return;
    }

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An error occurred');
    }

    return response.status === 204 ? null : response.json();
}

export { request };