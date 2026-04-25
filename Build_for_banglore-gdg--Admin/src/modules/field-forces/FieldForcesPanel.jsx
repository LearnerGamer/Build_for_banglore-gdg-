import React from 'react';
import { Users, CircleDot } from 'lucide-react';

const FieldForcesPanel = ({ forces, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div style={{ marginTop: '16px' }}>
      <h3 style={{ fontSize: '1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Users size={16} /> Field Units Open
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {forces.map(f => (
          <div key={f.id} style={{ 
            background: 'var(--bg-panel)', 
            border: '1px solid var(--border-color)', 
            borderRadius: '8px', 
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>{f.id}</span>
            <span style={{ 
              fontSize: '0.85rem', 
              fontWeight: 600,
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '20px',
              backgroundColor: f.status === 'Active' ? 'rgba(34, 197, 94, 0.15)' : f.status === 'Busy' ? 'rgba(234, 179, 8, 0.15)' : 'rgba(139, 148, 158, 0.15)',
              color: f.status === 'Active' ? '#4ade80' : f.status === 'Busy' ? '#fde047' : '#9ca3af',
              border: `1px solid ${f.status === 'Active' ? 'rgba(34, 197, 94, 0.3)' : f.status === 'Busy' ? 'rgba(234, 179, 8, 0.3)' : 'rgba(139, 148, 158, 0.3)'}`
            }}>
              <CircleDot size={12} /> {f.status}
            </span>
          </div>
        ))}
        {forces.length === 0 && <div style={{textAlign:'center', padding: '20px', color:'var(--text-muted)'}}>No field units found.</div>}
      </div>
    </div>
  );
};

export default FieldForcesPanel;
