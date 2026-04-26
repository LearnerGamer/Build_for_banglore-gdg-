import React from 'react';
import { Activity, CheckCircle, Image as ImageIcon } from 'lucide-react';

const PulsePanel = ({ signals, onUpdateStatus }) => {
  // Filter signals that have media and are not resolved
  const mediaSignals = signals.filter(s => s.mediaUrls && s.mediaUrls.length > 0 && s.status !== 'Resolved');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <Activity color="#3b82f6" size={24} />
        <h2 style={{ fontFamily: 'Outfit', color: 'white', margin: 0, fontSize: '1.2rem' }}>
          Pulse Dashboard - AI Analysis
        </h2>
      </div>
      
      {mediaSignals.length === 0 ? (
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', marginTop: '40px' }}>
          No new media incidents require AI analysis.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
          {mediaSignals.map(signal => (
            <div key={signal.id} style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#8b949e' }}>
                  Incident ID: {signal.id} • {new Date(signal.timestamp).toLocaleTimeString()}
                </span>
                <span style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#ef4444',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  {signal.priority} Priority
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '120px', height: '120px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: '#12161f' }}>
                  {signal.mediaUrls[0] ? (
                    <img src={signal.mediaUrls[0]} alt="Incident Media" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ImageIcon color="#8b949e" />
                    </div>
                  )}
                </div>
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '0.9rem', color: 'white', fontWeight: 500 }}>
                    <span style={{ color: '#3b82f6', marginRight: '8px' }}>AI Analysis:</span>
                    {signal.aiAnalysis || 'Analyzing image...'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#8b949e' }}>
                    <strong>Location:</strong> {signal.areaName} ({signal.latitude.toFixed(4)}, {signal.longitude.toFixed(4)})
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#8b949e' }}>
                    <strong>User Description:</strong> {signal.type}
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button
                  onClick={() => onUpdateStatus(signal.id, 'Resolved')}
                  style={{
                    background: 'rgba(34, 197, 94, 0.15)',
                    color: '#4ade80',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(34, 197, 94, 0.25)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'rgba(34, 197, 94, 0.15)'}
                >
                  <CheckCircle size={16} />
                  Mark as Resolved
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PulsePanel;
