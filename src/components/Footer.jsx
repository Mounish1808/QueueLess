import React, { useState, useEffect } from 'react';
import { Ticket, Code, Database, Server, RefreshCw, Cpu, Layers } from 'lucide-react';

export const Footer = ({ onResetData, onSelectTab }) => {
  const [time, setTime] = useState(() => new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-card)', padding: '2.5rem 0 1.5rem', marginTop: 'auto' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div className="brand-icon-wrap" style={{ width: '30px', height: '30px' }}>
                <Ticket size={16} color="#fff" />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800 }}>
                Queue<span style={{ color: 'var(--primary)' }}>Less</span>
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
              Smart Queue & Appointment Management System built for college administrative counters, laboratories, and student service desks.
            </p>
            <div style={{ marginTop: '12px', fontSize: '0.78rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
              Campus System Clock: <strong>{time}</strong>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-main)', marginBottom: '12px' }}>
              Application Modules
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
              <li><a href="#home" onClick={(e) => { e.preventDefault(); onSelectTab('home'); }}>Home & Live Counter Board</a></li>
              <li><a href="#campus-map" onClick={(e) => { e.preventDefault(); onSelectTab('campus-map'); }}>Campus Map & Hotspots (HTML &lt;map&gt;)</a></li>
              <li><a href="#analytics" onClick={(e) => { e.preventDefault(); onSelectTab('analytics'); }}>Reports & Analytics Dashboard</a></li>
              <li><a href="#calculator" onClick={(e) => { e.preventDefault(); onSelectTab('calculator'); }}>React Fundamentals Calculator</a></li>
              <li><a href="#syllabus-lab" onClick={(e) => { e.preventDefault(); onSelectTab('syllabus-lab'); }}>Syllabus Lab (Code Showcase)</a></li>
            </ul>
          </div>

          {/* Academic Concepts Covered */}
          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-main)', marginBottom: '12px' }}>
              Syllabus Topics Demonstrated
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <span className="badge badge-waiting" style={{ fontSize: '0.7rem' }}>HTML5 Semantic & Maps</span>
              <span className="badge badge-called" style={{ fontSize: '0.7rem' }}>CSS3 (External/Embedded/Inline)</span>
              <span className="badge badge-serving" style={{ fontSize: '0.7rem' }}>JS Regex Validation</span>
              <span className="badge badge-completed" style={{ fontSize: '0.7rem' }}>React JS Hooks & State</span>
              <span className="badge badge-skipped" style={{ fontSize: '0.7rem' }}>PHP CRUD & MySQL</span>
              <span className="badge badge-waiting" style={{ fontSize: '0.7rem' }}>Java Servlets & JDBC</span>
              <span className="badge badge-called" style={{ fontSize: '0.7rem' }}>3-Tier Architecture</span>
            </div>
          </div>

          {/* Demonstration Controls */}
          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-main)', marginBottom: '12px' }}>
              Demonstration Controls
            </h4>
            <p style={{ fontSize: '0.82rem', marginBottom: '12px' }}>
              Reset initial sample users, active tokens, and counter queue states back to default seed:
            </p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onResetData}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <RefreshCw size={14} /> Reset Demonstration Data
            </button>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
          <div>
            © 2026 <strong>QueueLess</strong> — Web Programming Project (Assignment 2). Designed for academic demonstration.
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span>Architecture: Three-Tier (Client • Engine • Storage)</span>
            <span>Client State: Reactive LocalStorage</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
