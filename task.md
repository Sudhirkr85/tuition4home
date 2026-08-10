# 📋 TuitionForHome — Master Implementation Task List (`task.md`)

> **Project:** TuitionForHome — Hybrid Home & Online Tuition Platform (Gurgaon & Delhi NCR)  
> **Operated By:** SSSAM Academy (M24 Sector 14, Gurugram)  
> **Brand Colors:** Royal Slate (`#0B132B` / `#0F172A`), Electric Blue (`#2563EB`), Emerald Glow (`#10B981`), Amber Gold (`#F59E0B`), Porcelain (`#F8FAFC`)  
> **Typography:** Outfit (Google Fonts) + Modern Clean Sans-Serif  

---

## 🏗️ Phase 1: Project Setup, Design System & Database Schema
- [x] **Task 1.1:** Initialize Next.js 14 App Router project with TypeScript, ESLint, and Vanilla CSS in `./`.
- [x] **Task 1.2:** Configure `package.json` with production dependencies (`prisma`, `@prisma/client`, `next-auth`, `bcryptjs`, `lucide-react`, `canvas-confetti`).
- [x] **Task 1.3:** Setup `.env.local` with all placeholder environment keys for MySQL, NextAuth, Brevo, Cloudinary, Maps, Telegram, and Firebase.
- [x] **Task 1.4:** Create complete **Prisma MySQL Schema** with strict foreign key relations, constraints, and indexes.
- [x] **Task 1.5:** Build Apple-inspired luxury design system in `src/app/globals.css` with Outfit font, custom CSS tokens, smooth micro-animations, and glassmorphic utility classes.
- [x] **Task 1.6:** Setup Global Header/Navbar with `TuitionForHome` brand logo support, Mode Switcher (Home/Online), and responsive mobile navigation.
- [x] **Task 1.7:** Setup Global Footer with SSSAM Academy Sector 14 Gurugram physical office trust seal, links, and helpline numbers.

---

## 🌐 Phase 2: High-Converting Homepage & Public Features
- [x] **Task 2.1:** **Hero Section:** High-impact heading, search bar with Mode Toggle (Home vs Online), Gurgaon locality & subject dropdowns, quick trust metrics.
- [x] **Task 2.2:** **Interactive Fee Estimator Widget:** 3-step dynamic slider for Grade + Subject + Mode + Days/week estimating monthly tuition fee.
- [x] **Task 2.3:** **Verified Tutor Showcase Grid:** Luxury cards with photo, 60s video intro trigger, ratings, subjects, degrees, and *"Book Free Demo"* CTA.
- [x] **Task 2.4:** **100% Replacement & SSSAM Academy Guarantee Section:** Trust pillars, physical center demo option, background check assurance.
- [x] **Task 2.5:** **High-Ticket Crash Courses & IB/Cambridge Section:** Board exam revision packages & international school elite tutors.
- [x] **Task 2.6:** **Sticky Mobile Action Widget:** Floating 1-tap `[📞 Call Counselor]` & `[💬 WhatsApp Inquiry]` buttons.
- [x] **Task 2.7:** **Modal Demo Booking Component:** 3-step instant popup form with Google Maps address autocomplete.

---

## 📍 Phase 3: Programmatic Hyper-Local SEO Engine (Gurgaon & NCR)
- [x] **Task 3.1:** Create dynamic locality route: `/home-tutors-in-gurgaon/[locality]`.
- [x] **Task 3.2:** Pre-render 20+ top Gurgaon localities (DLF Phase 1–5, Golf Course Rd, Sohna Rd, Nirvana Country, Sector 56, etc.).
- [x] **Task 3.3:** Inject Google `LocalBusiness`, `EducationalOrganization`, and `FAQPage` Schema.org JSON-LD with SSSAM Academy coordinates (`28.4703° N, 77.0418° E`).
- [x] **Task 3.4:** Create dynamic subject route & metadata generator.
- [x] **Task 3.5:** Generate dynamic `sitemap.xml` and `robots.txt` for search engines.

