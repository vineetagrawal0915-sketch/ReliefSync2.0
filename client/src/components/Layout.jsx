import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Package, 
  FileText, 
  Map as MapIcon, 
  LogOut,
  User,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Tasks', href: '/tasks', icon: ClipboardList },
    { name: 'Resources', href: '/resources', icon: Package },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Map View', href: '/map', icon: MapIcon },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* Sidebar */}
      <aside className={`bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col shadow-sm`}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && <span className="text-2xl font-black text-primary-600 dark:text-primary-400 tracking-tight">ReliefSync</span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center p-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 dark:shadow-none font-bold' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-400'} />
                {isSidebarOpen && <span className="ml-3">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 space-y-2 border-t border-slate-200 dark:border-slate-800">
          {/* Theme Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center w-full p-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            {isSidebarOpen && <span className="ml-3">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>

          <div className="flex items-center p-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold border border-primary-200 dark:border-primary-800">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User size={20} />}
            </div>
            {isSidebarOpen && (
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{user?.name || 'User'}</p>
                <p className="text-[10px] text-primary-600 dark:text-primary-400 font-bold uppercase tracking-wider">{user?.role || 'Volunteer'}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col">
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4 sticky top-0 z-10 flex justify-between items-center transition-colors">
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {navigation.find(n => n.href === location.pathname)?.name || 'Page'}
          </h1>
          <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
             <span>System Status: Online</span>
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
