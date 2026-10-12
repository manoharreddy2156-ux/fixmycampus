import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  Wrench, 
  GraduationCap, 
  AlertCircle,
  KeyRound,
  Mail
} from 'lucide-react';

export default function AuthModal({ onClose, onLogin, onRegister }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register state
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [phone, setPhone] = useState('');

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    const res = await onLogin(email, password);
    setIsSubmitting(false);
    if (!res.success) {
      setError(res.message || 'Invalid credentials');
    } else {
      onClose();
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !rollNo) {
      setError('Please fill in all required fields.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    const res = await onRegister({ name, rollNo, email, phone, password });
    setIsSubmitting(false);
    if (!res.success) {
      setError(res.message || 'Registration failed.');
    } else {
      onClose();
    }
  };

  const handleQuickLogin = async (quickEmail, quickPassword) => {
    setEmail(quickEmail);
    setPassword(quickPassword);
    setIsSubmitting(true);
    setError('');
    const res = await onLogin(quickEmail, quickPassword);
    setIsSubmitting(false);
    if (res.success) {
      onClose();
    } else {
      setError(res.message || 'Quick login failed.');
    }
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
          maxWidth: '520px',
          background: 'rgba(15, 23, 42, 0.96)',
          padding: '28px',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0, color: '#fff' }}>
              {isRegistering ? 'Create Student Account' : 'Sign In to Campus Hub'}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              {isRegistering ? 'Register to report, track, and monitor complaints' : 'Enter credentials or pick a demo profile below'}
            </p>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: '6px 10px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Quick Demo Logins Bar */}
        <div style={{ marginBottom: '20px', padding: '14px', background: 'rgba(99, 102, 241, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#818cf8', display: 'block', marginBottom: '8px', letterSpacing: '0.04em' }}>
            ⚡ 1-Click Demo Profiles
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('aarav.sharma@fixmycampus.edu', 'student123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '6px 8px' }}
            >
              <GraduationCap size={14} color="#38bdf8" />
              Student
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@fixmycampus.edu', 'admin123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '6px 8px' }}
            >
              <ShieldCheck size={14} color="#a855f7" />
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('electrical@fixmycampus.edu', 'dept123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '6px 8px' }}
            >
              <Wrench size={14} color="#fbbf24" />
              Dept Staff
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '10px 14px',
            color: '#f87171',
            fontSize: '0.85rem',
            marginBottom: '16px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {!isRegistering ? (
          /* Login Form */
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  placeholder="e.g. admin@fixmycampus.edu or student roll@..."
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                placeholder="Enter password..."
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
              <LogIn size={16} />
              {isSubmitting ? 'Authenticating...' : 'Sign In'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => { setIsRegistering(true); setError(''); }}
                style={{ background: 'none', border: 'none', color: '#818cf8', fontSize: '0.82rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Don't have an account? Register as Student
              </button>
            </div>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g., Ananya Deshmukh"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Roll Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., CS22B019"
                  className="form-control"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone (Optional)</label>
                <input
                  type="tel"
                  placeholder="e.g., 9876543210"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">College Email</label>
              <input
                type="email"
                required
                placeholder="e.g., ananya@fixmycampus.edu"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password (min 6 chars)</label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="Create secure password..."
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
              <UserPlus size={16} />
              {isSubmitting ? 'Registering...' : 'Complete Student Registration'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => { setIsRegistering(false); setError(''); }}
                style={{ background: 'none', border: 'none', color: '#818cf8', fontSize: '0.82rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Already registered? Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
