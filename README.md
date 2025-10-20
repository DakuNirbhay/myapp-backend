# UoN Event Platform – Backend (Auth)

Simple Node/Express API with MongoDB Memory Server (no install required).

## Endpoints
- `POST /api/register` → body: `{ "name", "email", "password" }`
- `POST /api/login`    → body: `{ "email", "password" }`
- `GET  /health`       → returns `{ "ok": true }`

## How to run
```bash
npm install
node server.js
