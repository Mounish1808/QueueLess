# Web Programming Syllabus Mapping Guide

This document maps every required concept from the **Web Programming Syllabus** directly to the corresponding source code files, components, and functions in the **QueueLess** project.

---

## Complete Syllabus-to-Code Matrix

| # | Syllabus Requirement | Implementation in QueueLess | Source File(s) & Code Reference |
|---|----------------------|-----------------------------|---------------------------------|
| 1 | **HTML5 Semantic Elements** | `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<figure>`, `<mark>` | • `src/components/Navbar.jsx`<br>• `src/components/Home.jsx`<br>• `src/components/Footer.jsx` |
| 2 | **HTML Image Maps & Hotspots** | `<img usemap="#campus-map">` with `<map>` and `<area shape="rect" coords="...">` tags for 5 campus buildings | • `src/components/CampusMap.jsx`<br>• `src/data/seedData.js` (`CAMPUS_LOCATIONS.coords`) |
| 3 | **CSS3 External Stylesheet** | Primary design system with CSS custom properties, grid, flexbox, transitions, and print media queries | • `src/index.css` |
| 4 | **CSS3 Embedded Stylesheet** | Scoped `<style>` blocks inside components demonstrating document-level CSS rules | • `src/components/TokenBadge.jsx`<br>• `src/components/SyllabusLab.jsx` |
| 5 | **CSS3 Inline Styles** | Dynamic style attributes for calculated widths, colors, and live adjustable sizes | • `src/components/Analytics.jsx` (`style={{ width: `${item.pct}%` }}`)<br>• `src/components/SyllabusLab.jsx` |
| 6 | **JavaScript Form Validation** | Real-time client-side checks for required fields, lengths, dates, and card Luhn checks | • `src/utils/validation.js`<br>• `src/components/AuthModal.jsx`<br>• `src/components/PaymentDemo.jsx` |
| 7 | **JavaScript Regular Expressions** | Comprehensive regex matching for email, Indian 10-digit phone, 6-digit PIN, strong password | • `src/utils/validation.js` (`REGEX_PATTERNS`)<br>• `src/components/SyllabusLab.jsx` (Live Regex Engine) |
| 8 | **React JS Fundamentals** | Functional components, Hooks (`useState`, `useEffect`, `useMemo`, `useCallback`), Custom Events | • `src/App.jsx`<br>• `src/components/UserDashboard.jsx`<br>• `src/components/StaffDashboard.jsx` |
| 9 | **React Calculator** | Keypad layout, arithmetic operations (+, -, ×, ÷), division-by-zero protection, calculation history | • `src/components/Calculator.jsx` |
| 10 | **PHP Regular Expressions** | Server-side validation using `preg_match` for name, email, phone, and password | • `backend-php/users_crud.php`<br>• Lines 28–73 (`validateUserPayload`) |
| 11 | **PHP & MySQL CRUD** | Create (POST), Read (GET), Update (PUT), Delete (DELETE) student records via PDO | • `backend-php/users_crud.php`<br>• `backend-php/config.php`<br>• `backend-php/schema.sql` |
| 12 | **Three-Tier Architecture** | Formal division into Presentation Tier, Application Logic Tier, and Database Tier | • `docs/ARCHITECTURE.md`<br>• `src/components/Home.jsx`<br>• `src/components/SyllabusLab.jsx` |
| 13 | **Java Servlets & MVC** | `HttpServlet` handling POST requests, input validation, and forwarding to JSP | • `academic-java-ee/src/com/queueless/servlet/QueueBookingServlet.java` |
| 14 | **JavaBeans** | Serializable data model with private properties and public getters/setters | • `academic-java-ee/src/com/queueless/model/TokenBean.java` |
| 15 | **Java JDBC & DAO** | `DriverManager`, parameterized `PreparedStatement`, and `ResultSet` mapping | • `academic-java-ee/src/com/queueless/dao/TokenDAO.java` |
| 16 | **Session Handling & Cookies** | `HttpSession` creation, attribute storage, timeout configuration, and client cookies | • `academic-java-ee/src/com/queueless/servlet/SessionTrackingServlet.java`<br>• `academic-java-ee/web/WEB-INF/web.xml` |
| 17 | **Dynamic JSP Pages** | Dynamic token rendering and session data extraction | • `academic-java-ee/web/booking.jsp`<br>• `academic-java-ee/web/queue_status.jsp` |

---

## Interactive Syllabus Inspector

For live inspection during academic viva or project presentations, navigate directly to the **Syllabus Lab** tab in the application header (`#syllabus-lab`). It contains interactive inspectors for:
1. CSS 3 Stylesheet types comparison with a live embedded color-picker.
2. JavaScript Regular Expression testing playground.
3. HTML5 semantic table and `<map>` hotspot code snippet.
4. PHP CRUD and regex execution code.
5. Java Servlet, JDBC DAO, and Session tracking architecture code.
