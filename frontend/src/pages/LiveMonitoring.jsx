import React, { useState } from 'react';
import { Maximize2, AlertTriangle, VideoOff, Volume2, VolumeX } from 'lucide-react';
import Modal from '../components/Modal';
import clsx from 'clsx';

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
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-end">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium",
            soundEnabled
              ? "bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20"
              : "bg-dark-800 border-dark-700 text-gray-400 hover:bg-dark-700"
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

          return (
            <div
              key={camera.id}
              onClick={() => setSelectedCamera(camera)}
              className={clsx(
                "group relative aspect-video bg-black rounded-xl overflow-hidden cursor-pointer border transition-all duration-300",
                isAlerting
                  ? "border-red-500 shadow-neon-red animate-pulse-slow"
                  : "border-dark-700 hover:border-primary-500 hover:shadow-lg"
              )}
            >
              {/* Video Feed */}
              {frame ? (
                <img
                  src={`data:image/jpeg;base64,${frame}`}
                  alt={camera.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 bg-dark-800">
                  <VideoOff className="w-10 h-10 mb-2 opacity-50" />
                  <span className="text-xs font-medium uppercase tracking-wider">No Signal</span>
                </div>
              )}

              {/* Overlays */}
              <div className="absolute inset-x-0 top-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div>
                  <h3 className="text-white font-bold text-sm">{camera.name}</h3>
                  <p className="text-xs text-gray-300">{camera.location}</p>
                </div>
                <div className={clsx("w-2 h-2 rounded-full", isAlerting ? "bg-red-500 animate-ping" : "bg-green-500")} />
              </div>

              {/* Alert Overlay */}
              {isAlerting && (
                <div className="absolute inset-0 bg-red-500/20 backdrop-blur-[2px] flex items-center justify-center pointer-events-none animate-fade-in">
                  <div className="bg-black/60 px-4 py-2 rounded-lg flex items-center gap-2 border border-red-500/50">
                    <AlertTriangle className="w-5 h-5 text-red-500 animate-bounce" />
                    <span className="text-red-500 font-bold tracking-wider">TAILGATING DETECTED</span>
                  </div>
                </div>
              )}

              {/* Hover Actions */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="bg-black/50 p-3 rounded-full backdrop-blur-sm transform scale-75 group-hover:scale-100 transition-transform">
                  <Maximize2 className="w-6 h-6 text-white" />
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
        <div className="aspect-video bg-black rounded-lg overflow-hidden relative border border-dark-700">
          {selectedCamera && cameraFrames[selectedCamera.id] ? (
            <img
              src={`data:image/jpeg;base64,${cameraFrames[selectedCamera.id]}`}
              alt="Fullscreen Feed"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <span className="animate-pulse">Loading live feed...</span>
            </div>
          )}
        </div>

        {/* Camera Details */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-dark-800 p-3 rounded-lg">
            <span className="text-xs text-gray-500 block">Status</span>
            <span className="text-green-400 font-medium text-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online
            </span>
          </div>
          <div className="bg-dark-800 p-3 rounded-lg">
            <span className="text-xs text-gray-500 block">Stream Quality</span>
            <span className="text-white font-medium text-sm">1080p HD</span>
          </div>
          <div className="bg-dark-800 p-3 rounded-lg">
            <span className="text-xs text-gray-500 block">AI Detection</span>
            <span className="text-blue-400 font-medium text-sm">Active</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}