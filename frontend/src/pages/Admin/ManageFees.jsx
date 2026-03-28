import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { IndianRupee, Filter, CheckCircle, Clock, Search } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const ManageFees = () => {
  const { user } = useContext(AuthContext);
  const isManager = user?.role === 'manager';
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  
  // Batch Assignment State
  const [standard, setStandard] = useState('');
  const [batchId, setBatchId] = useState('');
  const [bulkFee, setBulkFee] = useState('');

  // Filtering State
  const [filter, setFilter] = useState('all'); // 'all', 'paid', 'pending'
  const [searchTerm, setSearchTerm] = useState('');
  
  // Payment Modal/Inline State
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');

  useEffect(() => {
    fetchBatches();
    fetchStudents();
  }, []);

  const fetchBatches = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/batches`, { withCredentials: true });
      setBatches(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/students`, { withCredentials: true });
      setStudents(res.data);
    } catch (err) { console.error(err); }
  };

  const handleAssignBulkFees = async (e) => {
    e.preventDefault();
    if (!batchId || !bulkFee) return;
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/fees/batch`, { batchId, totalFees: Number(bulkFee) }, { withCredentials: true });
      alert('Batch fees assigned successfully!');
      setStandard(''); setBatchId(''); setBulkFee('');
      fetchStudents();
    } catch (err) { alert('Failed to assign batch fees'); }
  };

  const handleLogPayment = async (student) => {
    if (!paymentAmount || Number(paymentAmount) <= 0) return;
    try {
      const updatedPaid = (student.feesPaid || 0) + Number(paymentAmount);
      await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/fees/student/${student._id}`, { totalFees: student.totalFees, feesPaid: updatedPaid }, { withCredentials: true });
      setEditingStudentId(null);
      setPaymentAmount('');
      fetchStudents();
    } catch (err) { alert('Failed to update student payment'); }
  };

  const filteredStudents = students.filter(s => {
    const searchMatch = !searchTerm || 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (s.standard && s.standard.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (s.batch && s.batch.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
    if (!searchMatch) return false;

    const total = s.totalFees || 0;
    const paid = s.feesPaid || 0;
    if (filter === 'paid') return total > 0 && paid >= total;
    if (filter === 'pending') return total > 0 && paid < total;
    return true;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-white tracking-tight mb-8">Manage Fees</h1>

      {!isManager && (
      <div className="glass-card mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Assign Batch Fees</h3>
        <form onSubmit={handleAssignBulkFees} className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          <select value={standard} onChange={e=>{setStandard(e.target.value); setBatchId('');}} className="flex-1 w-full bg-slate-800 border border-slate-700 text-white rounded p-3 appearance-none">
            <option value="" className="bg-slate-800 text-white">Select Standard</option>
            {[...new Set(batches.map(b => b.standard))].map(std => <option key={std} value={std} className="bg-slate-800 text-white">{std}</option>)}
          </select>
          <select value={batchId} onChange={e=>setBatchId(e.target.value)} disabled={!standard} className="flex-1 w-full bg-slate-800 border border-slate-700 text-white rounded p-3 disabled:opacity-50 appearance-none">
            <option value="" className="bg-slate-800 text-white">{standard ? "Select Batch Letter" : "Select Standard First"}</option>
            {batches.filter(b => b.standard === standard).map(b => <option key={b._id} value={b._id} className="bg-slate-800 text-white">{b.name}</option>)}
          </select>
          <div className="flex-1 w-full relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IndianRupee className="h-5 w-5 text-slate-400" />
            </div>
            <input type="number" placeholder="Total Base Fee" value={bulkFee} onChange={e=>setBulkFee(e.target.value)} required className="w-full pl-10 bg-slate-800 border border-slate-700 text-white rounded p-3" />
          </div>
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 p-3 px-6 rounded text-white font-medium whitespace-nowrap">
            Apply to Batch
          </button>
        </form>
      </div>
      )}

      <div className="glass-card p-0 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex flex-col md:flex-row justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded font-medium transition-colors ${filter === 'all' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}>
              <Filter className="w-4 h-4 inline mr-2"/>All Students
            </button>
            <button onClick={() => setFilter('pending')} className={`px-4 py-2 rounded font-medium transition-colors ${filter === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'text-slate-400 hover:text-white'}`}>
              <Clock className="w-4 h-4 inline mr-2"/>Pending Dues
            </button>
            <button onClick={() => setFilter('paid')} className={`px-4 py-2 rounded font-medium transition-colors ${filter === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white'}`}>
              <CheckCircle className="w-4 h-4 inline mr-2"/>Fully Paid
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search name/batch/standard..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="pl-9 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm w-full md:w-64 focus:outline-none focus:border-indigo-500 transition-colors" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead className="bg-slate-800/50 text-slate-300 text-sm uppercase">
              <tr>
                <th className="p-4 px-6 font-medium">Student</th>
                <th className="p-4 px-6 font-medium">Batch</th>
                <th className="p-4 px-6 font-medium">Total Fees</th>
                <th className="p-4 px-6 font-medium">Paid</th>
                <th className="p-4 px-6 font-medium">Status / Remaining</th>
                <th className="p-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
            {filteredStudents.map(student => {
              const total = student.totalFees || 0;
              const paid = student.feesPaid || 0;
              const remaining = total - paid;
              const isPaid = total > 0 && paid >= total;

              return (
                <tr key={student._id} className="text-slate-300 hover:bg-white/5">
                  <td className="p-4 px-6">
                    <div className="text-white font-medium">{student.name}</div>
                    <div className="text-xs text-slate-400">{student.standard}</div>
                  </td>
                  <td className="p-4 px-6 text-sm">{student.batch ? student.batch.name : 'Unassigned'}</td>
                  <td className="p-4 px-6 font-medium text-white">₹{total}</td>
                  <td className="p-4 px-6 font-medium text-emerald-400">₹{paid}</td>
                  <td className="p-4 px-6">
                    {total === 0 ? (
                      <span className="text-xs text-slate-500">Not Assigned</span>
                    ) : isPaid ? (
                      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded border border-emerald-500/20">Cleared</span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 text-xs rounded border border-yellow-500/20">₹{remaining} Pending</span>
                    )}
                  </td>
                  <td className="p-4 px-6 text-right">
                    {editingStudentId === student._id ? (
                      <div className="flex justify-end gap-2 items-center">
                        <input type="number" placeholder="Amount" value={paymentAmount} onChange={e=>setPaymentAmount(e.target.value)} className="w-24 bg-slate-800 border border-slate-700 text-white rounded p-1.5 text-sm" />
                        <button onClick={() => handleLogPayment(student)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded text-sm">Save</button>
                        <button onClick={() => {setEditingStudentId(null); setPaymentAmount('')}} className="text-slate-400 hover:text-white px-2 py-1.5 text-sm">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setEditingStudentId(student._id)} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
                        + Log Payment
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};
export default ManageFees;
