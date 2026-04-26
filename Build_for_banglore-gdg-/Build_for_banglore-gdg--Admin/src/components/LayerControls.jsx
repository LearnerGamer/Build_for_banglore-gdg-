import React from 'react';
import { Layers } from 'lucide-react';

const LayerControls = ({ layers, setLayers }) => {

  const toggleLayer = (layerKey) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  return (
    <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
      <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Layers size={14} /> Map Layers
      </h3>
      <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          <input type="checkbox" checked={layers.sos} onChange={() => toggleLayer('sos')} />
          SOS Signals
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          <input type="checkbox" checked={layers.shelters} onChange={() => toggleLayer('shelters')} />
          Shelters & Relief
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          <input type="checkbox" checked={layers.medical} onChange={() => toggleLayer('medical')} />
          Medical Centers
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          <input type="checkbox" checked={layers.forces} onChange={() => toggleLayer('forces')} />
          Field Forces
        </label>
      </div>
    </div>
  );
};

export default LayerControls;
