import React, { useState, useEffect, useRef } from 'react';
import { Shield, Zap, Droplets, PhoneCall, AlertTriangle, Clock, MapPin, Navigation, AlertCircle, Check, LogOut } from 'lucide-react';
import { GoogleLogin, googleLogout, useGoogleLogin } from '@react-oauth/google';
import Map from './Map';
import { SHELTERS, HOSPITALS, DANGERS, USER_LOC } from './mockData';
import { sendEmergencySMS } from '../utils/emergencySMS';
import './citizen.css';

const CitizenApp = ({ onBack }) => {
  const [sosProgress, setSosProgress] = useState(0);
  const [isSosHolding, setIsSosHolding] = useState(false);
  const [isSosActive, setIsSosActive] = useState(false);
  const [activeDanger, setActiveDanger] = useState(null);
  const [lastSync, setLastSync] = useState(0);
  const [lowPowerMode, setLowPowerMode] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('citizen_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [showPhonePrompt, setShowPhonePrompt] = useState(false);
  const [tempPhone, setTempPhone] = useState('');

  // Persistent Device ID for anonymous SOS
  const deviceId = useRef(() => {
    let id = localStorage.getItem('citizen_device_id');
    if (!id) {
      id = `dev-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('citizen_device_id', id);
    }
    return id;
  }).current();

  const handleLoginSuccess = async (response) => {
    try {
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const decoded = JSON.parse(jsonPayload);
      const userData = {
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        phoneNumber: null,
        location: 'Auto-detecting...'
      };
      
      // If we don't have a phone number for this email, prompt for it
      const savedPhone = localStorage.getItem(`phone_${decoded.email}`);
      if (savedPhone) {
        userData.phoneNumber = savedPhone;
        setUser(userData);
        localStorage.setItem('citizen_user', JSON.stringify(userData));
      } else {
        setUser(userData); // Set user without phone first
        setShowPhonePrompt(true);
      }
    } catch (e) {
      console.error("Login decode error", e);
    }
  };

  const handlePhoneSubmit = () => {
    if (!tempPhone.trim() || !tempPhone.startsWith('+')) {
      alert("Please enter a valid phone number with country code (e.g. +91...)");
      return;
    }
    const updatedUser = { ...user, phoneNumber: tempPhone };
    setUser(updatedUser);
    localStorage.setItem('citizen_user', JSON.stringify(updatedUser));
    localStorage.setItem(`phone_${user.email}`, tempPhone);
    setShowPhonePrompt(false);
  };

  const handleLogout = () => {
    googleLogout();
    setUser(null);
    localStorage.removeItem('citizen_user');
    setIsSosActive(false);
    setLowPowerMode(false);
  };

  const [userLoc, setUserLoc] = useState(USER_LOC);

  // Auto-geotagging logic
  useEffect(() => {
    if (navigator.geolocation) {
      const watcher = navigator.geolocation.watchPosition(
        (pos) => {
          setUserLoc([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => console.error("Geolocation error", err),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watcher);
    }
  }, []);

  // SOS Hold Logic (3 Seconds)
  useEffect(() => {
    let interval;
    // Removed !user check - allow anyone to trigger SOS
    if (isSosHolding && !isSosActive) {
      interval = setInterval(() => {
        setSosProgress(prev => {
          if (prev >= 100) {
            setIsSosActive(true);
            setLowPowerMode(true);
            setIsSosHolding(false);

            // Trigger SMS only if we have a phone number
            if (user && user.phoneNumber) {
              sendEmergencySMS(user, userLoc, SHELTERS);
            }

            // Write SOS event to shared localStorage so Admin can pick it up
            const newSOS = {
              id: `sos-citizen-${Date.now()}`,
              latitude: userLoc[0],
              longitude: userLoc[1],
              areaName: user ? `${user.name} (Mobile)` : `Anon Device (${deviceId})`,
              timestamp: new Date().toISOString(),
              priority: 'Critical',
              status: 'New',
              type: 'Citizen SOS',
              reporter: user ? user.name : 'Anonymous',
              reporterEmail: user ? user.email : 'N/A',
              reporterPhone: user ? user.phoneNumber : 'N/A',
              deviceId: deviceId
            };
            const existing = JSON.parse(localStorage.getItem('sos_signals') || '[]');
            localStorage.setItem('sos_signals', JSON.stringify([newSOS, ...existing].slice(0, 50)));
            return 100;
          }
          return prev + 2;
        });
      }, 60);
    } else {
      setSosProgress(0);
    }
    return () => clearInterval(interval);
  }, [isSosHolding, isSosActive, user, userLoc]);

  // Sync Timer
  useEffect(() => {
    let interval;
    if (isSosActive) {
      interval = setInterval(() => setLastSync(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isSosActive]);

  // Check for active dangers
  useEffect(() => {
    if (DANGERS.length > 0) setActiveDanger(DANGERS[0]);
  }, []);

  const handleMarkerClick = (item) => setSelectedMarker(item);

  return (
    <div className={`citizen-root ${lowPowerMode ? 'low-power' : ''}`}>

      {/* Phone Prompt Overlay */}
      {showPhonePrompt && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 6000,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            background: '#1a1d23', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '400px',
            textAlign: 'center'
          }}>
            <div style={{ 
              width: '64px', height: '64px', background: 'rgba(59,130,246,0.1)', 
              borderRadius: '20px', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', margin: '0 auto 20px', color: '#3b82f6' 
            }}>
              <PhoneCall size={32} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>One more step</h2>
            <p style={{ color: '#a0a8b5', fontSize: '0.9rem', marginBottom: '24px' }}>
              Enter your phone number to receive emergency evacuation alerts and rescue updates.
            </p>
            <input 
              type="tel" 
              placeholder="+91 XXXXX XXXXX"
              value={tempPhone}
              onChange={(e) => setTempPhone(e.target.value)}
              style={{
                width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px', padding: '16px', color: 'white', fontSize: '1.1rem',
                marginBottom: '20px', outline: 'none', textAlign: 'center'
              }}
            />
            <button 
              onClick={handlePhoneSubmit}
              style={{
                width: '100%', background: '#3b82f6', color: 'white', border: 'none',
                borderRadius: '12px', padding: '16px', fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              Confirm & Continue
            </button>
          </div>
        </div>
      )}

      {/* SOS Active Status Bar */}
      {isSosActive && (
        <div style={{
          background: '#ff3b30',
          padding: '44px 20px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 5000,
          position: 'fixed', top: 0, left: 0, right: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={20} color="white" />
            <span style={{ fontWeight: 900, color: 'white', letterSpacing: '1.5px' }}>SOS ACTIVE</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>
            SYNC: {lastSync}s
          </div>
        </div>
      )}

      {/* Top Header / Profile Area */}
      {!isSosActive && (
        <div style={{
          position: 'absolute', top: 16, left: 16, right: 16, zIndex: 3000,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <button
            onClick={onBack}
            style={{
              background: 'rgba(31,34,41,0.9)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px', padding: '10px 16px', color: 'white',
              fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
              backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            ← Back
          </button>

          {!user ? (
            <div style={{ transform: 'scale(0.85)', transformOrigin: 'right' }}>
              <GoogleLogin 
                onSuccess={handleLoginSuccess}
                onError={() => console.log('Login Failed')}
                theme="dark"
                shape="pill"
              />
            </div>
          ) : (
            <div style={{
              background: 'rgba(31,34,41,0.9)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '25px', padding: '4px 4px 4px 12px', color: 'white',
              display: 'flex', alignItems: 'center', gap: '10px', backdropFilter: 'blur(12px)'
            }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{user.name.split(' ')[0]}</span>
              <img 
                src={user.picture} 
                alt="profile" 
                style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)' }} 
              />
              <button 
                onClick={handleLogout}
                style={{ background: 'transparent', border: 'none', color: '#ff3b30', padding: '0 8px 0 4px', cursor: 'pointer' }}
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Map */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <Map rescueMode={isSosActive} zoom={14} userLoc={userLoc} onMarkerClick={handleMarkerClick} />

        {/* SOS FAB (3s Hold) */}
        {!isSosActive && (
          <div style={{ position: 'absolute', bottom: '340px', right: '20px', zIndex: 1000 }}>
            <div
              className="sos-button-floating"
              style={{
                width: '80px', height: '80px', position: 'relative',
                background: isSosHolding ? '#ff0000' : 'radial-gradient(circle, #ff3b30 0%, #8b0000 100%)',
                cursor: 'pointer'
              }}
              onMouseDown={() => setIsSosHolding(true)}
              onMouseUp={() => setIsSosHolding(false)}
              onMouseLeave={() => setIsSosHolding(false)}
              onTouchStart={e => { e.preventDefault(); setIsSosHolding(true); }}
              onTouchEnd={() => setIsSosHolding(false)}
            >
              <Shield size={32} />
              <div style={{ fontSize: '8px', marginTop: '4px', fontWeight: 900 }}>HOLD 3s</div>

              {isSosHolding && (
                <svg style={{ position: 'absolute', inset: -6, width: '92px', height: '92px', transform: 'rotate(-90deg)' }}>
                  <circle
                    cx="46" cy="46" r="44"
                    fill="none" stroke="#fff" strokeWidth="6"
                    strokeDasharray={276.46}
                    strokeDashoffset={276.46 - (276.46 * sosProgress) / 100}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.1s' }}
                  />
                </svg>
              )}
            </div>
          </div>
        )}

        {/* Navigation Button */}
        <div style={{ position: 'absolute', bottom: '270px', right: '20px', zIndex: 1000 }}>
          <button className="glass" style={{ width: 44, height: 44, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }}>
            <Navigation size={20} color="#007aff" fill="#007aff" />
          </button>
        </div>
      </div>

      {/* Bottom Sheet */}
      <div className="citizen-bottom-sheet" style={{ height: isSosActive ? '260px' : '340px' }}>
        <div className="citizen-drag-handle"></div>

        {isSosActive ? (
          <div style={{ textAlign: 'center', padding: '10px' }}>
            <AlertCircle size={48} color="#ff3b30" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ff3b30', marginBottom: '12px' }}>RESCUE ACTIVE</h2>
            <p style={{ color: '#a0a8b5', fontSize: '0.95rem', marginBottom: '24px' }}>
              Broadcasting GPS coordinates. Help is being routed.
            </p>
            <button
              onClick={() => { setIsSosActive(false); setLowPowerMode(false); setSosProgress(0); setLastSync(0); }}
              style={{ padding: '16px 48px', borderRadius: '30px', background: '#333', color: 'white', border: 'none', fontWeight: 800 }}
            >
              CANCEL EMERGENCY
            </button>
          </div>
        ) : selectedMarker ? (
          <div style={{ padding: '0 4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontWeight: 800, fontSize: '1.1rem' }}>{selectedMarker.name}</h3>
              <button
                onClick={() => setSelectedMarker(null)}
                style={{ background: 'transparent', border: 'none', color: '#a0a8b5', fontSize: '1.2rem', cursor: 'pointer' }}
              >✕</button>
            </div>
            {selectedMarker.capacity && (
              <div style={{ fontSize: '0.9rem', color: '#a0a8b5', marginBottom: '8px' }}>
                📊 Occupancy: <strong style={{ color: 'white' }}>{selectedMarker.capacity}</strong>
              </div>
            )}
            {selectedMarker.beds !== undefined && (
              <div style={{ fontSize: '0.9rem', color: '#a0a8b5', marginBottom: '8px' }}>
                🛏 Available Beds: <strong style={{ color: '#34c759' }}>{selectedMarker.beds}</strong>
              </div>
            )}
            {selectedMarker.resources && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                {selectedMarker.resources.map(r => (
                  <span key={r} className="citizen-chip active">{r}</span>
                ))}
              </div>
            )}
            {selectedMarker.emergency && (
              <div style={{ marginTop: '12px' }}>
                <span className="citizen-chip active">🚨 Emergency Services</span>
              </div>
            )}
          </div>
        ) : (
          <div style={{ padding: '0 4px' }}>
            {activeDanger ? (
              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.2)',
                  borderRadius: '16px', padding: '16px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div>
                    <div style={{ color: '#ff3b30', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>Threat Detected</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{activeDanger.type}</div>
                    <div style={{ fontSize: '0.8rem', color: '#a0a8b5', marginTop: '4px' }}>{activeDanger.description}</div>
                  </div>
                  <AlertTriangle size={32} color="#ff3b30" />
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: '20px', textAlign: 'center', padding: '16px', background: 'rgba(52,199,89,0.05)', borderRadius: '16px', border: '1px solid rgba(52,199,89,0.1)' }}>
                <Check size={28} color="#34c759" style={{ margin: '0 auto 8px' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>System Status: Secure</h3>
                <p style={{ fontSize: '0.8rem', color: '#a0a8b5', marginTop: '4px' }}>No active threats detected.</p>
              </div>
            )}

            <h3 style={{ fontSize: '0.8rem', fontWeight: 900, color: '#555', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>Safety Guidelines</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <Zap size={18} color="#ffcc00" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Battery</div>
                  <div style={{ fontSize: '0.82rem', color: '#a0a8b5' }}>Keep phone &gt; 50%. Enable low power mode.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <Droplets size={18} color="#34c759" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Resources</div>
                  <div style={{ fontSize: '0.82rem', color: '#a0a8b5' }}>Store 2L of water and essential medication.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <PhoneCall size={18} color="#007aff" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Line 112</div>
                  <div style={{ fontSize: '0.82rem', color: '#a0a8b5' }}>Call 112 for search &amp; rescue requests.</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenApp;
