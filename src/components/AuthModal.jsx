import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Lock, Eye, EyeOff, Check, AlertCircle, X, Shield, Sparkles } from 'lucide-react';
import { validateRegistration, validateLogin } from '../utils/validation';
import { registerUser, loginUser, INITIAL_USERS } from '../services/storage';

export const AuthModal = ({ isOpen, onClose, initialMode = 'login', onAuthSuccess }) => {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Registration Form State
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    pinCode: '',
    password: '',
    confirmPassword: ''
  });
  const [regErrors, setRegErrors] = useState({});

  // Login Form State
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [loginErrors, setLoginErrors] = useState({});

  if (!isOpen) return null;

  const handleRegChange = (e) => {
    const { name, value } = e.target;
    setRegData(prev => ({ ...prev, [name]: value }));
    if (regErrors[name]) {
      setRegErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    if (loginErrors[name]) {
      setLoginErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    const validation = validateRegistration(regData);
    if (!validation.isValid) {
      setRegErrors(validation.errors);
      return;
    }

    try {
      const user = registerUser(regData);
      setSubmitSuccess('Account successfully registered! Logging you in...');
      setTimeout(() => {
        if (onAuthSuccess) onAuthSuccess(user);
        onClose();
      }, 1000);
    } catch (err) {
      setSubmitError(err.message || 'Registration failed.');
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    const validation = validateLogin(loginData);
    if (!validation.isValid) {
      setLoginErrors(validation.errors);
      return;
    }

    try {
      const user = loginUser(loginData.email, loginData.password);
      setSubmitSuccess(`Welcome back, ${user.name}!`);
      setTimeout(() => {
        if (onAuthSuccess) onAuthSuccess(user);
        onClose();
      }, 700);
    } catch (err) {
      setSubmitError(err.message || 'Login failed.');
    }
  };

  const autofillDemoUser = (userType) => {
    let targetUser = INITIAL_USERS[0];
    if (userType === 'staff') targetUser = INITIAL_USERS[1];
    if (userType === 'admin') targetUser = INITIAL_USERS[2];

    setLoginData({
      email: targetUser.email,
      password: targetUser.password
    });
    setLoginErrors({});
    setSubmitError('');
    setMode('login');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={20} color="var(--primary)" />
              {mode === 'login' ? 'Sign In to QueueLess' : 'Create Student / User Account'}
            </h3>
            <p style={{ fontSize: '0.82rem', marginTop: '2px' }}>
              {mode === 'login' ? 'Access your tokens, appointments, and dashboard' : 'Register for campus service counter bookings'}
            </p>
          </div>
          <button className="input-action-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-card)', background: 'rgba(0,0,0,0.15)' }}>
          <button
            type="button"
            className="nav-link"
            style={{ flex: 1, justifyContent: 'center', borderRadius: 0, padding: '12px', borderBottom: mode === 'login' ? '2px solid var(--primary)' : 'none', color: mode === 'login' ? '#fff' : 'var(--text-muted)' }}
            onClick={() => { setMode('login'); setSubmitError(''); }}
          >
            Sign In
          </button>
          <button
            type="button"
            className="nav-link"
            style={{ flex: 1, justifyContent: 'center', borderRadius: 0, padding: '12px', borderBottom: mode === 'register' ? '2px solid var(--primary)' : 'none', color: mode === 'register' ? '#fff' : 'var(--text-muted)' }}
            onClick={() => { setMode('register'); setSubmitError(''); }}
          >
            Register Account
          </button>
        </div>

        <div className="modal-body">
          {submitError && (
            <div style={{ background: 'var(--status-cancelled-bg)', color: '#fca5a5', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <AlertCircle size={18} /> {submitError}
            </div>
          )}

          {submitSuccess && (
            <div style={{ background: 'var(--status-serving-bg)', color: '#86efac', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <Check size={18} /> {submitSuccess}
            </div>
          )}

          {/* Quick Fill Demo Credentials */}
          <div style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '10px 12px', borderRadius: '8px', marginBottom: '16px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Sparkles size={14} /> Quick Demo Logins (Click to autofill):
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => autofillDemoUser('student')}>
                Student (Aarav)
              </button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => autofillDemoUser('staff')}>
                Staff (Priya)
              </button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => autofillDemoUser('admin')}>
                Admin (Rajesh)
              </button>
            </div>
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="login-email">
                  Email Address <span className="required">*</span>
                </label>
                <div className="input-with-action">
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    className={`form-control ${loginErrors.email ? 'is-invalid' : ''}`}
                    placeholder="e.g. student@college.edu"
                    value={loginData.email}
                    onChange={handleLoginChange}
                  />
                </div>
                {loginErrors.email && <div className="form-feedback error">{loginErrors.email}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="login-password">
                  Password <span className="required">*</span>
                </label>
                <div className="input-with-action">
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    className={`form-control ${loginErrors.password ? 'is-invalid' : ''}`}
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                  />
                  <button
                    type="button"
                    className="input-action-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {loginErrors.password && <div className="form-feedback error">{loginErrors.password}</div>}
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-name">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  id="reg-name"
                  name="name"
                  type="text"
                  className={`form-control ${regErrors.name ? 'is-invalid' : ''}`}
                  placeholder="e.g. Aarav Sharma"
                  value={regData.name}
                  onChange={handleRegChange}
                />
                {regErrors.name ? (
                  <div className="form-feedback error">{regErrors.name}</div>
                ) : (
                  <div className="form-feedback hint">Must be 3-50 letters without special characters.</div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-email">
                    Email Address <span className="required">*</span>
                  </label>
                  <input
                    id="reg-email"
                    name="email"
                    type="email"
                    className={`form-control ${regErrors.email ? 'is-invalid' : ''}`}
                    placeholder="student@college.edu"
                    value={regData.email}
                    onChange={handleRegChange}
                  />
                  {regErrors.email && <div className="form-feedback error">{regErrors.email}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="reg-phone">
                    Mobile Number <span className="required">*</span>
                  </label>
                  <input
                    id="reg-phone"
                    name="phone"
                    type="tel"
                    className={`form-control ${regErrors.phone ? 'is-invalid' : ''}`}
                    placeholder="10 digits (e.g. 9876543210)"
                    value={regData.phone}
                    onChange={handleRegChange}
                    maxLength={10}
                  />
                  {regErrors.phone && <div className="form-feedback error">{regErrors.phone}</div>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-dob">
                    Date of Birth <span className="required">*</span>
                  </label>
                  <input
                    id="reg-dob"
                    name="dob"
                    type="date"
                    className={`form-control ${regErrors.dob ? 'is-invalid' : ''}`}
                    value={regData.dob}
                    onChange={handleRegChange}
                  />
                  {regErrors.dob && <div className="form-feedback error">{regErrors.dob}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="reg-pin">
                    Postal PIN Code <span className="required">*</span>
                  </label>
                  <input
                    id="reg-pin"
                    name="pinCode"
                    type="text"
                    className={`form-control ${regErrors.pinCode ? 'is-invalid' : ''}`}
                    placeholder="6 digits (e.g. 560001)"
                    value={regData.pinCode}
                    onChange={handleRegChange}
                    maxLength={6}
                  />
                  {regErrors.pinCode && <div className="form-feedback error">{regErrors.pinCode}</div>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-password">
                  Password <span className="required">*</span>
                </label>
                <div className="input-with-action">
                  <input
                    id="reg-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    className={`form-control ${regErrors.password ? 'is-invalid' : ''}`}
                    placeholder="Min 8 chars, 1 uppercase, 1 number, 1 symbol"
                    value={regData.password}
                    onChange={handleRegChange}
                  />
                  <button
                    type="button"
                    className="input-action-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {regErrors.password ? (
                  <div className="form-feedback error">{regErrors.password}</div>
                ) : (
                  <div className="form-feedback hint">Must contain: A-Z, a-z, 0-9, and @$!%*?&#</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-confirm">
                  Confirm Password <span className="required">*</span>
                </label>
                <div className="input-with-action">
                  <input
                    id="reg-confirm"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`form-control ${regErrors.confirmPassword ? 'is-invalid' : ''}`}
                    placeholder="Re-enter password"
                    value={regData.confirmPassword}
                    onChange={handleRegChange}
                  />
                  <button
                    type="button"
                    className="input-action-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {regErrors.confirmPassword && <div className="form-feedback error">{regErrors.confirmPassword}</div>}
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.75rem' }}>
                Complete Registration
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
