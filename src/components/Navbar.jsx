import React, { useState } from 'react';
import { 
  Ticket, 
  MapPin, 
  BarChart3, 
  Calculator, 
  BookOpen, 
  User, 
  LogOut, 
  Bell, 
  Shield, 
  Menu, 
  X, 
  RotateCcw, 
  Sparkles,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { resetToDemoData, INITIAL_USERS } from '../services/storage';

export const Navbar = ({ 
  currentTab, 
  onSelectTab, 
  currentUser, 
  onRoleSwitch, 
  onOpenAuth, 
  onOpenBooking, 
  onLogout,
  onResetData,
  notifications = []
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNavClick = (tabId) => {
    onSelectTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <div className="brand" onClick={() => handleNavClick('home')}>
          <div className="brand-icon-wrap">
            <Ticket size={22} color="#ffffff" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>Queue<span style={{ color: 'var(--primary)' }}>Less</span></span>
            <span className="brand-badge">College Desk</span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav>
          <ul className="nav-links">
            <li>
              <button
                type="button"
                className={`nav-link ${currentTab === 'home' ? 'active' : ''}`}
                onClick={() => handleNavClick('home')}
              >
                Home
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`nav-link ${currentTab === 'my-queue' ? 'active' : ''}`}
                onClick={() => handleNavClick('my-queue')}
              >
                My Queue
              </button>
            </li>
            {currentUser && (currentUser.role === 'staff' || currentUser.role === 'admin') && (
              <li>
                <button
                  type="button"
                  className={`nav-link ${currentTab === 'staff-desk' ? 'active' : ''}`}
                  onClick={() => handleNavClick('staff-desk')}
                >
                  Staff Desk
                </button>
              </li>
            )}
            {currentUser && currentUser.role === 'admin' && (
              <li>
                <button
                  type="button"
                  className={`nav-link ${currentTab === 'admin' ? 'active' : ''}`}
                  onClick={() => handleNavClick('admin')}
                >
                  Admin
                </button>
              </li>
            )}
            <li>
              <button
                type="button"
                className={`nav-link ${currentTab === 'campus-map' ? 'active' : ''}`}
                onClick={() => handleNavClick('campus-map')}
              >
                <MapPin size={15} /> Campus Map
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`nav-link ${currentTab === 'analytics' ? 'active' : ''}`}
                onClick={() => handleNavClick('analytics')}
              >
                <BarChart3 size={15} /> Analytics
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`nav-link ${currentTab === 'calculator' ? 'active' : ''}`}
                onClick={() => handleNavClick('calculator')}
              >
                <Calculator size={15} /> Calculator
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`nav-link ${currentTab === 'syllabus-lab' ? 'active' : ''}`}
                onClick={() => handleNavClick('syllabus-lab')}
                style={{ color: '#a5b4fc', border: '1px solid rgba(165, 180, 252, 0.25)' }}
              >
                <BookOpen size={15} /> Syllabus Lab
              </button>
            </li>
          </ul>
        </nav>

        {/* Right Action Cluster */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Quick Role Switcher Pill for Academic Demonstration */}
          <div className="role-switcher" title="Quick Role Switcher (Web Programming Demonstration)">
            <button
              type="button"
              className={`role-btn ${currentUser?.role === 'customer' ? 'active' : ''}`}
              onClick={() => onRoleSwitch('customer')}
            >
              Student
            </button>
            <button
              type="button"
              className={`role-btn ${currentUser?.role === 'staff' ? 'active' : ''}`}
              onClick={() => onRoleSwitch('staff')}
            >
              Staff
            </button>
            <button
              type="button"
              className={`role-btn ${currentUser?.role === 'admin' ? 'active' : ''}`}
              onClick={() => onRoleSwitch('admin')}
            >
              Admin
            </button>
          </div>

          {/* Book Token Primary Button */}
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onOpenBooking}
          >
            <Ticket size={15} /> Book Token
          </button>

          {/* Notifications Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="btn-icon"
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              title="Queue Notifications"
              aria-label="Queue Notifications"
            >
              <Bell size={18} />
              {notifications.length > 0 && (
                <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '16px', height: '16px', background: 'var(--status-cancelled)', borderRadius: '50%', color: '#fff', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {notifications.length}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div style={{ position: 'absolute', right: 0, top: '45px', width: '320px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px', boxShadow: 'var(--shadow-lg)', zIndex: 110, padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-card)', paddingBottom: '8px', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Live Queue Alerts</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{notifications.length} updates</span>
                </div>
                <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      No active alerts right now.
                    </div>
                  ) : (
                    notifications.map((n, i) => (
                      <div key={i} style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '0.8rem', borderLeft: '3px solid var(--primary)' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{n.title}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{n.message}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '2px' }}>{n.time}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Account / Profile */}
          {currentUser ? (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold' }}>
                  {currentUser.name.charAt(0)}
                </div>
                <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentUser.name.split(' ')[0]}
                </span>
              </button>

              {userDropdownOpen && (
                <div style={{ position: 'absolute', right: 0, top: '45px', width: '230px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px', boxShadow: 'var(--shadow-lg)', zIndex: 110, padding: '10px' }}>
                  <div style={{ padding: '6px 8px', borderBottom: '1px solid var(--border-card)', marginBottom: '6px' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{currentUser.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{currentUser.email}</div>
                    <div style={{ marginTop: '4px' }}>
                      <span className={`badge badge-${currentUser.role === 'customer' ? 'waiting' : currentUser.role === 'staff' ? 'serving' : 'completed'}`} style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                        {currentUser.role.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="nav-link"
                    style={{ width: '100%', justifyContent: 'flex-start', padding: '6px 8px', fontSize: '0.85rem' }}
                    onClick={() => { handleNavClick('my-queue'); setUserDropdownOpen(false); }}
                  >
                    <User size={15} /> My Profile & Tokens
                  </button>
                  <button
                    type="button"
                    className="nav-link"
                    style={{ width: '100%', justifyContent: 'flex-start', padding: '6px 8px', fontSize: '0.85rem', color: '#fca5a5' }}
                    onClick={() => { onLogout(); setUserDropdownOpen(false); }}
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onOpenAuth}
            >
              Sign In
            </button>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            className="mobile-menu-btn btn-icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button type="button" className="nav-link" onClick={() => handleNavClick('home')}>Home</button>
          <button type="button" className="nav-link" onClick={() => handleNavClick('my-queue')}>My Queue</button>
          <button type="button" className="nav-link" onClick={() => handleNavClick('staff-desk')}>Staff Desk</button>
          <button type="button" className="nav-link" onClick={() => handleNavClick('admin')}>Admin Dashboard</button>
          <button type="button" className="nav-link" onClick={() => handleNavClick('campus-map')}>Campus Map</button>
          <button type="button" className="nav-link" onClick={() => handleNavClick('analytics')}>Analytics</button>
          <button type="button" className="nav-link" onClick={() => handleNavClick('calculator')}>Calculator</button>
          <button type="button" className="nav-link" onClick={() => handleNavClick('syllabus-lab')}>Syllabus Lab</button>
          <button type="button" className="btn btn-danger btn-sm" style={{ marginTop: '8px' }} onClick={onResetData}>
            <RotateCcw size={14} /> Reset Demo Data
          </button>
        </div>
      )}
    </header>
  );
};
