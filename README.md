# 📌 `pinpop` - Pinterest-Style Social Pinboard App

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.19-green?logo=prisma)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![GraphQL](https://img.shields.io/badge/GraphQL-Apollo-pink?logo=graphql)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-blue?logo=tailwindcss)

**`pinpop`** is a modern fullstack social image pinboard application inspired by Pinterest, built with Next.js 14+, TypeScript, and GraphQL. Users can discover, create, save, and share visual content through an intuitive masonry grid interface with real-time interactions.

---

## 📋 Table of Contents

- Features
- Working Workflow
- Tech Stack
- Architecture
- Installation
- Project Structure
- Services & APIs
- File Documentation
- Getting Started
- Contributing
- Troubleshooting

---

## ✨ Features

### 🔐 Advanced Authentication System
- **Email OTP Signup**: Secure registration with time-limited verification codes
- **JWT Token Management**: Access tokens (15min) + refresh tokens (7 days) with rotation
- **Session Control**: Max 5 active sessions per user with automatic cleanup
- **Proxy Middleware Auth**: Route-level protection with automatic token refresh
- **Password Security**: bcrypt hashing with strength validation

### 📌 Pin Management & Social Features
- **Create Pins**: Upload images via Cloudinary with title, description, and tags
- **Interactive Feed**: Infinite scroll masonry grid with responsive layout
- **Like & Save**: Toggle interactions with optimistic UI updates
- **Comments System**: Add/delete comments on pins with user attribution
- **Follow Users**: Build social connections and discover content
- **Tag-Based Organization**: Categorized content with 20+ predefined tags

### 🔍 Discovery & Search
- **Smart Search**: Full-text search across pin titles and descriptions
- **Tag Filtering**: Browse pins by categories (Art, Technology, Nature, etc.)
- **User Profiles**: View uploaded pins, saved collections, and follower stats
- **Related Content**: AI-powered pin recommendations based on tags

### 📱 Modern UI/UX
- **Pinterest-Style Layout**: Responsive masonry grid using Masonic library
- **Dark/Light Theme**: Tailwind CSS with custom design system
- **Mobile-First Design**: Optimized for all screen sizes
- **Smooth Animations**: CSS transitions and hover effects
- **Loading States**: Skeleton screens and progress indicators

### ☁️ Cloud Infrastructure
- **Image Storage**: Cloudinary integration for optimized media delivery
- **Database**: MongoDB Atlas with Prisma ORM for scalable data management
- **API Layer**: GraphQL with Apollo Server for efficient data fetching
- **Email Service**: Nodemailer for OTP and notification emails

---

## 🔄 Working Workflow

### User Journey Flow Chart

```
┌─────────────────────────────────────────────────────────────┐
│                     PINPOP APP WORKFLOW                      │
└─────────────────────────────────────────────────────────────┘

1️⃣  SPLASH SCREEN (page.tsx)
    ├─ Check authentication status
    ├─ Validate user session via proxy middleware
    ├─ Fetch user profile data
    └─ Redirect to main app or auth flow

2️⃣  AUTHENTICATION (If Not Logged In)
    ├─ Signup Screen → Email + OTP verification
    │  └─ API: sendSignupOtp → Email with hashed OTP
    ├─ Login Screen → Email + Password
    │  └─ API: login → JWT tokens + cookies
    └─ Forgot Password → Email reset (future feature)

3️⃣  MAIN APP (Tab Navigation - 4 Main Sections)
    ├─ 🏠 FEED → Infinite scroll pin grid
    │  └─ API: getUserFeed → Paginated pins
    ├─ 🔍 SEARCH → Tag-based filtering + search
    │  └─ API: getSearchPagePins → Filtered results
    ├─ 👤 PROFILE → User stats + saved pins
    │  └─ API: getCurrentProfile → User analytics
    └─ 📌 SAVED → Personal pin collection
       └─ API: getSavedPins → User's saved content

4️⃣  PIN INTERACTION WORKFLOW (Core Social Feature)
    ├─ User Clicks Pin → Pin Detail Page
    │  └─ API: getPinPageResponse → Full pin data + related
    ├─ Like/Save Actions → Optimistic UI update
    │  └─ API: toggleLike/toggleSave → State change
    ├─ Add Comment → Real-time comment addition
    │  └─ API: sendComment → New comment with user data
    └─ Follow User → Social connection
       └─ API: toggleFollow → Follower relationship

5️⃣  PIN CREATION WORKFLOW (Content Creation)
    ├─ User Selects Image → Cloudinary upload
    │  └─ API: /api/upload/pin → Secure file upload
    ├─ Add Metadata → Title, description, tags
    ├─ Submit Pin → Create new content
    │  └─ API: createPin → New pin in database
    └─ Update Feed → Real-time content refresh
```

### Authentication Flow (Detailed)

```
┌────────────────────────────────────────────────┐
│         JWT Authentication Flow (Detailed)       │
└────────────────────────────────────────────────┘

USER ATTEMPTS PROTECTED ROUTE
        ↓
    ┌─────────────────────────────────────┐
    │ 1. PROXY MIDDLEWARE CHECK           │
    ├─────────────────────────────────────┤
    │ • Check access token in cookies     │
    │ • Verify JWT signature & expiry     │
    │ • If valid → Allow request          │
    │ • If expired → Check refresh token  │
    └─────────────────────────────────────┘
        ↓
    ┌─────────────────────────────────────┐
    │ 2. TOKEN REFRESH (If Needed)        │
    ├─────────────────────────────────────┤
    │ • Verify refresh token in DB        │
    │ • Check expiry date                 │
    │ • Generate new access + refresh     │
    │ • Rotate refresh token              │
    │ • Update cookies                    │
    │ • Delete old refresh token          │
    └─────────────────────────────────────┘
        ↓
    ┌─────────────────────────────────────┐
    │ 3. SESSION MANAGEMENT               │
    ├─────────────────────────────────────┤
    │ • Limit to 5 active sessions        │
    │ • Auto-cleanup old sessions         │
    │ • Track session creation time       │
    │ • Secure httpOnly cookies           │
    └─────────────────────────────────────┘
        ↓
    ┌─────────────────────────────────────┐
    │ 4. LOGOUT PROCESS                   │
    ├─────────────────────────────────────┤
    │ • Delete refresh token from DB      │
    │ • Clear access/refresh cookies      │
    │ • Redirect to login                 │
    │ • Invalidate all user sessions      │
    └─────────────────────────────────────┘
        ↓
USER AUTHENTICATED - Access Granted
```

---

## 🏗️ Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        APP.tsx                               │
│                 (Entry Point + Navigation)                   │
└─────────────────────────────────────────────────────────────┘
        │
        ├─ Next.js App Router (app/)
        ├─ Proxy Middleware (src/proxy.ts)
        ├─ Global Context Providers
        └─ Tailwind CSS + Custom Components
        
        ↓
        
┌─────────────────────────────────────────────────────────────┐
│                    Route Structure                           │
├─────────────────────────────────────────────────────────────┤
│ • / → Landing page with hero + auth prompt                  │
│ • /main → Protected feed (middleware enforced)              │
│ • /main/search → Search with filters                        │
│ • /main/tags/[tagId] → Tag-specific pins                    │
│ • /main/pin/[pinId] → Pin detail with comments              │
│ • /main/saved → User's saved pins                           │
│ • /main/profile → Current user profile                      │
│ • /main/current-profile → Profile management                │
│ • /auth/signin → Login form                                 │
│ • /auth/signup → Registration with OTP                      │
└─────────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────────┐
│                    Services Layer                            │
├─────────────────────────────────────────────────────────────┤
│ • GraphQL Client (src/lib/services/graphql.ts)              │
│ • Prisma Client (src/lib/services/prisma.ts)                │
│ • Cloudinary Service (src/lib/services/cloudinary.ts)       │
│ • Email Service (src/lib/services/nodemailer.ts)            │
│ • Auth Helpers (src/helper/auth.ts)                         │
│ • Token Refresh (src/helper/refersh.ts)                     │
└─────────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────────┐
│              External Services & APIs                        │
├─────────────────────────────────────────────────────────────┤
│ Database:                                                    │
│ • MongoDB Atlas                                              │
│   ├─ Users, Pins, Comments, Likes, Saves, Follows           │
│   ├─ RefreshTokens, EmailVerification                       │
│   └─ Tags with relationships                                 │
│                                                              │
│ Media Storage:                                               │
│ • Cloudinary API                                             │
│   ├─ Image upload & optimization                            │
│   ├─ Public ID management                                   │
│   └─ CDN delivery                                            │
│                                                              │
│ Email Service:                                               │
│ • Nodemailer with SMTP                                       │
│   ├─ OTP verification emails                                │
│   └─ Welcome messages                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 💻 Tech Stack

### Frontend Framework
- **Next.js** `16.1.6` - React framework with App Router
- **React** `19.2.3` - UI library with hooks
- **TypeScript** `5.8.3` - Type safety and development experience

### Backend & API
- **GraphQL** with Apollo Server `5.4.0` - API layer
- **Prisma** `6.19` - ORM for database operations
- **MongoDB Atlas** - NoSQL database
- **JWT** `9.0.3` - Token-based authentication

### UI/UX & Styling
- **Tailwind CSS** `4.0` - Utility-first CSS framework
- **Lucide React** `0.563.0` - Icon library
- **Radix UI** `1.4.3` - Accessible UI primitives
- **Masonic** `4.1.0` - Masonry grid layout
- **Class Variance Authority** `0.7.1` - Component variants

### Media & Cloud Services
- **Cloudinary** `2.9.0` - Image upload and optimization
- **Nodemailer** `8.0.1` - Email service for OTP

### Development Tools
- **ESLint** `9.0` - Code linting
- **TypeScript Compiler** - Type checking
- **Next.js Dev Server** - Hot reload development

---

## 📁 Project Structure

```
pinpop/
│
├── 📂 src/                                  ← Main source code
│   ├── 📂 app/                              ← Next.js App Router
│   │   ├── globals.css                      └─ Global styles
│   │   ├── layout.tsx                       └─ Root layout
│   │   ├── page.tsx                         └─ Landing page
│   │   ├── (auth)/                          └─ Auth routes group
│   │   │   ├── signin/page.tsx              └─ Login page
│   │   │   └── signup/page.tsx              └─ Signup page
│   │   └── (main)/                          └─ Protected routes
│   │       ├── layout.tsx                   └─ Main app layout
│   │       ├── page.tsx                     └─ Feed page
│   │       ├── search/page.tsx              └─ Search page
│   │       ├── saved/page.tsx               └─ Saved pins
│   │       ├── (profile-pages)/             └─ Profile routes
│   │       │   ├── current-profile/page.tsx └─ Profile management
│   │       │   └── profile/page.tsx         └─ User profile view
│   │       ├── pin/[pinId]/page.tsx         └─ Pin detail page
│   │       └── tags/[tagId]/page.tsx        └─ Tag-specific pins
│   │
│   ├── 📂 components/                       ← Reusable UI components
│   │   ├── 📂 buttons/                      └─ Action buttons
│   │   │   ├── FollowBtn.tsx                └─ Follow/unfollow
│   │   │   ├── LikeBtn.tsx                  └─ Like toggle
│   │   │   ├── LogOutBtn.tsx                └─ Logout action
│   │   │   ├── SaveBtn.tsx                  └─ Save toggle
│   │   │   └── ShareBtn.tsx                 └─ Share functionality
│   │   ├── 📂 cards/                        └─ Content cards
│   │   │   ├── CommentCard.tsx              └─ Comment display
│   │   │   ├── LoadingCard.tsx              └─ Loading skeleton
│   │   │   └── PinCard.tsx                  └─ Pin display card
│   │   └── 📂 commons/                      └─ Common components
│   │       ├── CommentsArea.tsx             └─ Comments section
│   │       ├── EditDetailsArea.tsx          └─ Profile editing
│   │       ├── Error.tsx                    └─ Error display
│   │       ├── Feed.tsx                     └─ Main feed component
│   │       ├── Footer.tsx                   └─ App footer
│   │       ├── Header.tsx                   └─ App header
│   │       ├── HeroSection.tsx              └─ Landing hero
│   │       ├── Loading.tsx                  └─ Loading spinner
│   │       ├── NotFound.tsx                 └─ 404 page
│   │       ├── SeedBtn.tsx                  └─ Development seeder
│   │       ├── SideBar.tsx                  └─ Navigation sidebar
│   │       ├── TagsView.tsx                 └─ Tags display
│   │       ├── Toast.tsx                    └─ Notification toast
│   │       └── useInfinitePins.ts           └─ Infinite scroll hook
│   │
│   ├── 📂 contexts/                         ← React contexts
│   │   └── UserContext.tsx                  └─ User state management
│   │
│   ├── 📂 helper/                           ← Utility functions
│   │   ├── ApiError.ts                      └─ Error handling class
│   │   ├── auth.ts                          └─ JWT utilities
│   │   ├── context.ts                       └─ GraphQL context
│   │   ├── email.ts                         └─ Email utilities
│   │   ├── logout.ts                        └─ Logout helpers
│   │   ├── pagination.ts                    └─ Pagination logic
│   │   └── refersh.ts                       └─ Token refresh logic
│   │
│   ├── 📂 lib/                              ← Core libraries
│   │   ├── 📂 constants.ts                  └─ App constants
│   │   ├── 📂 gql/                          └─ GraphQL layer
│   │   │   ├── 📂 mutations/                └─ GraphQL mutations
│   │   │   │   └── mutations.ts             └─ All mutations
│   │   │   ├── 📂 queries/                  └─ GraphQL queries
│   │   │   │   └── queries.ts               └─ All queries
│   │   │   ├── 📂 resolvers/                └─ GraphQL resolvers
│   │   │   │   ├── auth.resolver.ts         └─ Auth operations
│   │   │   │   ├── comments.resolver.ts     └─ Comment operations
│   │   │   │   ├── pin.resolver.ts          └─ Pin operations
│   │   │   │   ├── toggles.resolver.ts      └─ Like/save/follow
│   │   │   │   └── user.resolver.ts         └─ User operations
│   │   │   └── 📂 typeDefs/                 └─ GraphQL schema
│   │   │       └── typeDefs.ts              └─ Schema definitions
│   │   └── 📂 services/                     └─ External services
│   │       ├── cloudinary.ts                └─ Image upload
│   │       ├── graphql.ts                   └─ GraphQL client
│   │       ├── nodemailer.ts                └─ Email service
│   │       └── prisma.ts                    └─ Database client
│   │
│   ├── 📂 proxy.ts                          └─ Auth middleware
│   ├── 📂 types/                            └─ TypeScript types
│   │   └── types.ts                         └─ App type definitions
│   │
│   └── 📂 app/                              ← API routes
│       ├── 📂 api/                          └─ Next.js API routes
│       │   ├── graphql/route.ts             └─ GraphQL endpoint
│       │   ├── refreshToken/route.ts        └─ Token refresh
│       │   └── upload/                      └─ File upload routes
│       │       ├── avatar/route.ts          └─ Avatar upload
│       │       └── pin/route.ts             └─ Pin image upload
│
├── 📂 prisma/                               ← Database schema
│   ├── schema.prisma                        └─ Prisma schema
│   └── 📂 generated/                        └─ Generated client
│
├── 📂 public/                               ← Static assets
│
├── 📄 package.json                          └─ Dependencies
├── 📄 next.config.ts                        └─ Next.js config
├── 📄 tailwind.config.ts                    └─ Tailwind config
├── 📄 tsconfig.json                         └─ TypeScript config
├── 📄 eslint.config.mjs                     └─ ESLint config
└── 📄 README.md                             └─ Documentation
```

---

## ⚙️ Installation & Setup

### Prerequisites

- **Node.js** `>=20.0.0`
- **npm** or **yarn**
- **MongoDB Atlas** account (or local MongoDB)
- **Cloudinary** account for image storage

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/pinpop.git
cd pinpop
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Environment Configuration

Create `.env.local` file:

```env
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/pinpop"

# JWT Secrets
JWT_SECRET="your-access-token-secret"
REFRESH_SECRET="your-refresh-token-secret"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email Service (for OTP)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# Optional: GraphQL API URL (defaults to local)
NEXT_PUBLIC_API_URL="http://localhost:3000/api/graphql"
```

### Step 4: Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Optional: Seed initial data
npx prisma db seed
```

### Step 5: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 6: Build for Production

```bash
npm run build
npm start
```

---

## 🔧 Services & APIs

### GraphQL API Endpoints

#### Authentication
```
POST /api/graphql
Mutation: sendSignupOtp(email: String!)
  Response: { message: String }

Mutation: signup(name, email, password, avatar, otp)
  Response: { user: { id, name, email, avatar } }

Mutation: login(email, password)
  Response: { user: { id, name, email, avatar, uploadCount } }

Mutation: logout
  Response: { success: Boolean }
```

#### Pin Management
```
Query: getUserFeed(limit, page)
  Response: { pins[], pagination }

Query: getPinPageResponse(id)
  Response: { pin, relatedPins[], likesCount, savesCount, tags[] }

Mutation: createPin(title, description, mediaUrl, fileType, tagIds, publicId, resourceType)
  Response: { id, title, mediaUrl, ... }

Mutation: deletePin(pinId)
  Response: { success: Boolean }
```

#### Social Interactions
```
Mutation: toggleLike(pinId)
  Response: { like: Boolean }

Mutation: toggleSave(pinId)
  Response: { saved: Boolean }

Mutation: toggleFollow(targetUserId)
  Response: { success: Boolean }

Mutation: sendComment(pinId, content)
  Response: { id, content, user, createdAt }

Mutation: deleteComment(commentId)
  Response: { success: Boolean }
```

#### User Management
```
Query: getCurrentProfile
  Response: { user, followersCount, followingCount, lastSavedPins[], totalLikes }

Query: getProfile(userId)
  Response: { user, followersCount, followingCount, isFollowing, lastUploadedPins[] }

Mutation: updateProfile(name, avatar)
  Response: { id, name, avatar, ... }
```

### File Upload Endpoints

#### Avatar Upload
```
POST /api/upload/avatar
Body: FormData { file: File }
Response: { url: String, publicId: String }
```

#### Pin Image Upload
```
POST /api/upload/pin
Body: FormData { file: File }
Response: { url: String, publicId: String, resourceType: String, fileType: String }
```

### Third-Party Services

| Service | Purpose | Configuration |
|---------|---------|---------------|
| **MongoDB Atlas** | Database | `DATABASE_URL` |
| **Cloudinary** | Image storage | `CLOUDINARY_*` vars |
| **Nodemailer** | Email service | `EMAIL_USER/PASS` |

---

## 📖 File Documentation

### Core Components

#### **proxy.ts** (Most Critical - Authentication Gateway)
- **Purpose**: Middleware for route protection and automatic token refresh
- **Size**: ~60 lines
- **Key Features**:
  - Protects `/main/*` routes
  - Checks access token validity
  - Automatically refreshes expired tokens
  - Manages httpOnly cookies
  - Handles logout redirects

#### **auth.resolver.ts** (Authentication Logic)
- **Purpose**: GraphQL resolvers for user authentication
- **Key Functions**:
  - `signup`: OTP verification + user creation + token generation
  - `login`: Password verification + session management
  - `logout`: Token cleanup + session invalidation
  - `sendSignupOtp`: Email OTP generation and sending

#### **pin.resolver.ts** (Content Management)
- **Purpose**: Pin CRUD operations and feed logic
- **Key Functions**:
  - `createPin`: New pin creation with validation
  - `getUserFeed`: Personalized feed with pagination
  - `getPinPageResponse`: Detailed pin data with relations

#### **Feed.tsx** (Main UI Component)
- **Purpose**: Infinite scroll masonry grid for pins
- **Features**:
  - Uses `masonic` library for responsive layout
  - `useInfinitePins` hook for pagination
  - Intersection Observer for loading triggers

#### **PinCard.tsx** (Pin Display)
- **Purpose**: Individual pin card with interactions
- **Features**:
  - Like/save buttons with optimistic updates
  - Responsive image display
  - User attribution and metadata

### Service Layers

| Service | Responsibility | Key Methods |
|---------|-----------------|----------------|
| **prisma.ts** | Database client | `PrismaClient` instance |
| **graphql.ts** | API client | `GraphQLClient` with auth |
| **cloudinary.ts** | Image service | `uploadImage`, `deleteImage` |
| **auth.ts** | Token utilities | `signAccess`, `verifyRefresh` |
| **refersh.ts** | Token refresh | `refreshTokens` function |

---

## 🚀 Getting Started

### Quick Start Guide

1. **Setup Environment**
   - Clone repository and install dependencies
   - Configure MongoDB Atlas and Cloudinary accounts
   - Set environment variables

2. **Database Initialization**
   - Run `npx prisma generate` and `npx prisma db push`
   - Verify database connection

3. **Start Development**
   - Run `npm run dev`
   - Open browser to `http://localhost:3000`

4. **Create Account**
   - Visit signup page
   - Enter email to receive OTP
   - Complete registration

5. **Explore Features**
   - Browse the feed
   - Create your first pin
   - Like and save content
   - Follow other users

### Development Workflow

1. **Authentication Flow**
   - User signs up with email OTP
   - System creates JWT tokens and stores refresh token
   - Proxy middleware protects routes

2. **Content Creation**
   - User uploads image to Cloudinary
   - System creates pin with metadata
   - Pin appears in feeds and search

3. **Social Interactions**
   - Users can like, save, comment on pins
   - Follow system builds social graph
   - Real-time UI updates

---

## 🐛 Troubleshooting

### Common Issues

**Issue: Authentication fails**
- Solution: Check JWT secrets in `.env.local`
- Verify MongoDB connection string
- Ensure cookies are enabled

**Issue: Images not uploading**
- Solution: Verify Cloudinary credentials
- Check file size limits (default 10MB)
- Ensure proper file types

**Issue: GraphQL queries fail**
- Solution: Check Prisma client generation
- Verify database schema matches queries
- Check network connectivity

**Issue: Build fails**
- Solution: Clear Next.js cache
```bash
rm -rf .next
npm run build
```

**Issue: Database connection errors**
- Solution: Verify MongoDB Atlas IP whitelist
- Check connection string format
- Ensure database user permissions

**Issue: Email OTP not received**
- Solution: Check email credentials
- Verify SMTP settings
- Check spam folder

---

## 📊 Statistics

| Metric | Value |
|--------|-------|
| **Total Dependencies** | 25+ |
| **GraphQL Operations** | 15+ queries/mutations |
| **Database Models** | 8 (User, Pin, Comment, etc.) |
| **UI Components** | 20+ reusable components |
| **API Routes** | 4 (GraphQL, refresh, uploads) |
| **Authentication Methods** | JWT + OTP |
| **Supported File Types** | Images (PNG, JPG, GIF) |
| **Max Sessions/User** | 5 active sessions |

---

## ✅ Checklist Before Deployment

- [ ] Environment variables configured
- [ ] Database schema pushed to production
- [ ] Cloudinary account set up
- [ ] Email service configured
- [ ] JWT secrets generated
- [ ] Build passes without errors
- [ ] Authentication flow tested
- [ ] File upload tested
- [ ] Responsive design verified
- [ ] Performance optimized

---

## 📈 Roadmap

### Planned Features (v2.0)
- [ ] Real-time notifications with WebSockets
- [ ] Advanced search with filters
- [ ] Pin collections/boards
- [ ] Direct messaging between users
- [ ] Analytics dashboard for creators
- [ ] Mobile app (React Native)
- [ ] AI-powered content recommendations
- [ ] Video pin support
- [ ] Dark mode toggle
- [ ] Multi-language support

### Performance Improvements
- [ ] Image lazy loading optimization
- [ ] Database query optimization
- [ ] CDN integration for assets
- [ ] Caching layer (Redis)
- [ ] API response compression

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [GraphQL Documentation](https://graphql.org/learn)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [MongoDB Atlas](https://docs.mongodb.com/atlas)

---

## Contact

**Pinpop Development Team**

- **GitHub**: [yourusername/pinpop](https://github.com/yourusername/pinpop)
- **Demo**: [pinpop.vercel.app](https://pinpop.vercel.app)

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🎯 Showcase Summary

**`pinpop`** demonstrates modern fullstack development with:
- **Secure Authentication**: JWT tokens with refresh rotation and session management
- **Scalable Architecture**: GraphQL API with Prisma ORM and MongoDB
- **Cloud Integration**: Cloudinary for media storage and optimization
- **Social Features**: Like, save, comment, and follow functionality
- **Responsive UI**: Pinterest-style masonry layout with infinite scroll
- **Type Safety**: Full TypeScript implementation
- **Modern Stack**: Next.js 14+ with App Router and React 19

Perfect for portfolios showcasing social media app development, authentication systems, and modern web technologies.
