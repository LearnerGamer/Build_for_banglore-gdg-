import React, { useState } from 'react';
import CitizenApp from './components/CitizenApp';
import ChatReport from './components/ChatReport';
import { Map as MapIcon, MessageSquare } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('map');

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {activeTab === 'map' ? <CitizenApp /> : <ChatReport />}
      </div>
      
      <div className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
        >
          <MapIcon size={20} />
          <span>Map</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <MessageSquare size={20} />
          <span>AI Report</span>
        </button>
      </div>
    </div>
  );
}

export default App;
