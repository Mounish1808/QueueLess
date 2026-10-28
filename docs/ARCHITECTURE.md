# QueueLess Architecture Specification

## 1. System Architectural Overview

**QueueLess** implements an industry-standard **Three-Tier Architecture** tailored for academic clarity and high operational robustness.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TIER 1: PRESENTATION LAYER                      │
│                                                                        │
│   • React JS 19 Components (Vite Bundler)                              │
│   • HTML5 Semantic Page Structure (<header>, <nav>, <main>, etc.)       │
│   • CSS3 Styling System:                                               │
│       - External Stylesheet: src/index.css (Tokens & Responsive Grid)  │
│       - Embedded Stylesheet: <style> in TokenBadge & SyllabusLab       │
│       - Inline Styles: style={{ ... }} for dynamic metrics & progress  │
│   • HTML5 Interactive Image Map (<map> & <area> Hotspots)              │
│   • Accessible ARIA Roles & Mobile Hamburger Responsive Drawer         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    │ Event Dispatches / State Mutations
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   TIER 2: APPLICATION & LOGIC LAYER                    │
│                                                                        │
│   • Reactive Client State Machine & LocalStorage Coordinator           │
│   • Client-Side JavaScript Validation Engine:                          │
│       - Regex Matching: RFC Email, 10-digit Phone, 6-digit PIN,        │
│         Strong Password, and Expiry Dates                              │
│       - Luhn Checksum Algorithm for Mock Card Verification             │
│   • Queue Sequencing & Position Recalculation Algorithm                │
│   • Web Audio API Synthesizer (Chime Generator for Called Tokens)      │
│   • Companion PHP Logic Layer (backend-php/users_crud.php):            │
│       - Server-side preg_match regex validation                        │
│       - RESTful JSON CRUD Router                                       │
│   • Companion Java EE Servlet Controller (academic-java-ee/):          │
│       - QueueBookingServlet & SessionTrackingServlet                   │
│       - HttpSession & Cookie Management                                │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    │ CRUD Storage Operations
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     TIER 3: DATA & STORAGE LAYER                       │
│                                                                        │
│   • Primary Client Storage: Browser LocalStorage (Synchronous JSON)    │
│       - Auto-seeding on fresh load                                     │
│       - CustomEvent ('queueless_storage_change') reactive dispatch     │
│       - One-click Reset to Demo Seed Data                              │
│   • Relational Database Schema: MySQL 8.0 DDL (backend-php/schema.sql) │
│       - Users, Services, Counters, and Tokens relational tables        │
│   • SQLite Fallback: Zero-configuration local database for testing     │
│   • Java JDBC Layer: TokenDAO with PreparedStatement pool              │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Layer Responsibilities

### Tier 1: Presentation Layer
- **Responsibility:** User interaction, presentation aesthetics, responsive adaptability, and data collection.
- **Key Modules:**
  - `Navbar.jsx`: Sticky brand bar, navigation tabs, quick 1-click role switcher, and live alerts dropdown.
  - `Home.jsx`: Landing marquee ticker, real-time counters board, service directory, and architecture summary.
  - `UserDashboard.jsx`: Active token status card, queue position tracker, reschedule modal, and appointment history.
  - `StaffDashboard.jsx`: Desk operator console with "Call Next", "Mark Serving", "Complete", "Skip", and "Add Walk-in".
  - `AdminDashboard.jsx`: System KPI overview, service catalog CRUD, counter status toggles, user records, and settings.
  - `CampusMap.jsx`: College campus plan implementing HTML5 `<map>` and `<area>` tags along with SVG hotspots.
  - `PaymentDemo.jsx`: Mock service fee gateway with Luhn card verification and printable receipts.
  - `Calculator.jsx`: Demonstration of React state hooks, event bubbling, and math sanitation.

### Tier 2: Business & Application Logic Layer
- **Responsibility:** Enforcing business rules, queue sequencing, state transitions, and validation integrity.
- **Key Logic:**
  - **Duplicate Booking Prevention:** Rejects booking if the same user already holds an active token for the identical service on the requested date.
  - **Dynamic Queue Position Recalculation:** When a token is completed or cancelled, all subsequent waiting tokens in that queue are dynamically re-indexed.
  - **Wait Time Estimation:** Evaluates `queue_position * service.avg_wait_mins` dynamically.
  - **Audio Annunciation:** Synthesizes airport / banking announcement chimes via the Web Audio API without network audio assets.
  - **Server-Side Validation:** Dual-enforced using PHP `preg_match` and Java `String.matches()`.

### Tier 3: Data & Storage Layer
- **Responsibility:** State persistence, transaction integrity, and seed reset mechanisms.
- **Storage Engines:**
  - `localStorage`: Fast, zero-dependency browser persistence surviving page refreshes.
  - `MySQL / SQLite`: Structured relational model for students, services, counters, and tokens.
  - `JDBC TokenDAO`: Java database abstraction using parameterized queries.
