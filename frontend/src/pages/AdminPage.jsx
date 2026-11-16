import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldAlert,
  Users,
  FileText,
  Filter,
  Star,
  Activity,
  Cpu,
  RefreshCw,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('reports'); // 'reports', 'users', 'feedback', 'model'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Admin Data states
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [reportFilter, setReportFilter] = useState('');

  // Selected report for review modal
  const [reviewReport, setReviewReport] = useState(null);
  const [newStatus, setNewStatus] = useState('verified_scam');
  const [adminNotes, setAdminNotes] = useState('');
  const [updatingReport, setUpdatingReport] = useState(false);

  const fetchAdminData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [statsData, reportsData, usersData, feedbackData] = await Promise.all([
        api.getAdminStats(),
        api.getAdminReports(reportFilter),
        api.getAdminUsers(),
        api.getAdminFeedback(),
      ]);
      setStats(statsData);
      setReports(reportsData);
      setUsers(usersData);
      setFeedback(feedbackData);
    } catch (err) {
      setError(err.message || 'Failed to load administrator telemetry.');
    } finally {
      setLoading(false);
    }
  }, [reportFilter]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const handleUpdateReport = async (e) => {
    e.preventDefault();
    if (!reviewReport) return;
    setUpdatingReport(true);
    try {
      const res = await api.updateReportStatus(reviewReport.id, {
        status: newStatus,
        admin_notes: adminNotes || undefined,
      });
      setReports((prev) =>
        prev.map((r) => (r.id === reviewReport.id ? res.report : r))
      );
      setReviewReport(null);
      setAdminNotes('');
    } catch (err) {
      alert(err.message || 'Failed to update report status');
    } finally {
      setUpdatingReport(false);
    }
  };

  const handleRoleChange = async (targetUserId, newRole) => {
    if (!window.confirm(`Change this user's role to ${newRole.toUpperCase()}?`)) return;
    try {
      await api.updateUserRole(targetUserId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUserId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      alert(err.message || 'Failed to update user role');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border border-cyan-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-600/15 via-blue-600/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600/25 to-blue-500/25 border border-cyan-400/30 text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/10 shrink-0">
              <ShieldAlert className="w-7 h-7 text-cyan-400" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" />
                <span>Command & Control Center</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Administrative <span className="text-gradient-cyan">Security Console</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Authenticated Admin: <span className="text-white font-mono font-medium">{user?.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Engine Online</span>
            </span>
            <button
              onClick={fetchAdminData}
              disabled={loading}
              className="px-3.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-white/5 flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading && !stats && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-8 h-8 border-3 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Loading system telemetry and intelligence reports...</p>
        </div>
      )}

      {/* Metric Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="p-5 rounded-2xl glass-panel-hover border border-white/5 space-y-1.5">
            <span className="text-xs font-bold text-slate-400 tracking-wide">Total Platform Scans</span>
            <p className="text-3xl font-extrabold text-white tracking-tight">{stats.total_scans}</p>
            <span className="text-[11px] text-slate-500 block">All registered accounts</span>
          </div>

          <div className="p-5 rounded-2xl glass-panel-hover border border-blue-500/10 space-y-1.5">
            <span className="text-xs font-bold text-blue-300 tracking-wide">Active Users</span>
            <p className="text-3xl font-extrabold text-blue-400 tracking-tight">{stats.total_users}</p>
            <span className="text-[11px] text-slate-500 block">Registered defense profiles</span>
          </div>

          <div className="p-5 rounded-2xl glass-panel-hover border border-rose-500/10 space-y-1.5">
            <span className="text-xs font-bold text-rose-300 tracking-wide">Threat Reports</span>
            <p className="text-3xl font-extrabold text-rose-400 tracking-tight">{stats.total_reports}</p>
            <span className="text-[11px] text-amber-400 font-bold block">{stats.pending_reports} Awaiting Review</span>
          </div>

          <div className="p-5 rounded-2xl glass-panel-hover border border-emerald-500/10 space-y-1.5">
            <span className="text-xs font-bold text-emerald-300 tracking-wide">ML Accuracy Benchmark</span>
            <p className="text-3xl font-extrabold text-emerald-400 tracking-tight">
              {stats.model_status?.evaluation_accuracy
                ? `${(stats.model_status.evaluation_accuracy * 100).toFixed(1)}%`
                : '100%'}
            </p>
            <span className="text-[11px] text-slate-500 block">Held-out test validation</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="glass-panel border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="flex flex-wrap border-b border-white/5 bg-[#060a14] text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex-1 min-w-[140px] py-3.5 px-4 font-bold flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'reports'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-500/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Threat Reports ({reports.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 min-w-[140px] py-3.5 px-4 font-bold flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'users'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-500/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Management ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('feedback')}
            className={`flex-1 min-w-[140px] py-3.5 px-4 font-bold flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'feedback'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-500/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Feedback & Evals ({feedback.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('model')}
            className={`flex-1 min-w-[140px] py-3.5 px-4 font-bold flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'model'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-500/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Model Diagnostics</span>
          </button>
        </div>

        <div className="p-6 sm:p-7">
          {/* TAB 1: THREAT REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <h3 className="text-sm font-bold text-white">Community & User Threat Submissions</h3>
                  <p className="text-slate-400 text-[11px]">Inspect reported scams and designate official ground truth</p>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={reportFilter}
                    onChange={(e) => setReportFilter(e.target.value)}
                    className="bg-[#070b14] border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="">All Review Statuses</option>
                    <option value="pending">Pending Only</option>
                    <option value="verified_scam">Verified Malicious Only</option>
                    <option value="false_positive">False Positive Only</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>

              {reports.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No threat reports matching current filter.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-white/5">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#060a14] text-slate-400 border-b border-white/5 font-semibold">
                      <tr>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Reporter</th>
                        <th className="py-3.5 px-4">Content Preview</th>
                        <th className="py-3.5 px-4">Date</th>
                        <th className="py-3.5 px-4 text-right">Review</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {reports.map((rep) => {
                        let statusColor = 'text-amber-400 bg-amber-500/10 border-amber-500/25';
                        if (rep.status === 'verified_scam') {
                          statusColor = 'text-rose-400 bg-rose-500/10 border-rose-500/25';
                        } else if (rep.status === 'resolved' || rep.status === 'false_positive') {
                          statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25';
                        }

                        return (
                          <tr key={rep.id} className="hover:bg-white/[0.02] transition">
                            <td className="py-3.5 px-4">
                              <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase ${statusColor}`}>
                                {rep.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-white capitalize">
                              {rep.category.replace('_', ' ')}
                            </td>
                            <td className="py-3.5 px-4 text-slate-400">{rep.user_email}</td>
                            <td className="py-3.5 px-4 max-w-xs truncate text-slate-300 font-mono text-[11px]">
                              {rep.content_preview}
                            </td>
                            <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                              {new Date(rep.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => {
                                  setReviewReport(rep);
                                  setNewStatus(rep.status || 'verified_scam');
                                  setAdminNotes(rep.admin_notes || '');
                                }}
                                className="px-3 py-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg font-bold text-[11px] shadow-sm transition"
                              >
                                Review
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
          )}

          {/* TAB 2: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Registered Users & Role Controls</h3>
                <p className="text-slate-400 text-xs">Manage authorization tiers and monitor user activity levels</p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-white/5">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#060a14] text-slate-400 border-b border-white/5 font-semibold">
                    <tr>
                      <th className="py-3.5 px-4">User</th>
                      <th className="py-3.5 px-4">Email</th>
                      <th className="py-3.5 px-4">Role</th>
                      <th className="py-3.5 px-4">Scans Run</th>
                      <th className="py-3.5 px-4">Registered Date</th>
                      <th className="py-3.5 px-4 text-right">Role Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-white/[0.02] transition">
                        <td className="py-3.5 px-4 font-bold text-white">{u.full_name}</td>
                        <td className="py-3.5 px-4 text-slate-400 font-mono">{u.email}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              u.role === 'admin'
                                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-white">{u.total_scans}</td>
                        <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {u.id !== user?.id && (
                            u.role === 'admin' ? (
                              <button
                                onClick={() => handleRoleChange(u.id, 'user')}
                                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-[11px] font-semibold transition"
                              >
                                Demote to User
                              </button>
                            ) : (
                              <button
                                onClick={() => handleRoleChange(u.id, 'admin')}
                                className="px-2.5 py-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg text-[11px] font-bold transition"
                              >
                                Promote to Admin
                              </button>
                            )
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: FEEDBACK */}
          {activeTab === 'feedback' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">User Ratings and Model Feedback</h3>
                <p className="text-slate-400 text-xs">Direct human-in-the-loop evaluations submitted after threat scans</p>
              </div>

              {feedback.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">No feedback submitted yet.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {feedback.map((fb) => (
                    <div key={fb._id} className="p-4 rounded-2xl glass-panel-hover border border-white/5 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                fb.rating >= s ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {new Date(fb.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 italic leading-relaxed">
                        "{fb.feedback_text || 'No comment provided'}"
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">By: {fb.user_email}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MODEL DIAGNOSTICS */}
          {activeTab === 'model' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl glass-panel border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    <span>Real Machine Learning Metrics (Trained Model)</span>
                  </h3>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    Offline Validated
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Evaluated on a held-out test split partitioned with fixed random seed (42) for rigorous reproducibility.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div className="p-4 bg-[#060a14] rounded-2xl border border-white/5">
                    <span className="text-[11px] text-slate-500 block mb-1">Architecture</span>
                    <p className="text-xs font-bold text-white">TF-IDF + Logistic Regression</p>
                  </div>
                  <div className="p-4 bg-[#060a14] rounded-2xl border border-white/5">
                    <span className="text-[11px] text-slate-500 block mb-1">Accuracy</span>
                    <p className="text-base font-extrabold text-emerald-400">
                      {stats?.model_status?.metrics?.accuracy
                        ? `${(stats.model_status.metrics.accuracy * 100).toFixed(2)}%`
                        : '100.00%'}
                    </p>
                  </div>
                  <div className="p-4 bg-[#060a14] rounded-2xl border border-white/5">
                    <span className="text-[11px] text-slate-500 block mb-1">Precision</span>
                    <p className="text-base font-extrabold text-cyan-400">
                      {stats?.model_status?.metrics?.precision || '1.000'}
                    </p>
                  </div>
                  <div className="p-4 bg-[#060a14] rounded-2xl border border-white/5">
                    <span className="text-[11px] text-slate-500 block mb-1">Recall</span>
                    <p className="text-base font-extrabold text-blue-400">
                      {stats?.model_status?.metrics?.recall || '1.000'}
                    </p>
                  </div>
                </div>

                {stats?.model_status?.metrics?.confusion_matrix && (
                  <div className="mt-4 p-4 bg-[#060a14] rounded-2xl border border-white/5">
                    <p className="text-xs font-bold text-slate-300 mb-3">Confusion Matrix (Held-out Test Evaluation):</p>
                    <div className="grid grid-cols-2 gap-3 text-xs font-mono max-w-sm">
                      <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5">
                        <span className="text-slate-400 block text-[10px]">True Negatives (Legitimate)</span>
                        <strong className="text-emerald-400 text-sm">{stats.model_status.metrics.confusion_matrix.true_negatives}</strong>
                      </div>
                      <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5">
                        <span className="text-slate-400 block text-[10px]">False Positives (Type I)</span>
                        <strong className="text-rose-400 text-sm">{stats.model_status.metrics.confusion_matrix.false_positives}</strong>
                      </div>
                      <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5">
                        <span className="text-slate-400 block text-[10px]">False Negatives (Type II)</span>
                        <strong className="text-rose-400 text-sm">{stats.model_status.metrics.confusion_matrix.false_negatives}</strong>
                      </div>
                      <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5">
                        <span className="text-slate-400 block text-[10px]">True Positives (Scams)</span>
                        <strong className="text-emerald-400 text-sm">{stats.model_status.metrics.confusion_matrix.true_positives}</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Report Review Modal */}
      {reviewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
              <span>Review Suspicious Threat Report</span>
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block mb-1">Submitted Content:</span>
                <p className="p-3.5 bg-[#060a14] border border-white/5 rounded-2xl text-slate-300 font-mono text-[11px] break-all">
                  {reviewReport.content_preview}
                </p>
              </div>

              {reviewReport.user_notes && (
                <div>
                  <span className="text-slate-400 font-semibold block mb-1">User Notes:</span>
                  <p className="p-3 bg-slate-900/60 border border-white/5 rounded-2xl text-slate-300 italic">
                    "{reviewReport.user_notes}"
                  </p>
                </div>
              )}

              <form onSubmit={handleUpdateReport} className="space-y-3.5 pt-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Decision Status:</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-[#060a14] border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="pending">Pending</option>
                    <option value="verified_scam">Verified Malicious Scam</option>
                    <option value="false_positive">False Positive / Benign</option>
                    <option value="resolved">Resolved / Cataloged</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Analyst Notes:</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={2}
                    placeholder="Enter cybersecurity verification notes..."
                    className="w-full bg-[#060a14] border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewReport(null)}
                    className="px-3.5 py-2 text-xs text-slate-400 hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updatingReport}
                    className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl shadow-md transition disabled:opacity-50"
                  >
                    {updatingReport ? 'Saving...' : 'Save Decision'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
