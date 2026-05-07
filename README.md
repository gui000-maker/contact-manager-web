# Contact Manager Web

Frontend for the [Contact Manager API](https://github.com/gui000-maker/contact-manager-api) — built with vanilla HTML, CSS, and JavaScript.

## Features

- JWT authentication — login and register
- Refresh token support — silent token renewal
- Contact CRUD — add, edit, and delete contacts
- Search contacts by name
- Paginated contact list
- Responsive design

## Tech Stack

- HTML5
- CSS3
- JavaScript (ES Modules)
- Fetch API

## Getting Started

### Requirements

- [Contact Manager API](https://github.com/gui000-maker/contact-manager-api) running on `http://localhost:8080`
- A local server (e.g. VS Code Live Server)

### Run

1. Clone the repo:
```bash
git clone https://github.com/gui000-maker/contact-manager-web.git
cd contact-manager-web
```

2. Start the API — follow the instructions in the [API repo](https://github.com/gui000-maker/contact-manager-api)

3. Open `index.html` with Live Server in VS Code

4. Visit `http://127.0.0.1:5500`

## Project Structure

```
contact-manager-web/
├── pages/
│   ├── login.html        — login and register
│   └── contacts.html     — contacts list, add, edit, search
├── js/
│   ├── api.js            — fetch wrapper, token handling, refresh logic
│   ├── auth.js           — login, register, logout, token storage
│   ├── contacts.js       — contacts CRUD, search, pagination
│   ├── login.js          — login page logic
│   ├── ui.js             — shared helpers (toast, error, loading)
│   └── config.js         — API base URL
├── css/
│   ├── login.css
│   └── contacts.css
├── index.html            — redirects to login or contacts
├── .prettierrc
├── .gitignore
└── LICENSE
```

## Configuration

Set your API base URL in `js/config.js`:

```javascript
const CONFIG = {
  BASE_URL: 'http://localhost:8080'
};
```

## License

MIT
