import React, { useState } from 'react';
import { Maximize2, AlertTriangle, VideoOff, Volume2, VolumeX, Shield, CheckCircle } from 'lucide-react';
import Modal from '../components/Modal';
import clsx from 'clsx';
import TestControlPanel from '../components/TestControlPanel';

export default function LiveMonitoring({ cameraFrames = {}, alertingCameras = {} }) {
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const cameras = [
    { id: 1, name: 'Entry Gate', location: 'Main Entrance' },
    { id: 2, name: 'Lobby', location: 'Ground Floor' },
    { id: 3, name: 'Access Point', location: 'Stairwell' },
    { id: 4, name: 'Parking', location: 'Level B1' },
    { id: 0, name: 'Webcam', location: 'Local System' },
    { id: 5, name: 'Perimeter', location: 'North Wall' }, // Placeholder for 6th slot
  ];

  return (
    <div className="space-y-8">
      <TestControlPanel />

      {/* Header Controls */}
      <div className="flex justify-end">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-sm font-medium shadow-sm border",
            soundEnabled
              ? "bg-status-success/10 border-status-success/20 text-status-success hover:bg-status-success/20"
              : "bg-white border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50"
          )}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          {soundEnabled ? 'Alert Sound: ON' : 'Alert Sound: OFF'}
        </button>
      </div>

      {/* 3x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cameras.map((camera) => {
          const frame = cameraFrames[camera.id];
          const alert = alertingCameras[camera.id];
          const isAlerting = !!alert;
          // Check severity for styling
          const isPending = isAlerting && alert.incident_type === 'VERIFICATION_PENDING';
          const isVerified = isAlerting && alert.incident_type === 'GUEST_VERIFIED';

          let borderClass = "border-gray-200 hover:border-primary-400 hover:shadow-lg";
          let shadowClass = "shadow-soft";

          if (isPending) {
            borderClass = "border-status-warning ring-4 ring-status-warning/20";
            shadowClass = "shadow-lg shadow-status-warning/20";
          } else if (isVerified) {
            borderClass = "border-status-success ring-4 ring-status-success/20";
            shadowClass = "shadow-lg shadow-status-success/20";
          } else if (isAlerting) {
            borderClass = "border-status-danger ring-4 ring-status-danger/20";
            shadowClass = "shadow-lg shadow-status-danger/30";
          }

          return (
            <div
              key={camera.id}
              onClick={() => setSelectedCamera(camera)}
              className={clsx(
                "group relative bg-white rounded-2xl overflow-hidden cursor-pointer border transition-all duration-300 transform hover:-translate-y-1",
                borderClass, shadowClass
              )}
            >
              {/* Aspect Ratio Container */}
              <div className="aspect-video relative bg-black/5 overflow-hidden">
                {/* Video Feed */}
                {frame ? (
                  <img
                    src={`data:image/jpeg;base64,${frame}`}
                    alt={camera.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-100">
                    <VideoOff className="w-10 h-10 mb-2 opacity-30" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">No Signal</span>
                  </div>
                )}

                {/* Status Indicator Dot */}
                <div className="absolute top-4 right-4 z-10">
                  <div className={clsx("w-3 h-3 rounded-full shadow-sm ring-2 ring-white",
                    isPending ? "bg-status-warning animate-pulse" :
                      isVerified ? "bg-status-success" :
                        isAlerting ? "bg-status-danger animate-ping" : "bg-status-success"
                  )} />
                </div>

                {/* Overlays */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div>
                    <p className="text-white/80 text-xs font-medium">{camera.location}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md p-1.5 rounded-lg">
                    <Maximize2 className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Alert Overlay */}
                {isAlerting && (
                  <div className={clsx(
                    "absolute inset-0 backdrop-blur-[2px] flex items-center justify-center pointer-events-none animate-fade-in z-20",
                    isVerified ? "bg-status-success/10" : isPending ? "bg-status-warning/10" : "bg-status-danger/10"
                  )}>
                    <div className={clsx(
                      "bg-white/90 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-xl flex flex-col items-center gap-3 border pointer-events-auto transform transition-all duration-300",
                      isVerified ? "border-status-success/30" : isPending ? "border-status-warning/30" : "border-status-danger/30"
                    )}>
                      <div className="flex items-center gap-2">
                        {isVerified ? <CheckCircle className="w-6 h-6 text-status-success" /> : <AlertTriangle className={clsx("w-6 h-6 animate-bounce", isPending ? "text-status-warning" : "text-status-danger")} />}
                        <span className={clsx(
                          "font-bold tracking-wide text-sm",
                          isVerified ? "text-status-success" : isPending ? "text-status-warning" : "text-status-danger"
                        )}>
                          {isVerified ? "GUEST VERIFIED" : isPending ? "VERIFICATION PENDING" : "TAILGATING DETECTED"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer (Metadata) */}
              <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-gray-900 font-bold text-sm">{camera.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Camera ID: #{camera.id}</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase">HD</span>
                  <span className="px-2 py-1 bg-primary-50 text-primary-600 text-[10px] font-bold rounded uppercase">AI</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fullscreen Modal */}
      <Modal
        isOpen={!!selectedCamera}
        onClose={() => setSelectedCamera(null)}
        title={selectedCamera?.name || 'Camera Feed'}
        size="xl"
      >
        <div className="aspect-video bg-black rounded-2xl overflow-hidden relative border border-gray-200 shadow-2xl">
          {selectedCamera && cameraFrames[selectedCamera.id] ? (
            <img
              src={`data:image/jpeg;base64,${cameraFrames[selectedCamera.id]}`}
              alt="Fullscreen Feed"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 bg-gray-50">
              <span className="animate-pulse font-medium">Loading live stream...</span>
            </div>
          )}
        </div>

        {/* Camera Details */}
        <div className="mt-6 grid grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <span className="text-xs text-gray-500 font-medium block mb-1">Status</span>
            <span className="text-status-success font-bold text-sm flex items-center gap-1.5">
              <span className="w-2 h-2 bg-status-success rounded-full shadow-glow-lime"></span> Online
            </span>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <span className="text-xs text-gray-500 font-medium block mb-1">Stream Quality</span>
            <span className="text-gray-900 font-bold text-sm">1080p HD • 60fps</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <span className="text-xs text-gray-500 font-medium block mb-1">AI Detection</span>
            <span className="text-primary-600 font-bold text-sm flex items-center gap-1.5">
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span> Active
            </span>
          </div>
        </div>
      </Modal>
    </div>
  );
}