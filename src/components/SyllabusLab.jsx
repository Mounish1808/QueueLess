import React, { useState } from 'react';
import { 
  BookOpen, 
  Code, 
  Palette, 
  Server, 
  Database, 
  CheckCircle, 
  FileCode, 
  Layers, 
  ExternalLink,
  Cpu,
  Terminal,
  Copy
} from 'lucide-react';
import { REGEX_PATTERNS } from '../utils/validation';

export const SyllabusLab = () => {
  const [activeSection, setActiveSection] = useState('css-styles'); // 'html5' | 'css-styles' | 'js-regex' | 'php-backend' | 'java-servlets'

  // Live CSS Embedded / Inline test state
  const [embeddedColor, setEmbeddedColor] = useState('#6366f1');
  const [inlineFontSize, setInlineFontSize] = useState(16);

  // Live JS Regex Tester State
  const [testRegexType, setTestRegexType] = useState('PHONE');
  const [testRegexInput, setTestRegexInput] = useState('9876543210');

  const getActiveRegex = () => {
    switch (testRegexType) {
      case 'PHONE': return { pattern: REGEX_PATTERNS.PHONE, label: 'Indian Mobile: ^[6-9]\\d{9}$' };
      case 'EMAIL': return { pattern: REGEX_PATTERNS.EMAIL, label: 'RFC Email: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' };
      case 'PIN_CODE': return { pattern: REGEX_PATTERNS.PIN_CODE, label: '6-digit PIN: ^\\d{6}$' };
      case 'PASSWORD_STRONG': return { pattern: REGEX_PATTERNS.PASSWORD_STRONG, label: 'Strong Password: Min 8, 1 upper, 1 lower, 1 digit, 1 special' };
      default: return { pattern: REGEX_PATTERNS.PHONE, label: 'Mobile' };
    }
  };

  const currentRegex = getActiveRegex();
  const isRegexMatch = currentRegex.pattern.test(testRegexInput);

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      {/* 
        Syllabus Demonstration: Embedded Stylesheet (<style> tag)
        Dynamically reacts to state to demonstrate embedded CSS principles.
      */}
      <style>{`
        .embedded-demo-card {
          border: 2px dashed ${embeddedColor} !important;
          background: rgba(99, 102, 241, 0.04) !important;
          transition: all 0.3s ease;
        }
        .embedded-demo-text {
          color: ${embeddedColor} !important;
          font-weight: 700;
        }
      `}</style>

      {/* Page Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BookOpen size={24} color="var(--primary)" /> Web Programming Syllabus Inspector
        </h1>
        <p style={{ fontSize: '0.88rem' }}>
          Interactive proof & viva examination viewer documenting every required concept from the course curriculum.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid var(--border-card)', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          className={`nav-link ${activeSection === 'css-styles' ? 'active' : ''}`}
          onClick={() => setActiveSection('css-styles')}
        >
          <Palette size={15} /> CSS 3 Types (External / Embedded / Inline)
        </button>
        <button
          type="button"
          className={`nav-link ${activeSection === 'js-regex' ? 'active' : ''}`}
          onClick={() => setActiveSection('js-regex')}
        >
          <Code size={15} /> JS & Regex Engine
        </button>
        <button
          type="button"
          className={`nav-link ${activeSection === 'html5' ? 'active' : ''}`}
          onClick={() => setActiveSection('html5')}
        >
          <FileCode size={15} /> HTML5 Semantics & &lt;map&gt;
        </button>
        <button
          type="button"
          className={`nav-link ${activeSection === 'php-backend' ? 'active' : ''}`}
          onClick={() => setActiveSection('php-backend')}
        >
          <Server size={15} /> PHP & MySQL CRUD
        </button>
        <button
          type="button"
          className={`nav-link ${activeSection === 'java-servlets' ? 'active' : ''}`}
          onClick={() => setActiveSection('java-servlets')}
        >
          <Database size={15} /> Java Servlets, JSP & JDBC
        </button>
      </div>

      {/* SECTION 1: CSS 3 Types Demonstration */}
      {activeSection === 'css-styles' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>
              CSS Stylesheet Demonstration: External, Embedded, and Inline
            </h3>
            <p style={{ fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Our project explicitly demonstrates all three methods of styling defined in the Web Programming curriculum:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {/* Type 1: External CSS */}
              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-card)' }}>
                <span className="badge badge-waiting" style={{ marginBottom: '8px' }}>1. External Stylesheet</span>
                <h4 style={{ fontSize: '1rem', marginTop: '4px', marginBottom: '6px' }}><code>src/index.css</code></h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  Main application design system containing global CSS variables (<code>--primary</code>, <code>--bg-main</code>), Flexbox & Grid layouts, card components, buttons, and <code>@media print</code> queries.
                </p>
                <div style={{ marginTop: '10px', background: '#020617', padding: '8px 10px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.75rem', color: '#818cf8' }}>
                  &lt;link rel="stylesheet" href="/src/index.css" /&gt;
                </div>
              </div>

              {/* Type 2: Embedded Stylesheet */}
              <div className="embedded-demo-card" style={{ padding: '16px', borderRadius: '12px' }}>
                <span className="badge badge-called" style={{ marginBottom: '8px' }}>2. Embedded Stylesheet</span>
                <h4 className="embedded-demo-text" style={{ fontSize: '1rem', marginTop: '4px', marginBottom: '6px' }}>
                  &lt;style&gt; Document Block
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  Scoped inside this component's DOM header and in <code>TokenBadge.jsx</code>. Notice this card's border responds in real-time to the color picker below!
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                  <span style={{ fontSize: '0.78rem' }}>Change &lt;style&gt; Color:</span>
                  <input
                    type="color"
                    value={embeddedColor}
                    onChange={(e) => setEmbeddedColor(e.target.value)}
                    style={{ cursor: 'pointer', background: 'none', border: 'none', width: '28px', height: '28px' }}
                  />
                  <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: embeddedColor }}>{embeddedColor}</span>
                </div>
              </div>

              {/* Type 3: Inline Styles */}
              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-card)' }}>
                <span className="badge badge-serving" style={{ marginBottom: '8px' }}>3. Inline Styles</span>
                <h4 style={{ fontSize: '1rem', marginTop: '4px', marginBottom: '6px' }}>
                  <code>style={'{...}'}</code> Attribute
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  Applied directly to specific JSX nodes for calculated properties such as dynamic progress bar widths and font scales.
                </p>
                <div style={{ marginTop: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.78rem' }}>Dynamic Inline Size:</span>
                    <input
                      type="range"
                      min="12"
                      max="24"
                      value={inlineFontSize}
                      onChange={(e) => setInlineFontSize(parseInt(e.target.value, 10))}
                    />
                  </div>
                  {/* Inline Style Demonstration Element */}
                  <div style={{ 
                    fontSize: `${inlineFontSize}px`, 
                    fontWeight: 'bold', 
                    color: '#34d399', 
                    padding: '4px 8px', 
                    background: 'rgba(16, 185, 129, 0.1)', 
                    borderRadius: '4px',
                    textAlign: 'center' 
                  }}>
                    Live Inline Font: {inlineFontSize}px
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: JavaScript Regular Expressions Tester */}
      {activeSection === 'js-regex' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>JavaScript Regular Expression Validation Engine</h3>
              <p style={{ fontSize: '0.85rem' }}>Interactive tester for the exact regex patterns applied across registration, login, and payments.</p>
            </div>
            <Code size={20} color="var(--primary)" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div>
              <div className="form-group">
                <label className="form-label">Select Course Validation Rule:</label>
                <select
                  className="form-control"
                  value={testRegexType}
                  onChange={(e) => {
                    setTestRegexType(e.target.value);
                    if (e.target.value === 'PHONE') setTestRegexInput('9876543210');
                    if (e.target.value === 'EMAIL') setTestRegexInput('student@college.edu');
                    if (e.target.value === 'PIN_CODE') setTestRegexInput('560001');
                    if (e.target.value === 'PASSWORD_STRONG') setTestRegexInput('Pass@1234');
                  }}
                >
                  <option value="PHONE">Mobile Number Validation (10 digits starting with 6-9)</option>
                  <option value="EMAIL">Email Address Validation (RFC format)</option>
                  <option value="PIN_CODE">Postal PIN Code (6 digits)</option>
                  <option value="PASSWORD_STRONG">Strong Password (Upper, Lower, Digit, Symbol, 8+)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Pattern Specification:</label>
                <div style={{ background: '#020617', padding: '10px 14px', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#818cf8', border: '1px solid var(--border-card)' }}>
                  {currentRegex.label}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Test Input String:</label>
                <input
                  type="text"
                  className={`form-control ${isRegexMatch ? '' : 'is-invalid'}`}
                  value={testRegexInput}
                  onChange={(e) => setTestRegexInput(e.target.value)}
                />
              </div>

              <div style={{ padding: '12px', borderRadius: '8px', background: isRegexMatch ? 'var(--status-serving-bg)' : 'var(--status-cancelled-bg)', color: isRegexMatch ? '#86efac' : '#fca5a5', border: isRegexMatch ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 600 }}>
                {isRegexMatch ? (
                  <>
                    <CheckCircle size={18} /> Valid Match: String satisfies pattern criteria!
                  </>
                ) : (
                  <>
                    <XCircle size={18} /> Invalid: String does NOT match regex pattern.
                  </>
                )}
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-card)', fontSize: '0.82rem', lineHeight: '1.6' }}>
              <div style={{ fontWeight: 700, color: '#38bdf8', marginBottom: '8px' }}>
                Course Syllabus Highlights:
              </div>
              <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-muted)' }}>
                <li>Client-side validation uses native JavaScript <code>RegExp.test()</code> before form dispatch.</li>
                <li>Prevents fraudulent registrations with instant red feedback rings.</li>
                <li>Corresponds directly to backend PHP <code>preg_match()</code> validation routines located in <code>backend-php/users_crud.php</code>.</li>
                <li>Credit/Debit cards implement the dual-stage check: 16-digit format + Luhn algorithm checksum.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: HTML5 Semantic & Map Demonstration */}
      {activeSection === 'html5' && (
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>
            HTML5 Semantic Structure & &lt;map&gt; Hotspot Demonstration
          </h3>
          <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Specification of HTML5 elements implemented throughout QueueLess:
          </p>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>HTML5 Element</th>
                  <th>Component Location</th>
                  <th>Purpose / Syllabus Demonstration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>&lt;header&gt; & &lt;nav&gt;</code></td>
                  <td><code>src/components/Navbar.jsx</code></td>
                  <td>Semantic top navigation, role switcher, and live notification container.</td>
                </tr>
                <tr>
                  <td><code>&lt;main&gt; & &lt;section&gt;</code></td>
                  <td><code>src/components/Home.jsx</code></td>
                  <td>Structured content sections for hero, live counters, catalog, and architecture.</td>
                </tr>
                <tr>
                  <td><code>&lt;map&gt; & &lt;area&gt;</code></td>
                  <td><code>src/components/CampusMap.jsx</code></td>
                  <td>Clickable coordinates (<code>coords="80,80,240,200"</code>) for campus buildings without external map APIs.</td>
                </tr>
                <tr>
                  <td><code>&lt;footer&gt;</code></td>
                  <td><code>src/components/Footer.jsx</code></td>
                  <td>Semantic footer with system status, department credits, and reset triggers.</td>
                </tr>
                <tr>
                  <td><code>&lt;figure&gt; & &lt;figcaption&gt;</code></td>
                  <td><code>src/components/CampusMap.jsx</code></td>
                  <td>Campus plan layout graphic encapsulation.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 4: PHP & MySQL Backend CRUD */}
      {activeSection === 'php-backend' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>PHP + MySQL Academic Module (backend-php/)</h3>
              <p style={{ fontSize: '0.85rem' }}>Complete server-side scripts for student management CRUD & PHP regular expressions.</p>
            </div>
            <Server size={20} color="var(--primary)" />
          </div>

          <div style={{ background: '#020617', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-card)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#818cf8' }}>
                📁 backend-php/users_crud.php — PHP Regex & CRUD Excerpt:
              </span>
            </div>
            <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#cbd5e1', overflowX: 'auto', lineHeight: '1.5' }}>
{`<?php
// backend-php/users_crud.php
header('Content-Type: application/json');
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // PHP Regular Expression Validation (Syllabus Requirement)
    if (!preg_match("/^[a-zA-Z\\s.]{3,50}$/", $data['name'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid name format']);
        exit;
    }
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid email address']);
        exit;
    }
    if (!preg_match("/^[6-9]\\d{9}$/", $data['phone'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Phone must be 10 digits starting with 6-9']);
        exit;
    }

    // Insert Record into MySQL
    $stmt = $pdo->prepare("INSERT INTO users (name, email, phone, role) VALUES (?, ?, ?, ?)");
    $stmt->execute([$data['name'], $data['email'], $data['phone'], $data['role'] ?? 'customer']);
    echo json_encode(['status' => 'success', 'id' => $pdo->lastInsertId()]);
}
?>`}
            </pre>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', fontSize: '0.84rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
              <strong>1. Database Schema (`schema.sql`):</strong> Full DDL script creating `users`, `services`, `counters`, and `tokens` tables with foreign keys and sample tuples.
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
              <strong>2. Dual Connection (`config.php`):</strong> Connects to MySQL with automatic fallback to SQLite for plug-and-play local execution without MySQL server daemon.
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
              <strong>3. REST API (`api.php`):</strong> Handles JSON GET, POST, PUT, and DELETE operations cleanly for exam demonstration.
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: Java Servlets, JSP & JDBC */}
      {activeSection === 'java-servlets' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>Java Servlets, JSP, JDBC & Sessions (academic-java-ee/)</h3>
              <p style={{ fontSize: '0.85rem' }}>Separate academic module demonstrating Java EE 3-tier architecture for Tomcat.</p>
            </div>
            <Database size={20} color="var(--primary)" />
          </div>

          <div style={{ background: '#020617', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-card)', marginBottom: '1.5rem' }}>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#38bdf8' }}>
                ☕ academic-java-ee/src/com/queueless/servlet/QueueBookingServlet.java:
              </span>
            </div>
            <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#cbd5e1', overflowX: 'auto', lineHeight: '1.5' }}>
{`package com.queueless.servlet;

import com.queueless.dao.TokenDAO;
import com.queueless.model.TokenBean;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet("/bookQueue")
public class QueueBookingServlet extends HttpServlet {
    private TokenDAO tokenDAO = new TokenDAO();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        // Session tracking demonstration (Syllabus topic)
        HttpSession session = req.getSession(true);
        String userEmail = (String) session.getAttribute("userEmail");

        // Cookie tracking demonstration
        Cookie visitCookie = new Cookie("lastVisit", String.valueOf(System.currentTimeMillis()));
        visitCookie.setMaxAge(60*60*24);
        resp.addCookie(visitCookie);

        String serviceId = req.getParameter("serviceId");
        String studentName = req.getParameter("studentName");

        TokenBean token = tokenDAO.createToken(serviceId, studentName);
        req.setAttribute("token", token);
        req.getRequestDispatcher("/queue_status.jsp").forward(req, resp);
    }
}`}
            </pre>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', fontSize: '0.84rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
              <strong>1. Model-View-Controller (MVC):</strong>
              <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                <code>TokenBean.java</code> (Model), <code>QueueBookingServlet.java</code> (Controller), and <code>queue_status.jsp</code> (View).
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
              <strong>2. Data Access Object (DAO):</strong>
              <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                <code>TokenDAO.java</code> encapsulates JDBC connection pooling, <code>PreparedStatement</code>, and ResultSet mapping.
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
              <strong>3. State Management:</strong>
              <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                Demonstrates HTTP Sessions (<code>HttpSession</code>) for logged-in credentials and persistent client cookies.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
