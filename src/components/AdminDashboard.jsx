import React, { useState } from 'react';
import { 
  Shield, 
  Layers, 
  Users, 
  Clock, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  RotateCcw, 
  AlertTriangle,
  Building,
  Activity,
  FileSpreadsheet
} from 'lucide-react';
import { 
  saveService, 
  deleteService, 
  updateCounter, 
  updateBookingStatus, 
  resetToDemoData 
} from '../services/storage';

export const AdminDashboard = ({ 
  services = [], 
  counters = [], 
  bookings = [], 
  users = [],
  onResetData 
}) => {
  const [activeTab, setActiveTab] = useState('services'); // 'services' | 'counters' | 'users' | 'ledger' | 'settings'
  
  // Service modal / edit state
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [serviceFormData, setServiceFormData] = useState({
    id: '',
    code: '',
    name: '',
    category: 'Administration',
    location: '',
    avgWaitMins: 10,
    description: '',
    active: true,
    requiresFee: false,
    feeAmount: 0
  });

  // Counter modal / edit state
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [counterFormData, setCounterFormData] = useState({
    id: '',
    name: '',
    serviceId: services[0] ? services[0].id : 'S1',
    staffName: '',
    status: 'active'
  });

  // Settings state
  const [campusHours, setCampusHours] = useState('09:00 AM – 05:00 PM');
  const [slotCapacity, setSlotCapacity] = useState('5');
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Bookings filter
  const [ledgerStatusFilter, setLedgerStatusFilter] = useState('all');

  // KPI calculations
  const totalBookings = bookings.length;
  const waitingCount = bookings.filter(b => b.status === 'waiting').length;
  const servingCount = bookings.filter(b => b.status === 'serving' || b.status === 'called').length;
  const completedCount = bookings.filter(b => b.status === 'completed').length;
  const cancelledCount = bookings.filter(b => b.status === 'cancelled' || b.status === 'skipped').length;

  const handleEditService = (service) => {
    setServiceFormData(service);
    setShowServiceModal(true);
  };

  const handleCreateNewService = () => {
    setServiceFormData({
      id: `S${Date.now().toString().slice(-4)}`,
      code: 'NEW',
      name: '',
      category: 'General',
      location: 'Administrative Block',
      avgWaitMins: 10,
      description: '',
      active: true,
      requiresFee: false,
      feeAmount: 0
    });
    setShowServiceModal(true);
  };

  const handleSaveService = (e) => {
    e.preventDefault();
    if (!serviceFormData.name || !serviceFormData.code) {
      alert('Service name and code are required.');
      return;
    }
    saveService({
      ...serviceFormData,
      avgWaitMins: parseInt(serviceFormData.avgWaitMins, 10) || 10,
      feeAmount: parseInt(serviceFormData.feeAmount, 10) || 0
    });
    setShowServiceModal(false);
  };

  const handleDeleteService = (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      deleteService(serviceId);
    }
  };

  const handleCreateNewCounter = () => {
    setCounterFormData({
      id: `C${counters.length + 1}`,
      name: `Counter ${counters.length + 1}`,
      serviceId: services[0] ? services[0].id : 'S1',
      staffName: 'Staff Officer',
      status: 'active'
    });
    setShowCounterModal(true);
  };

  const handleSaveCounter = (e) => {
    e.preventDefault();
    updateCounter(counterFormData);
    setShowCounterModal(false);
  };

  const handleToggleCounterStatus = (counter) => {
    const updated = {
      ...counter,
      status: counter.status === 'active' ? 'paused' : 'active'
    };
    updateCounter(updated);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const filteredLedger = bookings.filter(b => 
    ledgerStatusFilter === 'all' ? true : b.status === ledgerStatusFilter
  );

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={24} color="var(--primary)" /> College Queue Administration
          </h1>
          <p style={{ fontSize: '0.88rem' }}>
            Configure services, service counters, capacity limits, user records, and master queue transactions.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onResetData}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <RotateCcw size={14} /> Reset Demo Data
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-wrap" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Layers size={22} />
          </div>
          <div>
            <div className="kpi-value">{totalBookings}</div>
            <div className="kpi-label">Total Bookings</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap" style={{ background: 'var(--status-waiting-bg)', color: '#fbbf24' }}>
            <Clock size={22} />
          </div>
          <div>
            <div className="kpi-value">{waitingCount}</div>
            <div className="kpi-label">Waiting in Queue</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap" style={{ background: 'var(--status-serving-bg)', color: '#34d399' }}>
            <Activity size={22} />
          </div>
          <div>
            <div className="kpi-value">{servingCount}</div>
            <div className="kpi-label">Currently Serving</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap" style={{ background: 'var(--status-completed-bg)', color: '#a78bfa' }}>
            <Check size={22} />
          </div>
          <div>
            <div className="kpi-value">{completedCount}</div>
            <div className="kpi-label">Completed Today</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap" style={{ background: 'var(--status-cancelled-bg)', color: '#f87171' }}>
            <X size={22} />
          </div>
          <div>
            <div className="kpi-value">{cancelledCount}</div>
            <div className="kpi-label">Cancelled / Skipped</div>
          </div>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid var(--border-card)', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          className={`nav-link ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => setActiveTab('services')}
        >
          Services ({services.length})
        </button>
        <button
          type="button"
          className={`nav-link ${activeTab === 'counters' ? 'active' : ''}`}
          onClick={() => setActiveTab('counters')}
        >
          Service Counters ({counters.length})
        </button>
        <button
          type="button"
          className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Registered Users ({users.length})
        </button>
        <button
          type="button"
          className={`nav-link ${activeTab === 'ledger' ? 'active' : ''}`}
          onClick={() => setActiveTab('ledger')}
        >
          Master Bookings Ledger
        </button>
        <button
          type="button"
          className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Hours & Quota Settings
        </button>
      </div>

      {/* Services Management Tab */}
      {activeTab === 'services' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Campus Services Directory</h3>
              <p style={{ fontSize: '0.82rem' }}>Configure service descriptions, token prefixes, and expected wait times</p>
            </div>
            <button type="button" className="btn btn-primary btn-sm" onClick={handleCreateNewService}>
              <Plus size={15} /> Add New Service
            </button>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Service Name</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Avg Wait</th>
                  <th>Fee Req.</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map(s => (
                  <tr key={s.id}>
                    <td>
                      <span className="token-pill" style={{ fontSize: '0.82rem' }}>{s.code}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{s.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.description}
                      </div>
                    </td>
                    <td>{s.category}</td>
                    <td style={{ fontSize: '0.82rem' }}>{s.location}</td>
                    <td>{s.avgWaitMins} mins</td>
                    <td>
                      {s.requiresFee ? (
                        <span className="badge badge-waiting" style={{ fontSize: '0.7rem' }}>₹{s.feeAmount}</span>
                      ) : (
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Free</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge badge-${s.active ? 'serving' : 'cancelled'}`} style={{ fontSize: '0.7rem' }}>
                        {s.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '3px 8px' }}
                          onClick={() => handleEditService(s)}
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          style={{ padding: '3px 8px' }}
                          onClick={() => handleDeleteService(s.id)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Counters Management Tab */}
      {activeTab === 'counters' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Counter Assignment & Status</h3>
              <p style={{ fontSize: '0.82rem' }}>Assign staff officers and activate or pause physical desks</p>
            </div>
            <button type="button" className="btn btn-primary btn-sm" onClick={handleCreateNewCounter}>
              <Plus size={15} /> Add Counter Desk
            </button>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Counter ID</th>
                  <th>Desk Name</th>
                  <th>Assigned Service</th>
                  <th>Assigned Staff</th>
                  <th>Current State</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {counters.map(c => {
                  const s = services.find(srv => srv.id === c.serviceId);
                  return (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{c.id}</td>
                      <td style={{ fontWeight: 600 }}>{c.name}</td>
                      <td>{s ? s.name : 'Unassigned'}</td>
                      <td>{c.staffName || 'Unassigned'}</td>
                      <td>
                        <span className={`badge badge-${c.status === 'active' ? 'serving' : 'cancelled'}`}>
                          {c.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`btn ${c.status === 'active' ? 'btn-danger' : 'btn-success'} btn-sm`}
                          style={{ padding: '3px 10px', fontSize: '0.78rem' }}
                          onClick={() => handleToggleCounterStatus(c)}
                        >
                          {c.status === 'active' ? 'Pause Counter' : 'Activate Desk'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Directory Tab */}
      {activeTab === 'users' && (
        <div className="card">
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem' }}>Registered Users & Campus Roles</h3>
            <p style={{ fontSize: '0.82rem' }}>Listing students, staff operators, and system administrators</p>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Role</th>
                  <th>PIN Code</th>
                  <th>Department</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 600 }}>{u.name}</td>
                    <td style={{ fontSize: '0.85rem' }}>{u.email}</td>
                    <td style={{ fontSize: '0.85rem' }}>{u.phone}</td>
                    <td>
                      <span className={`badge badge-${u.role === 'admin' ? 'completed' : u.role === 'staff' ? 'serving' : 'waiting'}`} style={{ fontSize: '0.7rem' }}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td>{u.pinCode}</td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{u.department || 'General'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Master Ledger Tab */}
      {activeTab === 'ledger' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Master Bookings & Token Ledger</h3>
              <p style={{ fontSize: '0.82rem' }}>Comprehensive record of all campus queue interactions</p>
            </div>
            <select
              className="form-control"
              style={{ width: 'auto' }}
              value={ledgerStatusFilter}
              onChange={(e) => setLedgerStatusFilter(e.target.value)}
            >
              <option value="all">All Records ({bookings.length})</option>
              <option value="waiting">Waiting Only</option>
              <option value="serving">Serving / In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="skipped">Skipped</option>
            </select>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Student</th>
                  <th>Service</th>
                  <th>Desk</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Fee Status</th>
                  <th>Override</th>
                </tr>
              </thead>
              <tbody>
                {filteredLedger.map(b => (
                  <tr key={b.id}>
                    <td>
                      <span className="token-pill" style={{ fontSize: '0.85rem' }}>{b.tokenNumber}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.userName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.userPhone}</div>
                    </td>
                    <td>{b.serviceName}</td>
                    <td>{b.counterId}</td>
                    <td style={{ fontSize: '0.82rem' }}>
                      {b.date} • {b.slotTime}
                    </td>
                    <td>
                      <span className={`badge badge-${b.status}`}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      {b.isPaid ? (
                        <span style={{ color: '#34d399', fontSize: '0.8rem', fontWeight: 600 }}>Paid (Verified)</span>
                      ) : (
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>None</span>
                      )}
                    </td>
                    <td>
                      {b.status === 'waiting' && (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          style={{ padding: '2px 8px', fontSize: '0.72rem' }}
                          onClick={() => updateBookingStatus(b.id, 'cancelled')}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="card" style={{ maxWidth: '640px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>Campus Queue Configuration</h3>
          <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Set office operating hours, slot queue depth, and test state persistence.
          </p>

          {settingsSaved && (
            <div style={{ background: 'var(--status-serving-bg)', color: '#86efac', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <Check size={18} /> Configuration successfully saved!
            </div>
          )}

          <form onSubmit={handleSaveSettings}>
            <div className="form-group">
              <label className="form-label">Campus Counter Operating Hours</label>
              <input
                type="text"
                className="form-control"
                value={campusHours}
                onChange={(e) => setCampusHours(e.target.value)}
                required
              />
              <div className="form-feedback hint">Standard opening hours displayed to students across departments.</div>
            </div>

            <div className="form-group">
              <label className="form-label">Maximum Bookings Allowed Per Slot</label>
              <input
                type="number"
                min="1"
                max="25"
                className="form-control"
                value={slotCapacity}
                onChange={(e) => setSlotCapacity(e.target.value)}
                required
              />
              <div className="form-feedback hint">Prevents overbooking of counters in a single time window.</div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              Save Configuration Settings
            </button>
          </form>

          {/* Danger zone */}
          <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
            <h4 style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem', marginBottom: '6px' }}>
              <AlertTriangle size={16} /> Danger Zone: Demonstration Reset
            </h4>
            <p style={{ fontSize: '0.82rem', marginBottom: '12px' }}>
              Reset all active appointments, tokens, counters, and seed services to factory default state:
            </p>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={onResetData}
            >
              Reset All Demo Data
            </button>
          </div>
        </div>
      )}

      {/* Service Modal */}
      {showServiceModal && (
        <div className="modal-overlay" onClick={() => setShowServiceModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem' }}>
                {serviceFormData.id ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button className="input-action-btn" onClick={() => setShowServiceModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSaveService}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Code *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. ADM"
                      maxLength={4}
                      value={serviceFormData.code}
                      onChange={(e) => setServiceFormData({ ...serviceFormData, code: e.target.value.toUpperCase() })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Service Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Admissions Verification"
                      value={serviceFormData.name}
                      onChange={(e) => setServiceFormData({ ...serviceFormData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <input
                      type="text"
                      className="form-control"
                      value={serviceFormData.category}
                      onChange={(e) => setServiceFormData({ ...serviceFormData, category: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Avg Wait Time (Minutes)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={serviceFormData.avgWaitMins}
                      onChange={(e) => setServiceFormData({ ...serviceFormData, avgWaitMins: e.target.value })}
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Physical Location</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Administrative Block, Room 102"
                    value={serviceFormData.location}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, location: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Service Description</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={serviceFormData.description}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px', background: 'rgba(0,0,0,0.2)', padding: '10px 14px', borderRadius: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={serviceFormData.requiresFee}
                      onChange={(e) => setServiceFormData({ ...serviceFormData, requiresFee: e.target.checked })}
                    />
                    Requires Optional Fee
                  </label>

                  {serviceFormData.requiresFee && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.85rem' }}>Amount: ₹</span>
                      <input
                        type="number"
                        className="form-control"
                        style={{ width: '80px', padding: '3px 8px' }}
                        value={serviceFormData.feeAmount}
                        onChange={(e) => setServiceFormData({ ...serviceFormData, feeAmount: e.target.value })}
                      />
                    </div>
                  )}
                </div>

                <div className="modal-footer" style={{ padding: '12px 0 0 0', background: 'transparent' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowServiceModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Service
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Counter Modal */}
      {showCounterModal && (
        <div className="modal-overlay" onClick={() => setShowCounterModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem' }}>Add Service Counter</h3>
              <button className="input-action-btn" onClick={() => setShowCounterModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSaveCounter}>
                <div className="form-group">
                  <label className="form-label">Desk Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={counterFormData.name}
                    onChange={(e) => setCounterFormData({ ...counterFormData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Assigned Service</label>
                  <select
                    className="form-control"
                    value={counterFormData.serviceId}
                    onChange={(e) => setCounterFormData({ ...counterFormData, serviceId: e.target.value })}
                  >
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Staff Officer Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={counterFormData.staffName}
                    onChange={(e) => setCounterFormData({ ...counterFormData, staffName: e.target.value })}
                    required
                  />
                </div>

                <div className="modal-footer" style={{ padding: '12px 0 0 0', background: 'transparent' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCounterModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Counter
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
