import React, { useState } from 'react';
import { Save, RefreshCw, Shield, Camera, Bell, Lock, ToggleLeft, ToggleRight, Check } from 'lucide-react';
import clsx from 'clsx';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('ai');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const tabs = [
    { id: 'ai', label: 'AI Configuration', icon: Shield, desc: 'Model thresholds & detection settings' },
    { id: 'camera', label: 'Camera Setup', icon: Camera, desc: 'Manage reliable video streams' },
    { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Alert preferences & contacts' },
    { id: 'privacy', label: 'Privacy & Security', icon: Lock, desc: 'Data retention & access logs' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">System Settings</h2>
        <p className="text-gray-500 text-sm mt-1">Configure your security environment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1 space-y-3">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "w-full flex items-start px-4 py-4 rounded-xl transition-all text-left border",
                  isActive
                    ? "bg-white border-primary-500 shadow-md ring-1 ring-primary-100"
                    : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-200 text-gray-500"
                )}
              >
                <div className={clsx("p-2 rounded-lg mr-3 shrink-0 transition-colors", isActive ? "bg-primary-50 text-primary-600" : "bg-gray-100 text-gray-500")}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className={clsx("block text-sm font-bold", isActive ? "text-gray-900" : "text-gray-600")}>{tab.label}</span>
                  <span className="text-xs text-gray-400 mt-0.5 block">{tab.desc}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 glass-card p-8 min-h-[600px] flex flex-col relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-bl-full opacity-50 pointer-events-none" />

          <div className="relative z-10 flex-1 flex flex-col">
            <div className="border-b border-gray-100 pb-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900">{tabs.find(t => t.id === activeTab)?.label}</h3>
              <p className="text-gray-500 text-sm mt-1">Manage parameters for {tabs.find(t => t.id === activeTab)?.label.toLowerCase()}</p>
            </div>

            <div className="flex-1 space-y-8 animate-fade-in">
              {activeTab === 'ai' && (
                <>
                  {/* Threshold Sliders */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-sm font-bold text-gray-700">Confidence Threshold</label>
                        <span className="text-primary-600 font-bold bg-primary-50 px-2 py-1 rounded text-xs">75%</span>
                      </div>
                      <input type="range" className="w-full accent-primary-600 bg-gray-200 h-1.5 rounded-lg appearance-none cursor-pointer hover:bg-gray-300 transition-colors" />
                      <p className="text-xs text-gray-400 mt-2">Minimum confidence score required for positive identification.</p>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-sm font-bold text-gray-700">Tailgating Time Window</label>
                        <span className="text-primary-600 font-bold bg-primary-50 px-2 py-1 rounded text-xs">3.0s</span>
                      </div>
                      <input type="range" className="w-full accent-primary-600 bg-gray-200 h-1.5 rounded-lg appearance-none cursor-pointer hover:bg-gray-300 transition-colors" />
                      <p className="text-xs text-gray-400 mt-2">Maximum allowed time between authorized entry and door closure.</p>
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-primary-200 transition-colors hover:shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Shield className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">Face Recognition</h4>
                          <p className="text-xs text-gray-500">Identify registered residents automatically</p>
                        </div>
                      </div>
                      <ToggleButton defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-primary-200 transition-colors hover:shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                          <Shield className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">Weapon Detection</h4>
                          <p className="text-xs text-gray-500">Trigger high alerts on weapon identification</p>
                        </div>
                      </div>
                      <ToggleButton defaultChecked />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'camera' && (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 hover:border-primary-300 transition-all hover:shadow-md group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                          <Camera className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">Camera Feed {i}</p>
                          <p className="text-xs text-gray-400 font-mono mt-0.5">RTSP://192.168.1.10{i}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-1 text-xs bg-status-success/10 text-status-success font-bold rounded flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-status-success"></span> Online
                        </span>
                        <button className="text-gray-400 hover:text-gray-600 px-2">Edit</button>
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 font-medium rounded-xl hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 transition-all text-sm flex items-center justify-center gap-2">
                    <Camera className="w-4 h-4" /> Add New Camera Stream
                  </button>
                </div>
              )}

              {/* Placeholder for other tabs */}
              {(activeTab === 'notifications' || activeTab === 'privacy') && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Lock className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Configuration Locked</h3>
                  <p className="text-gray-500 max-w-xs mx-auto mt-2 text-sm">These settings are managed by the system administrator policy and cannot be changed.</p>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
              <button className="btn-secondary flex items-center gap-2">
                <RefreshCw className="w-4 h-4" /> Reset Defaults
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="btn-primary flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed min-w-[140px] justify-center shadow-lg shadow-primary-500/20"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
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
        "w-12 h-7 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
        checked ? "bg-primary-600" : "bg-gray-200"
      )}
    >
      <span className={clsx(
        "absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-200 shadow-sm",
        checked ? "left-6" : "left-1"
      )} />
    </button>
  );
}