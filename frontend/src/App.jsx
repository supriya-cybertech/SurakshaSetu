import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LiveMonitoring from './pages/LiveMonitoring';
import IncidentLog from './pages/IncidentLog';
import Settings from './pages/Settings';
import AlertToast from './components/AlertToast';
import LandingPage from './pages/LandingPage';
import Analytics from './pages/Analytics';
import { Toaster } from 'react-hot-toast';

// WebSocket URL
const WS_URL = 'ws://localhost:8000/ws/alerts';

function App() {
  const [activePage, setActivePage] = useState('landing');
  const [wsConnected, setWsConnected] = useState(false);
  const [socket, setSocket] = useState(null);

  // centralized system state
  const [alertNotifications, setAlertNotifications] = useState([]);
  const [cameraFrames, setCameraFrames] = useState({});
  const [stats, setStats] = useState(null);

  // Calculate active alerts per camera for LiveMonitoring
  const alertingCameras = {};
  alertNotifications.forEach(alert => {
    if (!alertingCameras[alert.camera_id]) {
      alertingCameras[alert.camera_id] = alert;
    }
  });

  // Initialize WebSocket
  useEffect(() => {
    // Only connect WS if not on landing page to save resources
    if (activePage === 'landing') return;

    const connectWs = () => {
      const ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        setWsConnected(true);
        console.log('Use Security System Connected');
      };

      ws.onclose = () => {
        setWsConnected(false);
        console.log('Disconnected. Reconnecting...');
        setTimeout(connectWs, 3000);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'ALERT') {
            addAlert(data);
          } else if (data.type === 'FRAME') {
            setCameraFrames(prev => ({
              ...prev,
              [data.camera_id]: data.frame
            }));
          } else if (data.type === 'STATS') {
            setStats(data);
          }
        } catch (e) {
          console.error('Parse error:', e);
        }
      };

      setSocket(ws);
      return ws;
    };

    const wsInstance = connectWs();

    // Fetch initial stats
    fetch('http://localhost:8000/api/dashboard/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Stats fetch error:", err));

    return () => {
      if (wsInstance) wsInstance.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage]);

  const addAlert = (alert) => {
    setAlertNotifications(prev => [alert, ...prev].slice(0, 5));
  };

  const removeAlert = () => {
    setAlertNotifications(prev => prev.slice(1));
  };

  // Determine Page Title
  const titles = {
    dashboard: 'System Overview',
    analytics: 'Performance Analytics',
    live: 'Live Surveillance Grid',
    incidents: 'Incident Access Logs',
    settings: 'System Configuration'
  };

  if (activePage === 'landing') return <LandingPage onEnterApp={() => setActivePage('dashboard')} />;

  return (
    <Layout
      activePage={activePage}
      onNavigate={setActivePage}
      title={titles[activePage]}
      isConnected={wsConnected}
    >
      {activePage === 'dashboard' && <Dashboard stats={stats} />}
      {activePage === 'analytics' && <Analytics />}
      {activePage === 'live' && <LiveMonitoring cameraFrames={cameraFrames} alertingCameras={alertingCameras} />}
      {activePage === 'incidents' && <IncidentLog />}
      {activePage === 'settings' && <Settings />}

      {/* Global Alert Toasts */}
      {alertNotifications.length > 0 && (
        <AlertToast
          alert={alertNotifications[0]}
          onClose={removeAlert}
        />
      )}
      <Toaster position="top-center" />
    </Layout>
  );
}

export default App;