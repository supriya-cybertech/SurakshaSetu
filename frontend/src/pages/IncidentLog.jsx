import React, { useState, useEffect } from 'react';
import { Filter, Download, Eye, ChevronLeft, ChevronRight, Search, Calendar, AlertTriangle } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

export default function IncidentLog() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({ severity: 'all', type: 'all' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIncident, setSelectedIncident] = useState(null);

  // Fetch Real Data
  useEffect(() => {
    fetch('http://localhost:8000/api/incidents')
      .then(res => res.json())
      .then(data => {
        setIncidents(data.incidents || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch incidents:", err);
        setLoading(false);
      });
  }, []);

  const filteredData = incidents.filter(inc => {
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
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Incident Logs</h2>
          <p className="text-gray-500 text-sm mt-1">Review and manage security alerts</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2 bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm">
            <Calendar className="w-4 h-4" /> Date Range
          </button>
          <button className="btn-primary flex items-center gap-2 shadow-lg shadow-primary-500/20">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="glass-card p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="search"
              autoComplete="off"
              placeholder="Search by ID or type..."
              className="input-field pl-10 w-full md:w-72 bg-white border-gray-200 focus:ring-primary-500 rounded-xl"
            />
          </div>

          <select
            className="input-field bg-white border-gray-200 focus:ring-primary-500 rounded-xl w-full md:w-48"
            value={filters.severity}
            onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
          >
            <option value="all">All Severities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>

        <button className="btn-secondary flex items-center gap-2 text-gray-600 hover:text-primary-600">
          <Filter className="w-4 h-4" /> Advanced Filters
        </button>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/80 border-b border-gray-200 backdrop-blur-sm">
              <tr>
                <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Incident ID</th>
                <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Severity</th>
                <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Camera</th>
                <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {paginatedData.map((incident) => (
                <tr key={incident.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-5 font-mono text-gray-600 font-medium">#{incident.id}</td>
                  <td className="p-5">
                    <span className="font-semibold text-gray-900">{incident.type.replace('_', ' ')}</span>
                  </td>
                  <td className="p-5">
                    <StatusBadge status={incident.severity} />
                  </td>
                  <td className="p-5 text-gray-600">{incident.camera}</td>
                  <td className="p-5 text-gray-500 text-sm">
                    {new Date(incident.timestamp).toLocaleString(undefined, {
                      year: 'numeric', month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                  <td className="p-5 text-right">
                    <button
                      onClick={() => setSelectedIncident(incident)}
                      className="text-gray-400 hover:text-primary-600 p-2 rounded-lg hover:bg-primary-50 transition-all transform hover:scale-110"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-lg font-medium text-gray-900">No incidents found</p>
                      <p className="text-sm">Try adjusting your filters or search query.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <span className="text-sm text-gray-500 font-medium">
            Showing <span className="text-gray-900">{paginatedData.length}</span> of <span className="text-gray-900">{filteredData.length}</span> entries
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-600 shadow-sm transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-700 font-medium px-4">
              Page <span className="text-primary-600">{currentPage}</span> of {totalPages || 1}
            </span>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-600 shadow-sm transition-all"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-video bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center relative overflow-hidden group shadow-inner">
                {/* Mock Image Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="text-gray-400 z-10 font-medium flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> Snapshot Unavailable
                </span>
                <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1.5 text-xs font-bold rounded-lg text-white z-20 shadow-lg border border-white/10">
                  CONFIDENCE: 98.2%
                </span>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-primary-200 transition-colors">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Incident Type</span>
                  <p className="text-lg font-bold text-gray-900 mt-1">{selectedIncident.type}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-primary-200 transition-colors">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Severity Level</span>
                  <div className="mt-2">
                    <StatusBadge status={selectedIncident.severity} />
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-primary-200 transition-colors">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Time & Location</span>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selectedIncident.camera}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{new Date(selectedIncident.timestamp).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setSelectedIncident(null)}
              >
                Close Details
              </button>
              <button className="btn-primary shadow-lg shadow-primary-500/20">
                Mark as Resolved
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}