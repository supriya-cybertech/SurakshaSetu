import React, { useState, useEffect } from 'react';
import KPICard from '../components/KPICard';
import { AlertCircle, UserCheck, Camera, Activity, Shield } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import StatusBadge from '../components/StatusBadge';

// Mock Data for Charts
const weeklyData = [
  { name: 'Mon', incidents: 4 },
  { name: 'Tue', incidents: 3 },
  { name: 'Wed', incidents: 7 },
  { name: 'Thu', incidents: 2 },
  { name: 'Fri', incidents: 5 },
  { name: 'Sat', incidents: 8 },
  { name: 'Sun', incidents: 6 },
];

const hourlyData = [
  { name: '08:00', entries: 12 },
  { name: '10:00', entries: 45 },
  { name: '12:00', entries: 35 },
  { name: '14:00', entries: 20 },
  { name: '16:00', entries: 55 },
  { name: '18:00', entries: 30 },
];

export default function Dashboard({ stats }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Incidents"
          value={stats?.total_incidents || 0}
          icon={AlertCircle}
          trend="up"
          trendValue="12%"
          color="red"
        />
        <KPICard
          title="Authorized Entries"
          value={stats?.authorized_entries || 0}
          icon={UserCheck}
          trend="up"
          trendValue="8%"
          color="green"
        />
        <KPICard
          title="Active Cameras"
          value={`${stats?.active_cameras || 0} / ${stats?.total_cameras || 5}`}
          icon={Camera}
          color="blue"
        />
        <KPICard
          title="System Accuracy"
          value={`${stats?.system_accuracy || 98.5}%`}
          icon={Activity}
          trend="up"
          trendValue="0.5%"
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-card p-6 min-h-[400px]">
          <h3 className="text-lg font-bold text-white mb-6">Weekly Incident Overview</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                  itemStyle={{ color: '#F3F4F6' }}
                />
                <Area type="monotone" dataKey="incidents" stroke="#EF4444" strokeWidth={3} fillOpacity={1} fill="url(#colorIncidents)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Chart */}
        <div className="glass-card p-6 min-h-[400px]">
          <h3 className="text-lg font-bold text-white mb-6">Visitor Traffic</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                  itemStyle={{ color: '#F3F4F6' }}
                  cursor={{ fill: '#374151', opacity: 0.4 }}
                />
                <Bar dataKey="entries" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Mini-Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Recent System Activity</h3>
          <button className="text-sm text-primary-400 hover:text-primary-300 transition-colors">View All Logs</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 font-medium">Timestamp</th>
                <th className="p-4 font-medium">Event Type</th>
                <th className="p-4 font-medium">Camera</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {[1, 2, 3].map((_, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 text-gray-300">Today, 10:4{i} AM</td>
                  <td className="p-4 text-white font-medium flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary-400" />
                    Authorized Entry
                  </td>
                  <td className="p-4 text-gray-400">Main Entrance</td>
                  <td className="p-4">
                    <StatusBadge status="success" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}