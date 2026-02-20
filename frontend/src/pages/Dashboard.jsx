import React, { useState, useEffect } from 'react';
import KPICard from '../components/KPICard';
import { AlertCircle, UserCheck, Camera, Activity, Shield, UserPlus, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import StatusBadge from '../components/StatusBadge';
import RegisterResidentModal from '../components/RegisterResidentModal';

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
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-8">
      {/* Header with Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">System Overview</h2>
          <p className="text-gray-500 text-sm mt-1">Real-time monitoring and analytics</p>
        </div>
        <button
          onClick={() => setIsRegisterModalOpen(true)}
          className="btn-primary flex items-center gap-2 transform hover:-translate-y-0.5 transition-all"
        >
          <UserPlus className="w-5 h-5" />
          <span className="hidden md:inline">Register Resident</span>
          <span className="md:hidden">Add</span>
        </button>
      </div>

      <RegisterResidentModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />

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
          color="teal"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-card p-8 min-h-[450px]">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Weekly Incident Overview</h3>
              <p className="text-sm text-gray-500">Security breaches over the last 7 days</p>
            </div>
            <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 outline-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>This Year</option>
            </select>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#9CA3AF" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#111827', fontWeight: 600 }}
                  labelStyle={{ color: '#6B7280', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="incidents" stroke="#EF4444" strokeWidth={3} fillOpacity={1} fill="url(#colorIncidents)" activeDot={{ r: 6, strokeWidth: 0, fill: '#EF4444' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Chart */}
        <div className="glass-card p-8 min-h-[450px]">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Visitor Traffic</h3>
          <p className="text-sm text-gray-500 mb-8">Peak entry times today</p>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} dy={10} />
                <Tooltip
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ backgroundColor: '#FFFFFF', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#111827', fontWeight: 600 }}
                  labelStyle={{ color: '#6B7280', marginBottom: '4px' }}
                />
                <Bar dataKey="entries" fill="#06B6D4" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Mini-Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Recent System Activity</h3>
            <p className="text-xs text-gray-500 mt-1">Latest verified entries and alerts</p>
          </div>
          <button className="text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors flex items-center gap-1">
            View All Logs <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-5 font-medium">Timestamp</th>
                <th className="p-5 font-medium">Event Type</th>
                <th className="p-5 font-medium">Camera</th>
                <th className="p-5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {[1, 2, 3].map((_, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                  <td className="p-5 text-gray-600 font-medium">Today, 10:4{i} AM</td>
                  <td className="p-5 text-gray-900 font-semibold flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                      <Shield className="w-4 h-4" />
                    </div>
                    Authorized Entry
                  </td>
                  <td className="p-5 text-gray-500">Main Entrance</td>
                  <td className="p-5">
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