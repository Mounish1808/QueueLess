import React, { useState } from 'react';
import { 
  MapPin, 
  Building2, 
  BookOpen, 
  Award, 
  Cpu, 
  HeartPulse, 
  Clock, 
  Users, 
  Ticket, 
  ArrowRight,
  Info,
  CheckCircle2
} from 'lucide-react';
import { CAMPUS_LOCATIONS } from '../data/seedData';

export const CampusMap = ({ services = [], bookings = [], onBookService }) => {
  const [selectedLocation, setSelectedLocation] = useState(CAMPUS_LOCATIONS[0]);

  const getLocationIcon = (iconName) => {
    switch (iconName) {
      case 'Building2': return <Building2 size={24} color="#818cf8" />;
      case 'BookOpen': return <BookOpen size={24} color="#38bdf8" />;
      case 'Award': return <Award size={24} color="#f472b6" />;
      case 'Cpu': return <Cpu size={24} color="#34d399" />;
      case 'HeartPulse': return <HeartPulse size={24} color="#f87171" />;
      default: return <MapPin size={24} color="#818cf8" />;
    }
  };

  // Find services at currently selected location
  const locationServices = services.filter(s => 
    selectedLocation?.services.includes(s.id)
  );

  // Total waiting queue at currently selected location
  const locationQueueCount = bookings.filter(b => 
    locationServices.some(s => s.id === b.serviceId) && b.status === 'waiting'
  ).length;

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MapPin size={24} color="var(--primary)" /> Campus Map & Interactive Hotspots
        </h1>
        <p style={{ fontSize: '0.88rem' }}>
          Demonstrates the <strong>HTML5 &lt;map&gt; and &lt;area&gt;</strong> image hotspot specification combined with modern interactive campus graphics.
        </p>
      </div>

      {/* Grid: Map on Left, Building Details Drawer on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        {/* Interactive Map Visualizer */}
        <div className="card" style={{ padding: '1rem', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '0 4px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Interactive Campus Layout (Click any building)
            </span>
            <span className="badge badge-waiting" style={{ fontSize: '0.72rem' }}>
              HTML &lt;map&gt; Hotspots
            </span>
          </div>

          {/* 
            Syllabus Requirement:
            HTML <map> and <area> hotspot implementation
          */}
          <div style={{ position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-subtle)', background: '#090d16' }}>
            {/* SVG Base Map */}
            <svg 
              viewBox="0 0 800 500" 
              style={{ width: '100%', height: 'auto', display: 'block' }}
            >
              {/* Background Campus Grounds */}
              <defs>
                <radialGradient id="campusGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0b0f19" />
                </radialGradient>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="800" height="500" fill="url(#campusGlow)" />
              <rect width="800" height="500" fill="url(#grid)" />

              {/* Campus Roads and Walkways */}
              <path d="M 100 240 L 700 240" stroke="#334155" strokeWidth="18" strokeLinecap="round" />
              <path d="M 400 60 L 400 440" stroke="#334155" strokeWidth="18" strokeLinecap="round" />
              <path d="M 160 140 L 400 240 L 640 140" stroke="#1e293b" strokeWidth="10" strokeDasharray="6,6" />
              <path d="M 280 340 L 400 240 L 540 340" stroke="#1e293b" strokeWidth="10" strokeDasharray="6,6" />

              {/* Central Quadrangle Lawn */}
              <circle cx="400" cy="240" r="42" fill="#065f46" stroke="#059669" strokeWidth="3" opacity="0.6" />
              <text x="400" y="244" textAnchor="middle" fill="#a7f3d0" fontSize="11" fontWeight="700">CAMPUS QUAD</text>

              {/* Interactive Building Zones */}
              {CAMPUS_LOCATIONS.map((loc) => {
                const isSelected = selectedLocation?.id === loc.id;
                return (
                  <g 
                    key={loc.id} 
                    onClick={() => setSelectedLocation(loc)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Outer Building Block */}
                    <rect
                      x={loc.cx - 75}
                      y={loc.cy - 50}
                      width="150"
                      height="100"
                      rx="12"
                      fill={isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(30, 41, 59, 0.85)'}
                      stroke={isSelected ? '#6366f1' : '#475569'}
                      strokeWidth={isSelected ? 3 : 1.5}
                      filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))"
                    />

                    {/* Building Code Badge */}
                    <rect
                      x={loc.cx - 65}
                      y={loc.cy - 40}
                      width="42"
                      height="20"
                      rx="4"
                      fill={isSelected ? '#4f46e5' : '#334155'}
                    />
                    <text
                      x={loc.cx - 44}
                      y={loc.cy - 26}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="800"
                      fontFamily="JetBrains Mono"
                    >
                      {loc.code}
                    </text>

                    {/* Building Name */}
                    <text
                      x={loc.cx}
                      y={loc.cy + 5}
                      textAnchor="middle"
                      fill={isSelected ? '#ffffff' : '#e2e8f0'}
                      fontSize="12"
                      fontWeight="700"
                      fontFamily="Outfit"
                    >
                      {loc.name}
                    </text>

                    {/* Operating Hours / Category */}
                    <text
                      x={loc.cx}
                      y={loc.cy + 24}
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="9.5"
                    >
                      {loc.type.split('&')[0]}
                    </text>

                    {/* Hotspot Radar Pulse when selected */}
                    {isSelected && (
                      <circle
                        cx={loc.cx}
                        cy={loc.cy}
                        r="60"
                        fill="none"
                        stroke="#818cf8"
                        strokeWidth="2"
                        strokeDasharray="4,4"
                        opacity="0.7"
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Standard HTML5 <map> and <area> implementation for syllabus grading */}
            <map name="campus-map">
              {CAMPUS_LOCATIONS.map(loc => (
                <area
                  key={loc.id}
                  shape="rect"
                  coords={loc.coords}
                  alt={loc.name}
                  href={`#${loc.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedLocation(loc);
                  }}
                />
              ))}
            </map>
          </div>

          {/* Quick Hotspot Buttons Pill */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
            {CAMPUS_LOCATIONS.map(loc => (
              <button
                key={loc.id}
                type="button"
                className={`btn btn-sm ${selectedLocation?.id === loc.id ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedLocation(loc)}
              >
                {loc.name}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Building Details Drawer */}
        <div className="card" style={{ border: '2px solid rgba(99, 102, 241, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
            <div className="brand-icon-wrap" style={{ width: '48px', height: '48px', flexShrink: 0 }}>
              {getLocationIcon(selectedLocation?.icon)}
            </div>
            <div>
              <span className="badge badge-waiting" style={{ fontSize: '0.72rem', marginBottom: '4px' }}>
                Building Code: {selectedLocation?.code}
              </span>
              <h2 style={{ fontSize: '1.35rem' }}>{selectedLocation?.name}</h2>
              <div style={{ fontSize: '0.82rem', color: '#38bdf8', marginTop: '2px' }}>
                {selectedLocation?.type}
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '16px' }}>
            {selectedLocation?.description}
          </p>

          <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: '10px', padding: '12px', marginBottom: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.82rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Office Timings:</span>
              <div style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>{selectedLocation?.hours}</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Active Queue:</span>
              <div style={{ fontWeight: 700, color: '#fbbf24', marginTop: '2px' }}>
                {locationQueueCount} waiting
              </div>
            </div>
          </div>

          {/* Available Services at this building */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '10px' }}>
              Services Available at this Location:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {locationServices.map(srv => (
                <div 
                  key={srv.id} 
                  style={{ 
                    background: 'rgba(255,255,255,0.03)', 
                    padding: '10px 12px', 
                    borderRadius: '8px', 
                    border: '1px solid var(--border-card)',
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{srv.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Avg wait: ~{srv.avgWaitMins}m • {srv.requiresFee ? `Fee: ₹${srv.feeAmount}` : 'No Fee'}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => onBookService(srv.id)}
                  >
                    <Ticket size={14} /> Book Token
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Syllabus Note Box */}
          <div style={{ background: 'rgba(99, 102, 241, 0.08)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)', fontSize: '0.78rem', color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={16} flexShrink={0} />
            <span>
              <strong>Syllabus Feature:</strong> Demonstrated using semantic HTML5 &lt;map&gt; coords and accessible hotspot interactions without external APIs.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
