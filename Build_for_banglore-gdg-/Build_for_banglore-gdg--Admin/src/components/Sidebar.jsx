import React from 'react';
import { Activity, MapPin, Clock, AlertTriangle } from 'lucide-react';

const Sidebar = ({ signals, selectedSignal, onSelectSignal }) => {

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'Critical': return 'critical blink-critical';
      case 'High': return 'high';
      case 'Medium': return 'medium';
      case 'Low': return 'low';
      default: return 'low';
    }
  };

  const getBadgeClass = (priority) => {
    return `badge ${priority.toLowerCase()}`;
  };

  const formatTime = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Sort signals: Critical first, then by time (latest first)
  const priorityScore = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
  
  const sortedSignals = [...signals].sort((a, b) => {
    if (priorityScore[b.priority] !== priorityScore[a.priority]) {
      return priorityScore[b.priority] - priorityScore[a.priority];
    }
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  return (
    <div className="panel glass-panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <h2 className="panel-title">
          <Activity size={24} color="var(--brand-blue)" /> 
          Live SOS Feed
        </h2>
        <div style={{marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-muted)'}}>
          {signals.length} active emergency signals
        </div>
      </div>
      
      <div className="panel-content scrollable">
        {sortedSignals.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
            <Activity size={48} opacity={0.2} style={{ marginBottom: '16px' }} />
            <p>No active SOS signals.</p>
          </div>
        ) : (
          sortedSignals.map(signal => (
            <div 
              key={signal.id} 
              className={`sos-card fade-in ${getPriorityClass(signal.priority)}`}
              style={{
                borderColor: selectedSignal?.id === signal.id ? 'var(--brand-blue)' : '',
                boxShadow: selectedSignal?.id === signal.id ? '0 0 0 1px var(--brand-blue)' : ''
              }}
              onClick={() => onSelectSignal(signal)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span className={getBadgeClass(signal.priority)}>
                  {signal.priority === 'Critical' && <AlertTriangle size={12} style={{marginRight: '4px'}}/>}
                  {signal.priority}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> {formatTime(signal.timestamp)}
                </span>
              </div>
              <div style={{ fontWeight: 600, marginBottom: '4px', fontSize: '1rem' }}>
                {signal.areaName}
                {signal.isForceReport && (
                  <span style={{ 
                    marginLeft: '8px', 
                    fontSize: '0.65rem', 
                    background: 'rgba(34, 197, 94, 0.2)', 
                    color: '#4ade80', 
                    padding: '2px 6px', 
                    borderRadius: '4px',
                    border: '1px solid rgba(34, 197, 94, 0.4)',
                    verticalAlign: 'middle'
                  }}>
                    FORCE REPORT
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <MapPin size={14} /> {signal.latitude.toFixed(4)}, {signal.longitude.toFixed(4)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
