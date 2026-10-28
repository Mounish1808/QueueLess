import React from 'react';
import { Ticket, Calendar, Clock, MapPin, CheckCircle, Printer, QrCode } from 'lucide-react';

export const TokenBadge = ({ booking, onPrint, onClose }) => {
  if (!booking) return null;

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="printable-ticket-wrapper">
      {/* 
        Syllabus Demonstration: Embedded Stylesheet (<style> tag)
        Specifically scoped for printable ticket styling and print media rules.
      */}
      <style>{`
        .ticket-card {
          background: linear-gradient(145deg, #1e293b, #0f172a);
          border: 2px dashed rgba(99, 102, 241, 0.4);
          border-radius: 16px;
          padding: 24px;
          color: #f8fafc;
          position: relative;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
          max-width: 440px;
          margin: 0 auto;
        }
        .ticket-header {
          text-align: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 16px;
          margin-bottom: 16px;
        }
        .ticket-token-large {
          font-family: 'JetBrains Mono', monospace;
          font-size: 2.4rem;
          font-weight: 800;
          color: #818cf8;
          letter-spacing: 2px;
          margin: 8px 0;
          text-shadow: 0 0 12px rgba(99, 102, 241, 0.4);
        }
        .ticket-meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
          font-size: 0.88rem;
        }
        .ticket-meta-item {
          background: rgba(0, 0, 0, 0.25);
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .ticket-meta-label {
          color: #94a3b8;
          font-size: 0.75rem;
          text-transform: uppercase;
          margin-bottom: 2px;
        }
        .ticket-meta-value {
          font-weight: 600;
          color: #f1f5f9;
        }
        .ticket-qr-sim {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 8px;
          font-size: 0.8rem;
          color: #94a3b8;
        }
      `}</style>

      <div className="ticket-card printable-ticket">
        <div className="ticket-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#818cf8', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
            <Ticket size={16} /> Campus Queue Token
          </div>
          <div className="ticket-token-large">{booking.tokenNumber}</div>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: '#e2e8f0' }}>{booking.serviceName}</div>
        </div>

        <div className="ticket-meta-grid">
          <div className="ticket-meta-item">
            <div className="ticket-meta-label">Counter</div>
            <div className="ticket-meta-value" style={{ color: '#38bdf8' }}>{booking.counterId || 'Assigned on call'}</div>
          </div>
          <div className="ticket-meta-item">
            <div className="ticket-meta-label">Queue Position</div>
            <div className="ticket-meta-value" style={{ color: '#fbbf24' }}>#{booking.queuePosition || 1} in line</div>
          </div>
          <div className="ticket-meta-item">
            <div className="ticket-meta-label">Date & Slot</div>
            <div className="ticket-meta-value">{booking.date} • {booking.slotTime}</div>
          </div>
          <div className="ticket-meta-item">
            <div className="ticket-meta-label">Est. Waiting Time</div>
            <div className="ticket-meta-value" style={{ color: '#34d399' }}>~{booking.estimatedWaitMins || 10} Mins</div>
          </div>
        </div>

        <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: '#cbd5e1' }}>
          <div><strong>Student Name:</strong> {booking.userName}</div>
          <div><strong>Mobile:</strong> {booking.userPhone}</div>
          {booking.notes && <div style={{ marginTop: '4px', fontStyle: 'italic', color: '#94a3b8' }}>"{booking.notes}"</div>}
        </div>

        <div className="ticket-qr-sim">
          <QrCode size={36} color="#818cf8" />
          <div>
            <div style={{ fontWeight: 600, color: '#e2e8f0' }}>Digital Verification Key</div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.72rem' }}>ID: {booking.id}</div>
          </div>
        </div>

        <div className="no-print" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={handlePrint}>
            <Printer size={16} /> Print Ticket
          </button>
          {onClose && (
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
