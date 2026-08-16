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

---

## 📌 Phase 9: Continuous Feature Roadmap & Discussion Tracker
> *Any new feature, improvement, or requirement discussed will be logged here and documented in `README.md` immediately.*

- [x] **Update 9.1 (Admin Counselor Desk UI Polish):** Removed redundant hardcoded "Desk Status" / "Desk Workload" column. Redesigned Counselor Management table into a clean, simple, Apple-inspired layout with 4 essential columns (Counselor & Desk ID, Email, Phone, and streamlined Action buttons: Edit, Password, Delete).
- [x] **Update 9.2 (Zero Horizontal Scroll & Responsive Mobile Cards):** Implemented fluid dual-layout rendering (clean 4-column structured table on desktop; zero-scroll stacked card cards on mobile). Sanitized mock and baseline counselor data to display clean, realistic counselor names, professional emails, and valid phone numbers.
- [x] **Update 9.3 (Removal of Internal UUIDs from UI):** Removed meaningless database UUID strings (`#3ed8ce3e`, `#57244e2f`, etc.) across desktop tables, mobile cards, and edit modals. The UI now cleanly displays only human-readable counselor names, clean emails, and contact details.
- [x] **Update 9.4 (Replaced All Browser Native `alert()` & `confirm()` with Centered UI Modals):** Replaced 100% of browser native popup dialogs (`confirm()`, `alert()`) across the entire codebase with modern, centered, Apple-inspired modal dialogs featuring backdrop blur, subtle icons, distinct Cancel / Destructive action buttons, and inline validation banners.
- [x] **Update 9.5 (Counselor Pagination & Button Readability Fix):** Fixed the "+ Add New Counselor" button with solid high-contrast dark styling (`#0F172A`), white typography, and vibrant icon. Added full pagination with customizable items-per-page dropdown (5, 10, 20), page counters, and previous/next page navigation buttons for counselor desks.
- [x] **Update 9.6 (Slide-Over Right Drawer for Tutor Allocation):** Converted the tutor allocation modal into a slide-over right panel (drawer). Added smart subject-matching (elevates exact subject matches to the top with `⚡ Subject Match` badge), live search bar, distance & sort controls, 1-click WhatsApp pitch generator, and an in-drawer full profile inspector.
- [x] **Update 9.7 (Dynamic Tutor Catalog & In-Drawer Pagination):** Expanded verified tutor directory with diverse subject specialists (Math, Physics, Organic Chemistry, NEET Biology, Coding/AI, Commerce, Humanities, Primary Phonics) and implemented dynamic pagination with per-page dropdown (4, 8, 12), live item counter, and page navigation controls inside the allocation drawer.
- [x] **Update 9.8 (Direct Tutor Assignment Confirmation Modal - Yes/No Dialog):** Streamlined the allocation flow to skip mandatory demo bottlenecks. When a counselor clicks "Assign", the system opens a high-contrast, centered confirmation dialog summarizing both the student's requirement and the tutor's verified credentials with explicit `Cancel / No` and `Yes, Confirm & Assign` buttons.
- [x] **Update 9.9 (Scalable 1,000+ Tutor Management Hub & Tutor 360° Drawer):** Replaced the 2-column allocation layout with a high-capacity, clean structured Table View with multi-tier filters (Search, Subject, Locality, KYC Status) and pagination (`10`, `25`, `50` per page). Clicking any row opens the Tutor 360° Slide-Over Drawer with matching leads by distance & subject, video preview player, KYC document review with 1-click verification, Active/Hide toggle switch, and call notes CRM.
- [x] **Update 9.10 (Dedicated Tutor-Parent Connect & Coordination Desk Tab):** Added a dedicated `🤝 Connect & Coordinate` tab in the Admin & Counselor sidebar. Features side-by-side [Parent ⟷ Assigned Tutor] pair cards with 1-click `Call Parent`, `Call Tutor`, `WhatsApp Parent`, `WhatsApp Tutor`, `3-Way WhatsApp Intro`, Milestone lifecycle updater (1st Class Scheduled, 1st Class Done, Fee Paid, Replace Tutor), and 1-click `Change Tutor` re-assignment.
- [x] **Update 9.11 (2-Way Fees & Tutor Payouts Finance Ledger Desk):** Added a dedicated `💰 Fees & Payouts` tab in the sidebar. Displays real-time financial KPI metrics (Total Advance Collected, Advance Due from Parents, Academy Net 25% Commission, and Tutor Payouts Due). Includes a structured 2-way ledger table, 1-click `Record Parent Advance` modal, 1-click `Record Tutor Payout` modal, automated WhatsApp UPI Advance Fee Reminders, and automated WhatsApp Payout Slips to educators.
- [x] **Update 9.12 (Parent & Student Master Directory & 360° Drawer):** Replaced the redundant "Converted Leads" tab with a high-capacity **`👨‍👩‍👧 Parent Directory`** tab. Features multi-tier filter toolbar (Live Search, Grade Level dropdown, Status pills), scalable table view, pagination (5, 10, 25, 50), and a comprehensive **Parent 360° Slide-Over Right Drawer** with Student requirements, Assigned Educator inspector with 1-click re-assignment, Monthly Fee ledger, and Counselor Call CRM notes.
- [x] **Update 9.13 (Dedicated Counselor Calling & Operations Portal - Zero Fee Clutter):** Upgraded `/counselor` portal into a focused 4-desk operations suite: (1) **Calling Lead Desk** with 8 status filters, mandatory call notes dialog, and direct WhatsApp/Call triggers; (2) **Tutor Allocator** with 1,000+ tutor table, radius matcher, and 1-click Direct Assignment; (3) **Parent Directory** with grade filters and 360° drawer; and (4) **Coordination Desk** with 3-way WhatsApp intros and session milestone management. Completely excludes all financial revenue counters, fee ledgers, and staff settings from counselor view for security and operational focus.
- [x] **Update 9.14 (100% Dynamic Prisma MySQL Database Architecture & Static Data Removal):** Migrated the entire application from hardcoded mock datasets to a live, persistent Prisma MySQL database. Added `GET /api/tutors/list` and `GET /api/config/global` endpoints. Connected Homepage, Rapido Interactive Map, Locality pages, Subject pages, Admin Dashboard, and Counselor Portal to fetch live verified educators, parent inquiries, and platform configs directly from the database. Added 1-command `npm run db:reset` and `npm run db:seed` workflows.
- [x] **Update 9.15 (High-Capacity Database Seeding):** Seeded 100 verified educators and 50 realistic parent leads with complete activity history into the MySQL database.
- [x] **Update 9.16 (Zero "Book Demo" Policy Enforcement):** Completely eliminated all "Book Demo" and "Free Demo" mentions across the public website, parent workflows, and portals, cementing the direct placement policy at the top of README.md.
- [x] **Update 9.17 (Public Tutors Directory `/tutors` & Privacy-Safe Profile `/tutors/[id]`):** Optimized homepage load time by slicing top 6 featured educators. Built high-performance `/tutors` catalog with live search, 10 subject filter pills, 14 Gurgaon locality dropdown, teaching mode toggle, sorting, and pagination (9/page). Created Apple-grade `/tutors/[id]` public profile featuring degrees, 60s video audition player, subject capabilities, rates, and 1-click Academy Class Request CTA with **Strict Privacy Protection (Zero phone, email, or Aadhaar leakage)**.
- [x] **Update 9.18 (Optional Intro Video Architecture):** Made 60s intro video optional across all tutor cards and profile views with automatic fallback to SSSAM Academy In-Person Interview verification seals.
- [x] **Update 9.19 (Dynamic Fee Range Pricing Engine):** Converted single static pricing to realistic hourly and monthly fee ranges (e.g. `₹700–₹1,000/hr`, `₹7,500–₹11,000/mo`) and added a budget range filter in the directory.
- [x] **Update 9.20 (Prominent Dual Education & Experience Stat Cards):** Re-engineered tutor cards with high-contrast, strictly balanced 50-50 dual stat boxes showcasing Degree and Experience with text truncation and clean dividers.
- [x] **Update 9.21 (LinkedIn-Style Professional Experience Timeline & Zero Police Check Clean):** Added an interactive LinkedIn-style career timeline and education block on `/tutors/[id]`, balanced the 2-column layout to full height with 4 comprehensive parent guarantee and process cards, eliminated all police check references in favor of Aadhaar/degree audits, and polished the Parent Dashboard.
- [ ] *(Upcoming features and enhancements discussed with the user will be logged here with status checkpoints).*


