import React, { useState, useEffect } from 'react';
import { AlertTriangle, ChevronDown, Download, Eye } from 'lucide-react';

export default function IncidentLog() {
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchIncidents = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/incidents?limit=100');
      if (response.ok) {
        const data = await response.json();
        setIncidents(data.incidents || []);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching incidents:', error);
      // Use mock data
      setIncidents(getMockIncidents());
      setLoading(false);
    }
  };

  const getMockIncidents = () => [
    {
      id: 1,
      type: 'TAILGATING',
      severity: 'HIGH',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      camera_id: 3,
      persons_detected: 3,
      persons_authorized: 1,
      details: '2 unauthorized persons detected crossing tripwire within 3 seconds',
      resolved: false
    },
    {
      id: 2,
      type: 'TAILGATING',
      severity: 'MEDIUM',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      camera_id: 1,
      persons_detected: 2,
      persons_authorized: 1,
      details: '1 unauthorized person detected',
      resolved: false
    },
    {
      id: 3,
      type: 'UNAUTHORIZED_ENTRY',
      severity: 'HIGH',
      timestamp: new Date(Date.now() - 1200000).toISOString(),
      camera_id: 3,
      persons_detected: 1,
      persons_authorized: 0,
      details: 'Unknown person attempted unauthorized entry',
      resolved: true
    }
  ];

  useEffect(() => {
    let filtered = incidents;

    if (severityFilter !== 'ALL') {
      filtered = filtered.filter(inc => inc.severity === severityFilter);
    }

    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(inc => inc.type === typeFilter);
    }

    setFilteredIncidents(filtered);
  }, [incidents, severityFilter, typeFilter]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'HIGH':
        return 'bg-red-600 text-white';
      case 'MEDIUM':
        return 'bg-yellow-600 text-black';
      case 'LOW':
        return 'bg-blue-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'TAILGATING':
        return '⚠️';
      case 'UNAUTHORIZED_ENTRY':
        return '🚫';
      case 'WEAPON_DETECTED':
        return '🔫';
      default:
        return '⚡';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-white">Incident Log</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Severity
          </label>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-4 py-2 bg-[#1a1a3e] border border-[#2a2a5e] rounded-lg text-white focus:outline-none focus:border-red-500"
          >
            <option value="ALL">All Severities</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Type
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 bg-[#1a1a3e] border border-[#2a2a5e] rounded-lg text-white focus:outline-none focus:border-red-500"
          >
            <option value="ALL">All Types</option>
            <option value="TAILGATING">Tailgating</option>
            <option value="UNAUTHORIZED_ENTRY">Unauthorized Entry</option>
            <option value="WEAPON_DETECTED">Weapon Detected</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Status
          </label>
          <select className="px-4 py-2 bg-[#1a1a3e] border border-[#2a2a5e] rounded-lg text-white focus:outline-none focus:border-red-500">
            <option>All</option>
            <option>Resolved</option>
            <option>Pending</option>
          </select>
        </div>

        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-all flex items-center gap-2 mt-6">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Incidents Table */}
      <div className="bg-[#0f0f23] rounded-lg border border-[#1a1a3e] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block w-8 h-8 rounded-full border-2 border-gray-600 border-t-blue-500 animate-spin"></div>
            <p className="text-gray-400 mt-2">Loading incidents...</p>
          </div>
        ) : filteredIncidents.length === 0 ? (
          <div className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-gray-600 mx-auto mb-2 opacity-50" />
            <p className="text-gray-400">No incidents found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1a1a3e] border-b border-[#2a2a5e]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Severity</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Camera</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">People</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a3e]">
                {filteredIncidents.map(incident => (
                  <tr
                    key={incident.id}
                    className="hover:bg-[#1a1a3e] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getTypeIcon(incident.type)}</span>
                        <span className="text-sm font-medium text-white">
                          {incident.type.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded text-xs font-bold ${getSeverityColor(incident.severity)}`}>
                        {incident.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {new Date(incident.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      Camera {incident.camera_id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <div className="flex items-center gap-1">
                        <span className="text-green-400 font-bold">{incident.persons_authorized}</span>
                        <span className="text-gray-400">/</span>
                        <span className="text-red-400 font-bold">{incident.persons_detected}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded text-xs font-medium ${
                        incident.resolved
                          ? 'bg-green-600/20 text-green-300'
                          : 'bg-red-600/20 text-red-300'
                      }`}>
                        {incident.resolved ? 'Resolved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedIncident(incident)}
                        className="flex items-center gap-2 px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500 rounded text-blue-300 text-sm font-medium transition-all"
                      >
                        <Eye className="w-4 h-4" />
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedIncident && (
        <div
          onClick={() => setSelectedIncident(null)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-[#0f0f23] rounded-lg border border-[#1a1a3e] p-6 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              {selectedIncident.type.replace(/_/g, ' ')}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 font-semibold">SEVERITY</p>
                  <span className={`inline-block px-3 py-1 rounded text-sm font-bold mt-1 ${getSeverityColor(selectedIncident.severity)}`}>
                    {selectedIncident.severity}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold">CAMERA</p>
                  <p className="text-lg font-bold text-white mt-1">Camera {selectedIncident.camera_id}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-semibold">TIMESTAMP</p>
                <p className="text-sm text-white mt-1">
                  {new Date(selectedIncident.timestamp).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-semibold">PEOPLE DETECTED</p>
                <div className="flex gap-4 mt-2">
                  <div className="flex-1 bg-green-600/20 rounded p-3">
                    <p className="text-xs text-green-300">Authorized</p>
                    <p className="text-2xl font-bold text-green-400">{selectedIncident.persons_authorized}</p>
                  </div>
                  <div className="flex-1 bg-red-600/20 rounded p-3">
                    <p className="text-xs text-red-300">Unauthorized</p>
                    <p className="text-2xl font-bold text-red-400">
                      {selectedIncident.persons_detected - selectedIncident.persons_authorized}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-semibold">DETAILS</p>
                <p className="text-sm text-gray-300 mt-2 bg-[#1a1a3e] p-3 rounded">
                  {selectedIncident.details}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-all">
                  Mark as Resolved
                </button>
                <button
                  onClick={() => setSelectedIncident(null)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}