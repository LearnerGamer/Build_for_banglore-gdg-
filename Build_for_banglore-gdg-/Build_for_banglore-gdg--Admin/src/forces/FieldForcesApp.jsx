import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Camera, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ChevronLeft,
  Navigation,
  User,
  Activity
} from 'lucide-react';

const FieldForcesApp = ({ onBack }) => {
  const [status, setStatus] = useState('Active');
  const [location, setLocation] = useState({ lat: 12.9716, lng: 77.5946, area: 'Bangalore Central' });
  const [isReporting, setIsReporting] = useState(false);
  const [reportText, setReportText] = useState('');
  const [mediaCount, setMediaCount] = useState(0);
  const [recentReports, setRecentReports] = useState([]);

  // Auto-geotagging simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLocation(prev => ({
        ...prev,
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleReport = () => {
    if (isReporting) {
      // Submit report
      const newReport = {
        id: `force-rep-${Date.now()}`,
        latitude: location.lat,
        longitude: location.lng,
        areaName: location.area,
        timestamp: new Date().toISOString(),
        priority: 'High',
        status: 'New',
        type: reportText || 'Field Observation',
        isForceReport: true,
        mediaCount
      };

      // Save to localStorage so AdminApp can see it
      const savedSignals = JSON.parse(localStorage.getItem('sos_signals') || '[]');
      localStorage.setItem('sos_signals', JSON.stringify([newReport, ...savedSignals]));

      setRecentReports(prev => [newReport, ...prev]);
      setIsReporting(false);
      setReportText('');
      setMediaCount(0);
      alert('Report submitted successfully!');
    } else {
      setIsReporting(true);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: '#0a0c10',
      color: 'white',
      fontFamily: "'Inter', sans-serif",
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        background: 'rgba(18, 22, 31, 0.95)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={onBack}
            style={{ 
              background: 'rgba(255,255,255,0.05)', 
              border: 'none', 
              borderRadius: '8px', 
              padding: '8px', 
              color: 'white',
              cursor: 'pointer'
            }}
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>UNIT-704</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#8b949e' }}>
              <Activity size={12} color="#22c55e" />
              <span>Live Sync Active</span>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            style={{
              background: status === 'Active' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
              color: status === 'Active' ? '#4ade80' : '#fde047',
              border: `1px solid ${status === 'Active' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(234, 179, 8, 0.3)'}`,
              borderRadius: '20px',
              padding: '6px 12px',
              fontSize: '0.8rem',
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="Active">Active</option>
            <option value="Busy">Busy</option>
            <option value="Standby">Standby</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
        
        {/* Geo-tagging Display */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: 48, height: 48,
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#3b82f6'
          }}>
            <Navigation size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#8b949e', marginBottom: '4px' }}>Current Geo-tag (Auto)</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>
              {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#3b82f6' }}>{location.area}</div>
          </div>
        </div>

        {/* Reporting Area */}
        {!isReporting ? (
          <button 
            onClick={() => setIsReporting(true)}
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
              border: 'none',
              borderRadius: '20px',
              padding: '40px 20px',
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: 800,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(239, 68, 68, 0.3)',
              transition: 'transform 0.2s'
            }}
          >
            <ShieldAlert size={48} />
            ONE-TAP REPORTING
          </button>
        ) : (
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1rem' }}>New Incident Report</h3>
              <button 
                onClick={() => setIsReporting(false)}
                style={{ background: 'transparent', border: 'none', color: '#8b949e', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>

            <textarea 
              placeholder="Describe the situation..."
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              style={{
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '12px',
                color: 'white',
                minHeight: '100px',
                resize: 'none',
                fontSize: '0.95rem'
              }}
            />

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setMediaCount(prev => prev + 1)}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '12px',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <Camera size={20} />
                <span>Add Media {mediaCount > 0 && `(${mediaCount})`}</span>
              </button>
            </div>

            <button 
              onClick={handleReport}
              style={{
                background: '#3b82f6',
                border: 'none',
                borderRadius: '12px',
                padding: '16px',
                color: 'white',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <Send size={20} />
              Submit Live Report
            </button>
          </div>
        )}

        {/* Global SOS Feed for Situational Awareness */}
        <div style={{ marginTop: '10px' }}>
          <h3 style={{ fontSize: '0.9rem', color: '#8b949e', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={14} color="#ef4444" /> ACTIVE EMERGENCIES (GLOBAL)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {JSON.parse(localStorage.getItem('sos_signals') || '[]').slice(0, 3).map(sig => (
              <div key={sig.id} style={{
                background: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.15)',
                borderRadius: '12px',
                padding: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ef4444' }}>{sig.priority.toUpperCase()}</div>
                  <div style={{ fontSize: '0.85rem' }}>{sig.areaName}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: '#8b949e' }}>{new Date(sig.timestamp).toLocaleTimeString()}</div>
                  <button style={{ 
                    marginTop: '4px', 
                    background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '4px', 
                    padding: '2px 8px', 
                    fontSize: '0.65rem', 
                    color: 'white' 
                  }}>Navigate</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 style={{ fontSize: '0.9rem', color: '#8b949e', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={14} /> YOUR RECENT LOGS
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentReports.length > 0 ? recentReports.map(rep => (
              <div key={rep.id} style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4ade80' }}>Reported Successfully</span>
                  <span style={{ fontSize: '0.7rem', color: '#4b5563' }}>{new Date(rep.timestamp).toLocaleTimeString()}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'white' }}>{rep.type}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '0.7rem', color: '#3b82f6' }}>
                  <MapPin size={10} />
                  <span>{rep.areaName}</span>
                </div>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '20px', color: '#4b5563', fontSize: '0.85rem' }}>
                No reports submitted in this session.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Footer Navigation (Mock) */}
      <div style={{
        padding: '12px 20px 24px',
        background: 'rgba(18, 22, 31, 0.95)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center'
      }}>
        <div style={{ color: '#3b82f6', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <ShieldAlert size={24} />
          <span style={{ fontSize: '0.65rem' }}>Report</span>
        </div>
        <div style={{ color: '#4b5563', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <MapPin size={24} />
          <span style={{ fontSize: '0.65rem' }}>Map</span>
        </div>
        <div style={{ color: '#4b5563', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <User size={24} />
          <span style={{ fontSize: '0.65rem' }}>Profile</span>
        </div>
      </div>
    </div>
  );
};

export default FieldForcesApp;
