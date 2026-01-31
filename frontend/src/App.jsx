import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LiveMonitoring from './pages/LiveMonitoring';
import IncidentLog from './pages/IncidentLog';
import Settings from './pages/Settings';
import AlertToast from './components/AlertToast';

// WebSocket URL
const WS_URL = 'ws://localhost:8000/ws/alerts';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [wsConnected, setWsConnected] = useState(false);
  const [socket, setSocket] = useState(null);

  // centralized system state
  const [alertNotifications, setAlertNotifications] = useState([]);
  const [cameraFrames, setCameraFrames] = useState({});
  const [stats, setStats] = useState(null);

  // Initialize WebSocket
  useEffect(() => {
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
  }, []);

  const addAlert = (alert) => {
    setAlertNotifications(prev => [alert, ...prev].slice(0, 5)); // Keep last 5
  };

  const removeAlert = () => {
    // Logic to dismiss top alert
    setAlertNotifications(prev => prev.slice(1));
  };


  // Routing Logic
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard stats={stats} />;
      case 'live':
        return <LiveMonitoring cameraFrames={cameraFrames} alertingCameras={{}} />; // Pass alerts map if needed
      case 'incidents':
        return <IncidentLog />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard stats={stats} />;
    }
  };

  // Determine Page Title
  const titles = {
    dashboard: 'System Overview',
    live: 'Live Surveillance Grid',
    incidents: 'Incident Access Logs',
    settings: 'System Configuration'
  };

  return (
    <Layout
      activePage={activePage}
      onNavigate={setActivePage}
      title={titles[activePage]}
      isConnected={wsConnected}
    >
      {renderPage()}

      {/* Global Alert Toasts */}
      {alertNotifications.length > 0 && (
        <AlertToast
          alert={alertNotifications[0]}
          onClose={removeAlert}
        />
      )}
    </Layout>
  );
}

export default App;