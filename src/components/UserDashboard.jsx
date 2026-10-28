import React, { useState } from 'react';
import { 
  Ticket, 
  Clock, 
  MapPin, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Printer, 
  DollarSign, 
  User, 
  Search, 
  ShieldCheck,
  Edit2
} from 'lucide-react';
import { TokenBadge } from './TokenBadge';
import { cancelBooking, rescheduleBooking, updateUserProfile } from '../services/storage';

export const UserDashboard = ({ 
  currentUser, 
  bookings = [], 
  services = [], 
  onOpenBooking, 
  onNavigatePayment,
  onUserUpdated 
}) => {
  const [activeSubTab, setActiveSubTab] = useState('active'); // 'active' | 'history' | 'profile'
  const [selectedTokenToView, setSelectedTokenToView] = useState(null);
  const [rescheduleModalBooking, setRescheduleModalBooking] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('10:00 AM');
  const [historySearch, setHistorySearch] = useState('');
  
  // Profile edit state
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    pinCode: currentUser?.pinCode || '',
    dob: currentUser?.dob || ''
  });
  const [profileMsg, setProfileMsg] = useState('');

  // Filter bookings for current user
  const userBookings = bookings.filter(b => 
    currentUser ? (b.userId === currentUser.id || b.userEmail === currentUser.email) : true
  );

  // Active bookings are waiting, called, or serving
  const activeBookings = userBookings.filter(b => 
    b.status === 'waiting' || b.status === 'called' || b.status === 'serving'
  );

  // Past bookings are completed, cancelled, or skipped
  const pastBookings = userBookings.filter(b => 
    b.status === 'completed' || b.status === 'cancelled' || b.status === 'skipped'
  );

  const handleCancel = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this appointment token?')) {
      cancelBooking(bookingId, 'Cancelled by user from dashboard');
    }
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    if (!newDate || !newSlot) return;
    try {
      rescheduleBooking(rescheduleModalBooking.id, newDate, newSlot);
      setRescheduleModalBooking(null);
      alert('Appointment rescheduled successfully!');
    } catch (err) {
      alert(err.message || 'Error rescheduling appointment.');
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
      const updated = updateUserProfile(currentUser.id, profileData);
      if (onUserUpdated) onUserUpdated(updated);
      setProfileMsg('Profile details updated successfully!');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Error updating profile.');
    }
  };

  const filteredHistory = pastBookings.filter(b => 
    b.tokenNumber.toLowerCase().includes(historySearch.toLowerCase()) ||
    b.serviceName.toLowerCase().includes(historySearch.toLowerCase()) ||
    b.status.toLowerCase().includes(historySearch.toLowerCase())
  );

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Ticket size={24} color="var(--primary)" /> Student Queue Dashboard
          </h1>
          <p style={{ fontSize: '0.88rem' }}>
            Welcome back, <strong>{currentUser ? currentUser.name : 'Guest User'}</strong>. Monitor your active queue tokens and appointments.
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={onOpenBooking}>
          <Ticket size={16} /> Book New Token
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid var(--border-card)', marginBottom: '1.5rem' }}>
        <button
          type="button"
          className={`nav-link ${activeSubTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('active')}
        >
          Active Tokens ({activeBookings.length})
        </button>
        <button
          type="button"
          className={`nav-link ${activeSubTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('history')}
        >
          Booking History ({pastBookings.length})
        </button>
        {currentUser && (
          <button
            type="button"
            className={`nav-link ${activeSubTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('profile')}
          >
            Student Profile
          </button>
        )}
      </div>

      {/* Active Tokens Tab */}
      {activeSubTab === 'active' && (
        <div>
          {activeBookings.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
              <div className="brand-icon-wrap" style={{ margin: '0 auto 1rem', width: '54px', height: '54px' }}>
                <Ticket size={28} color="#ffffff" />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No Active Queue Tokens</h3>
              <p style={{ maxWidth: '440px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
                You do not have any pending queue tickets or upcoming appointments for today.
              </p>
              <button type="button" className="btn btn-primary" onClick={onOpenBooking}>
                <Ticket size={16} /> Book a Queue Token Now
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
              {activeBookings.map(b => {
                const service = services.find(s => s.id === b.serviceId);
                const isCalled = b.status === 'called';
                const isServing = b.status === 'serving';

                return (
                  <div 
                    key={b.id} 
                    className="card" 
                    style={{ 
                      border: isCalled ? '2px solid #3b82f6' : isServing ? '2px solid #10b981' : '1px solid var(--border-card)',
                      boxShadow: isCalled ? '0 0 25px rgba(59, 130, 246, 0.3)' : 'var(--shadow-md)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                      <div>
                        <span className={`badge badge-${b.status}`}>
                          {b.status.toUpperCase()}
                        </span>
                        {isCalled && (
                          <div style={{ color: '#60a5fa', fontSize: '0.8rem', fontWeight: 600, marginTop: '4px' }}>
                            🔔 ATTENTION: Token Called to {b.counterId}!
                          </div>
                        )}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Waiting</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8' }}>
                          {isServing ? 'Now at Desk' : `~${b.estimatedWaitMins || 10} Mins`}
                        </div>
                      </div>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px', textAlign: 'center', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Token Number
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2.4rem', fontWeight: 800, color: '#818cf8', letterSpacing: '2px', margin: '4px 0' }}>
                        {b.tokenNumber}
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {b.serviceName}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.82rem', marginBottom: '16px' }}>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '6px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Service Counter:</span>
                        <div style={{ fontWeight: 600, color: '#38bdf8' }}>{b.counterId}</div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '6px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Queue Position:</span>
                        <div style={{ fontWeight: 600, color: '#fbbf24' }}>
                          {isServing ? 'Serving Now' : `#${b.queuePosition || 1} in queue`}
                        </div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '6px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Date & Slot:</span>
                        <div style={{ fontWeight: 600 }}>{b.date} • {b.slotTime}</div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '6px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Payment Status:</span>
                        <div style={{ fontWeight: 600, color: b.isPaid ? '#34d399' : 'var(--text-muted)' }}>
                          {b.isPaid ? 'Paid (Verified)' : 'Not Required / Unpaid'}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button 
                        type="button" 
                        className="btn btn-secondary btn-sm" 
                        style={{ flex: 1 }}
                        onClick={() => setSelectedTokenToView(b)}
                      >
                        <Printer size={14} /> View Ticket
                      </button>
                      
                      {b.status === 'waiting' && (
                        <button 
                          type="button" 
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setRescheduleModalBooking(b);
                            setNewDate(b.date);
                            setNewSlot(b.slotTime);
                          }}
                        >
                          <Calendar size={14} /> Reschedule
                        </button>
                      )}

                      {service?.requiresFee && !b.isPaid && (
                        <button 
                          type="button" 
                          className="btn btn-accent btn-sm"
                          onClick={() => onNavigatePayment(b)}
                        >
                          <DollarSign size={14} /> Pay ₹{service.feeAmount}
                        </button>
                      )}

                      {b.status === 'waiting' && (
                        <button 
                          type="button" 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancel(b.id)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Booking History Tab */}
      {activeSubTab === 'history' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ fontSize: '1.15rem' }}>Previous Appointments & Token History</h3>
            <div style={{ position: 'relative', width: '260px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search history..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                style={{ paddingLeft: '32px' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-dim)' }} />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Service</th>
                  <th>Date & Slot</th>
                  <th>Status</th>
                  <th>Counter</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No past records found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map(b => (
                    <tr key={b.id}>
                      <td>
                        <span className="token-pill" style={{ fontSize: '0.88rem' }}>{b.tokenNumber}</span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{b.serviceName}</div>
                        {b.notes && <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>{b.notes}</div>}
                      </td>
                      <td>
                        {b.date} <br />
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{b.slotTime}</span>
                      </td>
                      <td>
                        <span className={`badge badge-${b.status}`}>
                          {b.status}
                        </span>
                      </td>
                      <td>{b.counterId || '—'}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setSelectedTokenToView(b)}
                        >
                          <Printer size={13} /> Ticket
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Student Profile Tab */}
      {activeSubTab === 'profile' && currentUser && (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={20} color="var(--primary)" /> Student Registration Profile
          </h3>
          <p style={{ fontSize: '0.84rem', marginBottom: '1.5rem' }}>
            Registered profile used for queue verification and contact SMS/Email updates.
          </p>

          {profileMsg && (
            <div style={{ background: 'var(--status-serving-bg)', color: '#86efac', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <CheckCircle size={18} /> {profileMsg}
            </div>
          )}

          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="prof-name">Full Name</label>
              <input
                id="prof-name"
                type="text"
                className="form-control"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="prof-email">Email (Immutable)</label>
                <input
                  id="prof-email"
                  type="email"
                  className="form-control"
                  value={currentUser.email}
                  disabled
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prof-phone">Mobile Number</label>
                <input
                  id="prof-phone"
                  type="tel"
                  className="form-control"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  maxLength={10}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="prof-dob">Date of Birth</label>
                <input
                  id="prof-dob"
                  type="date"
                  className="form-control"
                  value={profileData.dob}
                  onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prof-pin">PIN Code</label>
                <input
                  id="prof-pin"
                  type="text"
                  className="form-control"
                  value={profileData.pinCode}
                  onChange={(e) => setProfileData({ ...profileData, pinCode: e.target.value })}
                  maxLength={6}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary">
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ticket Viewer Modal */}
      {selectedTokenToView && (
        <div className="modal-overlay" onClick={() => setSelectedTokenToView(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <TokenBadge booking={selectedTokenToView} onClose={() => setSelectedTokenToView(null)} />
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModalBooking && (
        <div className="modal-overlay" onClick={() => setRescheduleModalBooking(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem' }}>Reschedule Appointment</h3>
              <button className="input-action-btn" onClick={() => setRescheduleModalBooking(null)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleRescheduleSubmit}>
                <div style={{ marginBottom: '14px', fontSize: '0.88rem' }}>
                  <strong>Token:</strong> {rescheduleModalBooking.tokenNumber} ({rescheduleModalBooking.serviceName})
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="resched-date">New Date</label>
                  <input
                    id="resched-date"
                    type="date"
                    className="form-control"
                    min={todayStr}
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="resched-slot">New Slot</label>
                  <select
                    id="resched-slot"
                    className="form-control"
                    value={newSlot}
                    onChange={(e) => setNewSlot(e.target.value)}
                  >
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                  </select>
                </div>

                <div className="modal-footer" style={{ padding: '12px 0 0 0', background: 'transparent' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setRescheduleModalBooking(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Confirm Reschedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
