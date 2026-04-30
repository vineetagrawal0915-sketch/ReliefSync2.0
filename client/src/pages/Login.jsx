import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 font-sans">
      <div className="max-w-md w-full bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-700 overflow-hidden relative z-50 pointer-events-auto">
        <div className="bg-gradient-to-br from-primary-600 to-blue-700 p-12 text-center text-white relative">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">ReliefSync</h1>
          <p className="mt-2 text-blue-100 font-bold uppercase tracking-widest text-xs opacity-80">Mission Coordination Portal</p>
        </div>
        
        <div className="p-10 md:p-12">
          <h2 className="text-2xl font-black text-white mb-8 tracking-tight">System Login</h2>
          
          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center gap-3 animate-pulse">
              <AlertCircle size={20} />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Personnel Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 text-white font-medium transition-all"
                  placeholder="name@agency.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Access Credentials</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                <input
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 text-white font-medium transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-5 rounded-[1.25rem] font-black uppercase tracking-widest text-sm hover:bg-primary-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary-900/20 active:scale-[0.98] disabled:opacity-50 mt-4"
            >
              {loading ? 'Authenticating...' : (
                <>
                  <LogIn size={20} />
                  Access System
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
            New personnel?{' '}
            <Link to="/register" className="text-primary-500 hover:text-primary-400 transition-colors ml-1">
              Initialize profile
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
