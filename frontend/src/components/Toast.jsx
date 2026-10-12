import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(16px)',
        border: `1px solid ${isSuccess ? 'rgba(16, 185, 129, 0.4)' : isError ? 'rgba(239, 68, 68, 0.4)' : 'rgba(99, 102, 241, 0.4)'}`,
        borderRadius: '12px',
        padding: '14px 20px',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
        color: '#f8fafc',
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      {isSuccess && <CheckCircle2 size={20} color="#10b981" />}
      {isError && <AlertCircle size={20} color="#ef4444" />}
      {!isSuccess && !isError && <Info size={20} color="#6366f1" />}
      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{toast.message}</span>
      <button 
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: '#94a3b8',
          cursor: 'pointer',
          padding: '4px',
          marginLeft: '8px'
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
