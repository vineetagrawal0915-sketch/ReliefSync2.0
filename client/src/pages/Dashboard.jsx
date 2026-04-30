import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  ClipboardList,
  Package,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Map as MapIcon
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  if (!user) return null;
  const [stats, setStats] = useState({
    totalTasks: 0,
    activeTasks: 0,
    completedTasks: 0,
    totalResources: 0,
    totalReports: 0
  });





  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [tasksRes, resourcesRes, reportsRes] = await Promise.all([
          axios.get('/api/tasks').catch(() => ({ data: [] })),
          axios.get('/api/resources').catch(() => ({ data: [] })),
          axios.get('/api/reports').catch(() => ({ data: [] }))
        ]);

        const tasks = tasksRes?.data || [];
        const resources = resourcesRes?.data || [];
        const reports = reportsRes?.data || [];

        setStats({
          totalTasks: tasks.length,
          activeTasks: tasks.filter(t => t?.status === 'in_progress').length,
          completedTasks: tasks.filter(t => t?.status === 'completed').length,
          totalResources: resources.length,
          totalReports: reports.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const quickActions = [
    { name: 'Create Task', icon: ClipboardList, path: '/tasks', role: 'admin' },
    { name: 'Update Stock', icon: Package, path: '/resources', role: 'ngo' },
    { name: 'Send Report', icon: FileText, path: '/reports', role: 'ngo' },
    { name: 'View Map', icon: MapIcon, path: '/map' },
  ].filter(action => !action.role || action.role === user?.role);

  const cards = [
    { name: 'Active Tasks', value: stats.activeTasks, icon: Clock, color: 'bg-blue-500' },
    { name: 'Completed', value: stats.completedTasks, icon: CheckCircle, color: 'bg-green-500' },
    { name: 'Resources', value: stats.totalResources, icon: Package, color: 'bg-amber-500' },
    { name: 'Reports', value: stats.totalReports, icon: FileText, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-8">
      {/* ... cards section ... */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.name} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{card.name}</p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">{card.value}</h3>
              </div>
              <div className={`${card.color} p-4 rounded-2xl text-white shadow-lg shadow-current/20 group-hover:scale-110 transition-transform`}>
                <card.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-6">Critical Tasks</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl">
              <AlertCircle className="text-red-600 dark:text-red-400 mt-1" size={20} />
              <div>
                <h4 className="text-sm font-bold text-red-900 dark:text-red-300">Medical Supplies Needed</h4>
                <p className="text-xs text-red-700 dark:text-red-400 mt-1">Region: Coastal Sector A | Priority: High</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-xl">
              <AlertCircle className="text-amber-600 dark:text-amber-400 mt-1" size={20} />
              <div>
                <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300">Food Distribution Duplication</h4>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">Warning: Two NGOs reporting in same zone.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.name}
                onClick={() => navigate(action.path)}
                className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-primary-600 dark:hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all group"
              >
                <action.icon className="mb-2 text-slate-400 group-hover:text-white" />
                <span className="text-xs font-bold uppercase tracking-wide">{action.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
