import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import MapPanel from './components/MapPanel';
import ActionPanel from './components/ActionPanel';
import LayerControls from './components/LayerControls';
import ShelterAdminPanel from './components/ShelterAdminPanel';
import FieldForcesPanel from './modules/field-forces/FieldForcesPanel';
import NavStrip from './components/NavStrip';
import { initialSignals, generateMockSOS } from './utils/mockBackend';
import { fetchFieldForces } from './modules/field-forces/fieldForcesAPI';
import { ShieldAlert } from 'lucide-react';
import ConfirmModal from './components/ConfirmModal';
import Toast from './components/Toast';

function AdminApp({ onBack }) {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState('sos');
  const [layers, setLayers] = useState({ sos: true, shelters: true, forces: true, medical: true });
  const [draftCoords, setDraftCoords] = useState(null);
  
  // Custom Popup States
  const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  const [toastState, setToastState] = useState({ isOpen: false, message: '' });
  
  const [signals, setSignals] = useState(() => {
    const saved = localStorage.getItem('sos_signals');
    return saved ? JSON.parse(saved) : initialSignals;
  });
  
  const [shelters, setShelters] = useState(() => {
    const saved = localStorage.getItem('sos_shelters');
    return saved ? JSON.parse(saved) : [
      { id: 'sh-1', name: 'Kanteerava Stadium Relief', latitude: 12.9687, longitude: 77.5940, capacity: 500, status: 'Open' },
      { id: 'sh-2', name: 'Indiranagar School', latitude: 12.9784, longitude: 77.6408, capacity: 150, status: 'Limited' },
    ];
  });

  const [medicalCenters, setMedicalCenters] = useState(() => {
    const saved = localStorage.getItem('sos_medical');
    return saved ? JSON.parse(saved) : [
      { id: 'med-1', name: 'Apollo Main Hospital', latitude: 12.9711, longitude: 77.5910, status: 'Operating' },
      { id: 'med-2', name: 'Manipal ICU', latitude: 12.9734, longitude: 77.6388, status: 'Over Capacity' },
    ];
  });

  const [forces, setForces] = useState([]);
  const [selectedSignal, setSelectedSignal] = useState(null);

  // --- PERSISTENCE ---
  useEffect(() => { localStorage.setItem('sos_signals', JSON.stringify(signals)); }, [signals]);
  useEffect(() => { localStorage.setItem('sos_shelters', JSON.stringify(shelters)); }, [shelters]);
  useEffect(() => { localStorage.setItem('sos_medical', JSON.stringify(medicalCenters)); }, [medicalCenters]);

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    fetchFieldForces().then(data => setForces(data));
  }, []);

  // --- LIVE SOS SYNC from Bridge Server ---
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('http://localhost:5000/api/sos');
        if (response.ok) {
          const bridgeSignals = await response.json();
          if (bridgeSignals.length > 0) {
            setSignals(prev => {
              // Create a map of existing signals for easy merging
              const signalMap = new Map(prev.map(s => [s.id, s]));
              
              // Overwrite/Add signals from the bridge
              bridgeSignals.forEach(s => {
                signalMap.set(s.id, s);
              });

              // Convert back to array and sort (Bridge signals first, then others)
              return Array.from(signalMap.values()).slice(0, 100);
            });
          }
        }
      } catch (e) {
        console.warn('Bridge server not reachable, using local sync.');
        const saved = localStorage.getItem('sos_signals');
        if (saved) {
          const parsed = JSON.parse(saved);
          setSignals(prev => (parsed.length !== prev.length ? parsed : prev));
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // --- WEBSOCKET MOCK ---
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const newSOS = generateMockSOS();
        setSignals(prev => [newSOS, ...prev].slice(0, 50));
      }
      if (Math.random() > 0.7 && forces.length > 0) {
        setForces(prev => {
          const items = [...prev];
          const rdIdx = Math.floor(Math.random() * items.length);
          items[rdIdx].latitude += (Math.random() - 0.5) * 0.01;
          items[rdIdx].longitude += (Math.random() - 0.5) * 0.01;
          items[rdIdx].last_updated = new Date().toISOString();
          return items;
        });
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [forces.length]);

  // --- HANDLERS ---
  const handleMapClick = useCallback((latlng) => {
    if (activeTab === 'shelters') setDraftCoords({ lat: latlng.lat, lng: latlng.lng });
  }, [activeTab]);

  const handleSelectSignal = useCallback((signal) => setSelectedSignal(signal), []);

  const handleUpdateStatus = useCallback((id, newStatus) => {
    setSignals(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    if (selectedSignal?.id === id) setSelectedSignal(prev => ({ ...prev, status: newStatus }));
  }, [selectedSignal]);

  const handleDeleteSignal = useCallback((id) => {
    setModalState({
      isOpen: true,
      title: 'Remove Incident?',
      message: 'This will permanently remove the SOS signal from the live feed. This action cannot be undone.',
      onConfirm: async () => {
        try {
          await fetch(`http://localhost:5000/api/sos/${id}`, { method: 'DELETE' });
          setSignals(prev => prev.filter(s => s.id !== id));
          if (selectedSignal?.id === id) setSelectedSignal(null);
          setToastState({ isOpen: true, message: 'Signal removed successfully.' });
        } catch (e) {
          console.error('Failed to delete signal:', e);
          setSignals(prev => prev.filter(s => s.id !== id));
        }
        setModalState(prev => ({ ...prev, isOpen: false }));
      }
    });
  }, [selectedSignal]);

  const handleSendAlert = useCallback((region, message) => {
    setToastState({ isOpen: true, message: `Alert broadcasted to ${region} successfully.` });
  }, []);

  const handleAddShelter = (data) => setShelters(prev => [{ ...data, id: `sh-${Date.now()}` }, ...prev]);
  const handleUpdateShelter = (id, data) => setShelters(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  const handleDeleteShelter = (id) => setShelters(prev => prev.filter(s => s.id !== id));

  const handleAddMedical = (data) => setMedicalCenters(prev => [{ ...data, id: `med-${Date.now()}` }, ...prev]);
  const handleUpdateMedical = (id, data) => setMedicalCenters(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  const handleDeleteMedical = (id) => setMedicalCenters(prev => prev.filter(s => s.id !== id));

  return (
    <div className="app-container">
      <div className="top-bar-branding">
        <ShieldAlert color="var(--priority-critical)" />
        SAVIOUR
        <div className="live-indicator" style={{marginLeft: '8px'}} title="Live WebSocket Connected"></div>
        {/* Back to Landing */}
        <button
          onClick={onBack}
          style={{
            marginLeft: '16px', background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '10px', padding: '4px 12px',
            color: 'white', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
          }}
        >
          ← Home
        </button>
      </div>

      {/* NavStrip Column */}
      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <NavStrip activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'hidden' }}>
        {activeTab === 'sos' && (
          <Sidebar 
            signals={signals} 
            selectedSignal={selectedSignal} 
            onSelectSignal={handleSelectSignal} 
            onDeleteSignal={handleDeleteSignal}
          />
        )}
        {(activeTab === 'dashboard' || activeTab === 'pulse' || activeTab === 'settings') && (
          <div className="panel glass-panel" style={{ height: '100%', padding: '24px', color:'var(--text-muted)' }}>
            <h2 style={{fontFamily: 'Outfit', color: 'white', marginBottom:'8px'}}>Module Output</h2>
            Select SOS, Shelters, or Forces to manage live data.
          </div>
        )}
        {activeTab === 'shelters' && (
          <div className="panel glass-panel" style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
            <ShelterAdminPanel
              shelters={shelters}
              medicalCenters={medicalCenters}
              draftCoords={draftCoords}
              onAddShelter={handleAddShelter}
              onUpdateShelter={handleUpdateShelter}
              onDeleteShelter={handleDeleteShelter}
              onAddMedical={handleAddMedical}
              onUpdateMedical={handleUpdateMedical}
              onDeleteMedical={handleDeleteMedical}
            />
          </div>
        )}
        {activeTab === 'forces' && (
          <div className="panel glass-panel" style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
            <FieldForcesPanel forces={forces} isVisible={true} />
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'hidden' }}>
        <LayerControls layers={layers} setLayers={setLayers} />
        <MapPanel
          signals={signals}
          shelters={shelters}
          forces={forces}
          medicalCenters={medicalCenters}
          selectedSignal={selectedSignal}
          onSelectSignal={handleSelectSignal}
          onMapClick={handleMapClick}
          layers={layers}
        />
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'hidden' }}>
        <ActionPanel
          selectedSignal={selectedSignal}
          onUpdateStatus={handleUpdateStatus}
          onSendAlert={handleSendAlert}
        />
      </div>

      <ConfirmModal 
        {...modalState} 
        onCancel={() => setModalState(prev => ({ ...prev, isOpen: false }))} 
      />
      <Toast 
        isOpen={toastState.isOpen} 
        message={toastState.message} 
        onClose={() => setToastState({ isOpen: false, message: '' })} 
      />
    </div>
  );
}

export default AdminApp;
