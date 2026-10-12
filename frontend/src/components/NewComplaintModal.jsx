import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Zap, 
  Droplet, 
  Wifi, 
  Armchair, 
  Sparkles, 
  Monitor, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export default function NewComplaintModal({ onClose, onSubmit, currentUser }) {
  const [category, setCategory] = useState('ELECTRICAL');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    { id: 'ELECTRICAL', label: 'Electrical', icon: Zap },
    { id: 'PLUMBING', label: 'Plumbing', icon: Droplet },
    { id: 'WIFI_NETWORK', label: 'Wi-Fi / Network', icon: Wifi },
    { id: 'FURNITURE', label: 'Furniture', icon: Armchair },
    { id: 'CLEANLINESS', label: 'Cleanliness', icon: Sparkles },
    { id: 'CLASSROOM_LAB_EQUIPMENT', label: 'Lab / Class', icon: Monitor },
    { id: 'OTHER', label: 'Other', icon: HelpCircle },
  ];

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.size > 5 * 1024 * 1024) {
        setError('Photo must be under 5MB.');
        return;
      }
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location.trim()) {
      setError('Please specify the campus location.');
      return;
    }
    if (!description.trim()) {
      setError('Please describe the issue.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit({
        studentId: currentUser?.id || 2,
        studentName: currentUser?.name || 'Aarav Sharma',
        studentRollNo: currentUser?.rollNo || 'CS21B1042',
        studentEmail: currentUser?.email || 'student@fixmycampus.edu',
        category,
        location,
        description,
        priority,
        file
      });
      onClose();
    } catch (err) {
      setError('Failed to submit complaint. Please retry.');
    } finally {
      setIsSubmitting(false);
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
          maxWidth: '680px',
          maxHeight: '92vh',
          overflowY: 'auto',
          background: 'rgba(15, 23, 42, 0.96)',
          padding: '28px',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0, color: '#fff' }}>
              Report a Campus Issue
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Submit maintenance, electrical, plumbing, or facility complaints directly to campus teams.
            </p>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: '6px 10px' }}>
            <X size={18} />
          </button>
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

        <form onSubmit={handleSubmit}>
          {/* Category Selector Chips */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
              {categories.map((c) => {
                const Icon = c.icon;
                const isSelected = category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '9px 12px',
                      background: isSelected ? 'var(--primary-gradient)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-md)',
                      color: isSelected ? '#fff' : 'var(--text-secondary)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Icon size={16} color={isSelected ? '#fff' : 'currentColor'} />
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location */}
          <div className="form-group">
            <label className="form-label">Location / Building & Room</label>
            <input
              type="text"
              required
              placeholder="e.g., Computer Center Lab 2, 2nd Floor or Boys Hostel A Room 204"
              className="form-control"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            {/* Quick location tag helpers */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
              {['Academic Block A', 'Library 2nd Floor', 'Boys Hostel 1', 'Girls Hostel 3', 'Central Cafeteria'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setLocation(tag)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '4px',
                    padding: '2px 8px',
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  +{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div className="form-group">
            <label className="form-label">Priority Level</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {[
                { val: 'LOW', label: 'Low', color: '#10b981' },
                { val: 'MEDIUM', label: 'Medium', color: '#f59e0b' },
                { val: 'HIGH', label: 'High', color: '#f97316' },
                { val: 'URGENT', label: 'Urgent', color: '#ef4444' }
              ].map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => setPriority(p.val)}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: priority === p.val ? `rgba(255, 255, 255, 0.1)` : 'rgba(255, 255, 255, 0.02)',
                    border: `2px solid ${priority === p.val ? p.color : 'transparent'}`,
                    color: priority === p.val ? p.color : 'var(--text-secondary)'
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description & Fault Details</label>
            <textarea
              required
              rows={3}
              placeholder="Provide clear details about the issue, symptoms, safety concerns..."
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Photo Evidence Upload */}
          <div className="form-group">
            <label className="form-label">Photo Evidence (Optional, max 5MB)</label>
            <label 
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                border: '2px dashed var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                cursor: 'pointer',
                background: 'rgba(255, 255, 255, 0.01)',
                transition: 'all 0.2s ease'
              }}
            >
              <Upload size={24} color="var(--primary)" />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {file ? file.name : 'Click or drop a photo here to upload'}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Supports JPG, PNG, WEBP
              </span>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </label>

            {previewUrl && (
              <div style={{ marginTop: '10px', position: 'relative', display: 'inline-block' }}>
                <img 
                  src={previewUrl} 
                  alt="Upload preview" 
                  style={{ height: '80px', borderRadius: '8px', border: '1px solid var(--border-medium)' }} 
                />
                <button
                  type="button"
                  onClick={() => { setFile(null); setPreviewUrl(null); }}
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    background: '#ef4444',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>

          {/* Footer Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? 'Submitting...' : 'Submit Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
