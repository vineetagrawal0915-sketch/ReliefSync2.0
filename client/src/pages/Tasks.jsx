import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Search, Filter, MapPin, Tag, Flag, Clock, CheckCircle } from 'lucide-react';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    location: '',
    type: 'food',
    priority: 'medium',
    latitude: 0,
    longitude: 0
  });

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/api/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         task.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesType = filterType === 'all' || task.type === filterType;
    return matchesSearch && matchesPriority && matchesType;
  });

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token')?.trim();
      if (!token) {
        alert('Your session has timed out. Please log in again.');
        return;
      }
      
      await axios.post('/api/tasks', newTask, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      fetchTasks();
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Connection error. Please try again.';
      alert(`Mission Deployment Failed: ${errorMsg}`);
    }
  };

  const handleClaim = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/tasks/${taskId}/claim`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to claim task');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/50';
      case 'medium': return 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/50';
      default: return 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 outline-none transition-all dark:text-slate-100"
            placeholder="Search tasks by title or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-3 relative">
          <div className="relative">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all ${
                showFilters || filterPriority !== 'all' || filterType !== 'all'
                ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 text-primary-600'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Filter size={18} />
              <span className="font-bold text-sm text-inherit">Filters</span>
            </button>

            {showFilters && (
              <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-5 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Priority</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['all', 'high', 'medium', 'low'].map(p => (
                        <button
                          key={p}
                          onClick={() => setFilterPriority(p)}
                          className={`px-3 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                            filterPriority === p 
                            ? 'bg-primary-600 text-white' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Resource Type</label>
                    <select
                      className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 outline-none"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                    >
                      <option value="all">All Types</option>
                      <option value="food">Food</option>
                      <option value="medical">Medical</option>
                      <option value="shelter">Shelter</option>
                      <option value="rescue">Rescue</option>
                    </select>
                  </div>
                  <button 
                    onClick={() => { setFilterPriority('all'); setFilterType('all'); setShowFilters(false); }}
                    className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-all"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {user?.role === 'admin' && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-200 dark:shadow-none active:scale-95 transition-all"
            >
              <Plus size={20} />
              <span>Create Task</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <div key={task.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex justify-between items-start mb-5">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">
                <Clock size={12} />
                {new Date(task.created_at).toLocaleDateString()}
              </span>
            </div>
            
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{task.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">{task.description}</p>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-sm font-bold text-slate-500 dark:text-slate-400">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <MapPin size={16} className="text-primary-500" />
                </div>
                {task.location}
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-slate-500 dark:text-slate-400">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <Tag size={16} className="text-primary-500" />
                </div>
                <span className="capitalize">{task.type}</span>
              </div>
            </div>

            <div className="pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              {task.assigned_ngo_id ? (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-black text-[10px] uppercase tracking-widest">
                  <CheckCircle size={14} />
                  Claimed by {task.profiles?.name || 'NGO'}
                </div>
              ) : (
                <>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Unassigned</span>
                  {user?.role === 'ngo' && (
                    <button
                      onClick={() => handleClaim(task.id)}
                      className="px-5 py-2 bg-primary-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-700 shadow-lg shadow-primary-200 dark:shadow-none transition-all active:scale-95"
                    >
                      Claim Task
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 rounded-3xl w-full max-w-xl p-8 shadow-2xl border border-slate-800 animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-black text-white mb-8 tracking-tight">Create Mission Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Task Title</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 text-white font-medium transition-all"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  placeholder="e.g. Emergency Medical Supply Delivery"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Detailed Description</label>
                <textarea
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 text-white font-medium transition-all h-32 resize-none"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Provide essential details for responders..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Operational Location</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 text-white font-medium transition-all"
                    value={newTask.location}
                    onChange={(e) => setNewTask({...newTask, location: e.target.value})}
                    placeholder="e.g. Coastal Sector B"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Task Category</label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 text-white font-medium transition-all appearance-none cursor-pointer"
                      value={newTask.type}
                      onChange={(e) => setNewTask({...newTask, type: e.target.value})}
                    >
                      <option value="rescue">Rescue Operations</option>
                      <option value="medical">Medical Support</option>
                      <option value="food">Food & Water</option>
                      <option value="shelter">Emergency Shelter</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Priority Level</label>
                <div className="flex gap-4">
                  {['low', 'medium', 'high'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewTask({...newTask, priority: p})}
                      className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                        newTask.priority === p 
                        ? (p === 'high' ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : p === 'medium' ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20' : 'bg-green-600 text-white shadow-lg shadow-green-900/20')
                        : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-10 py-3 bg-primary-600 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-primary-500 shadow-xl shadow-primary-900/20 transition-all active:scale-[0.98]"
                >
                  Deploy Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
