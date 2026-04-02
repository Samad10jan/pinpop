# pinpop

A Pinterest-style social image pinboard — built with Next.js 16, React 19, TypeScript, GraphQL, and MongoDB.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.19-green?logo=prisma)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen?logo=mongodb)
![GraphQL](https://img.shields.io/badge/GraphQL-Apollo-pink?logo=graphql)

---
# Show Case

| Landing Page | Home Page  |
|---|---|
| <img width="1283" height="824" alt="image" src="https://github.com/user-attachments/assets/ea054feb-4f7f-4edf-bcc4-c28e0abb94a1" /> | <img width="1283" height="824"  alt="image" src="https://github.com/user-attachments/assets/c46a14d8-d0f3-4117-9322-37f749ffaa94" />|

| SignUp Page | SignIn Page|
|---|---|
| <img width="1283" height="824" alt="image" src="https://github.com/user-attachments/assets/fb942acf-7a2e-43d0-86e8-d9a4a72e2d1f" />| <img width="1283" height="824" alt="image" src="https://github.com/user-attachments/assets/c13848e2-db7b-41cd-8989-4b1cdb7a8eca" />|

| Explore Page | Pin Page |
|---|---|
| <img width="1283" height="824" alt="image" src="https://github.com/user-attachments/assets/e26c6af5-7c15-4435-a9ca-37d5fbacdd37" />| <img width="1283" height="824" alt="image" src="https://github.com/user-attachments/assets/90d511fe-5418-4ea8-bcef-f75af27b8bd3" />|

| Tags Pins Page | Search Page |
|---|---|
| <img width="1283" height="824" alt="image" src="https://github.com/user-attachments/assets/7828a39c-3691-4644-894c-7521f1cb004b" />|<img width="1283" height="824" alt="image" src="https://github.com/user-attachments/assets/ca10b7d0-212f-42ce-ab9d-89a0797a03c0" />|

| Create Pin Page | Saved Pins Page |
|---|---|
| <img width="1283" height="824" alt="image" src="https://github.com/user-attachments/assets/29f8153f-7a86-4213-b738-08b9ef2bb80a" />|  <img width="1283" height="824" alt="image" src="https://github.com/user-attachments/assets/1b6a16bd-900a-4764-aa55-6a4a6b642dda" />|

| Current User Profile Page  | Dashboard Page  |
|---|---|
|<img  width="1283" height="824" alt="image" src="https://github.com/user-attachments/assets/f709f4b9-e324-4357-9c4c-b600d1ddc06e" />| <img width="1283" height="824" alt="image" src="https://github.com/user-attachments/assets/7d3d5f93-e46b-4002-bb54-5918c432b6c4" />|



---
## Table of Contents

- [Stack](#stack)
- [Features](#features)
- [Setup](#setup)
- [Project Structure](#project-structure)
- [Auth System](#auth-system)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript 5 |
| Styling | Tailwind CSS 4, Lucide React |
| Backend | Apollo Server 5 + `@as-integrations/next` |
| Database | MongoDB Atlas via Prisma 6 ORM |
| Auth | `jsonwebtoken`, `bcrypt` |
| Media | Cloudinary (upload + CDN) |
| Email | Nodemailer (Gmail) |
| Grid | `masonic` 4 (responsive masonry) |
| GQL Client | `graphql-request` |

---

## Features

**Auth**
- Email OTP signup — 6-digit code, bcrypt-hashed, 5-minute expiry
- Hashed password for security using `bcrypt`
- JWT access tokens (15m) + refresh tokens (7d, stored in DB)
- Automatic token rotation via Next.js middleware (no extra HTTP call)
- Max 2 active sessions per user; oldest deleted on overflow
- httpOnly + secure + sameSite cookies throughout.

**Security**

- Passwords: bcrypt, 10 rounds
- JWTs: signed with separate secrets, short-lived access tokens
- Cookies: httpOnly, secure, sameSite=lax
- Refresh tokens: DB-stored, rotated on every use, invalidated on logout
- OTP: bcrypt-hashed before storage, deleted after use
- Sessions: max 2 per user


**Pins**
- Upload images/GIFs to Cloudinary with title, description, tags
- 20+ predefined tag categories
- Edit/delete with permission checks

**Social**
- Like, save, comment, follow/unfollow
- User profiles with follower/following/likes/upload stats

**Discovery**
- Infinite scroll masonry feed (20 pins/page, Intersection Observer)
- Related pins by tag

---



## Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── signin/page.tsx
│   │   └── signup/page.tsx
│   ├── (main)/                        # Protected by middleware
│   │   ├── page.tsx                   # Feed
│   │   ├── search/page.tsx
│   │   ├── saved/page.tsx
│   │   ├── pin/[pinId]/page.tsx
│   │   ├── tags/[tagId]/page.tsx
│   │   └── (profile-pages)/
│   │       ├── profile/page.tsx
│   │       └── current-profile/page.tsx
│   └── api/
│       ├── graphql/route.ts
│       ├── refreshToken/route.ts
│       └── upload/
│           ├── avatar/route.ts
│           └── pin/route.ts
├── components/
│   ├── buttons/                       # LikeBtn, SaveBtn, FollowBtn, ShareBtn, LogOutBtn
│   ├── cards/                         # PinCard, CommentCard, LoadingCard
│   └── commons/                       # Feed, Header, Sidebar, CommentsArea, useInfinitePins, ...
├── helper/
│   ├── auth.ts                        # JWT sign/verify
│   ├── refersh.ts                     # Token rotation logic
│   ├── context.ts                     # GraphQL context (user from cookie)
│   ├── email.ts                       # OTP + welcome email helpers
│   ├── logout.ts
│   ├── pagination.ts
│   └── ApiError.ts
├── lib/
│   ├── gql/
│   │   ├── typeDefs/typeDefs.ts
│   │   ├── resolvers/                 # auth, pin, comments, user, toggles
│   │   ├── queries/queries.ts
│   │   └── mutations/mutations.ts
│   └── services/                      # prisma, graphql, cloudinary, nodemailer
├── contexts/UserContext.tsx
├── types/types.ts
└── proxy.ts                           # Auth middleware
```

---

## Auth System

### Flow

```
Signup / Login
  ├── signAccess(userId)   → JWT, expires 15m  (JWT_SECRET)
  └── signRefresh(userId)  → JWT, expires 7d   (REFRESH_SECRET)
        ↓
  Store refresh token in RefreshToken DB table
  Set httpOnly, secure, sameSite=lax cookies
  Keep max 5 sessions (delete oldest on overflow)

Request to /main/*  (proxy.ts middleware)
  ├── Access token valid?     → continue
  ├── Access expired?
  │     └── Refresh valid?   → rotate tokens → set new cookies → continue
  └── Both invalid?           → redirect to /
```

### Token Rotation (`refersh.ts`)

On refresh, the middleware directly calls `refreshTokens()` — no HTTP roundtrip:

1. Verify JWT signature against `REFRESH_SECRET`
2. Look up token in `RefreshToken` table
3. Check `expiresAt < new Date()`
4. Atomically delete old + create new record (`prisma.$transaction`)
5. Return new access + refresh pair → set cookies → request continues

### GraphQL Context (`context.ts`)

Every resolver receives `{ user }` from the request cookie — no repeated token verification per resolver:

```
cookie("access") → jwt.verify → prisma.user.findUnique → { user: { id, name, email, avatar, uploadCount } }
```

### OTP Flow

1. `sendSignupOtp` — generate 6-digit code, bcrypt-hash it, store in `EmailVerification` (5m expiry), send plain code via Nodemailer
2. `signup` — verify OTP against stored hash, delete record, create user, issue tokens

---

## Infinite Scroll

**File**: `useInfinitePins.ts`

- `IntersectionObserver` with `rootMargin: "300px"` — preloads before user hits bottom
- `fetchingRef` lock prevents concurrent requests
- Pins deduplicated by ID on each append
- `pageRef` tracks current page; resets on query/variable change
- Returns `{ pins, loading, hasNextPage, observerRef }` — attach `observerRef` to a sentinel `<div>`

```tsx
const { pins, loading, observerRef, hasNextPage } = useInfinitePins(
  FEED_QUERY, {}, "getUserFeed"
);

// Sentinel triggers next page
{hasNextPage && <div ref={observerRef} className="h-1" />}
```

---

## About Masonry Layout

**Library**: `masonic` — auto-calculates column count from viewport width.

```tsx
<Masonry
  items={pins}
  columnWidth={236}
  columnGutter={16}
  itemKey={(item) => item.id}
  render={({ data }) => <PinCard data={data} />}
/>
```

Approximate breakpoints (auto-calculated):

| Viewport | Columns |
|---|---|
| ~1400px | ~6 |
| ~1000px | ~4 |
| ~600px | ~2–3 |
| Mobile | 1–2 |

---

## Database Schema

```prisma
model User              { id, name, email, passwordHash, avatar, uploadCount, pins, likes, comments, savedPins, followers, following, refreshTokens }
model RefreshToken       { id, token (unique), userId, expiresAt }
model EmailVerification  { id, email (unique), otp, expiresAt }
model Pin               { id, title, description, mediaUrl, publicId, resourceType, fileType, tagIds, userId }
model Tag               { id, name (unique) }
model Like              { id, userId, pinId  @@unique([userId, pinId]) }
model Save              { id, userId, pinId  @@unique([userId, pinId]) }
model Comment           { id, content, userId, pinId  @@unique([userId, pinId]) }
model Follow            { id, followerId, followingId  @@unique([followerId, followingId]) }

enum FileType      { PHOTO | GIF }
enum ResourceType  { IMAGE | VIDEO | RAW }
```

All relations use `onDelete: Cascade`. Full schema in `prisma/schema.prisma`.

---

## API Reference

### REST

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/graphql` | Main GraphQL endpoint (cookie auth) |
| `POST` | `/api/refreshToken` | Manual token refresh (client-side recovery) |
| `POST` | `/api/upload/pin` | Upload pin → `{ url, publicId, resourceType, fileType }` |
| `POST` | `/api/upload/avatar` | Upload avatar → `{ url, publicId }` |


---

## Setup

### Prerequisites
- Node.js `>=20`
- MongoDB Atlas account
- Cloudinary account
- Gmail account (for OTP emails)

### Install

```bash
git clone https://github.com/Samad10jan/pinpop.git
cd pinpop
npm install
```

### Environment Variables

Create `.env.local`:

```env
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/pinpop?retryWrites=true&w=majority"

# JWT (must be different secrets)
JWT_SECRET="your-access-secret-min-32-chars"
REFRESH_SECRET="your-refresh-secret-min-32-chars"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Gmail (use App Password, not account password)
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASS="your-16-char-app-password"
```

### Database

```bash
npx prisma generate    # generate Prisma client
npx prisma db push     # push schema to MongoDB
npx prisma studio      # optional: open DB GUI
```

### Run

```bash
npm run dev      # http://localhost:3000
npm run build
npm start
npm run lint
```

---

---

## Future Scope & Scalability Improvements

# Performance & Scalability

Introduce caching layer using Redis for frequently accessed data (feeds, pin details, counts)

Implement CDN optimization and advanced transformations via Cloudinary

Add database indexing & query optimization for high-traffic queries

Introduce pagination with cursor-based approach for better scalability

Use read replicas for scaling database read operations



---

# Concurrency & Data Consistency

Use atomic database operations for counters (likes, saves, followers)

Implement idempotent APIs to handle repeated requests safely

Add distributed locking (if needed) for critical operations



---

# Feed & Recommendation System

Build personalized feed using user behavior (likes, saves, follows)

Introduce recommendation engine (ML-based or heuristic-based)

Rank pins using engagement signals (CTR, saves, recency)

Add “For You” feed similar to Pinterest



---

# Background Processing

Introduce job queues using BullMQ for:

Notifications

Email sending

Feed precomputation

Image processing


Offload heavy tasks from request cycle to async workers



---

# Real-Time Features

Add real-time updates (likes, comments, notifications) using WebSockets

Implement live notifications system

Real-time feed updates for better UX



---

# Advanced Security

Add rate limiting using Cloudflare or middleware

Implement bot/spam detection mechanisms

Add device/session management dashboard

Enable 2FA (Two-Factor Authentication)



---

# Monitoring & Observability

Integrate logging & monitoring tools:

Sentry (error tracking)

Prometheus (metrics)


Track API latency, DB performance, and error rates

Add alerting for failures and anomalies



---

# System Architecture

Move towards microservices or modular backend architecture

Introduce API gateway for better routing & scaling

Containerize application using Docker

Deploy with horizontal scaling (multiple instances + load balancer)



---

# Product Enhancements

Progressive Web App (PWA) support

Mobile app (React Native)

Advanced search (full-text + filters)

Pin collections / boards (like Pinterest)

Social sharing & deep linking



---

# Global Scaling

Multi-region deployment for low latency

Edge caching and serverless functions

Localization & internationalization (i18n)



---

# Developer Experience

Add unit & integration testing

CI/CD pipelines for automated deployment

API rate limiting & schema validation improvements

Versioned APIs for backward compatibility



---

## Note

Current architecture is intentionally optimized for simplicity and low-scale usage (<50 users).
These improvements are planned for future scaling stages as user base and traffic grow.


---
