import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ShipsModule from './components/ShipsModule';

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('dashboard');

  useEffect(()=>{
    const u = localStorage.getItem('jm_user');
    if(u){ setUser(JSON.parse(u)); }
  },[]);

  if(!user){
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1324] to-[#0e1730] flex">
      <Sidebar current={view} onChange={setView} />
      <main className="flex-1 min-w-0">
        <Header user={user} onLogout={() => { localStorage.removeItem('jm_user'); setUser(null); }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {view === 'dashboard' && <Dashboard />}
          {view === 'ships' && <ShipsModule />}
          {view !== 'dashboard' && view !== 'ships' && (
            <div className="text-white/70">This module is part of the full system. For demo, explore Dashboard and Ship Intelligence.</div>
          )}
        </div>
      </main>
    </div>
  );
}
