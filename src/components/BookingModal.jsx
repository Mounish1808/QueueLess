import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Ticket, AlertCircle, Check, ArrowRight, X, User, DollarSign } from 'lucide-react';
import { getServices, createBooking } from '../services/storage';
import { TokenBadge } from './TokenBadge';

const TIME_SLOTS = [
  '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'
];

export const BookingModal = ({ isOpen, onClose, initialServiceId = null, currentUser, onBookingCreated, onNavigatePayment }) => {
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[0]);
  const [notes, setNotes] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [createdBooking, setCreatedBooking] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const activeServices = getServices().filter(s => s.active);
      setServices(activeServices);
      if (initialServiceId && activeServices.some(s => s.id === initialServiceId)) {
        setSelectedServiceId(initialServiceId);
      } else if (activeServices.length > 0) {
        setSelectedServiceId(activeServices[0].id);
      }
      setCreatedBooking(null);
      setError('');
    }
  }, [isOpen, initialServiceId]);

  if (!isOpen) return null;

  const currentService = services.find(s => s.id === selectedServiceId);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!selectedServiceId) {
      setError('Please select a service.');
      return;
    }

    const userName = currentUser ? currentUser.name : guestName.trim();
    const userEmail = currentUser ? currentUser.email : guestEmail.trim();
    const userPhone = currentUser ? currentUser.phone : guestPhone.trim();
    const userId = currentUser ? currentUser.id : `guest-${Date.now()}`;

    if (!userName || !userPhone) {
      setError('Student name and mobile number are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newBooking = createBooking({
        serviceId: selectedServiceId,
        userId,
        userName,
        userEmail: userEmail || 'student@college.edu',
        userPhone,
        date: selectedDate,
        slotTime: selectedSlot,
        notes: notes.trim(),
        isPaid: false
      });

      setCreatedBooking(newBooking);
      if (onBookingCreated) {
        onBookingCreated(newBooking);
      }
    } catch (err) {
      setError(err.message || 'Unable to book token. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Ticket size={22} color="var(--primary)" />
              {createdBooking ? 'Token Generated Successfully!' : 'Book Queue Token / Appointment'}
            </h3>
            <p style={{ fontSize: '0.82rem', marginTop: '2px' }}>
              {createdBooking ? 'Keep this token ready when approaching the service counter' : 'Select your campus service, date, and preferred time slot'}
            </p>
          </div>
          <button className="input-action-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div style={{ background: 'var(--status-cancelled-bg)', color: '#fca5a5', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {createdBooking ? (
            <div>
              <TokenBadge booking={createdBooking} />
              
              {createdBooking && currentService && currentService.requiresFee && (
                <div style={{ marginTop: '16px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fbbf24' }}>
                      Optional Demonstration Fee: ₹{currentService.feeAmount}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                      {currentService.feeDescription || 'Online fee payment demonstration'}
                    </div>
                  </div>
                  {onNavigatePayment && (
                    <button
                      type="button"
                      className="btn btn-accent btn-sm"
                      onClick={() => {
                        onClose();
                        onNavigatePayment(createdBooking);
                      }}
                    >
                      <DollarSign size={15} /> Pay Demo Fee
                    </button>
                  )}
                </div>
              )}

              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Back to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Service Selection */}
              <div className="form-group">
                <label className="form-label" htmlFor="booking-service">
                  Select Campus Service <span className="required">*</span>
                </label>
                <select
                  id="booking-service"
                  className="form-control"
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                >
                  {services.map(s => (
                    <option key={s.id} value={s.id}>
                      [{s.code}] {s.name} ({s.location})
                    </option>
                  ))}
                </select>
                {currentService && (
                  <div style={{ marginTop: '6px', fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="var(--primary)" /> {currentService.location} • Avg wait: ~{currentService.avgWaitMins} mins
                  </div>
                )}
              </div>

              {/* Date & Time Slot */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="booking-date">
                    Appointment Date <span className="required">*</span>
                  </label>
                  <input
                    id="booking-date"
                    type="date"
                    className="form-control"
                    min={today}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="booking-slot">
                    Time Slot <span className="required">*</span>
                  </label>
                  <select
                    id="booking-slot"
                    className="form-control"
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                  >
                    {TIME_SLOTS.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Student info if not logged in */}
              {!currentUser && (
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', marginBottom: '14px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
                    Applicant Information (Guest Booking):
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Your Full Name *"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="10-digit Mobile *"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        maxLength={10}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Purpose / Notes */}
              <div className="form-group">
                <label className="form-label" htmlFor="booking-notes">
                  Purpose / Specific Request (Optional)
                </label>
                <textarea
                  id="booking-notes"
                  className="form-control"
                  rows={2}
                  placeholder="e.g. Original 12th marksheet verification for scholarship clearance"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="modal-footer" style={{ padding: '12px 0 0 0', background: 'transparent' }}>
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  <Ticket size={16} /> {isSubmitting ? 'Generating...' : 'Confirm & Generate Token'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
