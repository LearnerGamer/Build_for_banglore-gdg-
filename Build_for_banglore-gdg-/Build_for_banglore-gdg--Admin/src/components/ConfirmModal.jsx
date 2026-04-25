import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', type = 'danger' }) => {
  if (!isOpen) return null;

  const getThemeColor = () => {
    switch (type) {
      case 'danger': return 'var(--priority-critical)';
      case 'success': return 'var(--success-green)';
      default: return 'var(--brand-blue)';
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(8px)'
    }}>
      <div className="glass-panel fade-in" style={{
        maxWidth: '400px', width: '100%', padding: '30px',
        border: `1px solid ${getThemeColor()}44`,
        borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '16px',
            background: `${getThemeColor()}11`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: getThemeColor()
          }}>
            <AlertCircle size={24} />
          </div>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '12px', fontFamily: 'Outfit' }}>{title}</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', lineHeight: '1.6' }}>{message}</p>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={onCancel} 
            style={{
              flex: 1, padding: '14px', borderRadius: '12px',
              background: 'rgba(255,255,255,0.05)', color: 'white',
              border: '1px solid rgba(255,255,255,0.1)', fontWeight: 700, cursor: 'pointer'
            }}
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm} 
            style={{
              flex: 1, padding: '14px', borderRadius: '12px',
              background: getThemeColor(), color: 'white',
              border: 'none', fontWeight: 700, cursor: 'pointer',
              boxShadow: `0 8px 20px ${getThemeColor()}44`
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