---

## 👨‍🏫 Phase 4: Tutor Onboarding, Video & KYC Lifecycle
- [x] **Task 4.1:** Multi-step Tutor Registration page (`/tutor/register`):
  - Step 1: Personal Info, Bio, Avatar Photo & Mode (Home/Online/Both).
  - Step 2: 60s Video Introduction (YouTube unlisted embed or direct upload).
  - Step 3: Teaching Specs (Subjects, Classes 1–12, CBSE/ICSE/IB/Cambridge).
  - Step 4: Dual Location Preferences (GPS Radius + Preferred Gurgaon Sectors).
  - Step 5: Hourly rate expectations for Home vs. Online.
  - Step 6: KYC Document Upload (Masked Aadhaar, Driving License, PAN, or Degree).
  - Step 7: Active Festival / Seasonal Offer Banner (`~~₹999~~ ₹0 Free` / Full price).
- [x] **Task 4.2:** Tutor Dashboard & Verification Progress Tracking (`Draft` ➔ `Pending Interview` ➔ `Active & Verified`).

---

## 📞 Phase 5: Counselor Operations CRM (Lead & Interview Desk)
- [x] **Task 5.1:** Inbound Parent Lead Management Desk (`/counselor`):
  - Live lead queue with status filter (`New`, `Demo Scheduled`, `Tuition Confirmed`, `Closed`).
  - 1-Click WhatsApp (`wa.me`) and Direct Call actions with pre-filled message templates.
- [x] **Task 5.2:** Tutor Interview & Verification Desk:
  - Queue of pending tutor applications.
  - 60s Video intro player & private KYC document viewer.
  - Interview Scorecard (Communication rating, subject depth, location notes).
  - 1-Click `Approve & Activate Badge` or `Reject`.
- [x] **Task 5.3:** Smart Proximity Matchmaking Engine:
  - Distance calculation matching nearest verified home tutors to a student's sector.
- [x] **Task 5.4:** Digital WhatsApp Demo Slip & 1-Click 1st-Month Commission QR Invoice Generator.

---

## 👑 Phase 6: Super Admin Command Center
- [x] **Task 6.1:** Master Business & Revenue Dashboard (`/admin`):
  - Live KPIs: Total Verified Tutors, Today's Inbound Leads, Active Tuitions, Monthly Commission Revenue.
- [x] **Task 6.2:** Dynamic Pricing & Festival Campaign Controller (`/admin`):
  - Change base verification fee (₹999), 1-click Festival Discount Toggle (100% Free / 50% Off / Full Price), and custom festival headlines.
- [x] **Task 6.3:** Counselor Team Performance Tracker:
  - Calls made, interviews conducted, demos booked, and revenue generated per counselor.
- [x] **Task 6.4:** Locality SEO & Pincode Registry.
- [x] **Task 6.5:** Commission Ledger & Settlement Tracker.

---

## 🔐 Phase 7: Authentication & Instant Alert Integrations
- [x] **Task 7.1:** Brevo Email OTP service + Password login + Google OAuth 2.0 configuration.
- [x] **Task 7.2:** Telegram Lead Alert Bot API integration (`/api/leads` with instant staff Telegram webhook).
- [x] **Task 7.3:** Firebase Cloud Messaging (FCM) Web Push setup.
- [x] **Task 7.4:** Automated Post-Demo Parent WhatsApp Feedback triggers.

---

## 🧪 Phase 8: Testing, Polish & Build Verification
- [x] **Task 8.1:** Validate Prisma schema & database relations.
- [x] **Task 8.2:** Test end-to-end Parent Lead Submission flow with instant confirmation.
- [x] **Task 8.3:** Test end-to-end Tutor Registration & Counselor Approval flow.
- [x] **Task 8.4:** Verify responsive mobile UI, micro-animations, and fast page load speeds.
