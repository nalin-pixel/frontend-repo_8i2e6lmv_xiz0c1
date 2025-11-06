import React, { useMemo, useState } from 'react';
import { Plus, Filter } from 'lucide-react';

function formatDate(s){
  return new Date(s).toLocaleString();
}

export default function ShipsModule(){
  const [port, setPort] = useState('All');
  const [stage, setStage] = useState('All');
  const [source, setSource] = useState('All');

  const ships = JSON.parse(localStorage.getItem('jm_ships') || '[]');
  const opportunities = JSON.parse(localStorage.getItem('jm_opportunities') || '[]');
  const agents = JSON.parse(localStorage.getItem('jm_agents') || '[]');

  const rows = useMemo(()=>{
    return ships.map(s=>({
      ...s,
      opportunity: opportunities.find(o=>o.ship_id===s.id) || null,
    })).filter(r => (port==='All'||r.port===port) && (stage==='All'||(r.opportunity?.stage||'None')===stage) && (source==='All'||r.source===source));
  },[ships, opportunities, port, stage, source]);

  const [form, setForm] = useState({ scope_of_work:'', expected_value: '', stage: 'Lead', probability: 0.4 });
  const [targetShip, setTargetShip] = useState(null);

  const createOpportunity = () => {
    if(!targetShip) return;
    const list = JSON.parse(localStorage.getItem('jm_opportunities') || '[]');
    const id = 'o' + Math.random().toString(36).slice(2,7);
    const data = { id, ship_id: targetShip.id, port: targetShip.port, scope_of_work: form.scope_of_work, expected_value: Number(form.expected_value||0), stage: form.stage, probability: Number(form.probability||0), notes: '' };
    localStorage.setItem('jm_opportunities', JSON.stringify([...list, data]));
    setTargetShip(null);
    setForm({ scope_of_work:'', expected_value: '', stage: 'Lead', probability: 0.4 });
    window.dispatchEvent(new Event('storage')); // hint refresh for other modules
  };

  const updateStage = (op, next) => {
    const list = JSON.parse(localStorage.getItem('jm_opportunities') || '[]');
    const idx = list.findIndex(x=>x.id===op.id);
    if(idx>-1){ list[idx] = { ...list[idx], stage: next }; localStorage.setItem('jm_opportunities', JSON.stringify(list)); window.dispatchEvent(new Event('storage')); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-lg font-medium">Ship Intelligence</h2>
        <div className="flex items-center gap-2 text-white/70">
          <Filter size={16}/>
          <select value={port} onChange={e=>setPort(e.target.value)} className="bg-white/10 border border-white/10 rounded px-2 py-1 text-sm">
            <option>All</option><option>Dar</option><option>Tanga</option>
          </select>
          <select value={stage} onChange={e=>setStage(e.target.value)} className="bg-white/10 border border-white/10 rounded px-2 py-1 text-sm">
            <option>All</option><option>None</option><option>Lead</option><option>Quoted</option><option>Won</option><option>Lost</option>
          </select>
          <select value={source} onChange={e=>setSource(e.target.value)} className="bg-white/10 border border-white/10 rounded px-2 py-1 text-sm">
            <option>All</option><option>AIS</option><option>TPA Shipping List</option><option>Agent Intel</option>
          </select>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5 text-white/60">
            <tr>
              <th className="text-left px-4 py-2">Vessel</th>
              <th className="text-left px-4 py-2">ETA</th>
              <th className="text-left px-4 py-2">Port</th>
              <th className="text-left px-4 py-2">Source</th>
              <th className="text-left px-4 py-2">Stage</th>
              <th className="text-right px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r=>{
              const st = r.opportunity?.stage || 'None';
              return (
                <tr key={r.id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="px-4 py-2 text-white">{r.name}</td>
                  <td className="px-4 py-2 text-white/80">{formatDate(r.ETA)}</td>
                  <td className="px-4 py-2 text-white/80">{r.port}</td>
                  <td className="px-4 py-2 text-white/80">{r.source}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      st==='Won'?'bg-green-500/20 text-green-300':
                      st==='Quoted'?'bg-yellow-500/20 text-yellow-300':
                      st==='Lead'?'bg-blue-500/20 text-blue-300':
                      st==='Lost'?'bg-red-500/20 text-red-300':'bg-white/10 text-white/70'
                    }`}>{st}</span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    {r.opportunity ? (
                      <div className="flex justify-end gap-2">
                        {['Lead','Quoted','Won','Lost'].map(next => (
                          <button key={next} onClick={()=>updateStage(r.opportunity, next)} className="px-2 py-1 text-xs rounded bg-white/10 hover:bg-white/20 text-white/80">{next}</button>
                        ))}
                      </div>
                    ) : (
                      <button onClick={()=>setTargetShip(r)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-[#f59e0b] text-black text-xs font-medium hover:brightness-110">
                        <Plus size={14}/> Opportunity
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {targetShip && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
          <div className="text-white/90 font-medium">New Opportunity for {targetShip.name}</div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/60 mb-1">Scope of Work</label>
              <input value={form.scope_of_work} onChange={e=>setForm({...form, scope_of_work:e.target.value})} className="w-full bg-white/10 border border-white/10 rounded px-3 py-2 text-white" placeholder="Deck wash, hold cleaning..."/>
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">Expected Value (USD)</label>
              <input value={form.expected_value} onChange={e=>setForm({...form, expected_value:e.target.value})} className="w-full bg-white/10 border border-white/10 rounded px-3 py-2 text-white" placeholder="5000"/>
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">Stage</label>
              <select value={form.stage} onChange={e=>setForm({...form, stage:e.target.value})} className="w-full bg-white/10 border border-white/10 rounded px-3 py-2 text-white">
                <option>Lead</option><option>Quoted</option><option>Won</option><option>Lost</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">Probability</label>
              <input type="number" step="0.1" min="0" max="1" value={form.probability} onChange={e=>setForm({...form, probability:e.target.value})} className="w-full bg-white/10 border border-white/10 rounded px-3 py-2 text-white"/>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={createOpportunity} className="px-4 py-2 rounded bg-[#f59e0b] text-black font-medium hover:brightness-110">Save Opportunity</button>
            <button onClick={()=>setTargetShip(null)} className="px-4 py-2 rounded bg-white/10 text-white/80 hover:bg-white/20">Cancel</button>
          </div>
        </div>
      )}

      {/* basic analytics */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="text-white/80 text-sm mb-2">Basic Analytics</div>
        <div className="grid sm:grid-cols-3 gap-3 text-white">
          <div className="bg-white/5 rounded p-3">
            <div className="text-sm text-white/60">Total Ships</div>
            <div className="text-xl font-semibold">{ships.length}</div>
          </div>
          <div className="bg-white/5 rounded p-3">
            <div className="text-sm text-white/60">Opportunities</div>
            <div className="text-xl font-semibold">{opportunities.length}</div>
          </div>
          <div className="bg-white/5 rounded p-3">
            <div className="text-sm text-white/60">Conversion to Won</div>
            <div className="text-xl font-semibold">{(() => { const won = opportunities.filter(o=>o.stage==='Won').length; return opportunities.length? Math.round((won/opportunities.length)*100):0; })()}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
