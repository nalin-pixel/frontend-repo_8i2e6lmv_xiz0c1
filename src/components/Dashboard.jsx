import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, Anchor, AlertTriangle, Users, DollarSign, TrendingUp } from 'lucide-react';

// Seed demo data into localStorage once
const seedData = () => {
  if (localStorage.getItem('jm_seeded')) return;

  const today = new Date();
  const days = (n) => new Date(today.getTime() + n * 86400000);

  const agents = [
    { id: 'a1', name: 'Abdul K.', company: 'HarborLink TZ', phone: '+255 713 000 111', email: 'abdul@harborlink.tz', ports: ['Dar','Tanga'], commission_type: 'percent', commission_value: 7, total_jobs: 18, total_revenue: 420000, total_margin: 98000 },
    { id: 'a2', name: 'Neema S.', company: 'EastPort Agency', phone: '+255 717 555 777', email: 'neema@eastport.tz', ports: ['Dar'], commission_type: 'fixed', commission_value: 300, total_jobs: 12, total_revenue: 260000, total_margin: 65000 },
    { id: 'a3', name: 'John M.', company: 'Tanga Marine', phone: '+255 715 222 333', email: 'john@tangamarine.tz', ports: ['Tanga'], commission_type: 'percent', commission_value: 5, total_jobs: 9, total_revenue: 140000, total_margin: 38000 },
  ];

  const ships = [
    { id: 's1', name: 'MV Kilimanjaro', IMO: '9631234', type: 'Bulk Carrier', flag: 'Tanzania', ETA: days(1).toISOString(), ETD: days(3).toISOString(), port: 'Dar', source: 'AIS', agent_id: 'a1', status: 'Expected' },
    { id: 's2', name: 'MT Bahari', IMO: '9723456', type: 'Tanker', flag: 'Panama', ETA: days(2).toISOString(), ETD: days(4).toISOString(), port: 'Dar', source: 'TPA Shipping List', status: 'Expected' },
    { id: 's3', name: 'MV Tanga Star', IMO: '9512345', type: 'General Cargo', flag: 'Liberia', ETA: days(5).toISOString(), ETD: days(7).toISOString(), port: 'Tanga', source: 'Agent Intel', agent_id: 'a3', status: 'Expected' },
    { id: 's4', name: 'MV Ziwa', IMO: '9456789', type: 'Bulk Carrier', flag: 'Tanzania', ETA: days(-10).toISOString(), ETD: days(-7).toISOString(), port: 'Dar', source: 'AIS', agent_id: 'a2', status: 'Completed' },
  ];

  const opportunities = [
    { id: 'o1', ship_id: 's1', port: 'Dar', scope_of_work: 'Hold cleaning + deck wash', expected_value: 8500, stage: 'Quoted', probability: 0.6, notes: 'Need tank ladders' },
    { id: 'o2', ship_id: 's2', port: 'Dar', scope_of_work: 'Side hull wash', expected_value: 5200, stage: 'Lead', probability: 0.4, notes: 'Agent price sensitive' },
    { id: 'o3', ship_id: 's3', port: 'Tanga', scope_of_work: 'Deck cleaning + garbage disposal', expected_value: 4500, stage: 'Won', probability: 0.9, notes: 'Urgent turnaround' },
  ];

  const workers = [
    { id: 'w1', name: 'Said Ally', phone: '+255 712 111 222', skill_category: 'Cleaner', daily_rate: 25, rating: 4.6, status: 'Available', last_job_date: days(-2).toISOString() },
    { id: 'w2', name: 'Aisha Msuya', phone: '+255 713 333 444', skill_category: 'Supervisor', daily_rate: 40, rating: 4.8, status: 'Available', last_job_date: days(-5).toISOString() },
    { id: 'w3', name: 'Joseph Kim', phone: '+255 714 555 666', skill_category: 'Safety', daily_rate: 35, rating: 4.2, status: 'On Job', last_job_date: days(-1).toISOString() },
    { id: 'w4', name: 'Hassan Juma', phone: '+255 715 777 888', skill_category: 'Cleaner', daily_rate: 25, rating: 4.1, status: 'Available', last_job_date: days(-10).toISOString() },
  ];

  const inventory = [
    { id: 'i1', name: 'Marine Detergent', category: 'Chemicals', unit: 'L', current_stock: 120, reorder_level: 100, avg_usage_per_job: 30, preferred_supplier: 'OceanChem' },
    { id: 'i2', name: 'PPE Kit', category: 'PPE', unit: 'set', current_stock: 12, reorder_level: 15, avg_usage_per_job: 4, preferred_supplier: 'SafeWorks' },
    { id: 'i3', name: 'Rope Access Gear', category: 'Tools', unit: 'set', current_stock: 5, reorder_level: 3, avg_usage_per_job: 1, preferred_supplier: 'HighLine' },
  ];

  const jobs = [
    { id: 'j1', opportunity_id: 'o3', start_datetime: days(1).toISOString(), end_datetime: days(2).toISOString(), status: 'Planned', crew_assigned: ['w2','w1'], materials_used: [{ inventory_item_id: 'i1', qty: 20 }], final_revenue: null, total_cost: null, margin: null },
  ];

  const transactions = [
    { id: 't1', type: 'Expense', date: days(-8).toISOString(), amount: 300, currency: 'USD', linked_job_id: 'j1', linked_agent_id: 'a3', category: 'Materials', description: 'Chemicals advance' },
    { id: 't2', type: 'Income', date: days(-7).toISOString(), amount: 6800, currency: 'USD', linked_job_id: 'j1', linked_agent_id: 'a3', category: 'Invoice', description: 'Invoice MT Tanga Star' },
  ];

  const marketing = [
    { id: 'm1', date: days(-1).toISOString(), contact_type: 'Call', agent_id: 'a2', notes: 'Followed up on Bahari tanker', outcome: 'Follow-up' },
  ];

  localStorage.setItem('jm_agents', JSON.stringify(agents));
  localStorage.setItem('jm_ships', JSON.stringify(ships));
  localStorage.setItem('jm_opportunities', JSON.stringify(opportunities));
  localStorage.setItem('jm_workers', JSON.stringify(workers));
  localStorage.setItem('jm_inventory', JSON.stringify(inventory));
  localStorage.setItem('jm_jobs', JSON.stringify(jobs));
  localStorage.setItem('jm_transactions', JSON.stringify(transactions));
  localStorage.setItem('jm_marketing', JSON.stringify(marketing));
  localStorage.setItem('jm_seeded', '1');
};

