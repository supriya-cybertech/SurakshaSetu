import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Users, Camera, TrendingUp } from 'lucide-react';

export default function Dashboard({ stats, alerts }) {
  const [weeklyData, setWeeklyData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);

  useEffect(() => {
    // Generate sample data for weekly trend
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    setWeeklyData(days.map((day, i) => ({
      name: day,
      incidents: Math.floor(Math.random() * 8) + 2,
      unauthorized: Math.floor(Math.random() * 5)
    })));

    // Generate hourly data
    const hours = Array.from({ length: 24 }, (_, i) => ({
      name: `${i}:00`,
      entries: Math.floor(Math.random() * 50) + 10
    }));
    setHourlyData(hours);
  }, []);

  const kpiCards = [
    {
      label: 'Total Incidents',
      value: stats.total_incidents || 23,
      color: 'red',
      icon: AlertTriangle
    },
    {
      label: 'Authorized Entries',
      value: stats.authorized_entries || 1463,
      color: 'green',
      icon: Users
    },
    {
      label: 'Active Cameras',
      value: `${stats.active_cameras || 5}/${stats.total_cameras || 5}`,
      color: 'blue',
      icon: Camera
    },
    {
      label: 'Accuracy',
      value: `${stats.system_accuracy || 94.2}%`,
      color: 'yellow',
      icon: TrendingUp
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, idx) => {
          const Icon = card.icon;
          const colorClasses = {
            red: 'from-red-600 to-red-700 border-red-500',
            green: 'from-green-600 to-green-700 border-green-500',
            blue: 'from-blue-600 to-blue-700 border-blue-500',
            yellow: 'from-yellow-600 to-yellow-700 border-yellow-500'
          };

          return (
            <div
              key={idx}
              className={`bg-gradient-to-br ${colorClasses[card.color]} rounded-lg border p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-200 text-sm font-medium">{card.label}</p>
                  <p className="text-3xl font-bold text-white mt-2">{card.value}</p>
                </div>
                <Icon className="w-12 h-12 text-white/30" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Incident Trend */}
        <div className="bg-[#0f0f23] rounded-lg border border-[#1a1a3e] p-6">
          <h2 className="text-lg font-bold text-white mb-4">Weekly Incident Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a3e" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a3e', border: '1px solid #ff4444' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="incidents" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line 
                type="monotone" 
                dataKey="unauthorized" 
                stroke="#f97316" 
                strokeWidth={2}
                dot={{ fill: '#f97316', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Entry Activity by Hour */}
        <div className="bg-[#0f0f23] rounded-lg border border-[#1a1a3e] p-6">
          <h2 className="text-lg font-bold text-white mb-4">Entry Activity by Hour</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a3e" />
              <XAxis dataKey="name" stroke="#888" tick={{ fontSize: 12 }} />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a3e', border: '1px solid #4444ff' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar 
                dataKey="entries" 
                fill="#3b82f6" 
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-[#0f0f23] rounded-lg border border-[#1a1a3e] p-6">
        <h2 className="text-lg font-bold text-white mb-4">Recent Alerts</h2>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {alerts.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No alerts at the moment</p>
          ) : (
            alerts.slice(0, 10).map((alert, idx) => (
              <div 
                key={idx}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  alert.severity === 'HIGH' ? 'bg-red-600/10 border-red-500' :
                  alert.severity === 'MEDIUM' ? 'bg-yellow-600/10 border-yellow-500' :
                  'bg-blue-600/10 border-blue-500'
                }`}
              >
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">{alert.incident_type}</p>
                  <p className="text-xs text-gray-300 mt-1">{alert.message || alert.additional_info}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded text-xs font-bold ${
                    alert.severity === 'HIGH' ? 'bg-red-500 text-white' :
                    alert.severity === 'MEDIUM' ? 'bg-yellow-500 text-black' :
                    'bg-blue-500 text-white'
                  }`}>
                    {alert.severity}
                  </span>
                  <span className="text-xs text-gray-400">Camera {alert.camera_id}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}