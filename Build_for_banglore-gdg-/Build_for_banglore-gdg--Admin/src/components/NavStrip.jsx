import React from 'react';
import { LayoutDashboard, MessageSquareWarning, Users, Activity, Settings, PlusSquare } from 'lucide-react';

const NavStrip = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', icon: <LayoutDashboard size={22} />, label: 'Dashboard' },
    { id: 'sos', icon: <MessageSquareWarning size={22} />, label: 'SOS Feed', special: true },
    { id: 'pulse', icon: <Activity size={22} />, label: 'Pulse' },
    { id: 'forces', icon: <Users size={22} />, label: 'Forces' },
    { id: 'shelters', icon: <PlusSquare size={22} />, label: 'Shelters & Medical' },
    { id: 'settings', icon: <Settings size={22} />, label: 'Settings' }
  ];

  return (
    <div className="panel glass-panel" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '24px 0', 
      gap: '24px',
      background: 'rgba(18, 22, 31, 0.9)',
      borderRight: '1px solid var(--border-color)',
      height: '100%'
    }}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        
        return (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            title={tab.label}
            style={{
              background: isActive && tab.special ? 'rgba(239, 68, 68, 0.2)' : isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
              border: 'none',
              color: isActive && tab.special ? '#ef4444' : isActive ? 'white' : 'var(--text-muted)',
              padding: '12px',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              border: isActive && tab.special ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid transparent'
            }}
          >
            {tab.icon}
          </button>
        )
      })}
    </div>
  );
};

export default NavStrip;
