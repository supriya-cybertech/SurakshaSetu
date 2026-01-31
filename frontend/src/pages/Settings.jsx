import React, { useState } from 'react';
import { Save, RefreshCw, Shield, Camera, Bell, Lock } from 'lucide-react';
import clsx from 'clsx';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('ai');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const tabs = [
    { id: 'ai', label: 'AI Configuration', icon: Shield },
    { id: 'camera', label: 'Camera Setup', icon: Camera },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Lock },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Settings Navigation */}
      <div className="lg:col-span-1 space-y-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "w-full flex items-center px-4 py-3 rounded-lg transition-all text-sm font-medium",
                isActive
                  ? "bg-primary-600 shadow-lg text-white"
                  : "bg-dark-800 text-gray-400 hover:bg-dark-700 hover:text-white"
              )}
            >
              <Icon className="w-4 h-4 mr-3" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Settings Content */}
      <div className="lg:col-span-3 glass-card p-6 min-h-[500px] flex flex-col">
        <h2 className="text-xl font-bold text-white mb-6 border-b border-white/5 pb-4">
          {tabs.find(t => t.id === activeTab)?.label}
        </h2>

        <div className="flex-1 space-y-8 animate-enter">
          {activeTab === 'ai' && (
            <>
              {/* Threshold Sliders */}
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-300">Confidence Threshold (0.75)</span>
                  <input type="range" className="w-full mt-2 accent-primary-500 bg-dark-700 h-2 rounded-lg appearance-none cursor-pointer" />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-300">Tailgating Time Window (3.0s)</span>
                  <input type="range" className="w-full mt-2 accent-primary-500 bg-dark-700 h-2 rounded-lg appearance-none cursor-pointer" />
                </label>
              </div>

              {/* Toggles */}
              <div className="bg-white/5 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-white">Face Recognition</h4>
                    <p className="text-xs text-gray-400">Identify registered residents automatically</p>
                  </div>
                  <ToggleButton defaultChecked />
                </div>
                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <div>
                    <h4 className="font-medium text-white">Weapon Detection</h4>
                    <p className="text-xs text-gray-400">Trigger high alerts on weapon identification</p>
                  </div>
                  <ToggleButton defaultChecked />
                </div>
              </div>
            </>
          )}

          {activeTab === 'camera' && (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center justify-between bg-dark-900 p-3 rounded-lg border border-dark-700">
                  <div className="flex items-center gap-3">
                    <Camera className="text-gray-500 w-5 h-5" />
                    <div>
                      <p className="text-sm font-medium text-white">Camera Feed {i}</p>
                      <p className="text-xs text-gray-500">RTSP://192.168.1.10{i}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs bg-green-500/10 text-green-400 rounded border border-green-500/20">Active</span>
                </div>
              ))}
              <button className="w-full py-2 border-2 border-dashed border-dark-700 text-gray-400 rounded-lg hover:border-primary-500 hover:text-primary-500 transition-colors text-sm">
                + Add New Stream
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-white/5">
          <button className="btn-secondary flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Reset
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function ToggleButton({ defaultChecked }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <button
      onClick={() => setChecked(!checked)}
      className={clsx(
        "w-11 h-6 rounded-full transition-colors relative",
        checked ? "bg-primary-600" : "bg-dark-700"
      )}
    >
      <span className={clsx(
        "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200",
        checked ? "left-6" : "left-1"
      )} />
    </button>
  );
}