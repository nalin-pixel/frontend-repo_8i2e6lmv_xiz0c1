import React from 'react';
import { Home, Ship, Users, Package, DollarSign, BarChart2, Settings } from 'lucide-react';

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: Home },
  { key: 'ships', label: 'Ship Intelligence', icon: Ship },
  { key: 'agents', label: 'Agent Hub', icon: Users },
  { key: 'inventory', label: 'Inventory', icon: Package },
  { key: 'finance', label: 'Finance', icon: DollarSign },
  { key: 'reports', label: 'Reports', icon: BarChart2 },
  { key: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ current, onChange }) {
  return (
    <aside className="h-screen w-64 bg-[#0b1324] text-white border-r border-white/10 hidden md:flex flex-col">
      <div className="px-6 py-5 border-b border-white/10">
        <div className="text-xl font-semibold tracking-wide">J Marine</div>
        <div className="text-xs text-white/60">Multifunctional Hub</div>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 space-y-1">
        {navItems.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition rounded-md mx-3 ${
              current === key
                ? 'bg-white/10 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon size={18} />
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 text-[10px] text-white/40 border-t border-white/10">
        © {new Date().getFullYear()} J Marine
      </div>
    </aside>
  );
}
