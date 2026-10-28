# QueueLess — PHP & MySQL Backend Module

This directory contains the complementary **PHP & MySQL CRUD module** built to fulfill the Web Programming syllabus requirements for server-side scripting, regular expressions, and database management.

---

## 1. Syllabus Concepts Demonstrated

1. **Server-Side Form Validation with PHP Regular Expressions (`preg_match`):**
   - Full Name: `preg_match('/^[a-zA-Z\s.]{3,50}$/', $name)`
   - Email: `preg_match('/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/', $email)`
   - Mobile: `preg_match('/^[6-9]\d{9}$/', $phone)` (10 digits starting with 6-9)
   - PIN Code: `preg_match('/^\d{6}$/', $pinCode)` (6 postal digits)
   - Password: `preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/', $password)`

2. **Full CRUD Operations:**
   - **Create (POST):** Inserts student/user records after server-side regex verification.
   - **Read (GET):** Fetches single user (`?id=xxx`) or list of all users.
   - **Update (PUT):** Updates user contact info and PIN code.
   - **Delete (DELETE):** Removes a user record by primary key.

3. **Three-Tier Architecture:**
   - **Tier 1 (Presentation):** React JS / HTML5 frontend forms.
   - **Tier 2 (Application Logic):** PHP business logic, validation, and JSON REST endpoints.
   - **Tier 3 (Database):** MySQL 8.0 / MariaDB schema (`schema.sql`) with auto-fallback to SQLite (`queueless.sqlite`) for plug-and-play examination environments.

---

## 2. Directory Structure

```
backend-php/
├── config.php          # Database PDO connection (MySQL with zero-config SQLite fallback)
├── schema.sql          # Complete MySQL DDL schema with tables, keys, and sample seed tuples
├── users_crud.php      # Student & User Management CRUD with PHP regular expressions
├── queue_api.php       # Queue tokens creation and status management API
└── README.md           # This documentation guide
```

---

## 3. Running and Testing Locally

### Option A: Instant PHP Built-in Server (Zero Configuration)
No MySQL installation required. Run:
```bash
php -S 127.0.0.1:8000 -t backend-php/
```
Test in terminal or browser:
```bash
# 1. Fetch users (GET)
curl http://127.0.0.1:8000/users_crud.php

# 2. Test Registration with Regex Validation (POST)
curl -X POST http://127.0.0.1:8000/users_crud.php \
  -H "Content-Type: application/json" \
  -d '{"name":"Sneha Patil","email":"sneha@college.edu","phone":"9876543211","pin_code":"560002","password":"Pass@1234"}'

# 3. Test Invalid Phone Regex Rejection (POST)
curl -X POST http://127.0.0.1:8000/users_crud.php \
  -H "Content-Type: application/json" \
  -d '{"name":"Invalid Phone","email":"test@college.edu","phone":"12345"}'
# Returns HTTP 400 with validation error message!
```

### Option B: Using XAMPP / WAMP / Apache with MySQL
1. Open phpMyAdmin (`http://localhost/phpmyadmin`).
2. Create a database named `queueless_db`.
3. Import `schema.sql`.
4. Copy `backend-php/` into `htdocs/queueless-backend/`.
5. Access endpoints at `http://localhost/queueless-backend/users_crud.php`.
