import React from 'react';
import { Bell, User } from 'lucide-react';

export default function Header({ onLogout, user }) {
  return (
    <header className="sticky top-0 z-20 bg-[#0e1730]/80 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div>
          <h1 className="text-white text-lg font-medium">Today at a Glance</h1>
          <p className="text-white/60 text-xs">Dar es Salaam • Tanga • Ship Cleaning Ops</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-md hover:bg-white/10 text-white/80 hover:text-white transition">
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 bg-[#f59e0b] text-[10px] text-black rounded-full px-1">3</span>
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 text-white/80">
            <User size={16} />
            <span className="text-sm">{user?.name || 'Owner / Manager'}</span>
          </div>
          <button onClick={onLogout} className="px-3 py-1.5 text-sm rounded-md bg-[#f59e0b] text-black font-medium hover:brightness-110 transition">Logout</button>
        </div>
      </div>
    </header>
  );
}