const Card = ({ title, children, accent }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-white/90 text-sm font-medium">{title}</h3>
      {accent}
    </div>
    {children}
  </div>
);

function formatMoney(n){
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0);
}

export default function Dashboard() {
  const [toast, setToast] = useState(null);
  const [user] = useState({ name: 'Owner / Manager' });

  useEffect(() => {
    seedData();
    // demo toasts
    setTimeout(() => setToast({ id: 1, text: '3 new ships detected for Dar' }), 800);
    setTimeout(() => setToast({ id: 2, text: '1 agent with overdue commission' }), 2200);
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, []);

  const ships = JSON.parse(localStorage.getItem('jm_ships') || '[]');
  const opportunities = JSON.parse(localStorage.getItem('jm_opportunities') || '[]');
  const workers = JSON.parse(localStorage.getItem('jm_workers') || '[]');
  const inventory = JSON.parse(localStorage.getItem('jm_inventory') || '[]');

  const upcoming = useMemo(() => {
    const now = new Date();
    const seven = new Date(now.getTime() + 7 * 86400000);
    return ships
      .filter(s => new Date(s.ETA) >= now && new Date(s.ETA) <= seven)
      .map(s => ({
        ...s,
        opportunity: opportunities.find(o => o.ship_id === s.id) || null,
      }))
      .sort((a,b) => new Date(a.ETA) - new Date(b.ETA));
  }, [ships, opportunities]);

  const agents = JSON.parse(localStorage.getItem('jm_agents') || '[]');
  const topAgents = useMemo(() => agents
    .slice()
    .sort((a,b) => (b.total_revenue || 0) - (a.total_revenue || 0))
    .slice(0,3), [agents]);

  const availableWorkers = workers.filter(w => w.status === 'Available').length;
  const assignedToday = 1 + Math.floor(Math.random()*3);
  const lowStock = inventory.filter(i => i.current_stock <= i.reorder_level);

  const expectedRevenue = upcoming.reduce((sum, s) => sum + ((s.opportunity?.expected_value || 0) * (s.opportunity?.probability || 0)), 0);
  const expectedCosts = expectedRevenue * 0.6; // rough demo assumption

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card title="Upcoming Ships (7 days)" accent={<Calendar className="text-[#f59e0b]" size={18} /> }>
          <div className="text-2xl text-white font-semibold">{upcoming.length}</div>
          <div className="text-xs text-white/60 mt-1">Dar & Tanga combined</div>
        </Card>
        <Card title="Casual Pool" accent={<Users className="text-[#f59e0b]" size={18} /> }>
          <div className="text-2xl text-white font-semibold">{availableWorkers}</div>
          <div className="text-xs text-white/60 mt-1">Available • {assignedToday} assigned today</div>
        </Card>
        <Card title="Inventory Alerts" accent={<AlertTriangle className="text-[#f59e0b]" size={18} /> }>
          <div className="text-2xl text-white font-semibold">{lowStock.length}</div>
          <div className="text-xs text-white/60 mt-1">Items at/below reorder</div>
        </Card>
        <Card title="Finance (This Week)" accent={<DollarSign className="text-[#f59e0b]" size={18} /> }>
          <div className="text-sm text-white/70">Expected Revenue</div>
          <div className="text-lg text-white font-semibold">{formatMoney(expectedRevenue)}</div>
          <div className="text-xs text-white/60 mt-1">Expected Costs {formatMoney(expectedCosts)}</div>
        </Card>
      </div>

      {/* Upcoming table */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2 text-white/80"><Anchor size={18} className="text-[#f59e0b]"/> Upcoming Ships</div>
          <div className="text-xs text-white/60">Based on AIS, TPA list and Agent intel</div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5 text-white/60">
              <tr>
                <th className="text-left px-4 py-2">Vessel</th>
                <th className="text-left px-4 py-2">ETA</th>
                <th className="text-left px-4 py-2">Port</th>
                <th className="text-left px-4 py-2">Agent</th>
                <th className="text-left px-4 py-2">Stage</th>
                <th className="text-right px-4 py-2">Expected</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.map(s => (
                <tr key={s.id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="px-4 py-2 text-white">{s.name}</td>
                  <td className="px-4 py-2 text-white/80">{new Date(s.ETA).toLocaleString()}</td>
                  <td className="px-4 py-2 text-white/80">{s.port}</td>
                  <td className="px-4 py-2 text-white/80">{(agents.find(a=>a.id===s.agent_id)?.name)||'—'}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      s.opportunity?.stage === 'Won' ? 'bg-green-500/20 text-green-300' :
                      s.opportunity?.stage === 'Quoted' ? 'bg-yellow-500/20 text-yellow-300' :
                      s.opportunity?.stage === 'Lead' ? 'bg-blue-500/20 text-blue-300' : 'bg-white/10 text-white/70'
                    }`}>
                      {s.opportunity?.stage || 'Not Contacted'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right text-white">{formatMoney((s.opportunity?.expected_value||0) * (s.opportunity?.probability||0))}</td>
                </tr>
              ))}
              {upcoming.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-white/60">No upcoming ships in the next 7 days.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Recommended Agents to Contact" accent={<TrendingUp className="text-[#f59e0b]" size={18} /> }>
          <ul className="divide-y divide-white/10">
            {topAgents.map(a => (
              <li key={a.id} className="py-2 flex items-center justify-between">
                <div>
                  <div className="text-white">{a.name}</div>
                  <div className="text-xs text-white/60">{a.company} • {a.ports.join(', ')}</div>
                </div>
                <div className="text-right">
                  <div className="text-white text-sm">{formatMoney(a.total_revenue)}</div>
                  <div className="text-xs text-white/60">Lifetime revenue</div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Scenario Guide" accent={<Calendar className="text-[#f59e0b]" size={18} /> }>
          <ol className="list-decimal list-inside text-white/80 space-y-1 text-sm">
            <li>Check Upcoming Ships and pick one.</li>
            <li>Create an Opportunity and set expected value.</li>
            <li>Mark it Won and convert to Job.</li>
            <li>Assign workers and inventory usage.</li>
            <li>Complete job and view profitability.</li>
          </ol>
          <p className="text-xs text-white/50 mt-3">This is a demo with local data. Your actions persist in your browser.</p>
        </Card>
      </div>

      {/* Toasts */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-black/80 text-white px-4 py-3 rounded-lg border border-white/10 shadow-lg animate-[fadeIn_.3s_ease]">
          {toast.text}
        </div>
      )}
    </div>
  );
}
