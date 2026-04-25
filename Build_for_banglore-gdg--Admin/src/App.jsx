import React, { useState } from 'react';
import LandingPage from './LandingPage';
import AdminApp from './AdminApp';
import CitizenApp from './citizen/CitizenApp';

function App() {
  // null = landing, 'citizen' = citizen UI, 'admin' = admin dashboard
  const [mode, setMode] = useState(null);

  if (mode === 'citizen') return <CitizenApp onBack={() => setMode(null)} />;
  if (mode === 'admin')   return <AdminApp   onBack={() => setMode(null)} />;
  return <LandingPage onSelect={setMode} />;
}

export default App;
