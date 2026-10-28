# QueueLess — Test Checklist & Viva Examination Guide

This document contains a comprehensive verification checklist covering every major interaction in QueueLess, along with common external examiner viva questions and recommended answers.

---

## 1. Practical Test Verification Checklist

### A. Landing Page & Live Ticker
- [x] **Page Load:** Header shows brand logo, role switcher pill, navigation links, and notification bell.
- [x] **Marquee Ticker:** Top banner continuously animates live counter statuses across campus.
- [x] **Live Counters Board:** Displays Counters 1 through 7 with staff names, current serving token, and waiting counts.
- [x] **Service Directory:** Service cards show physical locations, avg wait times, fee tags, and "Book Token" buttons.
- [x] **Three-Tier Architecture Card:** Overview explaining Tier 1 (Presentation), Tier 2 (Logic), and Tier 3 (Database).

### B. User Registration & Login Validation
- [x] **Required Fields:** Submitting an empty registration form displays clear red error labels under missing fields.
- [x] **Full Name Regex:** Rejects numbers or symbols (e.g. `John123`); accepts valid alphabetic names (e.g. `Aarav Sharma`).
- [x] **Email Regex:** Rejects invalid patterns (e.g. `aarav@`); accepts standard RFC email (`student@college.edu`).
- [x] **Mobile Regex:** Rejects numbers shorter than 10 digits or starting with digits < 6; accepts valid 10-digit Indian numbers (`9876543210`).
- [x] **PIN Code Regex:** Enforces exactly 6 numeric digits (`560001`).
- [x] **Password Strength:** Requires at least 8 characters with 1 uppercase, 1 lowercase, 1 digit, and 1 special symbol.
- [x] **Password Match:** Flags error when "Confirm Password" does not match.
- [x] **Password Visibility Toggle:** Eye icon toggles between masked dots and plain text.
- [x] **Demo Quick Fill:** 1-click buttons for Student, Staff, and Admin credentials.

### C. Queue Booking System & Token Generation
- [x] **Service Selection:** Pre-selects service when clicked from Service Catalog or Campus Map.
- [x] **Slot Scheduling:** Date picker defaults to today; time slot selector provides discrete appointment intervals.
- [x] **Token Creation:** Generates structured token (e.g. `ADM-103`) and increments waiting count.
- [x] **Duplicate Booking Prevention:** Attempting to book the same service on the same date triggers an alert warning.
- [x] **Printable Ticket:** Displays `TokenBadge` card with QR code simulation, queue position, estimated wait time, and print button.

### D. User Dashboard
- [x] **Active Token Hero Card:** Displays active ticket with live status badge (`waiting`, `called`, `serving`).
- [x] **Queue Position & Wait Countdown:** Displays `#1 in line` and estimated wait minutes.
- [x] **Reschedule Action:** Opens reschedule modal to change appointment date and slot.
- [x] **Cancel Action:** Prompts for confirmation and updates status to `cancelled`.
- [x] **Booking History:** Searchable table filtering past completed, cancelled, or skipped appointments.
- [x] **Profile Editor:** Allows editing student contact info and postal PIN with validation.

### E. Staff Operations Console
- [x] **Counter Switcher:** Staff operator can switch between assigned desks (e.g., Counter 1 vs Counter 4).
- [x] **Call Next Token:** Advances the queue, marks next waiting student as `serving`, and plays dual-tone Web Audio chime.
- [x] **Status Transitions:** Buttons to mark customer as `completed`, `skipped (absent)`, or `cancelled`.
- [x] **Pause / Resume Desk:** Toggles counter state between `active` and `paused (on break)`.
- [x] **Add Walk-in Student:** Instant modal to issue a paperless ticket directly at the counter.
- [x] **Table Filters:** Search by token/name and filter by status (`all`, `waiting`, `serving`, `completed`, `skipped`).

### F. Admin Console & Configuration
- [x] **Summary KPIs:** Dynamic cards for Total Bookings, Waiting, Serving, Completed, and Cancelled.
- [x] **Services CRUD:** Add new service, edit existing service properties/fees, and delete services.
- [x] **Counters Management:** Add counter, assign staff officers, and activate/pause desks.
- [x] **User Records:** Lists all registered students, staff, and admin accounts.
- [x] **Master Ledger:** College-wide ledger of all queue entries with status filters.
- [x] **System Settings:** Operating hours and slot capacity configuration.
- [x] **Reset Demo Data:** Restores all data back to clean factory demonstration seed.

