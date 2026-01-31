import React, { useState, useEffect } from 'react';
import { Filter, Download, Eye, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

// Mock Data
const mockIncidents = Array.from({ length: 20 }, (_, i) => ({
  id: `INC-${1000 + i}`,
  type: i % 3 === 0 ? 'TAILGATING' : i % 2 === 0 ? 'UNAUTHORIZED_ENTRY' : 'WEAPON_DETECTED',
  severity: i % 5 === 0 ? 'HIGH' : i % 3 === 0 ? 'MEDIUM' : 'LOW',
  timestamp: new Date(Date.now() - i * 3600000).toISOString(),
  camera: `Camera ${(i % 4) + 1}`,
  status: i % 4 === 0 ? 'RESOLVED' : 'OPEN',
}));

export default function IncidentLog() {
  const [filters, setFilters] = useState({ severity: 'all', type: 'all' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIncident, setSelectedIncident] = useState(null);

  const filteredData = mockIncidents.filter(inc => {
    if (filters.severity !== 'all' && inc.severity !== filters.severity) return false;
    if (filters.type !== 'all' && inc.type !== filters.type) return false;
    return true;
  });

  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="glass-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search incidents..."
              className="input-field pl-10 w-full md:w-64"
            />
          </div>

          <select
            className="input-field"
            value={filters.severity}
            onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
          >
            <option value="all">All Severities</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-dark-800 text-gray-400 text-xs uppercase tracking-wider border-b border-white/5">
              <tr>
                <th className="p-4 font-medium">Incident ID</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Severity</th>
                <th className="p-4 font-medium">Camera</th>
                <th className="p-4 font-medium">Timestamp</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {paginatedData.map((incident) => (
                <tr key={incident.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4 font-mono text-gray-300">{incident.id}</td>
                  <td className="p-4 font-medium text-white">{incident.type.replace('_', ' ')}</td>
                  <td className="p-4">
                    <StatusBadge status={incident.severity} />
                  </td>
                  <td className="p-4 text-gray-400">{incident.camera}</td>
                  <td className="p-4 text-gray-400">
                    {new Date(incident.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedIncident(incident)}
                      className="text-primary-400 hover:text-primary-300 p-2 rounded hover:bg-white/10 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Showing {paginatedData.length} of {filteredData.length} entries
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-2 rounded-lg border border-dark-700 disabled:opacity-50 hover:bg-white/5 text-gray-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-white px-2">Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-2 rounded-lg border border-dark-700 disabled:opacity-50 hover:bg-white/5 text-gray-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedIncident}
        onClose={() => setSelectedIncident(null)}
        title="Incident Details"
        size="lg"
      >
        {selectedIncident && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-video bg-black rounded-lg border border-dark-700 flex items-center justify-center relative overflow-hidden group">
                {/* Mock Image Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 to-transparent" />
                <span className="text-gray-500 z-10">Snapshot Unavailable</span>
                <span className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 text-xs rounded text-white z-20">
                  CONFIDENCE: 98.2%
                </span>
              </div>
              <div className="space-y-4">
                <div className="glass-panel p-4 rounded-lg">
                  <span className="text-xs text-gray-500 uppercase">Incident Type</span>
                  <p className="text-lg font-bold text-white mt-1">{selectedIncident.type}</p>
                </div>
                <div className="glass-panel p-4 rounded-lg">
                  <span className="text-xs text-gray-500 uppercase">Severity</span>
                  <div className="mt-1">
                    <StatusBadge status={selectedIncident.severity} />
                  </div>
                </div>
                <div className="glass-panel p-4 rounded-lg">
                  <span className="text-xs text-gray-500 uppercase">Time & Location</span>
                  <p className="text-sm text-gray-300 mt-1">{selectedIncident.camera}</p>
                  <p className="text-sm text-gray-400">{new Date(selectedIncident.timestamp).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
              <button className="btn-secondary" onClick={() => setSelectedIncident(null)}>Close</button>
              <button className="btn-primary">Mark as Resolved</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}