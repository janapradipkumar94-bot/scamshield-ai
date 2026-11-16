import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  ShieldAlert,
  AlertTriangle,
  ShieldCheck,
  Trash2,
  Search,
  AlertCircle,
  PlusCircle,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total_scans: 0,
    high_risk_scans: 0,
    suspicious_scans: 0,
    low_risk_scans: 0,
    scans_by_type: { text: 0, url: 0, email: 0 }
  });
  const [scans, setScans] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [selectedScan, setSelectedScan] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getHistory();
      setStats(data.stats);
      setScans(data.scans || []);
    } catch (err) {
      setError(err.message || 'Failed to load user scan telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteScan = async (scanId) => {
    if (!window.confirm('Are you sure you want to delete this scan record?')) return;
    setDeletingId(scanId);
    try {
      await api.deleteScan(scanId);
      setScans((prev) => prev.filter((s) => s.id !== scanId));
      const updated = await api.getHistory();
      setStats(updated.stats);
      if (selectedScan?.id === scanId) setSelectedScan(null);
    } catch (err) {
      alert(err.message || 'Could not delete scan record');
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Delete all scan records? This action cannot be undone.')) return;
    try {
      await api.clearAllHistory();
      setScans([]);
      setStats({
        total_scans: 0,
        high_risk_scans: 0,
        suspicious_scans: 0,
        low_risk_scans: 0,
        scans_by_type: { text: 0, url: 0, email: 0 }
      });
      setSelectedScan(null);
    } catch (err) {
      alert(err.message || 'Could not clear history');
    }
  };

  // Filtered scans
  const filteredScans = scans.filter((scan) => {
    const matchesRisk =
      filterRisk === 'all' ||
      (filterRisk === 'high' && scan.risk_level === 'High Risk') ||
      (filterRisk === 'suspicious' && scan.risk_level === 'Suspicious') ||
      (filterRisk === 'low' && scan.risk_level === 'Low Risk');

    const summaryStr = (scan.input_summary || '').toLowerCase();
    const typeStr = (scan.input_type || '').toLowerCase();
    const reasonsStr = (scan.reasons || []).join(' ').toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesQuery = !query || summaryStr.includes(query) || typeStr.includes(query) || reasonsStr.includes(query);

    return matchesRisk && matchesQuery;
  });

  // Recharts Chart Data
  const chartData = [
    { name: 'High Risk Threats', value: stats.high_risk_scans, color: '#f43f5e' },
    { name: 'Suspicious Content', value: stats.suspicious_scans, color: '#f59e0b' },
    { name: 'Low Risk / Safe', value: stats.low_risk_scans, color: '#10b981' },
  ].filter((d) => d.value > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-600/15 via-cyan-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-xs font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Cyber Defense Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Security Intelligence <span className="text-gradient-cyan">Dashboard</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Welcome back, <span className="text-white font-bold">{user?.full_name || 'Defender'}</span>. Review your saved detections, scam frequency patterns, and personal threat telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/scan"
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Threat Scan</span>
            </Link>
            {scans.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3.5 py-2.5 bg-slate-900/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700/60 hover:border-rose-500/40 rounded-xl text-xs font-medium transition flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-5 rounded-2xl glass-panel-hover border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 tracking-wide">Total Scans Run</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white tracking-tight">{stats.total_scans}</p>
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Saved in personal history</span>
          </span>
        </div>

        <div className="p-5 rounded-2xl glass-panel-hover border border-rose-500/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-300 tracking-wide">High Risk Threats</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-rose-400 tracking-tight">{stats.high_risk_scans}</p>
          <span className="text-[11px] text-rose-300/70">Critical scam indicators found</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel-hover border border-amber-500/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 tracking-wide">Suspicious Content</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-amber-400 tracking-tight">{stats.suspicious_scans}</p>
          <span className="text-[11px] text-amber-300/70">Potential social engineering flags</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel-hover border border-emerald-500/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-300 tracking-wide">Low Risk / Safe</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-400 tracking-tight">{stats.low_risk_scans}</p>
          <span className="text-[11px] text-emerald-300/70">Benign patterns verified</span>
        </div>
      </div>

      {/* Analytics Chart & Threat Vectors */}
      {stats.total_scans > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-6 sm:p-7 rounded-3xl glass-panel border border-white/5 lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white tracking-wide">Threat Severity Breakdown</h3>
              <span className="text-xs text-slate-400">AI Risk Distribution</span>
            </div>
            <div className="h-64 w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={6}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#070b14" strokeWidth={3} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0c1222',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#f8fafc',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-500">
                  No scan distribution available yet.
                </div>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-7 rounded-3xl glass-panel border border-white/5 flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide mb-5">Scans by Threat Vector</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1.5 font-medium">
                    <span className="text-slate-300">SMS / Text Messages</span>
                    <span className="font-bold text-cyan-400">{stats.scans_by_type?.text || 0}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                      style={{
                        width: `${stats.total_scans ? ((stats.scans_by_type?.text || 0) / stats.total_scans) * 100 : 0}%`
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5 font-medium">
                    <span className="text-slate-300">Website URLs / Links</span>
                    <span className="font-bold text-cyan-400">{stats.scans_by_type?.url || 0}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full transition-all duration-500"
                      style={{
                        width: `${stats.total_scans ? ((stats.scans_by_type?.url || 0) / stats.total_scans) * 100 : 0}%`
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5 font-medium">
                    <span className="text-slate-300">Emails Analyzed</span>
                    <span className="font-bold text-cyan-400">{stats.scans_by_type?.email || 0}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full transition-all duration-500"
                      style={{
                        width: `${stats.total_scans ? ((stats.scans_by_type?.email || 0) / stats.total_scans) * 100 : 0}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-blue-950/20 border border-blue-500/20 rounded-2xl text-[11px] text-slate-300 leading-relaxed">
              <strong className="text-cyan-400 block mb-0.5">Privacy Guaranteed:</strong>
              Records store only the security assessment and a privacy-preserving SHA-256 fingerprint. You can purge your scan records at any time.
            </div>
          </div>
        </div>
      )}

      {/* Scans List / Search & Filter Section */}
      <div className="glass-panel border border-white/5 rounded-3xl p-6 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Saved Scan Records</h3>
            <p className="text-xs text-slate-400">Search, filter, and inspect your analyzed threat detections</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search history content..."
                className="w-full bg-[#070b14] border border-slate-700/80 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>

            {/* Risk Filter */}
            <div className="relative">
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="bg-[#070b14] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="all">All Threat Levels</option>
                <option value="high">High Risk Only</option>
                <option value="suspicious">Suspicious Only</option>
                <option value="low">Low Risk Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* List of Scans */}
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
            <span className="text-xs text-slate-400">Retrieving security records...</span>
          </div>
        ) : filteredScans.length === 0 ? (
          <div className="py-14 text-center space-y-3.5">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-white">No scan history records found</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              When you scan suspicious messages, emails, or links with the "Save result" box checked, they will appear here.
            </p>
            <Link
              to="/scan"
              className="inline-flex items-center gap-1.5 mt-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-600/20 transition"
            >
              <span>Scan Something Now</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/5">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#060a14] text-slate-400 font-semibold border-b border-white/5">
                <tr>
                  <th className="py-3.5 px-4">Threat Level</th>
                  <th className="py-3.5 px-4">Risk Score</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Content / Hash</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {filteredScans.map((scan) => {
                  let badgeClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25';
                  if (scan.risk_level === 'High Risk') {
                    badgeClass = 'text-rose-400 bg-rose-500/10 border-rose-500/25';
                  } else if (scan.risk_level === 'Suspicious') {
                    badgeClass = 'text-amber-400 bg-amber-500/10 border-amber-500/25';
                  }

                  return (
                    <tr key={scan.id} className="hover:bg-white/[0.02] transition">
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full font-bold border text-[11px] ${badgeClass}`}>
                          {scan.risk_level}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        {scan.risk_score} / 100
                      </td>
                      <td className="py-3.5 px-4 capitalize text-slate-400 font-medium">
                        {scan.input_type}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs truncate font-mono text-slate-300 text-[11px]">
                        {scan.input_summary}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {new Date(scan.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedScan(scan)}
                          className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-cyan-300 hover:text-white rounded-lg font-medium text-[11px] transition"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleDeleteScan(scan.id)}
                          disabled={deletingId === scan.id}
                          className="p-1 text-slate-500 hover:text-rose-400 rounded transition"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Individual Scan Details Modal */}
      {selectedScan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Scan Record Details</h3>
              </div>
              <button
                onClick={() => setSelectedScan(null)}
                className="text-slate-400 hover:text-white text-xs px-2.5 py-1 rounded-lg bg-slate-800 transition"
              >
                Close
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center p-3.5 bg-[#060a14] rounded-2xl border border-white/5">
                <span className="text-slate-400 font-medium">Verdict:</span>
                <span className="font-extrabold text-white text-sm">
                  {selectedScan.risk_level} ({selectedScan.risk_score}/100)
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-1">Content / Hash Fingerprint:</span>
                <p className="p-3 bg-[#060a14] border border-white/5 rounded-2xl text-slate-300 font-mono text-[11px] break-all">
                  {selectedScan.input_summary}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-1.5">Detected Threat Signals:</span>
                <ul className="space-y-1.5">
                  {(selectedScan.reasons || []).map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-300 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-1">Protective Recommendation:</span>
                <p className="p-3.5 bg-blue-950/30 border border-blue-500/20 rounded-2xl text-blue-200 text-xs leading-relaxed">
                  {selectedScan.recommendation}
                </p>
              </div>

              <div className="text-[11px] text-slate-500 pt-1">
                Recorded on: {new Date(selectedScan.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
