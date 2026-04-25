import React, { useState, useEffect } from 'react';
import LandingPage from './LandingPage';
import AdminApp from './AdminApp';
import CitizenApp from './citizen/CitizenApp';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import AdminLogin from './components/AdminLogin';

function App() {
  // null = landing, 'citizen' = citizen UI, 'admin' = admin dashboard
  const [mode, setMode] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setAdminUser(user);
      setAuthChecked(true);
    });
  }, []);

  if (mode === 'citizen') return <CitizenApp onBack={() => setMode(null)} />;
  if (mode === 'admin') {
    if (!authChecked) return <div className="glass-card" style={{margin:'20px'}}>Loading...</div>;
    if (!adminUser) return <AdminLogin onLogin={setAdminUser} />;
    return <AdminApp onBack={() => setMode(null)} />;
  }
  return <LandingPage onSelect={setMode} />;
}

export default App;
