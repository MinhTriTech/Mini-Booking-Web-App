# Mini Booking Web App (MVP)

## Stack
- Backend: Node.js + Express + SQLite
- Frontend: React + Vite
- Auth: JWT Bearer token

## Features in this phase
- Auth API
  - `POST /register`
  - `POST /login`
- Booking API (require Bearer token)
  - `POST /booking`
  - `GET /booking`
  - `DELETE /booking/:id`
- Frontend pages
  - Login page
  - Register page
  - Booking page
    - Form chọn ngày giờ
    - List booking

## Run app
### 1) Install dependencies
```bash
npm --prefix backend install
npm --prefix frontend install
```

### 2) Start backend
```bash
npm --prefix backend run dev
```
Backend runs at `http://localhost:4000`.

### 3) Start frontend
```bash
npm --prefix frontend run dev
```
Frontend runs at `http://localhost:5173` (or next available port).

## Environment
Backend uses:
- `PORT` (optional, default `4000`)
- `JWT_SECRET` (optional, default `super-secret-key`)

Frontend uses:
- `VITE_API_BASE_URL` (optional, default `http://localhost:4000`)

## API payload examples
### POST /register
```json
{
  "email": "demo@example.com",
  "password": "123456"
}
```

### POST /login
```json
{
  "email": "demo@example.com",
  "password": "123456"
}
```
Response:
```json
{
  "token": "<jwt>",
  "user": {
    "id": 1,
    "email": "demo@example.com"
  }
}
```

### POST /booking
Headers:
- `Authorization: Bearer <jwt>`

Body:
```json
{
  "bookingTime": "2026-03-24T10:30"
}
```

## Notes
- UI intentionally minimal for MVP.
- Booking data is stored in `backend/booking.db`.
