import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { LayoutDashboard, Users, BookMarked, CalendarCheck, LogOut, IndianRupee, Menu, X } from 'lucide-react';

import ManageStudents from './ManageStudents';
import ManageBatches from './ManageBatches';
import ManageAttendance from './ManageAttendance';
import ManageMarks from './ManageMarks';
import ManageFees from './ManageFees';

const AdminDashboard = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Overview' },
    { path: '/admin/students', icon: Users, label: 'Students' },
    { path: '/admin/batches', icon: BookMarked, label: 'Batches' },
    { path: '/admin/attendance', icon: CalendarCheck, label: 'Attendance' },
    { path: '/admin/marks', icon: BookMarked, label: 'Marksheets' },
    { path: '/admin/fees', icon: IndianRupee, label: 'Fees' },
  ].filter(item => {
    if (user?.role === 'manager' && item.path === '/admin/batches') return false;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-900 relative">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-800/95 md:bg-slate-800/50 backdrop-blur-xl md:backdrop-blur-none border-r border-slate-700 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Mobile close button inside sidebar */}
        <button 
          className="md:hidden absolute top-6 right-4 text-slate-400 hover:text-white"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X className="w-6 h-6" />
        </button>
        <div className="p-6">
          <h2 className="text-2xl font-bold bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            {user?.role === 'manager' ? 'Manager Panel' : 'Admin Panel'}
          </h2>
          <p className="text-slate-400 text-sm mt-1">{user?.email}</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto flex flex-col relative w-full h-screen">
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50 sticky top-0 z-30 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="text-slate-300 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              {user?.role === 'manager' ? 'Manager Panel' : 'Admin Panel'}
            </h1>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-8 relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 max-w-6xl mx-auto">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/students" element={<ManageStudents />} />
            <Route path="/batches" element={<ManageBatches />} />
            <Route path="/attendance" element={<ManageAttendance />} />
            <Route path="/marks" element={<ManageMarks />} />
            <Route path="/fees" element={<ManageFees />} />
          </Routes>
        </div>
        </div>
      </main>
    </div>
  );
};

const Overview = () => {
  const [stats, setStats] = useState({ totalStudents: '--', activeBatches: '--', todayAttendance: '--' });

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/admin/overview`, { withCredentials: true })
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card flex flex-col items-center justify-center p-8">
          <Users className="w-12 h-12 text-blue-400 mb-4" />
          <h3 className="text-xl font-medium text-slate-300">Total Students</h3>
          <p className="text-4xl font-bold text-white mt-2">{stats.totalStudents}</p>
        </div>
        <div className="glass-card flex flex-col items-center justify-center p-8">
          <BookMarked className="w-12 h-12 text-indigo-400 mb-4" />
          <h3 className="text-xl font-medium text-slate-300">Active Batches</h3>
          <p className="text-4xl font-bold text-white mt-2">{stats.activeBatches}</p>
        </div>
        <div className="glass-card flex flex-col items-center justify-center p-8">
          <CalendarCheck className="w-12 h-12 text-purple-400 mb-4" />
          <h3 className="text-xl font-medium text-slate-300">Today's Attendance</h3>
          <p className="text-4xl font-bold text-white mt-2">{stats.todayAttendance}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
