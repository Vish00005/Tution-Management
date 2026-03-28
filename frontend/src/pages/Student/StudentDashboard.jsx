import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { LogOut, User as UserIcon, Calendar, CheckCircle, TrendingUp, BookOpen, IndianRupee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [marksFilter, setMarksFilter] = useState('All');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/student/stats`, { withCredentials: true });
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-blue-400">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <nav className="relative z-10 glass border-b border-white/5 px-6 py-4 flex justify-between items-center sticky top-0">
        <div className="flex items-center gap-3">
          <div className="bg-linear-to-br from-blue-500 to-indigo-600 p-2 rounded-xl">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Student Portal</h1>
            <p className="text-xs text-slate-400">Delta Institute</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-indigo-400">{stats?.studentDetails?.batch?.name || 'No Batch Assigned'}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/20"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        <div className="glass-card mb-8 bg-linear-to-r from-blue-600/20 to-indigo-600/20 border-blue-500/20">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name}! 👋</h2>
          <p className="text-slate-300">Here's your academic progress at a glance.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1 space-y-8">
            <div className="glass-card flex flex-col items-start justify-center p-6">
              <h3 className="font-semibold text-white flex items-center mb-4">
                <BookOpen className="w-5 h-5 mr-2 text-indigo-400" />
                Enrolled Subjects
              </h3>
              <div className="flex flex-wrap gap-2">
                {(stats?.studentDetails?.subjects?.length > 0 ? stats.studentDetails.subjects : ["Maths", "Science", "English", "Social Studies"]).map((sub, i) => (
                  <span key={i} className="px-3 py-1 bg-white/5 text-slate-300 rounded border border-white/10 text-sm shadow-inner">{sub}</span>
                ))}
              </div>
            </div>

            <div className="glass-card flex flex-col items-center justify-center py-10">
              <div className="relative">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="56" className="stroke-slate-700" strokeWidth="12" fill="none" />
                  <circle 
                    cx="64" cy="64" r="56" 
                    className="stroke-indigo-500 transition-all duration-1000 ease-out" 
                    strokeWidth="12" fill="none" 
                    strokeDasharray="351.85" 
                    strokeDashoffset={351.85 - (351.85 * (stats?.attendanceSummary?.percentage || 0)) / 100}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-3xl font-bold text-white">{stats?.attendanceSummary?.percentage || 0}%</span>
                </div>
              </div>
              <h3 className="mt-6 text-lg font-medium text-slate-300 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-indigo-400" />
                Overall Attendance
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                {stats?.attendanceSummary?.present} / {stats?.attendanceSummary?.total} Classes Attended
              </p>
            </div>

            <div className="glass-card flex flex-col items-center justify-center p-6 space-y-2">
              <h3 className="font-semibold text-white flex items-center mb-2 w-full">
                <IndianRupee className="w-5 h-5 mr-2 text-indigo-400" />
                Financial Overview
              </h3>
              <div className="w-full space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Total Assigned Fees:</span>
                  <span className="font-medium text-white">₹{stats?.studentDetails?.totalFees || 0}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Amount Paid:</span>
                  <span className="font-medium text-emerald-400">₹{stats?.studentDetails?.feesPaid || 0}</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 mt-2 overflow-hidden border border-white/5">
                  <div className="bg-linear-to-r from-emerald-500 to-emerald-400 h-1.5" 
                       style={{ width: `${stats?.studentDetails?.totalFees ? Math.min((stats.studentDetails.feesPaid / stats.studentDetails.totalFees) * 100, 100) : 0}%` }}></div>
                </div>
                <div className="flex justify-between items-center text-sm pt-3 border-t border-white/10 mt-3">
                  <span className="text-slate-400">Outstanding Dues:</span>
                  <span className="font-bold text-yellow-400">
                    ₹{Math.max((stats?.studentDetails?.totalFees || 0) - (stats?.studentDetails?.feesPaid || 0), 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="glass-card p-0 overflow-hidden">
              <div className="p-5 border-b border-white/10 bg-black/20">
                <h3 className="font-semibold text-white flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-emerald-400" />
                  Recent Attendance
                </h3>
              </div>
              <div className="p-2">
                {stats?.attendanceRecords?.length === 0 ? (
                  <p className="p-4 text-center text-slate-500 text-sm">No recent records</p>
                ) : (
                  <ul className="divide-y divide-white/5">
                    {stats?.attendanceRecords?.slice(0, 5).map((rec, i) => (
                      <li key={i} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg transition-colors">
                        <span className="text-slate-300 text-sm">{new Date(rec.date).toLocaleDateString()}</span>
                        <span className={`text-xs px-2 py-1 rounded border overflow-hidden ${rec.status === 'present' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                          {rec.status.toUpperCase()}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="glass-card p-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white flex items-center">
                    <TrendingUp className="w-6 h-6 mr-3 text-blue-400" />
                    Performance Records
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">Recent test and exam results</p>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 max-w-full md:max-w-[50%]">
                  {['All', ...new Set(stats?.marksRecords?.map(m => m.subject || 'General') || [])].map(sub => (
                    <button 
                      key={sub} 
                      onClick={() => setMarksFilter(sub)}
                      className={`px-3 py-1 rounded text-sm font-medium whitespace-nowrap transition-colors ${marksFilter === sub ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'}`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {stats?.marksRecords?.length > 0 ? (
                  (marksFilter === 'All' ? stats.marksRecords : stats.marksRecords.filter(m => (m.subject || 'General') === marksFilter)).length > 0 ? (
                    (marksFilter === 'All' ? stats.marksRecords : stats.marksRecords.filter(m => (m.subject || 'General') === marksFilter)).map((mark, i) => {
                      const percentage = (mark.marksObtained / mark.totalMarks) * 100;
                      let clr = 'from-emerald-500 to-emerald-400';
                      if(percentage < 40) clr = 'from-red-500 to-red-400';
                      else if(percentage < 70) clr = 'from-yellow-500 to-yellow-400';
                      return (
                        <div key={i} className="bg-slate-800/50 rounded-xl p-5 border border-white/5 hover:border-white/10 transition-colors">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-lg font-medium text-white">{mark.title}</h4>
                              <p className="text-xs text-slate-400 mt-1">
                                <span className="font-semibold text-indigo-400 mr-2">{mark.subject || 'General'}</span>
                                {new Date(mark.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right flex flex-col items-end">
                              {mark.isAbsent ? (
                                <span className="text-2xl font-bold tracking-tight text-red-400">Absent</span>
                              ) : (
                                <span className="text-2xl font-bold tracking-tight text-white">{mark.marksObtained} <span className="text-sm font-normal text-slate-400">/ {mark.totalMarks}</span></span>
                              )}
                              {mark.rank && (
                                <span className="text-xs font-semibold text-indigo-400 mt-1 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">Rank: {mark.rank} / {mark.classSize}</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="w-full bg-slate-900 rounded-full h-2.5 mb-2 overflow-hidden border border-white/5">
                            <div className={`h-full bg-linear-to-r ${clr}`} style={{ width: `${percentage}%` }}></div>
                          </div>
                          <p className="text-slate-300 text-sm mt-3 pt-3 border-t border-white/5">
                            <span className="text-slate-500 mr-2">Remarks:</span>
                            {mark.remarks || "No remarks"}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      No marks found for this subject.
                    </div>
                  )
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    No marks available yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
