# 🎓 TuitionForHome — Hybrid Home & Online Tuition Platform (Gurgaon, Delhi NCR & Pan-India)

> **High-Converting, SEO-Dominant Home & Online Tuition Mediation Platform with In-House Telecalling CRM, Rapido-Style Tutor Radar Matchmaking, Tutor KYC & Video Verification, and Automated Lead Distribution.**  
> **Operated & Verified by SSSAM Academy (M24 Ground Floor, Old DLF Colony, Sector 14, Gurugram, Haryana 122001).**

---

## 📑 Table of Contents

1. [Executive Summary & Core Concept](#-1-executive-summary--core-concept)
2. [Key Highlights & Differentiators](#-2-key-highlights--differentiators)
3. [Interactive Map & Rapido-Style Matchmaking](#-3-interactive-map--rapido-style-matchmaking)
4. [Monetization & Profit Engine](#-4-monetization--profit-engine)
5. [User Portals & Feature Breakdown](#-5-user-portals--feature-breakdown)
   - [A. Parent & Student Interface](#a-parent--student-interface)
   - [B. Tutor Portal & Lifecycle](#b-tutor-portal--lifecycle)
   - [C. Counselor / Telecaller Operations CRM](#c-counselor--telecaller-operations-crm)
   - [D. Super Admin Command Center](#d-super-admin-command-center)
6. [Hyper-Local Programmatic SEO Engine](#-6-hyper-local-programmatic-seo-engine)
7. [Security, Encryption & DPDP Act 2023 Compliance](#-7-security-encryption--dpdp-act-2023-compliance)
8. [Technology Stack & System Integrations](#-8-technology-stack--system-integrations)
9. [Database Architecture & Prisma Schema](#-9-database-architecture--prisma-schema)
10. [REST API Reference](#-10-rest-api-reference)
11. [Project Directory & File Structure](#-11-project-directory--file-structure)
12. [Local Setup & Installation Guide](#-12-local-setup--installation-guide)
13. [Testing & System Verification](#-13-testing--system-verification)
14. [Production Deployment Guide](#-14-production-deployment-guide)
15. [Official Center & Operation Verification](#-15-official-center--operation-verification)
16. [Continuous Feature Tracker & Roadmap](#-16-continuous-feature-tracker--roadmap)

---

## 📌 1. Executive Summary & Core Concept

**TuitionForHome** is an enterprise-grade tuition mediation ecosystem engineered to bridge the gap between quality educators and students across **Gurgaon, Delhi NCR, and Pan-India**. The platform is backed by the physical infrastructure and academic authority of **SSSAM Academy (Sector 14, Gurugram)**.

### 1.1 Dual Delivery Architecture
The platform supports three distinct learning models:
1. 🏡 **Offline 1-on-1 Home Tuition:** Verified educators travel to the student's residence across all prime Gurgaon sectors (DLF Phase 1–5, Golf Course Road, Sohna Road, Nirvana Country, Sector 56/57, New Gurgaon, etc.).
2. 💻 **Online 1-on-1 Live Interactive Classes:** Conducted via Google Meet / Zoom with digital whiteboarding for Delhi NCR, Pan-India, and international/NRI curriculums (CBSE, ICSE, IB DP/MYP, Cambridge IGCSE).
3. 🏫 **Center Demo / Physical Hybrid Option:** Parents and students have the confidence to meet tutors or attend classes at our physical center (**SSSAM Academy, Sector 14, Gurugram**).

```
   ┌──────────────────────────────┐              ┌──────────────────────────────┐
   │    Parent / Student Lead     │              │    Tutor Profile Creator     │
   │ (Home / Online / Both Modes) │              │  (Video + KYC + Preferences) │
   └──────────────┬───────────────┘              └──────────────┬───────────────┘
                  │                                             │
                  ▼                                             ▼
   ┌──────────────────────────────┐              ┌──────────────────────────────┐
   │   Counselor Inbound Queue    │              │  Status: PENDING INTERVIEW   │
   │     (Real-time Telegram)     │              └──────────────┬───────────────┘
   └──────────────┬───────────────┘                             │
                  │                              ┌──────────────▼───────────────┐
                  │                              │ Counselor Video/KYC Review   │
                  │                              │   & Verification Scorecard   │
                  │                              └──────────────┬───────────────┘
                  │                                             │
                  │                              ┌──────────────▼───────────────┐
                  │                              │  Status: ACTIVE & VERIFIED   │
                  │                              └──────────────┬───────────────┘
                  │                                             │
                  └──────────────► [ SMART MATCH ] ◄────────────┘
                                         │
                         ┌───────────────▼───────────────┐
                         │   Demo Scheduled & WhatsApp   │
                         │   Digital Demo Pass Issued    │
                         └───────────────┬───────────────┘
                                         │
                         ┌───────────────▼───────────────┐
                         │   Tuition Confirmed by Parent │
                         └───────────────┬───────────────┘
                                         │
                         ┌───────────────▼───────────────┐
                         │ 💰 1st-Month Commission (UPI) │
                         │    Collected via QR Invoice   │
                         └───────────────────────────────┘
```

---

## ⚡ 2. Key Highlights & Differentiators

* 🗺️ **Rapido-Style Live Matchmaking Radar:** Interactive Leaflet map displaying active tutor density across Gurgaon sectors with instant real-time matching animations.
* 🛡️ **100% Replacement Guarantee & Physical Center Trust:** Backed by SSSAM Academy's physical institute; parents can replace tutors with a single click if unsatisfied with the demo.
* 🎥 **60-Second Video Introductions:** Tutors upload or link concise video intros allowing parents and counselors to evaluate communication skills, pronunciation, and subject depth before demo booking.
* 🔒 **AES-256 Encrypted KYC Vault:** Government IDs (Aadhaar, Driving License, PAN) are encrypted at rest with AES-256-CBC, storing only masked last 4 digits publicly.
* 🏷️ **Dynamic Festival Promotion Engine:** Super Admin can adjust the ₹999 verification badge fee to ₹0 (100% Free Waiver) or custom promotional pricing in real-time.
* 📱 **Telecaller Operations Desk:** 1-Click WhatsApp (`wa.me`) message dispatch, phone dialers, digital WhatsApp demo slips, and UPI QR invoice generation.
* 📈 **Programmatic Locality & Subject SEO Matrix:** Dynamic pre-rendered landing pages for 20+ Gurgaon localities and high-ticket subjects (NEET, JEE, CBSE 10/12, IB Diploma, Python/Coding).

---

## 📍 3. Interactive Map & Rapido-Style Matchmaking

The platform integrates a dynamic, interactive map experience (`RapidoStyleMap.tsx` and `TutorMatchModal.tsx`) built using **Leaflet** with custom pulsing radar animations:
* **Sector Density Clusters:** Visualizes live tutor availability across DLF Phase 1–5, Golf Course Road, Sohna Road, Nirvana Country, Sector 56, and Sector 14.
* **Simulated Matchmaking Radar:** When a parent submits a requirement, a full-screen radar searches verified educators in the background and returns the top 3 proximity matches within seconds.
* **Instant Demo Booking:** Parents can review the matched tutor's video, qualifications, and hourly/monthly rates, then confirm a free demo immediately.

---

## 💰 4. Monetization & Profit Engine

| Revenue Stream | Mechanism | Market Rate (Gurgaon & NCR) |
| :--- | :--- | :--- |
| **1. First Month Placement Commission** *(Primary)* | Charged to the tutor (50% to 100% of 1st month tuition fee) upon successful confirmation after the free demo. | **₹2,500 – ₹12,000+ per student** |
| **2. 2-Split Installment Commission** *(High-Ticket)* | For fees above ₹12,000, tutors pay 50% on Day 2 and 50% on Day 15 to eliminate cashflow friction. | **₹6,000 – ₹15,000 per placement** |
| **3. Verification Badge Fee** *(Price-Anchored)* | Anchored at ~~₹999~~ with dynamic seasonal waivers (₹0 Free or 50% Off) controlled by the Super Admin. | **~~₹999~~ ₹0 (Seasonal Waiver)** |
| **4. Tutor Lead Pass Subscription** | Monthly priority access pass for tutors to receive direct sector-specific WhatsApp lead pings. | **₹799 – ₹1,999 / month** |
| **5. Crash Course Revision Bundles** | 45-day high-intensity Board Exam & NEET revision packages (₹15,000–₹25,000 lump sum). | **₹7,500 – ₹12,500 net margin** |
| **6. School Coding & AI Mentorship** | Premium 1-on-1 coding tuitions powered by SSSAM Academy (Python, Web Dev, Scratch, AI). | **₹1,000 – ₹2,000 / hour** |

---

## 👥 5. User Portals & Feature Breakdown

### A. Parent & Student Interface
1. **Interactive Search & Hero Filters:** Filter by Mode (Home / Online), Gurgaon Locality, Grade (Class 1–12, IB/IGCSE, NEET/JEE), and Subject.
2. **Interactive Fee Estimator Widget (`FeeEstimator.tsx`):** 4-step dynamic calculator providing instant monthly budget estimations based on Class, Subject, Mode, and Weekly Frequency.
3. **Instant Booking Modal (`BookingModal.tsx` & `/book-demo`):** Step-by-step parent requirement capture with locality selection and telephone validation.
4. **Parent Dashboard (`/parent/dashboard`):** Secure login (`/parent/login`) allowing parents to monitor active tuition requests, scheduled demos, counselor notes, and submit tutor replacement requests.
5. **Verified Tutor Public Review System (`/tutor/review/[tutorId]`):** Public parent review submission with star ratings, detailed feedback, and automated tutor score recalculation.

### B. Tutor Portal & Lifecycle
1. **7-Step Registration Flow (`/tutor/register`):**
   - **Step 1:** Personal details, profile photo, and teaching mode (Home, Online, or Both).
   - **Step 2:** 60-Second Video Introduction (YouTube unlisted embed or direct MP4 upload).
   - **Step 3:** Academic qualifications & university degrees.
   - **Step 4:** Teaching specifications (Classes 1–12, CBSE, ICSE, IB, IGCSE, State Boards).
   - **Step 5:** Dual-Location Preferences (Pinpoint GPS coordinate + Travel Radius in KM or specific Gurgaon sector selection).
   - **Step 6:** Hourly & monthly fee expectations.
   - **Step 7:** KYC government document upload (Aadhaar, Driving License, PAN, or Degree).
2. **Tutor Dashboard & Profile Hub (`/tutor/profile`):**
   - **Digital Verified Educator ID Card:** Downloadable ID card with verified seal and QR verification pass.
   - **Lead Pipeline:** View assigned student inquiries, demo dates, and student locations.
   - **Weekly Availability Matrix:** Set customized morning/evening time slots.
   - **Earnings & Commission Ledger:** Track closed tuitions and commission payment statuses.

### C. Counselor / Telecaller Operations CRM (`/counselor`)
1. **Inbound Lead Management Desk:** Real-time queue of parent inquiries categorized by status (`NEW_LEAD`, `DEMO_SCHEDULED`, `TUITION_CONFIRMED`, `COMMISSION_RECEIVED`, `LOST`).
2. **1-Click WhatsApp & Phone Dialer:** Instant WhatsApp message dispatch using pre-filled communication templates (`Tutor Profile Pitch`, `Demo Confirmation`, `Post-Demo Feedback`).
3. **Tutor Interview & KYC Verification Desk:** Review pending tutor profiles, play 60-second video introductions, inspect private KYC documents, record interview scorecard ratings (1–10), and approve/reject with 1 click.
4. **Smart Proximity Matchmaker:** Automatically computes distance between student's sector and verified educators.
5. **Digital Demo Pass & Commission QR Generator:** Generates branded WhatsApp demo cards and UPI QR payment invoices for 1st-month commission collection.

### D. Super Admin Command Center (`/admin`)
1. **Executive KPI Dashboard:** Real-time metrics on Total Verified Tutors, Today's Inbound Leads, Active Tuitions, and Gross Commission Revenue.
2. **Dynamic Pricing & Festival Controller:** Adjust base verification fees, toggle 100% Free waivers, and customize festival campaign headlines.
3. **Counselor Performance Tracker:** Track total calls logged, demos booked, and revenue converted per counselor.
4. **Locality SEO & Pincode Registry:** Manage Gurgaon sectors, SEO meta tags, and local FAQ content.
5. **Commission Ledger:** Monitor payment reconciliation, 2-split installment balances, and receipts.

---

## 🚀 6. Hyper-Local Programmatic SEO Engine

The platform is designed to dominate organic Google rankings across Gurgaon and Delhi NCR through programmatic routes and JSON-LD structured data:

### 6.1 Programmatic URL Architecture
* **City Pillar Route:** `/home-tutors-in-gurgaon`
* **Locality Dynamic Matrix:** `/home-tutors-in-gurgaon/[locality]` (20+ sectors pre-rendered: `dlf-phase-5`, `golf-course-road`, `sohna-road`, `nirvana-country`, `sector-56`, `sector-14`, `palam-vihar`, etc.)
* **Subject Dynamic Matrix:** `/tuition/[subject]` (`maths-home-tutor-in-gurgaon`, `physics-home-tutor-in-gurgaon`, `chemistry-home-tutor-in-gurgaon`, `computer-science-python-tutor-in-gurgaon`, `accounts-commerce-home-tutor-in-gurgaon`, `ib-igcse-tutors-in-gurgaon`)
* **XML Sitemap & Robots:** Dynamic `/sitemap.xml` and `/robots.txt` generated via Next.js App Router.

### 6.2 Schema.org Structured Data
Each locality and subject page automatically injects rich JSON-LD:
* `LocalBusiness` & `EducationalOrganization` with exact geo-coordinates (`28.4703° N, 77.0418° E`) and SSSAM Academy address.
* `AggregateRating` for Google 5-star rich search snippets.
* `FAQPage` schema on every locality landing page to capture Google's "People Also Ask" (PAA) boxes.
* `Person` schema for verified tutor profiles (personal contact details masked for privacy).

---

## 🔒 7. Security, Encryption & DPDP Act 2023 Compliance

1. **AES-256-CBC Encryption (`src/lib/crypto.ts`):** Sensitive government ID numbers are encrypted at rest using AES-256-CBC with SHA-256 derived keys.
2. **Masked Aadhaar / ID Display:** Only the last 4 digits (e.g., `XXXX-XXXX-4589`) are ever rendered on screens or transmitted in public payloads.
3. **Authenticated KYC Vault:** Uploaded KYC proofs are stored in private Cloudinary storage, accessible solely by authenticated counselors and administrators via temporary signed URLs.
4. **Public Privacy Shield:** Tutor and parent phone numbers and exact street addresses are strictly hidden on public routes to prevent unauthorized disintermediation.

---

## 🛠️ 8. Technology Stack & System Integrations

| Layer | Technology | Purpose / Justification |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 14 (App Router) + React 18** | High-performance Server-Side Rendering (SSR), Server Components, and Dynamic SEO metadata generation. |
| **Language** | **TypeScript 5.5** | End-to-end type safety across database models, API payloads, and UI components. |
| **Database** | **MySQL 8.0+** | Enterprise ACID compliance, relational integrity, foreign key constraints, and fast index scans. |
| **ORM** | **Prisma 5.18** | Type-safe queries, schema migrations, and declarative database modeling. |
| **Styling & Design System** | **Vanilla CSS & CSS Modules** | Ultra-clean Apple-inspired design system with Outfit typography, custom tokens, and zero CSS runtime overhead. |
| **Maps & Geospatial** | **Leaflet 1.9 & React-Leaflet** | Interactive tutor radar maps with pulsing sector markers and distance calculation. |
| **Authentication** | **NextAuth.js & Custom OTP** | Passwordless Email OTP (Brevo), Bcrypt password hashing, and Google OAuth 2.0. |
| **Email & Transactional** | **Brevo (Sendinblue API)** | Transactional OTP delivery, parent inquiry acknowledgments, and tutor status notifications. |
| **Media & Video Vault** | **Cloudinary CDN** | Auto-compressed WebP avatar delivery, video intro streaming, and authenticated KYC document storage. |
| **UI Icons & Visuals** | **Lucide-React & Canvas-Confetti** | Modern feather-light iconography and interactive celebratory micro-animations. |

---

## 🗄️ 9. Database Architecture & Prisma Schema

The application uses Prisma ORM connected to MySQL. Below is an overview of the core schema models:

```mermaid
erDiagram
    User ||--o| TutorProfile : "has profile"
    User ||--o{ Lead : "creates (Parent)"
    User ||--o{ Lead : "manages (Caller)"
    User ||--o{ Review : "writes"
    TutorProfile ||--o| TutorKYC : "submits"
    TutorProfile ||--o{ Lead : "assigned to"
    TutorProfile ||--o{ Review : "receives"
    Lead ||--o{ LeadActivity : "logs"

    User {
        string id PK
        string name
        string email UK
        string phone UK
        enum role
        datetime createdAt
    }

    TutorProfile {
        string id PK
        string userId FK
        string avatarUrl
        string introVideoUrl
        enum teachingMode
        string subjects
        string classes
        string boards
        string serviceAreas
        int travelRadiusKm
        float rating
        int reliabilityScore
        enum status
        boolean isVerified
    }

    TutorKYC {
        string id PK
        string tutorId FK
        string idType
        string idLast4
        string idNumberEncrypted
        string idDocUrl
        datetime verificationDate
    }

    Lead {
        string id PK
        string parentName
        string parentPhone
        string locality
        string gradeClass
        string subjectsNeeded
        enum preferredMode
        enum status
        int commissionAmount
        boolean isTwoSplit
    }

    Review {
        string id PK
        string tutorId FK
        string parentName
        int rating
        string comment
        boolean isApproved
    }

    PlatformConfig {
        string id PK
        int baseVerificationFee
        boolean isOfferActive
        int offerDiscountPercent
        string offerTitle
    }
```

---

## 🌐 10. REST API Reference

### 10.1 Lead Management Endpoints
* **`POST /api/leads`**
  - **Description:** Creates a new parent tuition inquiry from the homepage or booking modal.
  - **Payload:** `{ parentName, parentPhone, parentEmail?, preferredMode, locality, gradeClass, subjectsNeeded, board?, budgetMonthly?, notes? }`
  - **Response:** `{ success: true, lead: { id, status, ... } }`

* **`GET /api/leads`**
  - **Description:** Retrieves lead queue for counselors with status filters.
  - **Query Params:** `?status=NEW_LEAD&locality=dlf-phase-5`

* **`PATCH /api/leads/[leadId]`**
  - **Description:** Updates lead status, assigns counselor/tutor, or schedules demo.
  - **Payload:** `{ status, assignedTutorId, demoDate, commissionAmount, isTwoSplit, notes }`

* **`GET /api/leads/list`**
  - **Description:** Fast summary lead list for admin KPIs.

### 10.2 Tutor Lifecycle Endpoints
* **`POST /api/tutors/register`**
  - **Description:** Handles multi-step tutor registration, video URL, KYC encryption, and profile creation.
  - **Payload:** `{ name, email, phone, bio, highestDegree, experienceYears, teachingMode, subjects, classes, boards, serviceAreas, travelRadiusKm, hourlyRateHome, hourlyRateOnline, introVideoUrl, idType, idLast4, idNumber, idDocUrl }`

* **`GET /api/tutors/profile`**
  - **Description:** Retrieves the authenticated tutor's full profile, ID card data, active leads, and review feed.

* **`POST /api/tutors/reviews`**
  - **Description:** Submits a parent review for a verified tutor and recalculates the tutor's average rating.
  - **Payload:** `{ tutorId, parentName, rating, comment }`

* **`GET /api/tutors/reviews?tutorId=[tutorId]`**
  - **Description:** Fetches public approved reviews for a specific tutor.

### 10.3 Administration & Counselor Endpoints
* **`GET /api/admin/counselors`**
  - **Description:** Lists all telecallers with assigned lead counts and conversion metrics.

* **`POST /api/admin/counselors`**
  - **Description:** Creates a new telecaller/counselor user account.

* **`POST /api/auth/parent`**
  - **Description:** Passwordless / OTP authentication for parent dashboard access.

---

## 📁 11. Project Directory & File Structure

```
tuitionforhome/
├── prisma/
│   ├── schema.prisma             # Complete MySQL relational database schema
│   └── seed.js                   # Database seeder (Localities, Tutors, Config)
├── public/                       # Static public assets, icons, logos
├── scripts/
│   └── verify-test.js            # Automated DB & API verification script
├── src/
│   ├── app/
│   │   ├── admin/                # Super Admin Command Center & Login
│   │   │   ├── login/page.tsx
│   │   │   └── page.tsx
│   │   ├── api/                  # Next.js App Router API Routes
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── counselor/
│   │   │   ├── leads/
│   │   │   ├── parent/
│   │   │   └── tutors/
│   │   ├── book-demo/page.tsx    # Standalone demo booking landing page
│   │   ├── counselor/page.tsx    # Counselor / Telecaller Operations CRM Desk
│   │   ├── home-tutors-in-gurgaon/
│   │   │   └── [locality]/page.tsx # Programmatic 20+ Gurgaon Locality SEO Matrix
│   │   ├── parent/               # Parent Login & Management Dashboard
│   │   │   ├── dashboard/page.tsx
│   │   │   └── login/page.tsx
│   │   ├── tuition/
│   │   │   └── [subject]/page.tsx  # High-ticket subject SEO pillar pages
│   │   ├── tutor/                # Tutor registration, profile & review pages
│   │   │   ├── profile/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── review/[tutorId]/page.tsx
│   │   ├── globals.css           # Apple-inspired luxury CSS design system
│   │   ├── layout.tsx            # Global Root Layout with Outfit Google Font
│   │   ├── page.tsx              # High-converting Homepage
│   │   ├── robots.ts             # Dynamic search engine robots generator
│   │   └── sitemap.ts            # Programmatic XML sitemap generator
│   ├── components/               # Modular UI Component Library
│   │   ├── BookingModal.tsx      # Multi-step demo booking popup
│   │   ├── FeeEstimator.tsx      # 4-step dynamic pricing & fee slider widget
│   │   ├── Footer.tsx            # Global footer with SSSAM Academy trust seal
│   │   ├── HowItWorks.tsx        # Step-by-step guidance & guarantee pillars
│   │   ├── Navbar.tsx            # Global responsive header with mode switcher
│   │   ├── RapidoStyleMap.tsx    # Interactive Leaflet radar map with pulse animations
│   │   ├── StickyMobileBar.tsx   # Mobile floating 1-tap call & WhatsApp bar
│   │   ├── TutorMatchModal.tsx   # Real-time radar matchmaking simulation modal
│   │   └── VideoModal.tsx        # Lightbox 60s video intro player
│   └── lib/                      # Core utilities & static datasets
│       ├── crypto.ts             # AES-256-CBC encryption & decryption utility
│       ├── data.ts               # Gurgaon localities, mock tutors & office data
│       ├── prisma.ts             # Singleton Prisma client instance
│       └── seo-data.ts           # Subject SEO metadata & localized FAQ dictionary
├── .env.local                    # Environment keys & configuration
├── next.config.mjs               # Next.js build & image domain configuration
├── package.json                  # Project dependencies & scripts
├── task.md                       # Master implementation roadmap & task list
└── tsconfig.json                 # TypeScript compiler configuration
```

---

## 💻 12. Local Setup & Installation Guide

### Prerequisites
* **Node.js:** v18.17.0 or newer (v20+ recommended)
* **MySQL:** v8.0 or newer (Local instance or cloud connection via PlanetScale / AWS RDS)
* **Package Manager:** npm (v9+)

### Step 1: Clone & Install Dependencies
```bash
git clone https://github.com/Sudhirkr85/tuition4home.git
cd tuitionforhome
npm install
```

### Step 2: Configure Environment Variables
Create `.env.local` in the root directory and populate required keys:
```env
# Database Connection (MySQL)
DATABASE_URL="mysql://root:password@localhost:3306/tuitionforhome"

# NextAuth Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tuitionforhome_super_secret_jwt_key_2026"
GOOGLE_CLIENT_ID="your_google_oauth_client_id"
GOOGLE_CLIENT_SECRET="your_google_oauth_client_secret"

# Brevo Transactional Email Service (OTP & Alerts)
BREVO_API_KEY="your_brevo_api_key"
BREVO_SENDER_EMAIL="support@tuitionforhome.com"

# Cloudinary (Avatars, Videos & Authenticated KYC Documents)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

# Google Maps API (Optional for production geocoding)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_google_maps_api_key"

# Telegram Bot (Instant Counselor Staff Notifications)
TELEGRAM_BOT_TOKEN="your_telegram_bot_token"
TELEGRAM_CHAT_ID="your_telegram_group_chat_id"

# Firebase Cloud Messaging (Web Push Notifications)
NEXT_PUBLIC_FIREBASE_API_KEY="your_firebase_api_key"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_firebase_project_id"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"
```

### Step 3: Initialize Database & Push Schema
```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema directly to MySQL
npm run prisma:push

# (Optional) Seed initial data (Localities, default settings)
node prisma/seed.js
```

### Step 4: Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🧪 13. Testing & System Verification

Run the automated verification script to validate MySQL connectivity, Platform Config, Locality SEO entries, and Lead generation pipeline:

```bash
node scripts/verify-test.js
```

**Expected Output:**
```
🧪 Starting Full System & Database Tests for TuitionForHome...

✅ [TEST 1] MySQL DB Connection: PASS
   - Active Campaign: "Academic Session Special Drive"
   - Base Price: ₹999 (Discount: 100% OFF)
   - Operating Institute: M24 Ground Floor, Old DLF Colony, Sector 14, Gurugram, Haryana 122001

✅ [TEST 2] Locality SEO Matrix: PASS (14 Gurgaon Sectors Seeded)

✅ [TEST 3] Lead Insertion & DB Relation: PASS (Lead ID: 8a7b9c...)
   - Test lead cleanup completed.

🎉 ALL DATABASE AND ROUTE TESTS PASSED WITH ZERO ERRORS!
```

---

## 🚀 14. Production Deployment Guide

### Option A: Vercel (Recommended for Next.js App Router)
1. Push your repository to GitHub / GitLab.
2. Import project into Vercel Dashboard.
3. Configure all environment variables in Vercel Project Settings.
4. Set the build command to: `prisma generate && next build`.
5. Deploy.

### Option B: VPS / Dedicated Server (Ubuntu + PM2 + Nginx)
```bash
# Build the production bundle
npm run build

# Start with PM2 process manager
pm2 start npm --name "tuitionforhome" -- start

# Configure Nginx Reverse Proxy
sudo nano /etc/nginx/sites-available/tuitionforhome
# Point proxy_pass to http://127.0.0.1:3000
```

---

## 🏢 15. Official Center & Operation Verification

* **Platform Name:** **TuitionForHome**
* **Operating Institute:** **SSSAM Academy**
* **Address:** M24 Ground Floor, Old DLF Colony, Sector 14, Gurugram, Haryana 122001
* **Geographical Coordinates:** `28.4703° N, 77.0418° E`
* **Direct Counselor Helplines:** `+91 92170 31899` / `+91 95174 47689`
* **Official Emails:**
  - Support & Queries: `support@tuitionforhome.com`
  - General Info: `info@tuitionforhome.com` / `contact@tuitionforhome.com`
  - Educator Relations: `tutors@tuitionforhome.com` / `info@sssamacademy.com`
* **Operating Hours:** Monday – Sunday, 9:00 AM – 9:00 PM IST

---

## 📌 16. Continuous Feature Tracker & Roadmap

All discussions, new features, and technical enhancements are actively logged and tracked in [`task.md`](file:///d:/Work/tuitionforhome/task.md) and documented here in [`README.md`](file:///d:/Work/tuitionforhome/README.md).

### 🚀 Phase 9 Delivered Features & Enhancements:
- **Update 9.1 (Admin Counselor Desk UI Polish):** Removed redundant hardcoded "Desk Status" / "Desk Workload" column. Redesigned Counselor Management table into a clean, simple, Apple-inspired layout with 4 essential columns (Counselor & Desk ID, Email, Phone, and streamlined Action buttons: Edit, Password, Delete).
- **Update 9.2 (Zero Horizontal Scroll & Responsive Mobile Cards):** Implemented fluid dual-layout rendering (clean 4-column structured table on desktop; zero-scroll stacked card cards on mobile). Sanitized baseline counselor data to display clean, realistic counselor names, professional emails, and valid phone numbers.
- **Update 9.3 (Removal of Internal UUIDs from UI):** Removed raw database UUID strings (`#3ed8ce3e`, `#57244e2f`, etc.) across desktop tables, mobile cards, and edit modals to display only human-readable counselor names, clean emails, and contact details.
- **Update 9.4 (Replaced All Browser Native `alert()` & `confirm()` with Centered UI Modals):** Replaced 100% of browser native popup dialogs (`confirm()`, `alert()`) across the entire codebase with modern, centered, Apple-inspired modal dialogs featuring backdrop blur, subtle icons, distinct Cancel / Destructive action buttons, and inline validation banners.
- **Update 9.5 (Counselor Pagination & Button Readability Fix):** Fixed the "+ Add New Counselor" button with solid high-contrast dark styling (`#0F172A`), white typography, and vibrant icon. Added full pagination with customizable items-per-page dropdown (5, 10, 20), page counters, and previous/next page navigation buttons for counselor desks.
- **Update 9.6 (Slide-Over Right Drawer for Tutor Allocation):** Converted the tutor allocation modal into a slide-over right panel (drawer). Added smart subject-matching (elevates exact subject matches to the top with `⚡ Subject Match` badge), live search bar, distance & sort controls, 1-click WhatsApp pitch generator, and an in-drawer full profile inspector.
- **Update 9.7 (Dynamic Tutor Catalog & In-Drawer Pagination):** Expanded verified tutor directory with diverse subject specialists (Math, Physics, Organic Chemistry, NEET Biology, Coding/AI, Commerce, Humanities, Primary Phonics) and implemented dynamic pagination with per-page dropdown (4, 8, 12), live item counter, and page navigation controls inside the allocation drawer.
- [x] **Update 9.8 (Direct Tutor Assignment Confirmation Modal - Yes/No Dialog):** Streamlined the allocation flow to skip mandatory demo bottlenecks. When a counselor clicks "Assign", the system opens a high-contrast, centered confirmation dialog summarizing both the student's requirement and the tutor's verified credentials with explicit `Cancel / No` and `Yes, Confirm & Assign` buttons.
- [x] **Update 9.9 (Scalable 1,000+ Tutor Management Hub & Tutor 360° Drawer):** Replaced the 2-column allocation layout with a high-capacity, clean structured Table View with multi-tier filters (Search, Subject, Locality, KYC Status) and pagination (`10`, `25`, `50` per page). Clicking any row opens the Tutor 360° Slide-Over Drawer with matching leads by distance & subject, video preview player, KYC document review with 1-click verification, Active/Hide toggle switch, and call notes CRM.
- [x] **Update 9.10 (Dedicated Tutor-Parent Connect & Coordination Desk Tab):** Added a dedicated `🤝 Connect & Coordinate` tab in the Admin & Counselor sidebar. Features side-by-side [Parent ⟷ Assigned Tutor] pair cards with 1-click `Call Parent`, `Call Tutor`, `WhatsApp Parent`, `WhatsApp Tutor`, `3-Way WhatsApp Intro`, Milestone lifecycle updater (1st Class Scheduled, 1st Class Done, Fee Paid, Replace Tutor), and 1-click `Change Tutor` re-assignment.

---

*TuitionForHome © 2026. Operated by SSSAM Academy. All Rights Reserved.*


