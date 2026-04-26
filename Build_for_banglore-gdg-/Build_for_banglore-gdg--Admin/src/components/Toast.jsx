import React, { useEffect } from 'react';
import { Bell, X } from 'lucide-react';

const Toast = ({ message, isOpen, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, duration]);

  if (!isOpen) return null;

  return (
    <div className="fade-in-up" style={{
      position: 'fixed', bottom: '30px', right: '30px', zIndex: 11000,
      maxWidth: '350px', width: '100%',
      background: 'rgba(28, 28, 30, 0.95)', border: '1px solid var(--brand-blue)',
      backdropFilter: blur('12px'), borderRadius: '16px', padding: '16px',
      boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', gap: '15px'
    }}>
      <div style={{
        width: '36px', height: '36px', borderRadius: '10px',
        background: 'var(--brand-blue-glow)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--brand-blue)'
      }}>
        <Bell size={18} />
      </div>
      
      <div style={{ flex: 1 }}>
        <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>System Alert</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '2px' }}>{message}</div>
      </div>

      <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
