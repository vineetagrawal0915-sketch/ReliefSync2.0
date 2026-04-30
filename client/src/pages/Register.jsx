import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Phone, ShieldCheck, AlertCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ngo',
    contact: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 font-sans">
      <div className="max-w-2xl w-full bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-700 overflow-hidden relative z-50 pointer-events-auto">
        <div className="bg-gradient-to-br from-primary-600 to-blue-700 p-10 text-center text-white relative">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">ReliefSync</h1>
          <p className="mt-2 text-blue-100 font-bold uppercase tracking-widest text-xs opacity-80">Mission Coordination Portal</p>
        </div>
        
        <div className="p-10 md:p-12">
          <h2 className="text-2xl font-black text-white mb-8 tracking-tight">Create your account</h2>
          
          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center gap-3 animate-pulse">
              <AlertCircle size={20} />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Full Name / Org Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                  <input
                    type="text"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 text-white font-medium transition-all"
                    placeholder="e.g. Save Life NGO"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Contact Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                  <input
                    type="tel"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 text-white font-medium transition-all"
                    placeholder="+1 234 567 890"
                    value={formData.contact}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                  <input
                    type="email"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 text-white font-medium transition-all"
                    placeholder="name@agency.org"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Account Role</label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                  <select
                    className="w-full pl-12 pr-10 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 text-white font-medium transition-all appearance-none cursor-pointer"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="ngo">NGO Worker</option>
                    <option value="admin">Government Admin</option>
                    <option value="volunteer">Field Volunteer</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Secure Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                <input
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 text-white font-medium transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-5 rounded-[1.25rem] font-black uppercase tracking-widest text-sm hover:bg-primary-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary-900/20 active:scale-[0.98] disabled:opacity-50 mt-4"
            >
              {loading ? 'Registering...' : (
                <>
                  <UserPlus size={20} />
                  Initialize Profile
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
            Already registered?{' '}
            <Link to="/login" className="text-primary-500 hover:text-primary-400 transition-colors ml-1">
              Sign in to portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
