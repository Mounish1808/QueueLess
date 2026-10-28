import React, { useMemo } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Download, 
  Users, 
  Activity,
  Layers
} from 'lucide-react';

export const Analytics = ({ bookings = [], services = [], counters = [] }) => {
  // Computed metrics from real data
  const metrics = useMemo(() => {
    const total = bookings.length;
    const waiting = bookings.filter(b => b.status === 'waiting').length;
    const serving = bookings.filter(b => b.status === 'serving' || b.status === 'called').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    const skipped = bookings.filter(b => b.status === 'skipped').length;

    // Calculate average wait time (in minutes) across services
    const waitTimes = bookings
      .filter(b => b.estimatedWaitMins !== undefined)
      .map(b => b.estimatedWaitMins);
    const avgWait = waitTimes.length > 0 
      ? Math.round(waitTimes.reduce((acc, curr) => acc + curr, 0) / waitTimes.length) 
      : 12;

    // Service-wise distribution
    const serviceCounts = {};
    services.forEach(s => { serviceCounts[s.name] = 0; });
    bookings.forEach(b => {
      serviceCounts[b.serviceName] = (serviceCounts[b.serviceName] || 0) + 1;
    });

    const serviceData = Object.entries(serviceCounts).map(([name, count]) => ({
      name,
      count,
      pct: total > 0 ? Math.round((count / total) * 100) : 0
    }));

    // Daily distribution (today vs yesterday vs earlier)
    const today = new Date().toISOString().split('T')[0];
    const todayCount = bookings.filter(b => b.date === today).length;
    const yesterdayCount = bookings.filter(b => b.date < today).length;

    return {
      total,
      waiting,
      serving,
      completed,
      cancelled,
      skipped,
      avgWait,
      serviceData,
      todayCount,
      yesterdayCount
    };
  }, [bookings, services]);

  const handleExportCSV = () => {
    const headers = ['Token ID', 'Token Number', 'Service Name', 'User Name', 'Date', 'Time Slot', 'Status', 'Estimated Wait (Mins)', 'Paid'];
    const rows = bookings.map(b => [
      b.id,
      b.tokenNumber,
      `"${b.serviceName}"`,
      `"${b.userName}"`,
      b.date,
      b.slotTime,
      b.status,
      b.estimatedWaitMins || 0,
      b.isPaid ? 'Yes' : 'No'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `queueless_analytics_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Colors for donut chart slices
  const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart3 size={24} color="var(--primary)" /> Real-Time Analytics & Reports
          </h1>
          <p style={{ fontSize: '0.88rem' }}>
            Calculated dynamic queue metrics, campus service distribution, and counter efficiency.
          </p>
        </div>
        <button type="button" className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
          <Download size={15} /> Export Report (CSV)
        </button>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-wrap" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Layers size={22} />
          </div>
          <div>
            <div className="kpi-value">{metrics.total}</div>
            <div className="kpi-label">Total Tokens Logged</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap" style={{ background: 'var(--status-waiting-bg)', color: '#fbbf24' }}>
            <Clock size={22} />
          </div>
          <div>
            <div className="kpi-value">{metrics.waiting}</div>
            <div className="kpi-label">Currently Waiting</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap" style={{ background: 'var(--status-serving-bg)', color: '#10b981' }}>
            <Activity size={22} />
          </div>
          <div>
            <div className="kpi-value">{metrics.completed}</div>
            <div className="kpi-label">Completed Services</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap" style={{ background: 'var(--accent-light)', color: '#06b6d4' }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <div className="kpi-value">~{metrics.avgWait}m</div>
            <div className="kpi-label">Avg Simulated Wait</div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Service Distribution Chart */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>Service-Wise Booking Volume</h3>
              <p style={{ fontSize: '0.8rem' }}>Distribution of token requests across departments</p>
            </div>
            <PieChart size={18} color="var(--primary)" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {metrics.serviceData.map((item, index) => {
              const color = COLORS[index % COLORS.length];
              return (
                <div key={item.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{item.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{item.count} tokens ({item.pct}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${item.pct}%`, 
                        height: '100%', 
                        backgroundColor: color,
                        borderRadius: '4px',
                        transition: 'width 0.6s ease'
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Breakdown Bar Chart */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>Queue Status Resolution</h3>
              <p style={{ fontSize: '0.8rem' }}>Resolution ratio of tokens across all service desks</p>
            </div>
            <BarChart3 size={18} color="var(--primary)" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '4px' }}>
                <span style={{ color: '#34d399', fontWeight: 600 }}>Completed Appointments</span>
                <span>{metrics.completed} ({metrics.total > 0 ? Math.round((metrics.completed / metrics.total) * 100) : 0}%)</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '5px' }}>
                <div style={{ width: `${metrics.total > 0 ? (metrics.completed / metrics.total) * 100 : 0}%`, height: '100%', background: '#10b981', borderRadius: '5px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '4px' }}>
                <span style={{ color: '#fbbf24', fontWeight: 600 }}>Currently Waiting</span>
                <span>{metrics.waiting} ({metrics.total > 0 ? Math.round((metrics.waiting / metrics.total) * 100) : 0}%)</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '5px' }}>
                <div style={{ width: `${metrics.total > 0 ? (metrics.waiting / metrics.total) * 100 : 0}%`, height: '100%', background: '#f59e0b', borderRadius: '5px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '4px' }}>
                <span style={{ color: '#60a5fa', fontWeight: 600 }}>Currently Serving / Called</span>
                <span>{metrics.serving} ({metrics.total > 0 ? Math.round((metrics.serving / metrics.total) * 100) : 0}%)</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '5px' }}>
                <div style={{ width: `${metrics.total > 0 ? (metrics.serving / metrics.total) * 100 : 0}%`, height: '100%', background: '#3b82f6', borderRadius: '5px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '4px' }}>
                <span style={{ color: '#f87171', fontWeight: 600 }}>Cancelled by Applicant</span>
                <span>{metrics.cancelled} ({metrics.total > 0 ? Math.round((metrics.cancelled / metrics.total) * 100) : 0}%)</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '5px' }}>
                <div style={{ width: `${metrics.total > 0 ? (metrics.cancelled / metrics.total) * 100 : 0}%`, height: '100%', background: '#ef4444', borderRadius: '5px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '4px' }}>
                <span style={{ color: '#9ca3af', fontWeight: 600 }}>Skipped (Absent When Called)</span>
                <span>{metrics.skipped} ({metrics.total > 0 ? Math.round((metrics.skipped / metrics.total) * 100) : 0}%)</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '5px' }}>
                <div style={{ width: `${metrics.total > 0 ? (metrics.skipped / metrics.total) * 100 : 0}%`, height: '100%', background: '#6b7280', borderRadius: '5px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Counter Efficiency Table */}
      <div className="card">
        <h3 style={{ fontSize: '1.15rem', marginBottom: '6px' }}>Service Counter Throughput & Efficiency</h3>
        <p style={{ fontSize: '0.82rem', marginBottom: '1.25rem' }}>Summary of tokens handled per counter location</p>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Counter Desk</th>
                <th>Staff Officer</th>
                <th>Assigned Service</th>
                <th>Total Processed</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {counters.map(c => {
                const s = services.find(srv => srv.id === c.serviceId);
                const handled = bookings.filter(b => b.counterId === c.id || (b.serviceId === c.serviceId && b.status === 'completed')).length;
                return (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                    <td>{c.staffName || 'Unassigned'}</td>
                    <td>{s ? s.name : '—'}</td>
                    <td style={{ fontWeight: 700, color: '#818cf8' }}>{handled} tokens</td>
                    <td>
                      <span className={`badge badge-${c.status === 'active' ? 'serving' : 'cancelled'}`} style={{ fontSize: '0.7rem' }}>
                        {c.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
