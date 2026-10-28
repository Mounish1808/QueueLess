# QueueLess — Smart Queue & Appointment Management System

🚀 **Live Deployment**: [https://queueless-flame.vercel.app](https://queueless-flame.vercel.app)  
📦 **GitHub Repository**: [https://github.com/Mounish1808/QueueLess](https://github.com/Mounish1808/QueueLess)

A complete, professional, interactive web application built for college offices, laboratories, libraries, examination branches, and student service counters.

Designed specifically to demonstrate the concepts of the **Web Programming syllabus** for college practical examinations and academic submissions.

---

## 1. Quick Start Instructions

### Prerequisites
- **Node.js** (v18+) & **npm**

### Running the Application
```bash
# 1. Install dependencies
npm install

# 2. Start the Vite development server
npm run dev

# 3. Open in your browser:
# http://127.0.0.1:5173
```

### Building for Production
```bash
npm run build
```

---

## 2. Demonstration Accounts & Quick Role Switcher

For effortless practical examination review, a **1-click Role Switcher** is provided directly in the top navigation bar. You can switch between roles instantly without re-logging in:

| Role | Demo Account Name | Email | Password | Assigned Counter / Area |
|------|-------------------|-------|----------|-------------------------|
| **Student (Customer)** | Aarav Sharma | `student@college.edu` | `Pass@1234` | Admissions & Exam Tokens |
| **Staff Member** | Prof. Priya Nair | `staff.library@college.edu` | `Staff@1234` | Counter 4 (Central Library) |
| **Administrator** | Admin Officer Rajesh | `admin@college.edu` | `Admin@1234` | College Administration Console |

---

## 3. Web Programming Syllabus Concepts Demonstrated

| Syllabus Concept | Implementation Details | File Location |
|------------------|------------------------|---------------|
| **HTML5 Semantic Elements** | `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<figure>` | `src/components/Navbar.jsx`, `Home.jsx`, `Footer.jsx` |
| **HTML Image Map & Hotspots** | Native HTML `<map name="campus-map">` and `<area shape="rect" coords="...">` tags | `src/components/CampusMap.jsx` |
| **CSS3 External Stylesheet** | Global CSS custom properties, grid layouts, flexbox, badges, buttons, responsive design | `src/index.css` |
| **CSS3 Embedded Stylesheet** | Scoped `<style>` blocks for printable token cards and interactive color test cards | `src/components/TokenBadge.jsx`, `src/components/SyllabusLab.jsx` |
| **CSS3 Inline Styles** | Dynamic style attributes (`style={{ width: `${pct}%` }}`) for real-time progress bars | `src/components/Analytics.jsx`, `src/components/SyllabusLab.jsx` |
| **JavaScript Form Validation** | Validation for registration, login, profile, and mock payment forms | `src/utils/validation.js`, `src/components/AuthModal.jsx` |
| **JavaScript Regular Expressions** | Regex for email, 10-digit Indian phone (`/^[6-9]\d{9}$/`), 6-digit PIN, strong password | `src/utils/validation.js`, `src/components/SyllabusLab.jsx` |
| **React JS State & Routing** | Functional components, `useState`, `useEffect`, `useMemo`, `useCallback`, reactive events | `src/App.jsx`, `src/components/` |
| **React Calculator** | Keypad arithmetic (+, -, ×, ÷), division-by-zero protection, calculation history log | `src/components/Calculator.jsx` |
| **PHP Regular Expressions** | Server-side validation using PHP `preg_match` for name, email, phone, and password | `backend-php/users_crud.php` |
| **PHP & MySQL CRUD** | Complete Create, Read, Update, Delete REST operations via PDO with SQLite fallback | `backend-php/` |
| **Three-Tier Architecture** | Presentation Tier (React/HTML), Logic Tier (State/PHP/Java), Database Tier (MySQL/Storage) | `docs/ARCHITECTURE.md` |
| **Java Servlets & MVC** | `HttpServlet` handling POST requests, input validation, and forwarding to JSP | `academic-java-ee/src/com/queueless/servlet/QueueBookingServlet.java` |
| **JavaBeans** | Serializable model with private fields, getters, setters | `academic-java-ee/src/com/queueless/model/TokenBean.java` |
| **Java JDBC & DAO** | `PreparedStatement` parameterized queries and connection pooling | `academic-java-ee/src/com/queueless/dao/TokenDAO.java` |
| **Sessions & Cookies** | `HttpSession` creation, attributes, and client cookies | `academic-java-ee/src/com/queueless/servlet/SessionTrackingServlet.java` |
| **Dynamic JSP Pages** | Dynamic token generation and session display | `academic-java-ee/web/booking.jsp`, `queue_status.jsp` |

---

## 4. Key Application Features

### 🏢 Landing Page & Live Ticker
- Campus-wide live queue ticker showing active tokens in real-time.
- Live Service Counters Board (Counters 1 to 7) displaying serving tokens, waiting counts, and desk statuses.
- Service catalog with expected wait times and direct booking shortcuts.

### 🎫 Queue Booking & Token Generation
- Select campus service, date, and preferred time slot.
- Instant token generation (e.g. `ADM-101`, `LIB-202`) with queue position and estimated wait time.
- Duplicate booking prevention for the same service and date.
- Printable digital ticket badge with simulated QR verification key.

### 👤 Student Dashboard
- Hero card for current active token with live status (`waiting`, `called`, `serving`).
- Real-time queue position indicator (`#1 in line`, `2 people ahead of you`).
- Reschedule and cancel appointment actions.
- Past booking history with search filters.
- Student profile editor with form validation.

### 👩‍💼 Staff Operations Console
- Counter desk selector (switch between physical desks).
- "Call Next Token" button with **dual-tone audio chime synthesized via Web Audio API**.
- Mark tokens as `serving`, `completed`, `skipped (absent)`, or `cancelled`.
- Counter pacing control (Pause/Resume counter for lunch breaks).
- "Add Walk-in Student" tool for instant paperless token generation right at the counter.

### 🛡️ Administrator Dashboard
- Add, edit, and delete campus services (adjust fees, duration, descriptions).
- Counter desk assignments and activation toggles.
- User and staff directory.
- Master bookings ledger with status filters.
- Campus operating hours and slot capacity configuration.
- "Reset to Demo Data" button.

### 📊 Reports & Analytics
- Calculated dynamic metrics: total bookings, waiting, completed, cancelled, and average wait time.
- Interactive SVG charts: Service volume distribution, queue resolution ratios, and counter efficiency.
- One-click export to CSV spreadsheet.

### 🗺️ Campus Map & Interactive Hotspots
- High-resolution campus layout using **HTML5 `<map>` and `<area>` image hotspots**.
- Clickable locations: Administrative Block, Central Library, Examination Branch, CS Labs, Health Center.
- Opens building details, operating hours, active queue count, and a direct "Book Token Here" button.

### 💳 Mock Payment Gateway
- Demonstration fee payment for services requiring verification fees (e.g. ₹50 or ₹100).
- 16-digit card input with auto-formatting and Luhn algorithm checksum.
- Simulator toggle: "Simulate Success" vs "Simulate Bank Decline".
- Printable transaction receipt with Reference ID.

### 🧮 React Fundamentals Calculator
- Arithmetic operations (+, -, ×, ÷, %, ±, .).
- Division-by-zero protection and keyboard navigation.
- Calculation history log with "Use" button.
- Annotated code panel highlighting React hooks and event handling.

### 🔬 Syllabus Lab (Viva Showcase)
- Dedicated interactive inspector tab in the web application for external examiners to inspect:
  - CSS 3 Types (External vs Embedded `<style>` vs Inline).
  - JavaScript Regular Expression Engine with live interactive tester.
  - HTML5 Semantics & `<map>` tag specification.
  - PHP + MySQL CRUD and `preg_match` implementation.
  - Java Servlets, JSP, JDBC, Sessions, and Cookies.

---

## 5. Project Directory Structure

```
assignment 2/
├── backend-php/                  # PHP + MySQL academic module
│   ├── config.php                # Database PDO connection (MySQL + SQLite fallback)
│   ├── schema.sql                # Full MySQL schema DDL & seed data
│   ├── users_crud.php            # User CRUD with PHP regular expressions
│   ├── queue_api.php             # Queue tokens API
│   └── README.md                 # PHP documentation & execution guide
├── academic-java-ee/             # Java Servlets, JSP, JDBC academic module
│   ├── src/com/queueless/
│   │   ├── model/TokenBean.java  # JavaBean model
│   │   ├── dao/TokenDAO.java     # JDBC Data Access Object
│   │   └── servlet/
│   │       ├── QueueBookingServlet.java
│   │       └── SessionTrackingServlet.java
│   ├── web/
│   │   ├── WEB-INF/web.xml       # Deployment descriptor
│   │   ├── booking.jsp           # Input form JSP
│   │   └── queue_status.jsp      # Dynamic token status JSP
│   └── README.md                 # Tomcat deployment & architecture guide
├── docs/
│   ├── ARCHITECTURE.md           # Three-Tier Architecture documentation
│   ├── SYLLABUS_MAPPING.md       # Complete syllabus concepts-to-code matrix
│   └── TEST_CHECKLIST_AND_VIVA.md# Test checklist & viva Q&A guide
├── src/
│   ├── components/               # React functional components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Home.jsx
│   │   ├── UserDashboard.jsx
│   │   ├── StaffDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── CampusMap.jsx
│   │   ├── Analytics.jsx
│   │   ├── PaymentDemo.jsx
│   │   ├── Calculator.jsx
│   │   ├── SyllabusLab.jsx
│   │   ├── AuthModal.jsx
│   │   ├── BookingModal.jsx
│   │   └── TokenBadge.jsx
│   ├── data/seedData.js          # Realistic seed data
│   ├── services/storage.js       # LocalStorage abstraction with reactive events
│   ├── utils/validation.js       # Regex patterns & client-side validation
│   ├── utils/soundEffects.js     # Web Audio API chime synthesizer
│   ├── App.jsx                   # Master state coordinator & router
│   ├── index.css                 # External CSS design system
│   └── main.jsx
├── index.html                    # HTML5 entry with Google Fonts & metadata
├── package.json
└── README.md
```

---

## 6. Testing PHP Locally

To test the PHP module using PHP's built-in server (zero MySQL setup required):
```bash
php -S 127.0.0.1:8000 -t backend-php/
```
Test endpoints:
```bash
# Get all users (JSON)
curl http://127.0.0.1:8000/users_crud.php

# Create student with regex validation
curl -X POST http://127.0.0.1:8000/users_crud.php \
  -H "Content-Type: application/json" \
  -d '{"name":"Aarav Sharma","email":"aarav@college.edu","phone":"9876543210","pin_code":"560001","password":"Pass@1234"}'
```
