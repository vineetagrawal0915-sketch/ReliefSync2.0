import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Package, Plus, MapPin, History, Search } from 'lucide-react';

const Resources = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newResource, setNewResource] = useState({
    name: '',
    type: 'kits',
    quantity: 0,
    location: ''
  });

  const fetchResources = async () => {
    try {
      const res = await axios.get('/api/resources');
      setResources(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/resources', newResource, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      fetchResources();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update resources');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 dark:text-slate-100 transition-all"
            placeholder="Search resources..."
          />
        </div>
        {user?.role === 'ngo' && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-bold shadow-lg shadow-primary-200 dark:shadow-none transition-all active:scale-95"
          >
            <Plus size={20} />
            Update Inventory
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-colors duration-300">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Resource Name</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Type</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Quantity</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Location</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Provider</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Last Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {resources.map((res) => (
              <tr key={res.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{res.name}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-[10px] font-black uppercase tracking-wider">
                    {res.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${res.quantity > 10 ? 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400'}`}>
                    {res.quantity} units
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm font-medium flex items-center gap-2">
                  <MapPin size={14} className="text-primary-500" />
                  {res.location}
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-bold text-sm">{res.profiles?.name || 'NGO'}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[10px] font-bold">
                    <History size={14} />
                    {new Date(res.updated_at).toLocaleDateString()}
                  </div>
                </td>
              </tr>
            ))}
            {resources.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 italic">
                  No resources found in the global inventory.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-6">Update Inventory</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Item Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 dark:text-slate-100 transition-all"
                  value={newResource.name}
                  onChange={(e) => setNewResource({...newResource, name: e.target.value})}
                  placeholder="e.g. Rice Bags, First Aid Kits"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Type</label>
                  <select
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 dark:text-slate-100 transition-all appearance-none"
                    value={newResource.type}
                    onChange={(e) => setNewResource({...newResource, type: e.target.value})}
                  >
                    <option value="food">Food</option>
                    <option value="kits">Kits</option>
                    <option value="medicine">Medicine</option>
                    <option value="volunteers">Volunteers</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Quantity</label>
                  <input
                    type="number"
                    required
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 dark:text-slate-100 transition-all"
                    value={newResource.quantity}
                    onChange={(e) => setNewResource({...newResource, quantity: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Stock Location</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 dark:text-slate-100 transition-all"
                  value={newResource.location}
                  onChange={(e) => setNewResource({...newResource, location: e.target.value})}
                />
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
                  Update Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;
