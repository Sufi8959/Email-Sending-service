# Resilient Email Sending Service (Node.js)

A robust email delivery service built with Node.js using mock email providers. It includes retry logic, fallback mechanism, idempotency, rate limiting, status tracking, and a clean modular architecture.

---

## Features

- Retry mechanism with exponential backoff
- Fallback between providers
- Idempotency support
- Basic in-memory rate limiting
- Status tracking
- Unified error/response handling
- Simple logger

---

## Project Structure

```
project-root/
├── routes/                  # API route handlers
│   └── email.route.js
├── services/                # Core email sending logic
│   └── EmailService.js
├── providers/              # Mock email providers
│   ├── MockProvider1.js
│   └── MockProvider2.js
├── store/                  # In-memory idempotency + status tracker
│   └── inMemoryStore.js
├── utils/                  # Reusable utilities
│   ├── ApiError.js
│   ├── ApiResponse.js
│   ├── asyncHandler.js
│   └── logger.js
├── src/                    # App entrypoint
│   └── index.js
├── index.js                # Root entrypoint (optional)
└── package.json
```

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-repo/email-service.git
cd email-service
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the server

```bash
npm run dev
```

Server runs on `http://localhost:3000`

---

## API Endpoint

### `POST /api/v1/email/send`

### `GET /api/v1/email/get`

### `GET /api/v1/email/demo`

#### Request Body

```json
{
  "to": "test@example.com",
  "subject": "Welcome!",
  "body": "Thanks for signing up."
}
```

> ✅ You don’t need to provide `id` — it’s auto-generated on server

#### Success Response

```json
{
  "statusCode": 200,
  "message": "Email sent successfully"
}
```

#### Error Responses

| Code | Reason                | Message                            |
| ---- | --------------------- | ---------------------------------- |
| 400  | Missing fields        | All fields are required            |
| 429  | Rate limit exceeded   | Rate limit exceeded. Try again.    |
| 500  | Both providers failed | All providers failed to send email |

---

## Test Cases

### Success Scenario

- Email sent successfully on first provider
- Status: `sent`

### Retry Scenario

- First 1–2 attempts fail, next retry succeeds
- Status: `sent`

### Fallback Scenario

- Primary provider fails after all retries
- Fallback provider succeeds
- Status: `sent`

### All Providers Fail

- Both providers fail all retries
- Status: `failed`

### Duplicate Request (Idempotency)

- Sending same email again returns: `Email already sent`
- Status: `sent`

### Rate Limiting

- More than 5 requests in 1 minute
- resets afer every 60 seconds
- Status: `rate-limited`, returns 429

---

## Configuration

You can tweak these values in `email.service.js`:

```js
const MAX_RETRIES = 3; // number of retries per provider
const RATE_LIMIT = 5; // max emails per minute
```

You can also modify mock provider success rates:

```js
const success = Math.random() > 0.3; // 70% success rate
```

---

## Assumptions

- Mock providers are used instead of real services
- In-memory store is used for simplicity (resets on server restart)
- `uuid` package is used to auto-generate unique email IDs
- Not production-ready for distributed systems (no Redis or DB yet)

---

## Future Improvements

- [ ] Replace mock providers with real SMTP (e.g., SendGrid, Mailgun)
- [ ] Add `/status/:id` route
- [ ] Use Redis for distributed rate limiting + job queue (e.g., BullMQ)
- [ ] Add persistent database (MongoDB/Postgres)

---

## Author

Built with Sufiyaan Mansoori
