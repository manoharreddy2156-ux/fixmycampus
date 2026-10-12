import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Wrench, 
  GraduationCap, 
  Plus, 
  Wifi, 
  WifiOff, 
  User, 
  LogOut, 
  ChevronDown,
  Layers
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  currentUser, 
  onOpenAuth, 
  onLogout, 
  onOpenNewComplaint,
  isBackendConnected,
  onCheckBackend
}) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0 24px',
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        <div 
          onClick={() => setActiveTab('student')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Building2 size={22} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                fontFamily: 'var(--font-heading)', 
                fontSize: '1.25rem', 
                fontWeight: 800,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(to right, #ffffff, #94a3b8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                FixMyCampus
              </span>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#818cf8',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>
                v2.0
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
              Campus Facilities & Maintenance
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <nav style={{ display: 'flex', gap: '6px', background: 'rgba(255, 255, 255, 0.03)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setActiveTab('student')}
            className="btn btn-sm"
            style={{
              background: activeTab === 'student' ? 'var(--bg-surface-elevated)' : 'transparent',
              color: activeTab === 'student' ? '#fff' : 'var(--text-secondary)',
              border: activeTab === 'student' ? '1px solid var(--border-medium)' : '1px solid transparent',
              boxShadow: activeTab === 'student' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            <GraduationCap size={15} color={activeTab === 'student' ? '#38bdf8' : 'currentColor'} />
            Student Portal
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className="btn btn-sm"
            style={{
              background: activeTab === 'admin' ? 'var(--bg-surface-elevated)' : 'transparent',
              color: activeTab === 'admin' ? '#fff' : 'var(--text-secondary)',
              border: activeTab === 'admin' ? '1px solid var(--border-medium)' : '1px solid transparent',
              boxShadow: activeTab === 'admin' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            <ShieldCheck size={15} color={activeTab === 'admin' ? '#a855f7' : 'currentColor'} />
            Admin Dashboard
          </button>

          <button
            onClick={() => setActiveTab('department')}
            className="btn btn-sm"
            style={{
              background: activeTab === 'department' ? 'var(--bg-surface-elevated)' : 'transparent',
              color: activeTab === 'department' ? '#fff' : 'var(--text-secondary)',
              border: activeTab === 'department' ? '1px solid var(--border-medium)' : '1px solid transparent',
              boxShadow: activeTab === 'department' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            <Wrench size={15} color={activeTab === 'department' ? '#fbbf24' : 'currentColor'} />
            Department Queue
          </button>
        </nav>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Backend Connection Indicator */}
        <div 
          onClick={onCheckBackend}
          title={isBackendConnected ? "Connected to Spring Boot backend (/api)" : "Running in Interactive Demo Mode. Click to retry connection to backend."}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            background: isBackendConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            border: `1px solid ${isBackendConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
            color: isBackendConnected ? '#34d399' : '#fbbf24',
            cursor: 'pointer'
          }}
        >
          {isBackendConnected ? <Wifi size={13} /> : <WifiOff size={13} />}
          <span>{isBackendConnected ? 'Live Backend' : 'Demo Mode'}</span>
        </div>

        {/* Action: New Complaint */}
        <button 
          onClick={onOpenNewComplaint}
          className="btn btn-primary btn-sm"
        >
          <Plus size={16} />
          Report Issue
        </button>

        {/* User Pill / Login */}
        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div 
              onClick={onOpenAuth}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: currentUser.role === 'ADMIN' ? 'linear-gradient(135deg, #a855f7, #6366f1)' :
                            currentUser.role === 'DEPARTMENT_STAFF' ? 'linear-gradient(135deg, #f59e0b, #ea580c)' :
                            'linear-gradient(135deg, #38bdf8, #2563eb)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#fff'
              }}>
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div style={{ lineHeight: 1.2 }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.name}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  {currentUser.role}
                </span>
              </div>
              <ChevronDown size={14} color="var(--text-muted)" />
            </div>

            <button 
              onClick={onLogout}
              title="Logout"
              className="btn btn-secondary btn-sm"
              style={{ padding: '7px 10px' }}
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button 
            onClick={onOpenAuth}
            className="btn btn-secondary btn-sm"
          >
            <User size={15} />
            Sign In / Switch Role
          </button>
        )}
      </div>
    </header>
  );
}
