import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Maximize2, Volume2, VolumeX } from 'lucide-react';

export default function LiveMonitoring({ websocket, alertNotifications }) {
  const [cameraFrames, setCameraFrames] = useState({});
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [alertingCameras, setAlertingCameras] = useState({});
  const [soundEnabled, setSoundEnabled] = useState(true);
  const alertSoundRef = useRef(null);

  const cameras = [
    { id: 1, name: 'Entry Gate', location: 'Main Entrance' },
    { id: 2, name: 'Lobby', location: 'Ground Floor' },
    { id: 3, name: 'Access Point', location: 'Stairwell' },
    { id: 4, name: 'Parking', location: 'Level B1' },
    { id: 0, name: 'Webcam', location: 'Local System' }
  ];

  // Handle WebSocket frame updates
  useEffect(() => {
    if (!websocket) return;

    const originalOnMessage = websocket.onmessage;
    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'FRAME') {
          setCameraFrames(prev => ({
            ...prev,
            [data.camera_id]: data.frame
          }));
        } else if (data.type === 'ALERT' && data.incident_type === 'TAILGATING') {
          // Add camera to alerting list
          setAlertingCameras(prev => ({
            ...prev,
            [data.camera_id]: {
              severity: data.severity,
              timestamp: new Date(),
              message: data.message
            }
          }));

          // Play alert sound
          if (soundEnabled && data.severity === 'HIGH') {
            playAlertSound();
          }

          // Clear alert after 5 seconds
          setTimeout(() => {
            setAlertingCameras(prev => {
              const updated = { ...prev };
              delete updated[data.camera_id];
              return updated;
            });
          }, 5000);
        }
      } catch (e) {
        console.error('Error parsing WebSocket message:', e);
      }
    };

    return () => {
      websocket.onmessage = originalOnMessage;
    };
  }, [websocket, soundEnabled]);

  const playAlertSound = () => {
    try {
      // Create a simple beep sound using Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const now = audioContext.currentTime;
      
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      
      oscillator.frequency.value = 1000;
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      
      oscillator.start(now);
      oscillator.stop(now + 0.5);
    } catch (e) {
      console.error('Error playing sound:', e);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Live Monitoring</h1>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
            soundEnabled
              ? 'bg-green-600/20 border-green-500 text-green-300 hover:bg-green-600/30'
              : 'bg-gray-600/20 border-gray-500 text-gray-300 hover:bg-gray-600/30'
          }`}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">
            {soundEnabled ? 'Sound: ON' : 'Sound: OFF'}
          </span>
        </button>
      </div>

      {/* Camera Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cameras.map(camera => {
          const isAlerting = alertingCameras[camera.id];
          const frame = cameraFrames[camera.id];

          return (
            <div
              key={camera.id}
              onClick={() => setSelectedCamera(camera)}
              className={`relative rounded-lg border overflow-hidden cursor-pointer transition-all transform hover:scale-105 ${
                isAlerting
                  ? 'border-red-500 shadow-lg shadow-red-500/50 animate-pulse'
                  : 'border-[#1a1a3e] hover:border-[#2a2a5e]'
              }`}
            >
              {/* Camera Feed or Placeholder */}
              <div className="relative w-full bg-black aspect-video flex items-center justify-center overflow-hidden">
                {frame ? (
                  <img
                    src={`data:image/jpeg;base64,${frame}`}
                    alt={`Camera ${camera.id}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1a1a3e] to-[#0f0f23] flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full border-2 border-gray-600 border-t-blue-500 animate-spin mx-auto mb-2"></div>
                      <p className="text-gray-400 text-sm">Loading...</p>
                    </div>
                  </div>
                )}

                {/* Alert Overlay */}
                {isAlerting && (
                  <div className="absolute inset-0 bg-red-600/30 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center">
                      <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-2 animate-bounce" />
                      <p className="text-white font-bold text-lg">ALERT</p>
                      <p className="text-red-200 text-sm">TAILGATING DETECTED</p>
                    </div>
                  </div>
                )}

                {/* Camera Header */}
                <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/80 to-transparent p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white text-sm">{camera.name}</h3>
                      <p className="text-xs text-gray-300">{camera.location}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      isAlerting ? 'bg-red-500 animate-pulse' : 'bg-green-500'
                    }`}></div>
                  </div>
                </div>

                {/* Fullscreen Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCamera(camera);
                  }}
                  className="absolute bottom-3 right-3 bg-black/50 hover:bg-black/70 p-2 rounded-lg transition-all"
                >
                  <Maximize2 className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fullscreen Modal */}
      {selectedCamera && (
        <div
          onClick={() => setSelectedCamera(null)}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden"
          >
            <div className="aspect-video flex items-center justify-center">
              {cameraFrames[selectedCamera.id] ? (
                <img
                  src={`data:image/jpeg;base64,${cameraFrames[selectedCamera.id]}`}
                  alt={selectedCamera.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full border-4 border-gray-600 border-t-blue-500 animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading live feed...</p>
                </div>
              )}
            </div>

            <div className="bg-[#0f0f23] border-t border-[#1a1a3e] p-4">
              <h2 className="text-xl font-bold text-white">{selectedCamera.name}</h2>
              <p className="text-gray-400 text-sm">{selectedCamera.location}</p>
            </div>

            <button
              onClick={() => setSelectedCamera(null)}
              className="absolute top-4 right-4 bg-red-600/80 hover:bg-red-600 px-4 py-2 rounded-lg text-white font-medium transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Alert History */}
      {alertNotifications.length > 0 && (
        <div className="bg-[#0f0f23] rounded-lg border border-[#1a1a3e] p-6">
          <h2 className="text-lg font-bold text-white mb-4">Recent Alerts</h2>
          <div className="space-y-3">
            {alertNotifications.map(alert => (
              <div
                key={alert.alert_id}
                className="flex items-center justify-between p-3 bg-red-600/10 border border-red-500 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-semibold text-red-300">{alert.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <span className="px-3 py-1 bg-red-500 text-white rounded text-xs font-bold">
                  {alert.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}