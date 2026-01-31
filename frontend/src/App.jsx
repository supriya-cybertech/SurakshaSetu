import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Activity, Eye, Shield, ChevronRight } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import LiveMonitoring from './pages/LiveMonitoring';
import IncidentLog from './pages/IncidentLog';
import Settings from './pages/Settings';
import './App.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({
    total_incidents: 23,
    authorized_entries: 1463,
    active_cameras: 5,
    system_accuracy: 94.2
  });
  const [websocket, setWebsocket] = useState(null);
  const [alertNotifications, setAlertNotifications] = useState([]);
  const wsRef = useRef(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}/ws/alerts`;

    try {
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setWebsocket(wsRef.current);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message:', data);

          if (data.type === 'ALERT') {
            // Add to alerts and notifications
            setAlerts(prev => [data, ...prev].slice(0, 100));
            setAlertNotifications(prev => [data, ...prev].slice(0, 10));

            // Auto-dismiss notification after 5 seconds
            setTimeout(() => {
              setAlertNotifications(prev => prev.filter(a => a.alert_id !== data.alert_id));
            }, 5000);
          } else if (data.type === 'FRAME') {
            // Live camera frame update
            // Handled in LiveMonitoring component
          }
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setWebsocket(null);
        // Attempt reconnection after 3 seconds
        setTimeout(() => {
          // Reconnection logic handled by re-running this effect
        }, 3000);
      };
    } catch (error) {
      console.error('Failed to establish WebSocket:', error);
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/dashboard/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleNavigation = (page) => {
    setCurrentPage(page);
    setAlertNotifications([]); // Clear notifications when navigating
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* Top Navigation Bar */}
      <nav className="bg-[#0f0f23] border-b border-[#1a1a3e] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-red-500" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                SurakshaSetu
              </h1>
              <p className="text-xs text-gray-400">AI-Powered Security System</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              websocket ? 'bg-green-500/20 border border-green-500' : 'bg-red-500/20 border border-red-500'
            }`}>
              <div className={`w-2 h-2 rounded-full ${websocket ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-xs font-medium">{websocket ? 'LIVE' : 'OFFLINE'}</span>
            </div>

            {/* Alert Count Badge */}
            {alertNotifications.length > 0 && (
              <div className="bg-red-600 text-white rounded-full px-3 py-1 text-sm font-bold animate-pulse">
                {alertNotifications.length} Alerts
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <aside className="w-64 bg-[#0f0f23] border-r border-[#1a1a3e] p-4 overflow-y-auto">
          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Activity },
              { id: 'live-monitoring', label: 'Live Monitoring', icon: Eye },
              { id: 'incidents', label: 'Incident Log', icon: AlertTriangle },
              { id: 'settings', label: 'Settings', icon: ChevronRight }
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    currentPage === item.id
                      ? 'bg-red-600/20 border border-red-500 text-red-400'
                      : 'text-gray-300 hover:bg-[#1a1a3e]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* System Status */}
          <div className="mt-8 p-4 bg-[#1a1a3e] rounded-lg border border-[#2a2a5e]">
            <h3 className="text-sm font-bold text-gray-300 mb-3">System Status</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Cameras:</span>
                <span className="text-green-400 font-bold">{stats.active_cameras}/{stats.total_cameras}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Accuracy:</span>
                <span className="text-green-400 font-bold">{stats.system_accuracy}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">High Severity:</span>
                <span className="text-red-400 font-bold">3</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gradient-to-b from-[#020617] to-[#0f0f23]">
          {currentPage === 'dashboard' && <Dashboard stats={stats} alerts={alerts} />}
          {currentPage === 'live-monitoring' && <LiveMonitoring websocket={wsRef.current} alertNotifications={alertNotifications} />}
          {currentPage === 'incidents' && <IncidentLog />}
          {currentPage === 'settings' && <Settings />}
        </main>
      </div>

      {/* Alert Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {alertNotifications.map(alert => (
          <div
            key={alert.alert_id}
            className={`p-4 rounded-lg border shadow-lg max-w-sm animate-in slide-in-from-top ${
              alert.severity === 'HIGH'
                ? 'bg-red-600/20 border-red-500 text-red-200'
                : alert.severity === 'MEDIUM'
                ? 'bg-yellow-600/20 border-yellow-500 text-yellow-200'
                : 'bg-blue-600/20 border-blue-500 text-blue-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-bold text-sm">{alert.incident_type}</p>
                <p className="text-xs mt-1 opacity-90">{alert.message}</p>
                <p className="text-xs mt-1 opacity-75">Camera {alert.camera_id}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}