### G. Reports & Analytics
- [x] **Dynamic Calculations:** Metrics derived from live state rather than static text.
- [x] **Service Distribution:** Donut bar visualization showing percentage volume per department.
- [x] **Status Resolution:** Resolution ratio comparison (Completed vs Waiting vs Cancelled vs Skipped).
- [x] **Counter Throughput:** Leaderboard of tokens processed per physical desk.
- [x] **CSV Export:** Generates and downloads a `.csv` spreadsheet file with one click.

### H. Campus Map & Hotspots
- [x] **Image Map Implementation:** Uses native HTML5 `<map name="campus-map">` and `<area shape="rect" coords="...">` tags.
- [x] **Interactive Hotspots:** Clicking any building (Admin Block, Library, Exam Cell, CS Labs, Health Center) opens building details.
- [x] **Queue Integration:** Displays live queue length for that building and provides a 1-click "Book Token" button.

### I. Mock Payment Demonstration
- [x] **Fee Summary:** Breakdown of base service charge, 18% GST, and total payable amount.
- [x] **Input Formatting:** Auto-formats 16-digit card number with spacing (`xxxx xxxx xxxx xxxx`).
- [x] **Validation:** Validates cardholder name, MM/YY expiry, CVV, and performs the Luhn algorithm checksum.
- [x] **Simulator Controls:** Toggle to simulate either "Success" or "Bank Decline".
- [x] **Printable Receipt:** Generates official transaction receipt with Transaction Reference ID.

### J. React Calculator
- [x] **Keypad & Display:** Full arithmetic operations (+, -, ×, ÷, %, ±, .).
- [x] **Input Sanitation:** Division by zero protection, decimal chaining prevention, and backspace.
- [x] **Calculation Memory:** Session history list with "Use" button to recall previous answers.
- [x] **Keyboard Shortcuts:** Physical keyboard numbers and operators trigger matching calculations.

---

## 2. Common Viva Examination Questions & Answers

### Q1: What architecture does this application follow, and how are the layers decoupled?
> **Answer:** QueueLess follows a standard **Three-Tier Architecture**:
> 1. **Presentation Tier:** Built with React JS 19, HTML5 semantic tags, and CSS3 stylesheets.
> 2. **Application / Business Logic Tier:** Enforces validation rules, duplicate booking checks, queue position recalculation, and audio annunciation via the Web Audio API. Companion logic is provided via PHP scripts (`users_crud.php`) and Java Servlets (`QueueBookingServlet.java`).
> 3. **Database Tier:** Client-side persistence via `localStorage` with reactive event dispatch, paired with a complete relational MySQL schema (`schema.sql`) and Java JDBC DAO (`TokenDAO.java`).

### Q2: What is the difference between External, Embedded, and Inline CSS in your application?
> **Answer:**
> - **External CSS (`src/index.css`):** Linked via `<link>`, defining global design tokens (CSS variables), grid systems, typography, and `@media print` queries.
> - **Embedded CSS (`<style>` tag):** Placed directly in document components (e.g. `TokenBadge.jsx` for print ticket formatting and `SyllabusLab.jsx` with a live color picker).
> - **Inline CSS (`style={{ ... }}`):** Injected directly into JSX nodes for dynamic, state-driven styles like progress bar percentages and dynamic font sizing.

### Q3: How did you implement the HTML image map requirement?
> **Answer:** In `CampusMap.jsx`, we embedded the campus layout and defined clickable hotspots using the HTML5 `<map name="campus-map">` and `<area shape="rect" coords="..." alt="..." />` tags. Clicking any coordinate area highlights the building and opens its service queue drawer without requiring external map APIs like Google Maps.

### Q4: How is client-side form validation enforced versus server-side validation?
> **Answer:**
> - **Client-side (JavaScript):** In `validation.js`, functions test user inputs against regular expression patterns (`RegExp.test()`) and apply the Luhn algorithm for payment cards before form submission.
> - **Server-side (PHP & Java):** In `backend-php/users_crud.php`, we execute `preg_match()` for names, emails, phones, and passwords. In Java, `QueueBookingServlet.java` executes `String.matches()`.

### Q5: How does session tracking differ between HTTP Sessions and Cookies in Java EE?
> **Answer:** As demonstrated in `SessionTrackingServlet.java`:
> - **HttpSession:** State is maintained on the server. The client only stores a unique session ID (`JSESSIONID`). Used for sensitive data like authenticated credentials.
> - **Cookies:** Small key-value text tokens stored directly on the client's browser (e.g. `lastBookingTimestamp`). Sent with every HTTP request header.

### Q6: How does the application prevent duplicate bookings?
> **Answer:** In `src/services/storage.js`, before adding a new token to the queue, `createBooking()` queries existing records to check if the user already has an active token (`waiting`, `called`, or `serving`) for the same service on the requested date. If found, an explicit exception is thrown.
