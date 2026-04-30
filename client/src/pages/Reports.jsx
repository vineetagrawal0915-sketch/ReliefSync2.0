import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FileText, Plus, Users, Box, MapPin, Calendar } from 'lucide-react';

const Reports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newReport, setNewReport] = useState({
    location: '',
    people_helped: 0,
    resources_used: '',
    needs: ''
  });

  const fetchReports = async () => {
    try {
      const res = await axios.get('/api/reports');
      setReports(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/reports', newReport, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      fetchReports();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit report');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">Field Reports</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Submit and track rehabilitation progress</p>
        </div>
        {user?.role === 'ngo' && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-bold shadow-lg shadow-primary-200 dark:shadow-none transition-all active:scale-95"
          >
            <Plus size={20} />
            Submit Report
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reports.map((report) => (
          <div key={report.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-slate-100">{report.profiles?.name || 'NGO'}</h3>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    <Calendar size={12} />
                    {new Date(report.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-full border border-primary-100 dark:border-primary-800">
                <Users size={14} />
                {report.people_helped} helped
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
                <MapPin size={16} className="text-primary-500" />
                {report.location}
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                  <Box size={14} /> Resources Used
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{report.resources_used}</p>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                <div className="flex items-center gap-2 text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-2">
                   Pending Needs
                </div>
                <p className="text-sm text-amber-900 dark:text-amber-300 font-bold leading-relaxed">{report.needs}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-6">Submit Field Report</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Location</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 dark:text-slate-100 transition-all"
                  value={newReport.location}
                  onChange={(e) => setNewReport({...newReport, location: e.target.value})}
                  placeholder="e.g. Village Sector 4, School Ground"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">People Helped</label>
                <input
                  type="number"
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 dark:text-slate-100 transition-all"
                  value={newReport.people_helped}
                  onChange={(e) => setNewReport({...newReport, people_helped: parseInt(e.target.value)})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Resources Used</label>
                  <textarea
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 dark:text-slate-100 transition-all h-24"
                    value={newReport.resources_used}
                    onChange={(e) => setNewReport({...newReport, resources_used: e.target.value})}
                    placeholder="List items used..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Pending Needs</label>
                  <textarea
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 dark:text-slate-100 transition-all h-24"
                    value={newReport.needs}
                    onChange={(e) => setNewReport({...newReport, needs: e.target.value})}
                    placeholder="What is still required?"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-6 py-3 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-200 dark:shadow-none transition-all active:scale-95"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
