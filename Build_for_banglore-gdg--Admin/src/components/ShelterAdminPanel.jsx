import React, { useState, useEffect } from 'react';
import { Home, Plus, Trash2, Edit, Cross, PlusSquare } from 'lucide-react';

const ShelterAdminPanel = ({ 
  shelters, 
  medicalCenters,
  draftCoords, 
  onAddShelter, 
  onUpdateShelter, 
  onDeleteShelter,
  onAddMedical,
  onUpdateMedical,
  onDeleteMedical
}) => {
  const [viewMode, setViewMode] = useState('shelters'); // 'shelters' or 'medical'
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', latitude: '', longitude: '', capacity: '', status: 'Open' });

  // Auto-fill coordinates when user clicks the map
  useEffect(() => {
    if (draftCoords) {
      setFormData(prev => ({
        ...prev,
        latitude: draftCoords.lat.toFixed(6),
        longitude: draftCoords.lng.toFixed(6)
      }));
      setIsAdding(true);
    }
  }, [draftCoords]);

  // Reset form when switching modes
  useEffect(() => {
    setIsAdding(false);
    setFormData({ name: '', latitude: '', longitude: '', capacity: '', status: viewMode === 'shelters' ? 'Open' : 'Operating' });
  }, [viewMode]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if(formData.name && formData.latitude && formData.longitude) {
      if (viewMode === 'shelters') {
        onAddShelter({
          ...formData,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude)
        });
      } else {
        onAddMedical({
          name: formData.name,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          status: formData.status
        });
      }
      setIsAdding(false);
      setFormData({ name: '', latitude: '', longitude: '', capacity: '', status: viewMode === 'shelters' ? 'Open' : 'Operating' });
    }
  };

  const currentList = viewMode === 'shelters' ? shelters : medicalCenters;

  return (
    <div style={{ marginTop: '8px' }}>
      
      {/* Segmented Control */}
      <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '4px', marginBottom: '24px' }}>
        <button 
          onClick={() => setViewMode('shelters')}
          style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', background: viewMode === 'shelters' ? 'var(--brand-blue)' : 'transparent', color: viewMode === 'shelters' ? 'white' : 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <Home size={16} /> Shelters
        </button>
        <button 
          onClick={() => setViewMode('medical')}
          style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', background: viewMode === 'medical' ? '#22c55e' : 'transparent', color: viewMode === 'medical' ? 'white' : 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <PlusSquare size={16} /> Medical
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)' }}>
          {viewMode === 'shelters' ? <Home size={16} /> : <PlusSquare size={16} />} 
          Manage {viewMode === 'shelters' ? 'Shelters' : 'Medical Centers'}
        </h3>
        <button onClick={() => setIsAdding(!isAdding)} className="button-primary" style={{ padding: '6px 12px', width: 'auto', fontSize: '12px', background: viewMode === 'medical' ? '#22c55e' : 'var(--brand-blue)' }}>
          <Plus size={14} /> Add
        </button>
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '16px', fontStyle: 'italic' }}>
        Tip: Click anywhere on the map to auto-fill latitude and longitude for a new entry.
      </p>

      {isAdding && (
        <form onSubmit={handleAddSubmit} style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid var(--border-color)' }}>
          <div className="form-group" style={{ marginBottom: '12px' }}>
            <input className="form-input" style={{ padding: '10px', fontSize: '13px' }} placeholder={`${viewMode === 'shelters' ? 'Shelter' : 'Hospital / Center'} Name`} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
            <input type="number" step="any" className="form-input" style={{ padding: '10px', fontSize: '13px' }} placeholder="Lat (e.g. 12.97)" value={formData.latitude} onChange={e => setFormData({...formData, latitude: e.target.value})} required />
            <input type="number" step="any" className="form-input" style={{ padding: '10px', fontSize: '13px' }} placeholder="Lng (e.g. 77.59)" value={formData.longitude} onChange={e => setFormData({...formData, longitude: e.target.value})} required />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'shelters' ? '1fr 1fr' : '1fr', gap: '8px', marginBottom: '16px' }}>
            {viewMode === 'shelters' && (
              <input type="number" className="form-input" style={{ padding: '10px', fontSize: '13px' }} placeholder="Capacity" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} />
            )}
            
            {viewMode === 'shelters' ? (
              <select className="form-input" style={{ padding: '10px', fontSize: '13px' }} value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="Open">Open</option>
                <option value="Limited">Limited</option>
                <option value="Full">Full</option>
                <option value="Closed">Closed</option>
              </select>
            ) : (
              <select className="form-input" style={{ padding: '10px', fontSize: '13px' }} value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="Operating">Operating</option>
                <option value="Over Capacity">Over Capacity</option>
                <option value="Compromised">Compromised</option>
                <option value="Closed">Closed</option>
              </select>
            )}
          </div>
          <button type="submit" className="button-success" style={{ padding: '10px', fontSize: '13px', background: viewMode === 'medical' ? '#16a34a' : '#2563eb' }}>
            Save {viewMode === 'shelters' ? 'Shelter' : 'Medical Center'}
          </button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {currentList.map(item => (
          <div key={item.id} style={{ 
            background: 'var(--bg-panel)', 
            border: '1px solid var(--border-color)', 
            borderRadius: '8px', 
            padding: '12px 16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>{item.name}</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => viewMode === 'shelters' ? onDeleteShelter(item.id) : onDeleteMedical(item.id)} 
                  style={{ background: 'rgba(239, 68, 68, 0.2)', border:'none', color:'var(--priority-critical)', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.85rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '6px 10px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Status: </span>
                
                {viewMode === 'shelters' ? (
                  <select 
                    value={item.status}
                    onChange={(e) => onUpdateShelter(item.id, { status: e.target.value })}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: item.status === 'Open' ? '#22c55e' : item.status === 'Limited' ? '#eab308' : '#ef4444',
                      fontWeight: '700',
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    <option value="Open" style={{color: 'black'}}>Open</option>
                    <option value="Limited" style={{color: 'black'}}>Limited</option>
                    <option value="Full" style={{color: 'black'}}>Full</option>
                    <option value="Closed" style={{color: 'black'}}>Closed</option>
                  </select>
                ) : (
                  <select 
                    value={item.status}
                    onChange={(e) => onUpdateMedical(item.id, { status: e.target.value })}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: item.status === 'Operating' ? '#22c55e' : item.status === 'Over Capacity' ? '#eab308' : '#ef4444',
                      fontWeight: '700',
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      outline: 'none',
                      flex: 1
                    }}
                  >
                    <option value="Operating" style={{color: 'black'}}>Operating</option>
                    <option value="Over Capacity" style={{color: 'black'}}>Over Capacity</option>
                    <option value="Compromised" style={{color: 'black'}}>Compromised</option>
                    <option value="Closed" style={{color: 'black'}}>Closed</option>
                  </select>
                )}
              </div>
              
              {item.capacity && viewMode === 'shelters' && (
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '6px 10px', borderRadius: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Capacity: </span>
                  <strong style={{ color: 'var(--text-main)' }}>{item.capacity}</strong>
                </div>
              )}
            </div>
          </div>
        ))}
        {currentList.length === 0 && <div style={{textAlign: 'center', padding: '20px', color:'var(--text-muted)'}}>No {viewMode === 'shelters' ? 'shelters' : 'medical centers'} tracked.</div>}
      </div>
    </div>
  );
};

export default ShelterAdminPanel;
