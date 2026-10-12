import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  BarChart3, 
  Building, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  UserPlus, 
  ChevronRight,
  MapPin,
  Eye,
  X
} from 'lucide-react';

export default function AdminDashboard({ 
  complaints, 
  adminStats, 
  departments, 
  currentUser, 
  onSelectComplaint, 
  onAssignDepartment, 
  onUpdatePriority, 
  onUpdateStatus,
  onCreateDepartmentUser,
  categories,
  statuses 
}) {
  const [keyword, setKeyword] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);

  // Staff creation form
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [staffDeptId, setStaffDeptId] = useState('');
  const [staffSuccess, setStaffSuccess] = useState('');
  const [staffError, setStaffError] = useState('');

  const filtered = complaints.filter(c => {
    if (selectedDept && c.departmentId !== Number(selectedDept)) return false;
    if (selectedStatus && c.status !== selectedStatus) return false;
    if (selectedCategory && c.category !== selectedCategory) return false;
    if (keyword) {
      const kw = keyword.toLowerCase();
      const matchLoc = c.location && c.location.toLowerCase().includes(kw);
      const matchDesc = c.description && c.description.toLowerCase().includes(kw);
      const matchUser = c.studentName && c.studentName.toLowerCase().includes(kw);
      if (!matchLoc && !matchDesc && !matchUser) return false;
    }
    return true;
  });

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    if (!staffDeptId) {
      setStaffError('Please select a department.');
      return;
    }
    setStaffError('');
    setStaffSuccess('');

    try {
      await onCreateDepartmentUser({
        name: staffName,
        email: staffEmail,
        phone: staffPhone,
        password: staffPassword,
        departmentId: Number(staffDeptId)
      });
      setStaffSuccess('Department staff account created successfully!');
      setStaffName('');
      setStaffEmail('');
      setStaffPhone('');
      setStaffPassword('');
      setTimeout(() => {
        setIsStaffModalOpen(false);
        setStaffSuccess('');
      }, 1500);
    } catch (err) {
      setStaffError('Failed to create account. Email may already be registered.');
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '32px 24px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Top Banner */}
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
          background: 'radial-gradient(ellipse at top left, rgba(168, 85, 247, 0.15) 0%, rgba(15, 23, 42, 0.7) 100%)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <ShieldCheck size={20} color="#c084fc" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Campus Facilities & Infrastructure Command
            </span>
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            Administrator Central Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '6px 0 0 0' }}>
            Monitor campus health, assign maintenance tickets, review workload distribution, and oversee SLA resolutions.
          </p>
        </div>

        <button 
          onClick={() => setIsStaffModalOpen(true)}
          className="btn btn-secondary"
        >
          <UserPlus size={16} />
          Add Department Staff Account
        </button>
      </div>

      {/* Campus Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Complaints</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
            {adminStats?.totalCount || complaints.length}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Campus-wide tickets</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 600 }}>Submitted (Pending)</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', marginTop: '6px' }}>
            {adminStats?.submittedCount ?? complaints.filter(c => c.status === 'SUBMITTED').length}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Awaiting routing</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', color: '#c084fc', textTransform: 'uppercase', fontWeight: 600 }}>Assigned</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#c084fc', marginTop: '6px' }}>
            {adminStats?.assignedCount ?? complaints.filter(c => c.status === 'ASSIGNED').length}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Routed to dept</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', color: '#fbbf24', textTransform: 'uppercase', fontWeight: 600 }}>In Progress</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24', marginTop: '6px' }}>
            {adminStats?.inProgressCount ?? complaints.filter(c => c.status === 'IN_PROGRESS').length}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Technician dispatched</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', color: '#34d399', textTransform: 'uppercase', fontWeight: 600 }}>Resolved</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399', marginTop: '6px' }}>
            {adminStats?.resolvedCount ?? complaints.filter(c => c.status === 'RESOLVED').length}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Fixed & verified</span>
        </div>
      </div>

      {/* Department Workload Status Table */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Building size={18} color="var(--primary)" />
          Department Workload Distribution
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {departments?.map(dept => {
            const assigned = complaints.filter(c => c.departmentId === dept.id && c.status === 'ASSIGNED').length;
            const inProgress = complaints.filter(c => c.departmentId === dept.id && c.status === 'IN_PROGRESS').length;
            const resolved = complaints.filter(c => c.departmentId === dept.id && (c.status === 'RESOLVED' || c.status === 'CLOSED')).length;
            const total = assigned + inProgress + resolved;

            return (
              <div 
                key={dept.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff', display: 'block' }}>{dept.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lead: {dept.contactPerson || 'Assigned'}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>{total} Total</span>
                </div>

                <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem', marginBottom: '8px' }}>
                  <span style={{ color: '#c084fc' }}>{assigned} Assigned</span>
                  <span>•</span>
                  <span style={{ color: '#fbbf24' }}>{inProgress} Active</span>
                  <span>•</span>
                  <span style={{ color: '#34d399' }}>{resolved} Done</span>
                </div>

                {/* Progress bar */}
                <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden', display: 'flex' }}>
                  {total > 0 && (
                    <>
                      <div style={{ width: `${(resolved / total) * 100}%`, background: '#34d399' }} />
                      <div style={{ width: `${(inProgress / total) * 100}%`, background: '#fbbf24' }} />
                      <div style={{ width: `${(assigned / total) * 100}%`, background: '#c084fc' }} />
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Bar */}
      <div 
        className="glass-panel"
        style={{
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ flex: '1 1 260px', position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by student, description, location..."
            className="form-control"
            style={{ paddingLeft: '36px' }}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <div style={{ flex: '0 1 180px' }}>
          <select 
            className="form-select"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments?.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: '0 1 160px' }}>
          <select 
            className="form-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            {statuses?.map(s => (
              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: '0 1 160px' }}>
          <select 
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories?.map(c => (
              <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        {(keyword || selectedDept || selectedStatus || selectedCategory) && (
          <button 
            onClick={() => { setKeyword(''); setSelectedDept(''); setSelectedStatus(''); setSelectedCategory(''); }}
            className="btn btn-outline btn-sm"
          >
            Reset
          </button>
        )}
      </div>

      {/* Complaints Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '14px 18px' }}>Ticket</th>
                <th style={{ padding: '14px 18px' }}>Reporter</th>
                <th style={{ padding: '14px 18px' }}>Location & Issue</th>
                <th style={{ padding: '14px 18px' }}>Category</th>
                <th style={{ padding: '14px 18px' }}>Priority</th>
                <th style={{ padding: '14px 18px' }}>Assigned Dept</th>
                <th style={{ padding: '14px 18px' }}>Status</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(complaint => (
                <tr 
                  key={complaint.id}
                  style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.15s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    #{complaint.id}
                  </td>

                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{complaint.studentName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{complaint.studentRollNo || complaint.studentEmail}</div>
                  </td>

                  <td style={{ padding: '14px 18px', maxWidth: '240px' }}>
                    <div style={{ fontWeight: 600, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={13} color="var(--primary)" />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{complaint.location}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {complaint.description}
                    </div>
                  </td>

                  <td style={{ padding: '14px 18px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {complaint.category?.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td style={{ padding: '14px 18px' }}>
                    <span className={`badge priority-${complaint.priority}`}>
                      {complaint.priority}
                    </span>
                  </td>

                  <td style={{ padding: '14px 18px' }}>
                    <select
                      className="form-select"
                      style={{ padding: '4px 8px', fontSize: '0.8rem', maxWidth: '170px' }}
                      value={complaint.departmentId || ''}
                      onChange={(e) => onAssignDepartment(complaint.id, Number(e.target.value))}
                    >
                      <option value="">Unassigned</option>
                      {departments?.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </td>

                  <td style={{ padding: '14px 18px' }}>
                    <span className={`badge badge-${complaint.status}`}>
                      {complaint.status}
                    </span>
                  </td>

                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <button 
                      onClick={() => onSelectComplaint(complaint)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '6px 12px' }}
                    >
                      <Eye size={14} />
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Account Modal */}
      {isStaffModalOpen && (
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
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', background: 'rgba(15, 23, 42, 0.96)', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#fff', margin: 0 }}>Create Department Staff Account</h2>
              <button onClick={() => setIsStaffModalOpen(false)} className="btn btn-secondary btn-sm"><X size={16} /></button>
            </div>

            {staffSuccess && (
              <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', borderRadius: '8px', marginBottom: '14px', fontSize: '0.85rem' }}>
                {staffSuccess}
              </div>
            )}
            {staffError && (
              <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', borderRadius: '8px', marginBottom: '14px', fontSize: '0.85rem' }}>
                {staffError}
              </div>
            )}

            <form onSubmit={handleCreateStaff}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input required className="form-control" value={staffName} onChange={e => setStaffName(e.target.value)} placeholder="e.g. Mr. Rajesh Kumar" />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" required className="form-control" value={staffEmail} onChange={e => setStaffEmail(e.target.value)} placeholder="e.g. electrical2@fixmycampus.edu" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input type="tel" className="form-control" value={staffPhone} onChange={e => setStaffPhone(e.target.value)} placeholder="e.g. 9811223344" />
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <select required className="form-select" value={staffDeptId} onChange={e => setStaffDeptId(e.target.value)}>
                  <option value="">Select Department...</option>
                  {departments?.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Initial Password</label>
                <input type="password" required minLength={6} className="form-control" value={staffPassword} onChange={e => setStaffPassword(e.target.value)} placeholder="At least 6 characters" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={() => setIsStaffModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Create Staff Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
