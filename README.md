# Comingle Backend

This backend is an Express + TypeScript server that powers authentication, posts, social graph actions, notifications, chat, subscription flows, moderation, analytics, Socket.IO realtime events, and integrated PeerJS signaling for video/audio calls.

## Stack

- Node.js
- Express 4
- TypeScript
- MongoDB + Mongoose
- Socket.IO
- JWT authentication
- Passport Google OAuth
- Cloudinary upload pipeline
- Nodemailer
- Razorpay and Stripe-related payment dependencies
- PeerJS / `peer` for signaling

## Project Structure

```text
src/
|-- adapters/        # Controllers, repositories, and implementation-facing layers
|-- domain/          # Entities, interfaces, and business-level types
|-- infrastructure/  # Express config, DB, routes, sockets, auth config, utilities
|-- types/           # Shared TS types
|-- userCase/        # Application use cases / business orchestration
`-- index.ts         # App bootstrap entry
```

The structure follows a clean-architecture-inspired separation:

- `domain` describes business concepts
- `userCase` contains use-case level orchestration
- `adapters` connect framework input/output to business logic
- `infrastructure` wires Express, sockets, persistence, auth, and third-party services

## Scripts

```powershell
npm run dev
npm run build
npm run start
npm run eslint:fix
```

## Local Development

### 1. Install dependencies

```powershell
cd D:\Downloads\miscellaneous\BroCamp\Comingle\backend
npm install
```

### 2. Configure `.env`

Expected backend environment variables:

- `PORT`
- `MONGO_URI`
- `MONGO_DEV_URI`
- `FRONTEND_URL`
- `JWT_SECRET`
- `NODE_ENV`
- `GMAIL_ID`
- `APP_PASS`
- `CLOUD_NAME`
- `CD_API_KEY`
- `CD_API_SECREAT`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `RAZORPAY_ID_KEY`
- `RAZORPAY_SECRET_KEY`

Only store real secrets in your local or deployed environment, never in public source control.

### 3. Start the server

```powershell
npm run dev
```

Default local port:

- `http://localhost:5000`

Health check:

- `GET /test`

## Boot Flow

The backend entry point is `src/index.ts`, which loads environment variables and starts the Express server via `expressServer()`.

During startup, the app:

- connects to MongoDB
- creates the Express app and HTTP server
- applies JSON, URL-encoded, cookie, and passport middleware
- ensures admin/demo user bootstrap helpers run
- configures CORS
- mounts PeerJS at `/peerjs`
- mounts `/user` and `/admin` routes
- attaches Socket.IO
- starts listening on the configured port

## API Overview

### User Auth

Main auth endpoints include:

- `POST /user/signup`
- `GET /user/signup`
- `POST /user/signup/verify-otp`
- `POST /user/signup/verify-otp/resend`
- `POST /user/signin`
- `POST /user/logout`
- Google auth and callback routes
- forgot-password and password-reset flows

### Profile and User Data

- `GET /user/profile`
- `GET /user/profile/:username`
- `PATCH /user/profile/update/cover`
- `PATCH /user/profile/update/dp`
- `PATCH /user/profile/update/info`
- change-password OTP routes

### Feed and Posts

- `POST /user/new-post`
- `GET /user/posts/all`
- `GET /user/post/:postId`
- `PATCH /user/post/edit`
- `DELETE /user/post/delete/:postId`
- like/unlike endpoints
- comment add/edit/delete endpoints
- `POST /user/posts/report`

### Follows, Friends, and Notifications

- `GET /user/list-friends/:userId`
- `GET /user/friends/suggestions`
- `POST /user/follow-request`
- `GET /user/follow/status/:requesterId/:recipietnetId`
- `POST /user/follow/accept/:followId/:notificationId`
- `PATCH /user/unfollow`
- `GET /user/notifications`
- `GET /user/search`

### Chat

- `POST /user/chat/access`
- `GET /user/chat/fetch-all`
- `POST /user/chat/new-message`
- `GET /user/chat/:chatId`

### Plans and Premium

- `GET /user/application/plans/`
- `POST /user/rozarpay/create-premium-order`
- `POST /user/rozarpay/premium-order/verify`
- `GET /user/rozarpay/get-key_id`

### Admin

- `POST /admin/signin`
- `GET /admin/users`
- subscription plan create/update/list endpoints
- user block/unblock
- post moderation and report dismissal
- post reaction views
- dashboard analytics

## Realtime and Socket.IO

Socket.IO is configured in `src/infrastructure/config/socket.ts`.

It supports:

- user online presence
- room joins for chat and calls
- realtime notifications
- chat message events
- typing and stop-typing events
- audio/video call signaling
- call rejection and end events
- admin-triggered events such as block/unblock

Examples of event groups in the current server:

- `login`
- `request:onlineUsers`
- `notification`
- `chat:start`
- `message`
- `typeing`
- `stopTypeing`
- `calluser`
- `call:rejcted`
- `call:ended`
- `audio:status`
- `video:status`

## PeerJS Integration

The backend now hosts a PeerJS signaling server directly inside the main HTTP server:

- mount path: `/peerjs`

Why this matters:

- you do not need a separately deployed PeerJS server for signaling
- frontend clients can connect to the same backend domain for REST, sockets, and peer signaling

What it does not replace:

- STUN/TURN infrastructure for harder network conditions

If video/audio calls are unreliable across certain networks, the next improvement is usually adding explicit ICE server configuration.

## CORS and Deployment

The current Express CORS configuration allows specific origins from `src/infrastructure/config/app.ts`.

Before deploying or changing domains:

- update the allowed frontend origins
- ensure the reverse proxy supports WebSockets
- keep `/peerjs` publicly reachable

## Scheduled Jobs

The user routes initialize a post-related cron job:

- `PostCronJob`

If you are debugging background behavior, inspect the cron implementation in the use-case/infrastructure layers and verify the production process remains alive long enough for scheduled work to execute.

## Media and Upload Pipeline

Uploads depend on:

- Multer / related middleware
- Cloudinary storage config
- optional image processing libraries such as `sharp`

If uploads fail:

- verify Cloudinary keys
- inspect request payload size
- confirm route middleware order
- check whether the target endpoint expects multipart input

## Build and Production Run

Compile TypeScript:

```powershell
npm run build
```

Run the built server:

```powershell
npm run start
```

The compiled output is expected under `dist/`.

## Backend Troubleshooting

### Server starts but frontend auth fails

- verify JWT secret
- confirm cookies/credentials are allowed
- verify frontend origin is present in CORS config

### Chat works but notifications or call signaling fail

- inspect Socket.IO room joins
- verify target user IDs used for emits
- check server logs for event payload mismatches

### PeerJS endpoint does not connect

- test `/peerjs`
- verify deployment proxy passes websocket/upgrade traffic
- confirm frontend uses the correct backend URL

### Premium flow errors

- verify Razorpay keys
- inspect callback/verification payloads
- confirm plan documents exist in MongoDB
