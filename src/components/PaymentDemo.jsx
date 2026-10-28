import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  DollarSign, 
  QrCode, 
  Printer, 
  ShieldCheck, 
  ArrowLeft,
  Sparkles,
  Lock
} from 'lucide-react';
import { validatePayment } from '../utils/validation';
import { updateBookingStatus } from '../services/storage';

export const PaymentDemo = ({ booking, onPaymentCompleted, onCancel }) => {
  const [method, setMethod] = useState('card'); // 'card' | 'upi'
  const [outcomeSimulation, setOutcomeSimulation] = useState('success'); // 'success' | 'failure'
  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Form Fields
  const [formData, setFormData] = useState({
    cardHolder: booking?.userName || 'Aarav Sharma',
    cardNumber: '4111 2222 3333 4444',
    expiry: '12/28',
    cvv: '123',
    upiId: 'student@okaxis'
  });

  const baseAmount = booking?.serviceId === 'S4' ? 100 : 50;
  const gstAmount = Math.round(baseAmount * 0.18);
  const totalAmount = baseAmount + gstAmount;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCardNumberFormatting = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    // Add space every 4 digits
    val = val.replace(/(\d{4})(?=\d)/g, '$1 ');
    setFormData(prev => ({ ...prev, cardNumber: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validatePayment(formData, method);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      if (outcomeSimulation === 'success') {
        const txnId = `TXN-${Date.now().toString().slice(-8)}`;
        const receiptData = {
          txnId,
          bookingId: booking?.id || 'TKN-DEMO',
          tokenNumber: booking?.tokenNumber || 'DEMO-101',
          serviceName: booking?.serviceName || 'Document Verification Fee',
          amount: totalAmount,
          paidAt: new Date().toLocaleString(),
          paymentMethod: method === 'card' ? 'Visa / MasterCard (Simulated)' : 'UPI Virtual Address',
          customerName: formData.cardHolder
        };

        setReceipt(receiptData);

        // Update booking status in storage if booking ID exists
        if (booking && booking.id) {
          updateBookingStatus(booking.id, booking.status, {
            isPaid: true,
            paymentRef: txnId
          });
        }

        if (onPaymentCompleted) {
          onPaymentCompleted(receiptData);
        }
      } else {
        alert('Transaction Failed: [SIMULATED] Bank declined card due to insufficient funds or timeout.');
      }
    }, 2200);
  };

  return (
    <div className="container" style={{ marginTop: '2rem', maxWidth: '820px' }}>
      {/* Top Academic Disclaimer Banner */}
      <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.35)', padding: '12px 16px', borderRadius: '10px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <AlertTriangle size={24} color="#f59e0b" flexShrink={0} />
        <div style={{ fontSize: '0.82rem', color: '#fef3c7', lineHeight: '1.45' }}>
          <strong>ACADEMIC DEMONSTRATION GATEWAY:</strong> This is a mock payment simulator created for the Web Programming syllabus. Never input real credit card credentials. All validation occurs purely in client-side JavaScript.
        </div>
      </div>

      {receipt ? (
        /* Printable Payment Receipt View */
        <div className="card" style={{ maxWidth: '520px', margin: '0 auto', textAlign: 'center', padding: '2rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--status-serving-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#10b981' }}>
            <CheckCircle2 size={32} />
          </div>

          <h2 style={{ fontSize: '1.5rem', color: '#10b981', marginBottom: '4px' }}>Payment Successful!</h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            College service fee processed and token validated.
          </p>

          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px', textAlign: 'left', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.06)', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Transaction Reference:</span>
              <strong style={{ fontFamily: 'var(--font-mono)', color: '#818cf8' }}>{receipt.txnId}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Token Number:</span>
              <strong style={{ fontFamily: 'var(--font-mono)', color: '#fbbf24' }}>{receipt.tokenNumber}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Service:</span>
              <span>{receipt.serviceName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Date & Time:</span>
              <span>{receipt.paidAt}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-card)', paddingTop: '8px', marginTop: '8px', fontSize: '1.05rem', fontWeight: 700 }}>
              <span>Total Paid:</span>
              <span style={{ color: '#34d399' }}>₹{receipt.amount}.00</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => window.print()}>
              <Printer size={15} /> Print Receipt
            </button>
            <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={onCancel}>
              Return to Dashboard
            </button>
          </div>
        </div>
      ) : (
        /* Payment Checkout Form */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Order Summary Box */}
          <div className="card" style={{ height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={18} color="var(--primary)" /> Service Fee Summary
            </h3>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.85rem' }}>
              <div style={{ color: 'var(--text-muted)' }}>Queue Booking:</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#818cf8', margin: '4px 0' }}>
                {booking?.tokenNumber || 'DEMO-TOKEN'}
              </div>
              <div style={{ color: 'var(--text-main)' }}>{booking?.serviceName || 'Admissions Document Verification'}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', borderBottom: '1px solid var(--border-card)', paddingBottom: '12px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Administrative Base Fee:</span>
                <span>₹{baseAmount}.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>GST (18%):</span>
                <span>₹{gstAmount}.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Platform Convenience:</span>
                <span style={{ color: '#34d399' }}>Free (₹0.00)</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>
              <span>Total Payable:</span>
              <span style={{ color: '#38bdf8' }}>₹{totalAmount}.00</span>
            </div>

            {/* Simulation outcome toggles */}
            <div style={{ background: 'rgba(99, 102, 241, 0.08)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', marginBottom: '6px' }}>
                Simulator Test Controls:
              </div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '0.82rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="sim-outcome"
                    value="success"
                    checked={outcomeSimulation === 'success'}
                    onChange={() => setOutcomeSimulation('success')}
                  />
                  Simulate Success
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="sim-outcome"
                    value="failure"
                    checked={outcomeSimulation === 'failure'}
                    onChange={() => setOutcomeSimulation('failure')}
                  />
                  Simulate Bank Decline
                </label>
              </div>
            </div>
          </div>

          {/* Payment Method & Inputs */}
          <div className="card">
            {/* Tabs: Card vs UPI */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-card)', paddingBottom: '10px' }}>
              <button
                type="button"
                className={`btn btn-sm ${method === 'card' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setMethod('card')}
                style={{ flex: 1 }}
              >
                Credit / Debit Card
              </button>
              <button
                type="button"
                className={`btn btn-sm ${method === 'upi' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setMethod('upi')}
                style={{ flex: 1 }}
              >
                UPI VPA (QR / Handle)
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {method === 'card' ? (
                <div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="cardHolder">Cardholder Name *</label>
                    <input
                      id="cardHolder"
                      name="cardHolder"
                      type="text"
                      className={`form-control ${formErrors.cardHolder ? 'is-invalid' : ''}`}
                      placeholder="Name on card"
                      value={formData.cardHolder}
                      onChange={handleInputChange}
                    />
                    {formErrors.cardHolder && <div className="form-feedback error">{formErrors.cardHolder}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="cardNumber">16-Digit Card Number *</label>
                    <input
                      id="cardNumber"
                      name="cardNumber"
                      type="text"
                      className={`form-control ${formErrors.cardNumber ? 'is-invalid' : ''}`}
                      placeholder="4111 2222 3333 4444"
                      value={formData.cardNumber}
                      onChange={handleCardNumberFormatting}
                      maxLength={19}
                    />
                    {formErrors.cardNumber ? (
                      <div className="form-feedback error">{formErrors.cardNumber}</div>
                    ) : (
                      <div className="form-feedback hint">Includes client-side Luhn Algorithm verification.</div>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="expiry">Expiry (MM/YY) *</label>
                      <input
                        id="expiry"
                        name="expiry"
                        type="text"
                        className={`form-control ${formErrors.expiry ? 'is-invalid' : ''}`}
                        placeholder="MM/YY (e.g. 12/28)"
                        value={formData.expiry}
                        onChange={handleInputChange}
                        maxLength={5}
                      />
                      {formErrors.expiry && <div className="form-feedback error">{formErrors.expiry}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="cvv">CVV *</label>
                      <input
                        id="cvv"
                        name="cvv"
                        type="password"
                        className={`form-control ${formErrors.cvv ? 'is-invalid' : ''}`}
                        placeholder="3 digits"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        maxLength={3}
                      />
                      {formErrors.cvv && <div className="form-feedback error">{formErrors.cvv}</div>}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="upiId">Virtual Payment Address (UPI ID) *</label>
                    <input
                      id="upiId"
                      name="upiId"
                      type="text"
                      className={`form-control ${formErrors.upiId ? 'is-invalid' : ''}`}
                      placeholder="e.g. student@okaxis or name@paytm"
                      value={formData.upiId}
                      onChange={handleInputChange}
                    />
                    {formErrors.upiId && <div className="form-feedback error">{formErrors.upiId}</div>}
                  </div>
                  <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginBottom: '14px' }}>
                    <QrCode size={90} color="#818cf8" style={{ margin: '0 auto 8px' }} />
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Scan with any UPI App (Simulated)</div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isProcessing}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isProcessing}>
                  <Lock size={15} /> {isProcessing ? 'Processing Payment...' : `Pay ₹${totalAmount}.00 (Mock)`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
