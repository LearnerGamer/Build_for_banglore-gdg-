import React, { useState, useEffect } from 'react';
import { ShieldAlert, LayoutDashboard, Wifi, Users, MapPin, Zap } from 'lucide-react';

const STATS = [
  { icon: <Wifi size={16} />, label: 'Live SOS Feed', value: 'Active' },
  { icon: <Users size={16} />, label: 'Field Forces', value: '12 Units' },
  { icon: <MapPin size={16} />, label: 'Coverage Area', value: 'Bangalore' },
  { icon: <Zap size={16} />, label: 'Response Time', value: '< 4 min' },
];

const LandingPage = ({ onSelect }) => {
  const [time, setTime] = useState(new Date());
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTime = (d) =>
    d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: '#080a0e',
      backgroundImage: `
        radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.15) 0%, transparent 60%),
        radial-gradient(ellipse 60% 40% at 80% 110%, rgba(239,68,68,0.08) 0%, transparent 60%)
      `,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
      color: 'white',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Subtle animated grid */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, opacity: 0.04,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      {/* Live clock badge */}
      <div style={{
        position: 'absolute', top: 24, right: 24,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px', padding: '8px 16px',
        fontSize: '0.8rem', fontFamily: 'monospace',
        color: '#8b949e', zIndex: 1,
      }}>
        {formatTime(time)}
      </div>

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1200px', textAlign: 'center' }}>

        {/* Logo / brand */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '16px' }}>
          <div style={{
            width: 52, height: 52,
            background: 'linear-gradient(135deg, #ef4444 0%, #7f1d1d 100%)',
            borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px rgba(239,68,68,0.35)',
          }}>
            <ShieldAlert size={28} color="white" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <h1 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '2rem', fontWeight: 900,
              margin: 0, letterSpacing: '-0.5px',
            }}>
              CODECURE
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#8b949e', margin: 0, letterSpacing: '2px', textTransform: 'uppercase' }}>
              Disaster Response Platform
            </p>
          </div>
        </div>

        {/* Tagline */}
        <p style={{
          fontSize: '1.05rem', color: '#8b949e',
          maxWidth: '520px', margin: '0 auto 48px',
          lineHeight: 1.7,
        }}>
          Real-time emergency coordination for citizens and first responders across Bangalore.
        </p>

        {/* Stats row */}
        <div style={{
          display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap',
          marginBottom: '52px',
        }}>
          {STATS.map(s => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '12px', padding: '12px 20px',
              display: 'flex', alignItems: 'center', gap: '10px',
              fontSize: '0.85rem', color: '#8b949e',
            }}>
              <span style={{ color: '#3b82f6' }}>{s.icon}</span>
              <span>{s.label}:</span>
              <strong style={{ color: 'white' }}>{s.value}</strong>
            </div>
          ))}
        </div>

        {/* Mode cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          width: '100%',
          padding: '0 20px',
          boxSizing: 'border-box',
          minHeight: '400px'
        }}>

          {/* Citizen Card */}
          <button
            id="mode-citizen"
            onMouseEnter={() => setHovered('citizen')}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect('citizen')}
            style={{
              background: hovered === 'citizen'
                ? 'rgba(255,59,48,0.12)'
                : 'rgba(255,255,255,0.03)',
              border: hovered === 'citizen'
                ? '1px solid rgba(255,59,48,0.5)'
                : '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px', padding: '36px 28px',
              cursor: 'pointer', textAlign: 'left', color: 'white',
              transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
              transform: hovered === 'citizen' ? 'translateY(-4px)' : 'translateY(0)',
              boxShadow: hovered === 'citizen'
                ? '0 20px 60px rgba(255,59,48,0.2)'
                : '0 4px 20px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{
              width: 56, height: 56,
              background: 'linear-gradient(135deg, #ff3b30 0%, #8b0000 100%)',
              borderRadius: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '20px',
              boxShadow: hovered === 'citizen' ? '0 0 30px rgba(255,59,48,0.5)' : 'none',
              transition: 'box-shadow 0.25s',
            }}>
              <ShieldAlert size={28} color="white" />
            </div>
            <h2 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.5rem', fontWeight: 800,
              marginBottom: '10px',
            }}>Citizen Mode</h2>
            <p style={{ color: '#8b949e', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Mobile-first emergency interface. Trigger SOS, view shelters &amp; hospitals on the map, and receive live threat alerts.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['📍 SOS Button', '🗺 Live Map', '🏥 Hospitals', '⛺ Shelters'].map(f => (
                <span key={f} style={{
                  background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.2)',
                  borderRadius: '20px', padding: '4px 12px', fontSize: '0.78rem', color: '#ff8a8a'
                }}>{f}</span>
              ))}
            </div>
            <div style={{
              marginTop: '28px', display: 'flex', alignItems: 'center', gap: '8px',
              color: hovered === 'citizen' ? '#ff3b30' : '#8b949e',
              fontWeight: 700, fontSize: '0.9rem', transition: 'color 0.2s',
            }}>
              Enter Citizen View →
            </div>
          </button>

          {/* Admin Card */}
          <button
            id="mode-admin"
            onMouseEnter={() => setHovered('admin')}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect('admin')}
            style={{
              background: hovered === 'admin'
                ? 'rgba(59,130,246,0.12)'
                : 'rgba(255,255,255,0.03)',
              border: hovered === 'admin'
                ? '1px solid rgba(59,130,246,0.5)'
                : '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px', padding: '36px 28px',
              cursor: 'pointer', textAlign: 'left', color: 'white',
              transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
              transform: hovered === 'admin' ? 'translateY(-4px)' : 'translateY(0)',
              boxShadow: hovered === 'admin'
                ? '0 20px 60px rgba(59,130,246,0.2)'
                : '0 4px 20px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{
              width: 56, height: 56,
              background: 'linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)',
              borderRadius: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '20px',
              boxShadow: hovered === 'admin' ? '0 0 30px rgba(59,130,246,0.5)' : 'none',
              transition: 'box-shadow 0.25s',
            }}>
              <LayoutDashboard size={28} color="white" />
            </div>
            <h2 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.5rem', fontWeight: 800,
              marginBottom: '10px',
            }}>Admin Dashboard</h2>
            <p style={{ color: '#8b949e', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Command-center for responders. Monitor live SOS signals, manage field forces, shelters, and dispatch resources.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['📡 Live SOS Feed', '🧑‍🤝‍🧑 Field Forces', '🏕 Shelter Mgmt', '🗺 Command Map'].map(f => (
                <span key={f} style={{
                  background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
                  borderRadius: '20px', padding: '4px 12px', fontSize: '0.78rem', color: '#93c5fd'
                }}>{f}</span>
              ))}
            </div>
            <div style={{
              marginTop: '28px', display: 'flex', alignItems: 'center', gap: '8px',
              color: hovered === 'admin' ? '#3b82f6' : '#8b949e',
              fontWeight: 700, fontSize: '0.9rem', transition: 'color 0.2s',
            }}>
              Enter Command Center →
            </div>
          </button>

          {/* Field Forces Card */}
          <button
            id="mode-forces"
            onMouseEnter={() => setHovered('forces')}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect('forces')}
            style={{
              background: hovered === 'forces'
                ? 'rgba(34,197,94,0.12)'
                : 'rgba(255,255,255,0.03)',
              border: hovered === 'forces'
                ? '1px solid rgba(34,197,94,0.5)'
                : '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px', padding: '36px 28px',
              cursor: 'pointer', textAlign: 'left', color: 'white',
              transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
              transform: hovered === 'forces' ? 'translateY(-4px)' : 'translateY(0)',
              boxShadow: hovered === 'forces'
                ? '0 20px 60px rgba(34,197,94,0.2)'
                : '0 4px 20px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{
              width: 56, height: 56,
              background: 'linear-gradient(135deg, #22c55e 0%, #166534 100%)',
              borderRadius: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '20px',
              boxShadow: hovered === 'forces' ? '0 0 30px rgba(34,197,94,0.5)' : 'none',
              transition: 'box-shadow 0.25s',
            }}>
              <Users size={28} color="white" />
            </div>
            <h2 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.5rem', fontWeight: 800,
              marginBottom: '10px',
            }}>Field Forces</h2>
            <p style={{ color: '#8b949e', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Operational interface for units on the ground. One-tap reporting, auto-geotagging, and real-time status updates.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['⚡ Quick Report', '🛰 Auto Geo-tag', '📸 Media Upload', '🔄 Status Sync'].map(f => (
                <span key={f} style={{
                  background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
                  borderRadius: '20px', padding: '4px 12px', fontSize: '0.78rem', color: '#86efac'
                }}>{f}</span>
              ))}
            </div>
            <div style={{
              marginTop: '28px', display: 'flex', alignItems: 'center', gap: '8px',
              color: hovered === 'forces' ? '#22c55e' : '#8b949e',
              fontWeight: 700, fontSize: '0.9rem', transition: 'color 0.2s',
            }}>
              Enter Field Unit View →
            </div>
          </button>
        </div>


        {/* Footer */}
        <p style={{ marginTop: '48px', fontSize: '0.78rem', color: '#4b5563', letterSpacing: '0.5px' }}>
          Built for <strong style={{ color: '#6b7280' }}>Google Developer Groups Bangalore</strong> · CODECURE Team
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
