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
| **Page** | **Screenshot** |
|---|---|
| Page1  | screenshot   |
---
## Table of Contents

- [Stack](#stack)
- [Features](#features)
- [Setup](#setup)
- [Project Structure](#project-structure)
- [Page Routes](#page-routes)
- [Auth System](#auth-system)
- [Infinite Scroll](#infinite-scroll)
- [Masonry Layout](#masonry-layout)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript 5 |
| Styling | Tailwind CSS 4, Radix UI, Lucide React, tw-animate-css |
| Backend | Apollo Server 5 + `@as-integrations/next` |
| Database | MongoDB Atlas via Prisma 6 ORM |
| Auth | `jsonwebtoken`, `bcrypt` |
| Media | Cloudinary (upload + CDN) |
| Email | Nodemailer (Gmail) |
| Grid | `masonic` 4 (responsive masonry) |
| GQL Client | `graphql-request`, `graphql-tag` |

---

## Features

**Auth**
- Email OTP signup — 6-digit code, bcrypt-hashed, 5-minute expiry
- JWT access tokens (15m) + refresh tokens (7d, stored in DB)
- Automatic token rotation via Next.js middleware (no extra HTTP call)
- Max 5 active sessions per user; oldest deleted on overflow
- httpOnly + secure + sameSite cookies throughout

**Pins**
- Upload images/GIFs to Cloudinary with title, description, tags
- 20+ predefined tag categories
- Edit/delete with permission checks

**Social**
- Like, save, comment, follow/unfollow
- User profiles with follower/following/likes/upload stats

**Discovery**
- Infinite scroll masonry feed (20 pins/page, Intersection Observer)
- Full-text search
- Tag browsing + tag-filtered feeds
- Related pins by tag

---

## Setup

### Prerequisites
- Node.js `>=20`
- MongoDB Atlas account
- Cloudinary account
- Gmail account (for OTP emails)

### Install

```bash
git clone https://github.com/Samad10jan/Fixel.git
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

## Security

- Passwords: bcrypt, 10 rounds
- JWTs: signed with separate secrets, short-lived access tokens
- Cookies: httpOnly, secure, sameSite=lax
- Refresh tokens: DB-stored, rotated on every use, invalidated on logout
- OTP: bcrypt-hashed before storage, deleted after use
- Sessions: max 5 per user

---
