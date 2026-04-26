import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Navigation, Radio } from 'lucide-react';

const ActionPanel = ({ selectedSignal, onUpdateStatus, onSendAlert }) => {
  const [alertMessage, setAlertMessage] = useState('');

  if (!selectedSignal) {
    return (
      <div className="panel glass-panel" style={{ height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        <AlertCircle size={48} opacity={0.2} style={{ marginBottom: '16px' }} />
        <p>Select an incident to view details<br/>and take action.</p>
      </div>
    );
  }

  const handleAlertSend = () => {
    if (alertMessage.trim()) {
      onSendAlert(selectedSignal.areaName, alertMessage);
      setAlertMessage('');
    }
  };

  return (
    <div className="panel glass-panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <h2 className="panel-title fade-in">
          Incident Details
        </h2>
      </div>
      
      <div className="panel-content scrollable fade-in">
        <div style={{ marginBottom: '24px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>Location ID</div>
          <div style={{ fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '4px', letterSpacing: '1px' }}>
            {selectedSignal.id}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>Coordinates</div>
            <div style={{ fontWeight: 600 }}>{selectedSignal.latitude.toFixed(4)},<br/>{selectedSignal.longitude.toFixed(4)}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>Status</div>
            <div style={{ fontWeight: 600, color: selectedSignal.status === 'Verified' ? 'var(--success-green)' : 'var(--text-main)' }}>
              {selectedSignal.status}
            </div>
          </div>
        </div>

        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Admin Actions</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          {selectedSignal.status !== 'Verified' && (
            <button className="button-success" onClick={() => onUpdateStatus(selectedSignal.id, 'Verified')}>
              <CheckCircle size={18} /> Mark as Verified
            </button>
          )}
          <button className="button-primary">
            <Navigation size={18} /> Dispatch Field Force
          </button>
        </div>

        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Broadcast Alert</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Send targeted alert to area: <strong>{selectedSignal.areaName}</strong>
        </p>

        <div className="form-group">
          <label>Alert Message</label>
          <textarea 
            className="form-input" 
            rows="3" 
            placeholder="e.g. Evacuate immediately due to medical emergency"
            value={alertMessage}
            onChange={(e) => setAlertMessage(e.target.value)}
          ></textarea>
        </div>
        <button className="button-danger" onClick={handleAlertSend} disabled={!alertMessage.trim()}>
          <Radio size={18} /> Send GEO Alert
        </button>

      </div>
    </div>
  );
};

export default ActionPanel;
