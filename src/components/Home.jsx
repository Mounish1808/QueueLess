import React from 'react';
import { 
  Ticket, 
  MapPin, 
  Clock, 
  Users, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Building2, 
  BookOpen, 
  Award, 
  HeartPulse, 
  DollarSign,
  Activity
} from 'lucide-react';

export const Home = ({ 
  services = [], 
  counters = [], 
  bookings = [], 
  onOpenBooking, 
  onSelectTab, 
  onServiceSelect 
}) => {
  // Extract currently serving or recently called tokens for ticker
  const activeTokens = bookings.filter(b => b.status === 'serving' || b.status === 'called');
  const waitingTokens = bookings.filter(b => b.status === 'waiting');

  const getServiceIcon = (buildingId) => {
    switch (buildingId) {
      case 'admin-block': return <Building2 size={20} color="#818cf8" />;
      case 'central-library': return <BookOpen size={20} color="#38bdf8" />;
      case 'exam-branch': return <Award size={20} color="#f472b6" />;
      case 'cs-labs': return <Cpu size={20} color="#34d399" />;
      case 'health-center': return <HeartPulse size={20} color="#f87171" />;
      default: return <Ticket size={20} color="#818cf8" />;
    }
  };

  return (
    <div>
      {/* Live Token Marquee / Ticker */}
      <div className="ticker-wrap">
        <div className="ticker-inner">
          <span style={{ color: '#38bdf8', fontWeight: 700 }}>● CAMPUS LIVE QUEUE STATUS:</span>
          {counters.map((c, i) => {
            const servToken = bookings.find(b => b.id === c.servingTokenId);
            return (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#94a3b8' }}>[{c.name.split(' ')[0]} {c.name.split(' ')[1]}]:</span>
                {c.status === 'paused' ? (
                  <span style={{ color: '#ef4444' }}>PAUSED (ON BREAK)</span>
                ) : servToken ? (
                  <span style={{ color: '#34d399', fontWeight: 'bold' }}>SERVING {servToken.tokenNumber}</span>
                ) : (
                  <span style={{ color: '#a5b4fc' }}>IDLE / READY</span>
                )}
              </span>
            );
          })}
          {/* Duplicate for seamless infinite loop */}
          <span style={{ color: '#38bdf8', fontWeight: 700 }}>● CAMPUS LIVE QUEUE STATUS:</span>
          {counters.map((c, i) => {
            const servToken = bookings.find(b => b.id === c.servingTokenId);
            return (
              <span key={`dup-${i}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#94a3b8' }}>[{c.name.split(' ')[0]} {c.name.split(' ')[1]}]:</span>
                {c.status === 'paused' ? (
                  <span style={{ color: '#ef4444' }}>PAUSED</span>
                ) : servToken ? (
                  <span style={{ color: '#34d399', fontWeight: 'bold' }}>SERVING {servToken.tokenNumber}</span>
                ) : (
                  <span style={{ color: '#a5b4fc' }}>IDLE</span>
                )}
              </span>
            );
          })}
        </div>
      </div>

      <div className="container" style={{ marginTop: '2.5rem' }}>
        {/* Hero Section */}
        <section style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 3.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 14px', borderRadius: '9999px', background: 'var(--primary-light)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#a5b4fc', fontSize: '0.82rem', fontWeight: 600, marginBottom: '1.25rem' }}>
            <Sparkles size={15} /> Smart College Queue & Appointment Management System
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)', lineHeight: 1.15, marginBottom: '1.25rem' }}>
            Say Goodbye to Standing in Long Queues Across Campus.
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
            Book appointments, generate digital tokens for administrative offices, libraries, laboratories, and fee desks, and track your queue position in real-time.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={onOpenBooking}
            >
              <Ticket size={18} /> Book a Queue Token
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={() => onSelectTab('campus-map')}
            >
              <MapPin size={18} /> Explore Campus Map
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={() => onSelectTab('syllabus-lab')}
              style={{ border: '1px solid rgba(99, 102, 241, 0.4)' }}
            >
              <BookOpen size={18} color="#818cf8" /> Syllabus Lab & Viva
            </button>
          </div>
        </section>

        {/* Live Counters Overview Card */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Activity size={22} color="var(--primary)" /> Live Service Counters Board
              </h2>
              <p style={{ fontSize: '0.88rem' }}>
                Real-time operational status across administrative wings, libraries, and laboratories.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', fontSize: '0.82rem' }}>
              <span className="badge badge-serving">Active Desk</span>
              <span className="badge badge-waiting">Waiting in Line</span>
              <span className="badge badge-cancelled">Counter Paused</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {counters.map(counter => {
              const service = services.find(s => s.id === counter.serviceId);
              const servingBooking = bookings.find(b => b.id === counter.servingTokenId);
              const waitingCount = bookings.filter(b => b.serviceId === counter.serviceId && b.status === 'waiting').length;

              return (
                <div key={counter.id} className="card card-hover" style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>{counter.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <Users size={13} /> Staff: {counter.staffName}
                      </div>
                    </div>
                    {counter.status === 'paused' ? (
                      <span className="badge badge-cancelled">Paused</span>
                    ) : (
                      <span className="badge badge-serving">Active</span>
                    )}
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: '8px', padding: '12px', margin: '10px 0', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Currently Serving
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.35rem', fontWeight: 800, color: servingBooking ? '#34d399' : '#94a3b8' }}>
                        {servingBooking ? servingBooking.tokenNumber : 'None (Idle)'}
                      </span>
                      {servingBooking && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          • {servingBooking.userName.split(' ')[0]}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-card)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: waitingCount > 0 ? '#fbbf24' : 'var(--text-dim)' }}>
                      <Clock size={14} /> <strong>{waitingCount}</strong> waiting in queue
                    </div>
                    {service && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        style={{ padding: '3px 10px', fontSize: '0.76rem' }}
                        onClick={() => {
                          if (onServiceSelect) onServiceSelect(service.id);
                          onOpenBooking();
                        }}
                      >
                        Book Here
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Services Catalog */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Layers size={22} color="var(--primary)" /> Campus Service Catalog
            </h2>
            <p style={{ fontSize: '0.88rem' }}>
              Select a service below to generate an instant token with estimated wait times.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {services.map(service => {
              const queueForThisService = bookings.filter(b => b.serviceId === service.id && b.status === 'waiting').length;

              return (
                <div key={service.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                    <div className="brand-icon-wrap" style={{ width: '42px', height: '42px', flexShrink: 0 }}>
                      {getServiceIcon(service.buildingId)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#818cf8', fontWeight: 700 }}>
                          [{service.code}]
                        </span>
                        {service.requiresFee && (
                          <span className="badge badge-waiting" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                            Demo Fee: ₹{service.feeAmount}
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontSize: '1.1rem', marginTop: '2px' }}>{service.name}</h3>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.84rem', lineHeight: '1.5', marginBottom: '14px', flex: 1 }}>
                    {service.description}
                  </p>

                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px 12px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                      <MapPin size={13} /> {service.location.split(',')[0]}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#38bdf8' }}>
                      <Clock size={13} /> ~{service.avgWaitMins}m avg
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ flex: 1 }}
                      onClick={() => {
                        if (onServiceSelect) onServiceSelect(service.id);
                        onOpenBooking();
                      }}
                    >
                      <Ticket size={16} /> Book Token
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-icon"
                      title="View Location on Campus Map"
                      onClick={() => onSelectTab('campus-map')}
                    >
                      <MapPin size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Three-Tier Architecture Explanation Card (Web Programming Syllabus Requirement) */}
        <section style={{ marginBottom: '2rem' }}>
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Layers size={22} color="#818cf8" />
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>Three-Tier Architecture Overview</h3>
                <p style={{ fontSize: '0.82rem' }}>Web Programming Syllabus Implementation Architecture</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ color: '#818cf8', fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px' }}>
                  Tier 1: Presentation Layer
                </div>
                <p style={{ fontSize: '0.82rem', lineHeight: '1.5' }}>
                  Built with <strong>React JS, HTML5 semantic elements</strong>, and <strong>CSS3</strong> external, embedded, and inline stylesheets. Responsive UI for students, staff desks, and admin consoles.
                </p>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px' }}>
                  Tier 2: Business & Application Layer
                </div>
                <p style={{ fontSize: '0.82rem', lineHeight: '1.5' }}>
                  Client state machine, JavaScript token sequence generator, queue position recalculation, and simulated backend with complementary <strong>PHP regular expressions</strong> and <strong>Java Servlets</strong>.
                </p>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ color: '#34d399', fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px' }}>
                  Tier 3: Database & Storage Layer
                </div>
                <p style={{ fontSize: '0.82rem', lineHeight: '1.5' }}>
                  Client persistent <strong>LocalStorage</strong> with automatic seeding and reset. Includes companion <strong>MySQL schema (`schema.sql`)</strong> and <strong>Java JDBC DAO</strong> for academic examinations.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
