# QueueLess — Java Servlets, JSP & JDBC Academic Module

This module demonstrates the Java Enterprise Edition (Java EE / Jakarta EE) curriculum requirements for **Three-Tier Architecture**, **Java Servlets**, **JSP dynamic pages**, **JDBC database access**, and **Session & Cookie tracking**.

---

## 1. Architecture Breakdown (Three-Tier MVC)

```
       [ Client Browser ]
              │ (HTTP Requests: GET / POST)
              ▼
┌────────────────────────────────────────────────────────┐
│  Tier 1: Presentation Layer                            │
│  - booking.jsp (Input form, HTML5 layout)              │
│  - queue_status.jsp (Dynamic rendering with EL/Script) │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│  Tier 2: Application / Controller Layer                │
│  - QueueBookingServlet.java (HTTP handler, validation) │
│  - SessionTrackingServlet.java (HttpSession & Cookies) │
│  - TokenBean.java (JavaBean Data Model)                │
└──────────────────────────┬─────────────────────────────┘
                           │ (JDBC PreparedStatements)
┌──────────────────────────▼─────────────────────────────┐
│  Tier 3: Database & Storage Layer                      │
│  - TokenDAO.java (Data Access Object)                  │
│  - MySQL / MariaDB (Database tables)                   │
└────────────────────────────────────────────────────────┘
```

---

## 2. Java EE Syllabus Topics Covered

1. **JavaBean Specification (`TokenBean.java`):**
   - Implements `java.io.Serializable`.
   - Private attributes, default zero-argument constructor, and public getters/setters.

2. **Servlet Lifecycle & Processing (`QueueBookingServlet.java`):**
   - `@WebServlet(urlPatterns = {"/bookQueue"})` annotation mapping.
   - `init()`, `doGet()`, and `doPost()` method implementations.
   - Form data reading via `HttpServletRequest.getParameter()`.
   - Server-side regex validation via Java `String.matches()`.
   - Request dispatching via `request.getRequestDispatcher().forward()`.

3. **Session & Cookie Handling (`SessionTrackingServlet.java`):**
   - `request.getSession(true)` for creating or obtaining the user session.
   - `session.setAttribute()` and `session.getAttribute()`.
   - Cookie generation via `new Cookie("lastBookingTimestamp", ...)` and retrieval via `request.getCookies()`.

4. **JDBC DAO (`TokenDAO.java`):**
   - Driver loading: `Class.forName("com.mysql.cj.jdbc.Driver")`.
   - Connection creation: `DriverManager.getConnection()`.
   - SQL Injection prevention using parameterized `PreparedStatement`.
   - Iterating database queries using `ResultSet`.

5. **Deployment Descriptor (`web.xml`):**
   - Declares session timeouts, cookie security flags (`http-only`), and welcome file lists.

---

## 3. How to Deploy to Apache Tomcat

1. Compile Java files into `.class` files matching the package directory structure `WEB-INF/classes/com/queueless/...`.
2. Package the `web/` folder into a Web Application Archive (`queueless.war`) or place as an exploded folder inside Apache Tomcat's `webapps/` directory.
3. Start Apache Tomcat (`catalina.sh run` or `startup.bat`).
4. Access `http://localhost:8080/queueless/booking.jsp`.
