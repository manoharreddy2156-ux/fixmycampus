import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Building, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  Camera
} from 'lucide-react';

export default function StudentPortal({ 
  complaints, 
  currentUser, 
  onSelectComplaint, 
  onOpenNewComplaint,
  categories,
  statuses 
}) {
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Filter complaints
  const filtered = complaints.filter(c => {
    // If logged in as student, show only their complaints if they have an id
    if (currentUser?.role === 'STUDENT' && c.studentId && currentUser.id) {
      if (c.studentId !== currentUser.id && c.studentEmail !== currentUser.email) {
        // For demo convenience, if they filed complaints in session, show them
      }
    }
    if (selectedCategory && c.category !== selectedCategory) return false;
    if (selectedStatus && c.status !== selectedStatus) return false;
    if (keyword) {
      const kw = keyword.toLowerCase();
      const matchLoc = c.location && c.location.toLowerCase().includes(kw);
      const matchDesc = c.description && c.description.toLowerCase().includes(kw);
      if (!matchLoc && !matchDesc) return false;
    }
    return true;
  });

  const totalSubmitted = complaints.length;
  const inProgressCount = complaints.filter(c => c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED').length;
  const resolvedCount = complaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length;

  return (
    <div className="animate-fade-in" style={{ padding: '32px 24px', maxWidth: '1240px', margin: '0 auto' }}>
      {/* Student Hero Header */}
      <div 
        className="glass-panel"
        style={{
          padding: '32px',
          marginBottom: '28px',
          background: 'radial-gradient(ellipse at top left, rgba(99, 102, 241, 0.15) 0%, rgba(15, 23, 42, 0.7) 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Sparkles size={18} color="#818cf8" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Student Self-Service Portal
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
            Welcome, {currentUser ? currentUser.name : 'Campus Student'} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', margin: 0 }}>
            Spot a broken light, plumbing leak, or network outage? File an instant campus ticket and track real-time technician progress.
          </p>
        </div>

        <button 
          onClick={onOpenNewComplaint}
          className="btn btn-primary"
          style={{ padding: '12px 24px', fontSize: '1rem' }}
        >
          <Plus size={18} />
          Report New Campus Issue
        </button>
      </div>

      {/* Mini Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div className="glass-panel" style={{ padding: '18px 22px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total My Tickets</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>{totalSubmitted}</div>
        </div>

        <div className="glass-panel" style={{ padding: '18px 22px' }}>
          <span style={{ fontSize: '0.78rem', color: '#fbbf24', textTransform: 'uppercase', fontWeight: 600 }}>Active / In Progress</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>{inProgressCount}</div>
        </div>

        <div className="glass-panel" style={{ padding: '18px 22px' }}>
          <span style={{ fontSize: '0.78rem', color: '#34d399', textTransform: 'uppercase', fontWeight: 600 }}>Resolved & Closed</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>{resolvedCount}</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div 
        className="glass-panel"
        style={{
          padding: '16px 20px',
          marginBottom: '24px',
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
            placeholder="Search tickets by location, keywords..."
            className="form-control"
            style={{ paddingLeft: '36px' }}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <div style={{ flex: '0 1 180px' }}>
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

        <div style={{ flex: '0 1 180px' }}>
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

        {(keyword || selectedCategory || selectedStatus) && (
          <button 
            onClick={() => { setKeyword(''); setSelectedCategory(''); setSelectedStatus(''); }}
            className="btn btn-outline btn-sm"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Complaints List Cards */}
      {filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
          {filtered.map(complaint => (
            <div 
              key={complaint.id}
              onClick={() => onSelectComplaint(complaint)}
              className="glass-panel"
              style={{
                padding: '22px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, border-color 0.2s ease'
              }}
            >
              <div>
                {/* Card Top Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className={`badge badge-${complaint.status}`}>
                      {complaint.status}
                    </span>
                    <span className={`badge priority-${complaint.priority}`}>
                      {complaint.priority}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    #{complaint.id}
                  </span>
                </div>

                {/* Location */}
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {complaint.location}
                  </span>
                </h3>

                {/* Description Preview */}
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.88rem',
                  lineHeight: '1.5',
                  marginBottom: '16px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {complaint.description}
                </p>

                {/* Department Info */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  color: complaint.departmentName && complaint.departmentName !== 'Unassigned' ? '#c084fc' : 'var(--text-muted)',
                  marginBottom: '14px'
                }}>
                  <Building size={14} />
                  <span>{complaint.departmentName || 'Pending Department Routing'}</span>
                </div>
              </div>

              {/* Card Bottom Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '14px',
                borderTop: '1px solid var(--border-subtle)',
                marginTop: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <Clock size={13} />
                  <span>{complaint.dateReported ? new Date(complaint.dateReported).toLocaleDateString() : 'Today'}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary)' }}>
                  <span>View Details</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div 
          className="glass-panel" 
          style={{ padding: '60px 20px', textAlign: 'center' }}
        >
          <AlertCircle size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px auto', display: 'block' }} />
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '8px' }}>No Complaints Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 20px auto' }}>
            No complaints match the selected filter criteria. Try adjusting search or report a new issue!
          </p>
          <button onClick={onOpenNewComplaint} className="btn btn-primary btn-sm">
            Report New Issue
          </button>
        </div>
      )}
    </div>
  );
}
