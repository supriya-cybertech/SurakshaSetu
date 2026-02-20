import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Calendar, Download, Filter, TrendingUp, TrendingDown, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';
import KPICard from '../components/KPICard';
import clsx from 'clsx';

// Mock Data
const INCIDENT_TRENDS = [
    { name: 'Mon', unauthorized: 4, verified: 12 },
    { name: 'Tue', unauthorized: 3, verified: 15 },
    { name: 'Wed', unauthorized: 7, verified: 20 },
    { name: 'Thu', unauthorized: 2, verified: 18 },
    { name: 'Fri', unauthorized: 5, verified: 22 },
    { name: 'Sat', unauthorized: 8, verified: 10 },
    { name: 'Sun', unauthorized: 6, verified: 8 },
];

const RESPONSE_TIMES = [
    { time: '08:00', avg: 45 },
    { time: '10:00', avg: 30 },
    { time: '12:00', avg: 25 },
    { time: '14:00', avg: 35 },
    { time: '16:00', avg: 28 },
    { time: '18:00', avg: 40 },
];

const INCIDENT_TYPES = [
    { name: 'Tailgating', value: 45, color: '#EF4444' }, // Red-500
    { name: 'Unverified', value: 30, color: '#F59E0B' }, // Amber-500
    { name: 'Blacklisted', value: 15, color: '#111827' }, // Gray-900
    { name: 'Loitering', value: 10, color: '#3B82F6' },   // Blue-500
];

export default function Analytics() {
    const [timeRange, setTimeRange] = useState('week');

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Security Analytics</h2>
                    <p className="text-gray-500 text-sm mt-1">Deep dive into system performance and threat patterns.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="bg-white border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-primary-500 focus:border-primary-500 block pl-4 pr-10 py-2.5 outline-none shadow-sm appearance-none cursor-pointer hover:border-gray-300 transition-colors"
                        >
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="year">This Year</option>
                        </select>
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all text-sm font-medium shadow-sm">
                        <Download className="w-4 h-4" /> Export Report
                    </button>
                </div>
            </div>

            {/* Performance KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPICard
                    title="Avg Response Time"
                    value="32s"
                    icon={Clock}
                    trend="down"
                    trendValue="12% vs last week"
                    color="blue"
                />
                <KPICard
                    title="Security Score"
                    value="94/100"
                    icon={ShieldCheck}
                    trend="up"
                    trendValue="2pts vs last week"
                    color="green"
                />
                <KPICard
                    title="Threat Detection Rate"
                    value="99.8%"
                    icon={AlertTriangle}
                    trend="up"
                    trendValue="0.1% vs last week"
                    color="teal"
                />
            </div>

            {/* Main Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Incident Trends - Area Chart */}
                <div className="lg:col-span-2 glass-card p-8 min-h-[400px]">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-gray-400" />
                        Incident vs Verified Traffic
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={INCIDENT_TRENDS}>
                                <defs>
                                    <linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorUnauthorized" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                                <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                                <YAxis stroke="#9CA3AF" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} dx={-10} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                                />
                                <Area type="monotone" dataKey="verified" name="Verified Entries" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorVerified)" />
                                <Area type="monotone" dataKey="unauthorized" name="Incidents" stroke="#EF4444" strokeWidth={3} fillOpacity={1} fill="url(#colorUnauthorized)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Incident Distribution - Donut Chart */}
                <div className="glass-card p-8 min-h-[400px] flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Threat Distribution</h3>
                    <p className="text-gray-500 text-xs mb-6">Breakdown by incident type</p>

                    <div className="flex-1 flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={INCIDENT_TYPES}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {INCIDENT_TYPES.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    itemStyle={{ color: '#111827', fontWeight: 600 }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-gray-900">100</span>
                            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total</span>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="grid grid-cols-2 gap-3 mt-6">
                        {INCIDENT_TYPES.map((type) => (
                            <div key={type.name} className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: type.color }} />
                                <span className="text-xs font-medium text-gray-600">{type.name} ({type.value}%)</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row - Response Times */}
            <div className="glass-card p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Staff Response Efficiency</h3>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={RESPONSE_TIMES}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                            <XAxis dataKey="time" stroke="#9CA3AF" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                            <YAxis stroke="#9CA3AF" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} dx={-10} unit="s" />
                            <Tooltip
                                cursor={{ fill: '#F9FAFB' }}
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Bar dataKey="avg" name="Avg Response (s)" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
