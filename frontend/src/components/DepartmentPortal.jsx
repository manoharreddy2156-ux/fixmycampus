import React, { useState } from 'react';
import { 
  Wrench, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Play, 
  AlertTriangle, 
  Building, 
  MessageSquare,
  ArrowRight,
  Filter
} from 'lucide-react';

export default function DepartmentPortal({ 
  complaints, 
  departments, 
  currentUser, 
  onSelectComplaint, 
  onUpdateStatus 
}) {
  const [selectedDeptId, setSelectedDeptId] = useState(
    currentUser?.departmentId || 1 // Defaults to Electrical Maintenance
  );
  const [activeSubTab, setActiveSubTab] = useState('ACTIVE'); // ACTIVE or RESOLVED
  const [resolvingId, setResolvingId] = useState(null);
  const [resolutionRemarks, setResolutionRemarks] = useState('');

  const currentDept = departments?.find(d => d.id === Number(selectedDeptId)) || departments?.[0];

  // Filter complaints for this department
  const deptComplaints = complaints.filter(c => c.departmentId === Number(selectedDeptId));
  
  const activeComplaints = deptComplaints.filter(c => c.status === 'ASSIGNED' || c.status === 'IN_PROGRESS');
  const resolvedComplaints = deptComplaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED');

  const displayedList = activeSubTab === 'ACTIVE' ? activeComplaints : resolvedComplaints;

  const handleStartWork = async (complaintId) => {
    await onUpdateStatus(complaintId, 'IN_PROGRESS', 'Technician dispatched and work commenced.');
  };

  const handleConfirmResolve = async (complaintId) => {
    await onUpdateStatus(complaintId, 'RESOLVED', resolutionRemarks || 'Work completed and verified by department staff.');
    setResolvingId(null);
    setResolutionRemarks('');
  };

  return (
    <div className="animate-fade-in" style={{ padding: '32px 24px', maxWidth: '1240px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div 
        className="glass-panel"
        style={{
          padding: '28px 32px',
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          background: 'radial-gradient(ellipse at top left, rgba(251, 191, 36, 0.15) 0%, rgba(15, 23, 42, 0.7) 100%)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Wrench size={18} color="#fbbf24" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Maintenance Department Queue
            </span>
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            {currentDept ? currentDept.name : 'Maintenance Crew'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '6px 0 0 0' }}>
            Supervisor: {currentDept?.contactPerson || 'Assigned Lead'} • Active Assigned Queue
          </p>
        </div>

        {/* Switch Department Dropdown (helpful for testing and leads) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Department:</span>
          <select 
            className="form-select"
            style={{ minWidth: '220px' }}
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(Number(e.target.value))}
          >
            {departments?.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs: Active Tasks vs Resolved History */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveSubTab('ACTIVE')}
          className={`btn ${activeSubTab === 'ACTIVE' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Active Tasks ({activeComplaints.length})
        </button>
        <button
          onClick={() => setActiveSubTab('RESOLVED')}
          className={`btn ${activeSubTab === 'RESOLVED' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Resolved Archive ({resolvedComplaints.length})
        </button>
      </div>

      {/* Tasks Grid */}
      {displayedList.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
          {displayedList.map(complaint => (
            <div 
              key={complaint.id}
              className="glass-panel"
              style={{
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderLeft: complaint.priority === 'URGENT' ? '4px solid #ef4444' : '1px solid var(--border-subtle)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span className={`badge badge-${complaint.status}`}>{complaint.status}</span>
                    <span className={`badge priority-${complaint.priority}`}>{complaint.priority}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    #{complaint.id}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={16} color="#fbbf24" style={{ flexShrink: 0 }} />
                  <span>{complaint.location}</span>
                </h3>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '16px' }}>
                  {complaint.description}
                </p>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  Reporter: <strong style={{ color: '#fff' }}>{complaint.studentName}</strong> {complaint.studentRollNo ? `(${complaint.studentRollNo})` : ''}
                </div>
              </div>

              {/* Resolution Form if active */}
              {resolvingId === complaint.id ? (
                <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '14px', borderRadius: '8px', marginTop: '12px' }}>
                  <label className="form-label">Completion Remarks</label>
                  <input 
                    type="text"
                    className="form-control"
                    placeholder="e.g. Ballast replaced, circuit tested OK."
                    value={resolutionRemarks}
                    onChange={(e) => setResolutionRemarks(e.target.value)}
                    style={{ marginBottom: '10px' }}
                  />
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button onClick={() => setResolvingId(null)} className="btn btn-secondary btn-sm">Cancel</button>
                    <button onClick={() => handleConfirmResolve(complaint.id)} className="btn btn-primary btn-sm">Confirm Resolved</button>
                  </div>
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '14px',
                  borderTop: '1px solid var(--border-subtle)',
                  marginTop: '12px'
                }}>
                  <button 
                    onClick={() => onSelectComplaint(complaint)}
                    className="btn btn-outline btn-sm"
                  >
                    View History
                  </button>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {complaint.status === 'ASSIGNED' && (
                      <button 
                        onClick={() => handleStartWork(complaint.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#fbbf24' }}
                      >
                        <Play size={13} />
                        Start Work
                      </button>
                    )}

                    {(complaint.status === 'IN_PROGRESS' || complaint.status === 'ASSIGNED') && (
                      <button 
                        onClick={() => { setResolvingId(complaint.id); setResolutionRemarks(''); }}
                        className="btn btn-primary btn-sm"
                        style={{ background: 'var(--success-gradient)' }}
                      >
                        <CheckCircle2 size={13} />
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <CheckCircle2 size={40} color="#34d399" style={{ margin: '0 auto 16px auto', display: 'block' }} />
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '8px' }}>
            Queue Clean! No {activeSubTab === 'ACTIVE' ? 'Active Tasks' : 'Resolved Tickets'}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            All assigned issues for {currentDept?.name} are up to date.
          </p>
        </div>
      )}
    </div>
  );
}
