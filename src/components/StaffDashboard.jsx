import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Play, 
  Pause, 
  Volume2, 
  UserPlus, 
  Search, 
  Filter, 
  SkipForward, 
  AlertCircle,
  Phone,
  Mail,
  Ticket
} from 'lucide-react';
import { 
  updateBookingStatus, 
  setCounterStatus, 
  createBooking, 
  getCounters, 
  getServices 
} from '../services/storage';
import { playTokenCallChime } from '../utils/soundEffects';

export const StaffDashboard = ({ 
  counters = [], 
  services = [], 
  bookings = [], 
  currentUser,
  onNotify 
}) => {
  // Default to staff's assigned counter or first active counter
  const initialCounterId = currentUser?.counterId || (counters[0] ? counters[0].id : 'C1');
  const [activeCounterId, setActiveCounterId] = useState(initialCounterId);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'waiting' | 'serving' | 'completed' | 'skipped'
  const [searchTerm, setSearchTerm] = useState('');
  const [showWalkinModal, setShowWalkinModal] = useState(false);
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinNotes, setWalkinNotes] = useState('');

  // Selected counter object
  const currentCounter = counters.find(c => c.id === activeCounterId) || counters[0];
  const currentService = services.find(s => s.id === currentCounter?.serviceId);

  // Currently serving token at this counter
  const servingBooking = bookings.find(b => b.id === currentCounter?.servingTokenId) || 
    bookings.find(b => b.counterId === activeCounterId && (b.status === 'serving' || b.status === 'called'));

  // Waiting list for this counter's service
  const waitingList = bookings.filter(b => 
    b.serviceId === currentCounter?.serviceId && b.status === 'waiting'
  );

  // Counter filter bookings
  const counterBookings = bookings.filter(b => {
    const matchesCounter = b.serviceId === currentCounter?.serviceId || b.counterId === activeCounterId;
    const matchesStatus = filterStatus === 'all' ? true : b.status === filterStatus;
    const matchesSearch = searchTerm ? (
      b.tokenNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.userPhone.includes(searchTerm)
    ) : true;
    return matchesCounter && matchesStatus && matchesSearch;
  });

  const handleCallNext = () => {
    if (waitingList.length === 0) {
      alert('No more students are currently waiting in line for this service.');
      return;
    }

    const nextBooking = waitingList[0];

    // Mark current serving as completed if exists
    if (servingBooking) {
      updateBookingStatus(servingBooking.id, 'completed');
    }

    // Call next token
    updateBookingStatus(nextBooking.id, 'serving', { counterId: activeCounterId });
    setCounterStatus(activeCounterId, 'active', nextBooking.id);

    // Audio chime notification
    playTokenCallChime();

    if (onNotify) {
      onNotify({
        title: `Token ${nextBooking.tokenNumber} Called!`,
        message: `${nextBooking.userName} please proceed to ${currentCounter?.name}`,
        time: new Date().toLocaleTimeString()
      });
    }
  };

  const handleStatusChange = (bookingId, status) => {
    updateBookingStatus(bookingId, status);
    if (servingBooking && servingBooking.id === bookingId) {
      if (status === 'completed' || status === 'skipped' || status === 'cancelled') {
        setCounterStatus(activeCounterId, currentCounter.status, null);
      }
    }
  };

  const handleToggleCounterPause = () => {
    const newStatus = currentCounter.status === 'active' ? 'paused' : 'active';
    setCounterStatus(activeCounterId, newStatus, currentCounter.servingTokenId);
  };

  const handleAddWalkinSubmit = (e) => {
    e.preventDefault();
    if (!walkinName.trim() || !walkinPhone.trim()) {
      alert('Walk-in student name and contact are required.');
      return;
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      const slotTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newBooking = createBooking({
        serviceId: currentCounter.serviceId,
        userId: `walkin-${Date.now()}`,
        userName: `${walkinName.trim()} (Walk-in)`,
        userEmail: 'walkin.student@college.edu',
        userPhone: walkinPhone.trim(),
        date: today,
        slotTime,
        notes: walkinNotes.trim() || 'Direct desk walk-in student',
        isPaid: false
      });

      setShowWalkinModal(false);
      setWalkinName('');
      setWalkinPhone('');
      setWalkinNotes('');
      alert(`Walk-in token ${newBooking.tokenNumber} created and queued!`);
    } catch (err) {
      alert(err.message || 'Error generating walk-in token.');
    }
  };

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      {/* Top Controls Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={24} color="var(--primary)" /> Staff Counter Desk Operations
          </h1>
          <p style={{ fontSize: '0.88rem' }}>
            Operator desk controls for calling tokens, serving students, managing walk-ins, and counter pacing.
          </p>
        </div>

        {/* Counter Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-card)', padding: '6px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Staffing:</span>
          <select 
            className="form-control" 
            style={{ width: 'auto', padding: '4px 10px', fontSize: '0.85rem' }}
            value={activeCounterId}
            onChange={(e) => setActiveCounterId(e.target.value)}
          >
            {counters.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} {c.status === 'paused' ? '(PAUSED)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Operational Status Banner & Quick Action Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
        {/* Currently Serving Box */}
        <div className="card" style={{ border: servingBooking ? '2px solid #10b981' : '1px solid var(--border-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)' }}>
              CURRENTLY SERVING AT DESK
            </span>
            {servingBooking ? (
              <span className="badge badge-serving">In Progress</span>
            ) : (
              <span className="badge badge-skipped">Desk Idle</span>
            )}
          </div>

          {servingBooking ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '6px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '2.5rem', fontWeight: 800, color: '#34d399' }}>
                  {servingBooking.tokenNumber}
                </span>
                <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>{servingBooking.userName}</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                <div><strong>Service:</strong> {servingBooking.serviceName}</div>
                <div><strong>Purpose:</strong> {servingBooking.notes || 'General inquiry'}</div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                  <span><Phone size={12} /> {servingBooking.userPhone}</span>
                  <span><Clock size={12} /> Called at: {servingBooking.calledAt || 'Just now'}</span>
                </div>
              </div>

              {/* Action Buttons for current customer */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                <button
                  type="button"
                  className="btn btn-success btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => handleStatusChange(servingBooking.id, 'completed')}
                >
                  <CheckCircle size={15} /> Complete & Done
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleStatusChange(servingBooking.id, 'skipped')}
                >
                  <SkipForward size={14} /> Skip (Absent)
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleStatusChange(servingBooking.id, 'cancelled')}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: '1.5rem 0', textAlign: 'center' }}>
              <p style={{ fontSize: '0.9rem', marginBottom: '12px' }}>
                No student is currently being served at this desk.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCallNext}
                disabled={waitingList.length === 0 || currentCounter?.status === 'paused'}
              >
                <Volume2 size={16} /> Call Next Student ({waitingList.length} Waiting)
              </button>
            </div>
          )}
        </div>

        {/* Counter Action & Controls Panel */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)' }}>
                COUNTER PACING & QUEUE CONTROLS
              </span>
              <span className={`badge badge-${currentCounter?.status === 'active' ? 'serving' : 'cancelled'}`}>
                {currentCounter?.status === 'active' ? 'Desk Active' : 'Desk Paused'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Waiting in Line</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fbbf24' }}>{waitingList.length}</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Estimated Wait</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8' }}>
                  ~{waitingList.length * (currentService?.avgWaitMins || 10)}m
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={handleCallNext}
              disabled={waitingList.length === 0 || currentCounter?.status === 'paused'}
            >
              <Volume2 size={16} /> Call Next Token
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowWalkinModal(true)}
            >
              <UserPlus size={16} /> Add Walk-in
            </button>
            <button
              type="button"
              className={`btn ${currentCounter?.status === 'active' ? 'btn-danger' : 'btn-success'}`}
              onClick={handleToggleCounterPause}
              title={currentCounter?.status === 'active' ? 'Pause counter for break' : 'Resume counter'}
            >
              {currentCounter?.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
              {currentCounter?.status === 'active' ? 'Pause Desk' : 'Resume Desk'}
            </button>
          </div>
        </div>
      </div>

      {/* Queue List Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem' }}>Counter Queue Directory</h3>
            <p style={{ fontSize: '0.82rem' }}>All appointments and tokens mapped to {currentCounter?.name}</p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ position: 'relative', width: '220px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search token / student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '32px' }}
              />
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-dim)' }} />
            </div>

            {/* Status Filter */}
            <select
              className="form-control"
              style={{ width: 'auto' }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="waiting">Waiting Only</option>
              <option value="serving">Serving Now</option>
              <option value="completed">Completed</option>
              <option value="skipped">Skipped</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Student / Customer</th>
                <th>Contact</th>
                <th>Slot Time</th>
                <th>Status</th>
                <th>Queue Pos</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {counterBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No bookings found matching current filters.
                  </td>
                </tr>
              ) : (
                counterBookings.map(b => (
                  <tr key={b.id}>
                    <td>
                      <span className="token-pill">{b.tokenNumber}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.userName}</div>
                      {b.notes && <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>"{b.notes}"</div>}
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>
                      {b.userPhone}
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {b.slotTime}
                    </td>
                    <td>
                      <span className={`badge badge-${b.status}`}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      {b.status === 'waiting' ? `#${b.queuePosition || 1}` : '—'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {b.status === 'waiting' && (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                            onClick={() => {
                              updateBookingStatus(b.id, 'serving', { counterId: activeCounterId });
                              setCounterStatus(activeCounterId, 'active', b.id);
                              playTokenCallChime();
                            }}
                          >
                            Call Direct
                          </button>
                        )}
                        {b.status === 'serving' && (
                          <button
                            type="button"
                            className="btn btn-success btn-sm"
                            style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                            onClick={() => handleStatusChange(b.id, 'completed')}
                          >
                            Complete
                          </button>
                        )}
                        {b.status !== 'completed' && b.status !== 'cancelled' && (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                            onClick={() => handleStatusChange(b.id, 'skipped')}
                          >
                            Skip
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Walk-in Modal */}
      {showWalkinModal && (
        <div className="modal-overlay" onClick={() => setShowWalkinModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem' }}>Add Desk Walk-in Customer</h3>
              <button className="input-action-btn" onClick={() => setShowWalkinModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddWalkinSubmit}>
                <div style={{ marginBottom: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Issue an instant queue ticket for a student directly at <strong>{currentCounter?.name}</strong>.
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="walkin-name">Student Name <span className="required">*</span></label>
                  <input
                    id="walkin-name"
                    type="text"
                    className="form-control"
                    placeholder="e.g. Rahul Sharma"
                    value={walkinName}
                    onChange={(e) => setWalkinName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="walkin-phone">Mobile Number <span className="required">*</span></label>
                  <input
                    id="walkin-phone"
                    type="tel"
                    className="form-control"
                    placeholder="10-digit Mobile"
                    value={walkinPhone}
                    onChange={(e) => setWalkinPhone(e.target.value)}
                    maxLength={10}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="walkin-notes">Purpose / Query</label>
                  <input
                    id="walkin-notes"
                    type="text"
                    className="form-control"
                    placeholder="e.g. Urgent fee receipt copy"
                    value={walkinNotes}
                    onChange={(e) => setWalkinNotes(e.target.value)}
                  />
                </div>

                <div className="modal-footer" style={{ padding: '12px 0 0 0', background: 'transparent' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowWalkinModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Generate Walk-in Token
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
