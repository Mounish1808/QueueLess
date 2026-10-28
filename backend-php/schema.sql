-- ============================================================================
-- QueueLess — Smart Queue & Appointment Management System
-- Database Schema (MySQL 8.0+ / MariaDB)
-- Web Programming Syllabus Demonstration: Database Tier (Tier 3)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS queueless_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE queueless_db;

-- ----------------------------------------------------------------------------
-- Table: users
-- Stores students, staff officers, and administrators
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    phone VARCHAR(15) NOT NULL,
    dob DATE NULL,
    pin_code VARCHAR(10) NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('customer', 'staff', 'admin') DEFAULT 'customer',
    department VARCHAR(100) DEFAULT 'General',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- Table: services
-- Stores available campus services, locations, and fees
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(80) NOT NULL,
    location VARCHAR(200) NOT NULL,
    building_id VARCHAR(50) NOT NULL,
    avg_wait_mins INT DEFAULT 10,
    description TEXT,
    requires_fee BOOLEAN DEFAULT FALSE,
    fee_amount DECIMAL(10, 2) DEFAULT 0.00,
    fee_description VARCHAR(255) DEFAULT '',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- Table: counters
-- Stores physical and virtual service desks
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS counters (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    service_id VARCHAR(50) NOT NULL,
    staff_name VARCHAR(100) NOT NULL,
    status ENUM('active', 'paused') DEFAULT 'active',
    serving_token_id VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- Table: tokens
-- Core queue transaction and appointment ledger
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tokens (
    id VARCHAR(50) PRIMARY KEY,
    token_number VARCHAR(30) NOT NULL,
    service_id VARCHAR(50) NOT NULL,
    service_name VARCHAR(150) NOT NULL,
    counter_id VARCHAR(50) NULL,
    user_id VARCHAR(50) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(120) NOT NULL,
    user_phone VARCHAR(15) NOT NULL,
    booking_date DATE NOT NULL,
    slot_time VARCHAR(20) NOT NULL,
    status ENUM('waiting', 'called', 'serving', 'completed', 'cancelled', 'skipped') DEFAULT 'waiting',
    queue_position INT DEFAULT 1,
    estimated_wait_mins INT DEFAULT 10,
    called_at VARCHAR(30) NULL,
    completed_at VARCHAR(30) NULL,
    notes TEXT,
    is_paid BOOLEAN DEFAULT FALSE,
    payment_ref VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- Sample Seed Data (For testing in MySQL or phpMyAdmin)
-- ----------------------------------------------------------------------------
INSERT INTO users (id, name, email, phone, dob, pin_code, password_hash, role, department)
VALUES
('u-student-1', 'Aarav Sharma', 'student@college.edu', '9876543210', '2003-05-15', '560001', 'Pass@1234', 'customer', 'Computer Science'),
('u-staff-1', 'Prof. Priya Nair', 'staff.library@college.edu', '9812345678', '1988-11-20', '560025', 'Staff@1234', 'staff', 'Central Library'),
('u-admin-1', 'Admin Officer Rajesh', 'admin@college.edu', '9845098450', '1980-03-10', '560012', 'Admin@1234', 'admin', 'Dean of Student Affairs')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO services (id, code, name, category, location, building_id, avg_wait_mins, description, requires_fee, fee_amount)
VALUES
('S1', 'ADM', 'Admissions & Document Verification', 'Administration', 'Administrative Block, Ground Floor', 'admin-block', 15, 'Original mark sheets and certificate endorsement.', TRUE, 50.00),
('S2', 'FEE', 'Fee Payment & Scholarship Desk', 'Accounts', 'Administrative Block, 1st Floor', 'admin-block', 10, 'Tuition fee receipts and scholarship verification.', FALSE, 0.00),
('S3', 'LIB', 'Library Book Clearance & Issue', 'Library', 'Central Library, Ground Floor Desk', 'central-library', 5, 'Semester clearance and borrowing.', FALSE, 0.00),
('S4', 'EXM', 'Examination Cell & Hall Tickets', 'Examinations', 'Examination Branch, 2nd Floor', 'exam-branch', 12, 'Duplicate hall tickets and grade card inquiries.', TRUE, 100.00)
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO counters (id, name, service_id, staff_name, status)
VALUES
('C1', 'Counter 1 (Admissions A)', 'S1', 'Rajesh Sharma', 'active'),
('C2', 'Counter 2 (Admissions B)', 'S1', 'Sunita Verma', 'active'),
('C3', 'Counter 3 (Accounts / Fees)', 'S2', 'Kavita Rao', 'active'),
('C4', 'Counter 4 (Library Desk)', 'S3', 'Prof. Priya Nair', 'active'),
('C5', 'Counter 5 (Exam Cell Desk)', 'S4', 'Vikram Mehta', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);
