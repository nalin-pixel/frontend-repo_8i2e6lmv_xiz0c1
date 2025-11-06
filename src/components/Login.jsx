import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('owner');
  const [password, setPassword] = useState('jm@2025');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'owner' && password === 'jm@2025') {
      onLogin({ name: 'Owner / Manager', role: 'Owner' });
      localStorage.setItem('jm_user', JSON.stringify({ name: 'Owner / Manager', role: 'Owner' }));
    } else {
      setError('Invalid credentials for demo. Use owner / jm@2025');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1324] to-[#0e1730] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="text-center mb-6">
          <h1 className="text-white text-2xl font-semibold">J Marine Multifunctional Hub</h1>
          <p className="text-white/60 text-sm mt-1">Owner / Manager Demo Login</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-white/70 mb-1">Username</label>
            <input value={username} onChange={(e)=>setUsername(e.target.value)} className="w-full bg-white/10 border border-white/10 rounded-md px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#f59e0b]" placeholder="owner" />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Password</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full bg-white/10 border border-white/10 rounded-md px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#f59e0b]" placeholder="jm@2025" />
          </div>
          {error && <div className="text-red-300 text-sm">{error}</div>}
          <button type="submit" className="w-full bg-[#f59e0b] hover:brightness-110 text-black font-medium rounded-md py-2 transition">Login</button>
        </form>
        <p className="text-center text-xs text-white/50 mt-4">Use username "owner" and password "jm@2025"</p>
      </div>
    </div>
  );
}
