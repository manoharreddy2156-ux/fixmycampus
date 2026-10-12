import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  User, 
  Clock, 
  Building, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  FileText, 
  MessageSquare,
  Shield,
  Send
} from 'lucide-react';

export default function ComplaintDetailModal({ 
  complaint, 
  history, 
  departments, 
  currentUser, 
  onClose, 
  onAssignDepartment, 
  onUpdatePriority, 
  onUpdateStatus 
}) {
  if (!complaint) return null;

  const [selectedDept, setSelectedDept] = useState(complaint.departmentId || '');
  const [selectedPriority, setSelectedPriority] = useState(complaint.priority || 'MEDIUM');
  const [newStatus, setNewStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = ['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
  const currentStepIndex = steps.indexOf(complaint.status);

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedDept) return;
    setIsSubmitting(true);
    await onAssignDepartment(complaint.id, selectedDept);
    setIsSubmitting(false);
  };

  const handlePriorityChange = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onUpdatePriority(complaint.id, selectedPriority);
    setIsSubmitting(false);
  };

  const handleStatusChange = async (e) => {
    e.preventDefault();
    if (!newStatus) return;
    setIsSubmitting(true);
    await onUpdateStatus(complaint.id, newStatus, remarks);
    setNewStatus('');
    setRemarks('');
    setIsSubmitting(false);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'rgba(15, 23, 42, 0.95)',
          padding: '28px',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                TICKET #{complaint.id}
              </span>
              <span className={`badge badge-${complaint.status}`}>
                {complaint.status}
              </span>
              <span className={`badge priority-${complaint.priority}`}>
                {complaint.priority}
              </span>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '4px 8px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.06)',
                color: 'var(--text-secondary)'
              }}>
                {complaint.category?.replace(/_/g, ' ')}
              </span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 700, margin: 0, color: '#fff' }}>
              {complaint.location}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: '6px 10px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Stepper */}
        <div className="stepper-container">
          <div className="stepper-line" />
          <div 
            className="stepper-line-fill" 
            style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
          />
          {steps.map((st, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isActive = idx === currentStepIndex;
            return (
              <div key={st} className="stepper-step">
                <div className={`stepper-circle ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                  {isCompleted ? <CheckCircle2 size={16} /> : idx + 1}
                </div>
                <span className="stepper-label" style={{ color: isActive ? '#fff' : isCompleted ? '#34d399' : 'var(--text-muted)' }}>
                  {st.replace('_', ' ')}
                </span>
              </div>
            );
          })}
        </div>

        {/* Grid info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          {/* Details Card */}
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '18px' }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '14px', letterSpacing: '0.04em' }}>
              Issue Description
            </h4>
            <p style={{ color: '#e2e8f0', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '16px' }}>
              {complaint.description}
            </p>

            {complaint.imagePath && (
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Attached Evidence
                </span>
                <img 
                  src={complaint.imagePath.startsWith('/') || complaint.imagePath.startsWith('http') ? complaint.imagePath : `/uploads/${complaint.imagePath}`} 
                  alt="Evidence" 
                  style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
          </div>

          {/* Metadata Card */}
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px', letterSpacing: '0.04em' }}>
              Ticket Information
            </h4>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <User size={16} color="var(--primary)" />
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Reported By</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{complaint.studentName} {complaint.studentRollNo ? `(${complaint.studentRollNo})` : ''}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Building size={16} color="#fbbf24" />
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Handling Department</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{complaint.departmentName || 'Not Assigned Yet'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={16} color="#38bdf8" />
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Reported On</span>
                <span style={{ fontSize: '0.88rem' }}>{complaint.dateReported ? new Date(complaint.dateReported).toLocaleString() : 'Recent'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls for Admin or Department Staff */}
        <div style={{ background: 'rgba(30, 41, 59, 0.4)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '18px', marginBottom: '24px' }}>
          <h4 style={{ fontSize: '0.88rem', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={16} color="var(--primary)" />
            Resolution & Workflow Controls
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {/* Admin Assign Dept */}
            <div>
              <label className="form-label">Assign Department</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select 
                  className="form-select"
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                >
                  <option value="">Select Department...</option>
                  {departments?.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
                <button 
                  onClick={handleAssign}
                  disabled={!selectedDept || isSubmitting}
                  className="btn btn-secondary btn-sm"
                >
                  Assign
                </button>
              </div>
            </div>

            {/* Admin Change Priority */}
            <div>
              <label className="form-label">Update Priority</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select 
                  className="form-select"
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
                <button 
                  onClick={handlePriorityChange}
                  disabled={isSubmitting}
                  className="btn btn-secondary btn-sm"
                >
                  Set
                </button>
              </div>
            </div>

            {/* Update Status */}
            <div>
              <label className="form-label">Move Status</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select 
                  className="form-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="">Next Status...</option>
                  <option value="ASSIGNED">ASSIGNED</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
                <button 
                  onClick={handleStatusChange}
                  disabled={!newStatus || isSubmitting}
                  className="btn btn-primary btn-sm"
                >
                  Update
                </button>
              </div>
            </div>
          </div>

          {newStatus && (
            <div style={{ marginTop: '12px' }}>
              <input 
                type="text"
                placeholder="Optional remarks or resolution comment..."
                className="form-control"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Audit Trail / History */}
        <div>
          <h4 style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} color="var(--primary)" />
            Audit Trail & Status History
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {history && history.length > 0 ? (
              history.map((item, index) => (
                <div 
                  key={item.id || index}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: item.status === 'RESOLVED' ? '#34d399' : item.status === 'IN_PROGRESS' ? '#fbbf24' : '#6366f1',
                    marginTop: '5px'
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                        {item.changedByName} ({item.changedByRole || 'Staff'})
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {item.updatedOn ? new Date(item.updatedOn).toLocaleString() : ''}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`badge badge-${item.status}`}>
                        {item.status}
                      </span>
                      {item.remarks && (
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                          — {item.remarks}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No past history log entries available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
