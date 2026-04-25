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
            background: 'rgba(255,255,255,0.03)', 
            border: '1px solid var(--border-color)', 
            borderRadius: '8px', 
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={16} color="var(--brand-blue)" />
              <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>{f.id}</span>
            </div>
            <span style={{ 
              fontSize: '0.75rem', 
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '12px',
              backgroundColor: f.status === 'Active' ? 'rgba(34, 197, 94, 0.1)' : f.status === 'Busy' ? 'rgba(234, 179, 8, 0.1)' : 'rgba(139, 148, 158, 0.1)',
              color: f.status === 'Active' ? '#4ade80' : f.status === 'Busy' ? '#fde047' : '#9ca3af',
              border: `1px solid ${f.status === 'Active' ? 'rgba(34, 197, 94, 0.2)' : f.status === 'Busy' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(139, 148, 158, 0.2)'}`
            }}>
              {f.status}
            </span>
          </div>
        ))}
        {forces.length === 0 && <div style={{textAlign:'center', padding: '20px', color:'var(--text-muted)'}}>No field units found.</div>}
      </div>

      <h3 style={{ fontSize: '1rem', marginTop: '24px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: '#4ade80' }}>
        <CircleDot size={16} /> Live Reports from Units
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {JSON.parse(localStorage.getItem('sos_signals') || '[]')
          .filter(s => s.isForceReport)
          .map(report => (
            <div key={report.id} style={{
              background: 'rgba(34, 197, 94, 0.05)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              borderRadius: '10px',
              padding: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4ade80' }}>UNIT-704</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(report.timestamp).toLocaleTimeString()}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'white' }}>{report.type}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--brand-blue)', marginTop: '4px' }}>📍 {report.areaName}</div>
            </div>
          ))}
        {JSON.parse(localStorage.getItem('sos_signals') || '[]').filter(s => s.isForceReport).length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No unit reports yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldForcesPanel;
