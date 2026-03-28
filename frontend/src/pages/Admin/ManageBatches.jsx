import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2 } from 'lucide-react';

const ManageBatches = () => {
  const [batches, setBatches] = useState([]);
  const [name, setName] = useState('');
  const [standard, setStandard] = useState('');
  const [schedule, setSchedule] = useState('');

  useEffect(() => { fetchBatches(); }, []);

  const fetchBatches = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/batches`, { withCredentials: true });
      setBatches(res.data);
    } catch (err) { console.error(err); }
  };

  const handleAddBatch = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/batches`, { name, standard, schedule }, { withCredentials: true });
      setName(''); setStandard(''); setSchedule('');
      fetchBatches();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this batch and all associated records?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/batches/${id}`, { withCredentials: true });
        fetchBatches();
      } catch (err) { console.error(err); }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white tracking-tight mb-8">Manage Batches</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="glass-card">
            <h3 className="text-xl font-semibold text-white mb-4">Create New Batch</h3>
            <form onSubmit={handleAddBatch} className="space-y-4">
              <input type="text" placeholder="Batch Name (e.g. Maths 10A)" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-slate-800/50 border border-slate-700 rounded p-3 text-white" />
              <input type="text" placeholder="Standard (e.g. 10th)" value={standard} onChange={(e) => setStandard(e.target.value)} required className="w-full bg-slate-800/50 border border-slate-700 rounded p-3 text-white" />
              <input type="text" placeholder="Schedule (e.g. Mon-Wed 4PM)" value={schedule} onChange={(e) => setSchedule(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700 rounded p-3 text-white" />
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 p-3 rounded text-white font-medium flex items-center justify-center">
                <Plus className="w-5 h-5 mr-2" /> Add Batch
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="glass-card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[500px]">
                <thead className="bg-slate-800/50 text-slate-300 border-b border-white/10 uppercase text-sm">
                  <tr>
                    <th className="p-4 px-6 font-medium">Name</th><th className="p-4 px-6 font-medium">Standard</th><th className="p-4 px-6 font-medium">Schedule</th><th className="p-4 px-6 font-medium">Students Enrolled</th><th className="p-4 px-6 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {batches.map(b => (
                    <tr key={b._id} className="hover:bg-white/5">
                      <td className="p-4 px-6 text-white font-medium">{b.name}</td><td className="p-4 px-6">{b.standard}</td><td className="p-4 px-6 text-slate-400">{b.schedule}</td>
                      <td className="p-4 px-6 text-slate-400">{b.studentCount || 0}</td>
                      <td className="p-4 px-6 text-right">
                        <button onClick={() => handleDelete(b._id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ManageBatches;
