import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageAttendance = () => {
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [standard, setStandard] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [history, setHistory] = useState([]);
  
  // History filters
  const [filterHistoryDate, setFilterHistoryDate] = useState('');
  const [filterHistoryStandard, setFilterHistoryStandard] = useState('');
  const [filterHistoryBatch, setFilterHistoryBatch] = useState('');
  
  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editRecords, setEditRecords] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/admin/batches`, { withCredentials: true }).then(res => setBatches(res.data));
    axios.get(`${import.meta.env.VITE_API_URL}/api/admin/students`, { withCredentials: true }).then(res => setStudents(res.data));
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/attendance`, { withCredentials: true });
      setHistory(res.data);
    } catch (err) { console.error('Failed to load attendance history', err); }
  };

  const handleBatchSelect = (batchId) => {
    setSelectedBatch(batchId);
    setAttendance({});
  };

  const handleMark = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const markAll = (status) => {
    const newAtt = {};
    const filtered = students.filter(s => s.batch && s.batch._id === selectedBatch);
    filtered.forEach(s => newAtt[s._id] = status);
    setAttendance(newAtt);
  };

  const handleSubmit = async () => {
    const filtered = students.filter(s => s.batch && s.batch._id === selectedBatch);
    const records = filtered.map(student => ({
      student: student._id,
      status: attendance[student._id] || 'absent'
    }));
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/attendance`, { date, batch: selectedBatch, records }, { withCredentials: true });
      alert('Attendance saved successfully!');
      fetchHistory();
      setAttendance({});
    } catch (err) { alert('Failed to save attendance'); }
  };

  const startEdit = (att) => {
    setEditingId(att._id);
    setEditRecords(JSON.parse(JSON.stringify(att.records)));
  };

  const saveEdit = async (attId) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/attendance/${attId}`, { records: editRecords }, { withCredentials: true });
      alert('Attendance updated successfully!');
      setEditingId(null);
      fetchHistory();
    } catch (err) { alert('Failed to update attendance'); }
  };

  const updateEditStatus = (index, status) => {
    const updated = [...editRecords];
    updated[index].status = status;
    setEditRecords(updated);
  };

  const filteredStudents = students.filter(s => s.batch && s.batch._id === selectedBatch);
  const displayedHistory = history.filter(h => {
    let matches = true;
    if (filterHistoryDate && new Date(h.date).toISOString().split('T')[0] !== filterHistoryDate) matches = false;
    if (filterHistoryStandard && h.batch?.standard !== filterHistoryStandard) matches = false;
    if (filterHistoryBatch && h.batch?._id !== filterHistoryBatch) matches = false;
    return matches;
  });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white tracking-tight mb-8">Record Attendance</h1>
      <div className="glass-card mb-8 flex flex-col md:flex-row gap-4">
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="bg-slate-800 border border-slate-700 text-white rounded p-3 w-full md:w-auto" />
        <select value={standard} onChange={e=>{setStandard(e.target.value); handleBatchSelect('');}} className="flex-1 w-full bg-slate-800 border border-slate-700 text-white rounded p-3">
          <option value="">Select Standard</option>
          {[...new Set(batches.map(b => b.standard))].map(std => <option key={std} value={std}>{std}</option>)}
        </select>
        <select value={selectedBatch} onChange={e=>handleBatchSelect(e.target.value)} disabled={!standard} className="flex-1 w-full bg-slate-800 border border-slate-700 text-white rounded p-3 disabled:opacity-50">
          <option value="">{standard ? "Select Batch Letter" : "Select Standard First"}</option>
          {batches.filter(b => b.standard === standard).map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
        </select>
      </div>

      {selectedBatch && (
        <div className="glass-card mb-12 p-0 overflow-hidden">
          <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-black/20">
            <h3 className="text-white font-medium">Class Roster</h3>
            <div className="flex gap-2 w-full sm:w-auto">
              <button onClick={() => markAll('present')} className="flex-1 sm:flex-none px-3 py-1.5 text-xs bg-emerald-600/20 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 rounded transition-colors whitespace-nowrap">Mark All Present</button>
              <button onClick={() => markAll('absent')} className="flex-1 sm:flex-none px-3 py-1.5 text-xs bg-red-600/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 rounded transition-colors whitespace-nowrap">Mark All Absent</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[300px]">
              <thead className="bg-slate-800/50 text-slate-300">
                <tr>
                  <th className="p-4 px-6 font-medium">Student Name</th>
                  <th className="p-4 px-6 font-medium text-center w-32">Present</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredStudents.map(student => (
                  <tr key={student._id} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => handleMark(student._id, attendance[student._id] === 'present' ? 'absent' : 'present')}>
                    <td className="p-4 px-6 text-white font-medium">{student.name}</td>
                    <td className="p-4 px-6 flex justify-center">
                      <input 
                        type="checkbox" 
                        checked={attendance[student._id] === 'present'} 
                        onChange={(e) => { e.stopPropagation(); handleMark(student._id, e.target.checked ? 'present' : 'absent'); }}
                        className="w-5 h-5 rounded border-slate-600 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900 bg-slate-800 cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-black/20 text-right">
            <button onClick={handleSubmit} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium shadow-lg transition-colors">Submit Details</button>
          </div>
        </div>
      )}

      {/* HISTORY TABLE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-12 mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Attendance History</h2>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4 items-end bg-slate-800/30 p-4 rounded-lg border border-white/5">
        <div className="flex-1 w-full">
          <label className="block text-xs text-slate-400 mb-1 ml-1">Filter by Date</label>
          <input type="date" value={filterHistoryDate} onChange={e => setFilterHistoryDate(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 text-sm" />
        </div>
        <div className="flex-1 w-full">
          <label className="block text-xs text-slate-400 mb-1 ml-1">Filter by Standard</label>
          <select value={filterHistoryStandard} onChange={e => {setFilterHistoryStandard(e.target.value); setFilterHistoryBatch('');}} className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 text-sm appearance-none">
            <option value="" className="bg-slate-800 text-white">All Standards</option>
            {[...new Set(batches.map(b => b.standard))].map(std => <option key={std} value={std} className="bg-slate-800 text-white">{std}</option>)}
          </select>
        </div>
        <div className="flex-1 w-full">
          <label className="block text-xs text-slate-400 mb-1 ml-1">Filter by Batch</label>
          <select value={filterHistoryBatch} onChange={e => setFilterHistoryBatch(e.target.value)} disabled={!filterHistoryStandard} className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 text-sm disabled:opacity-50 appearance-none">
            <option value="" className="bg-slate-800 text-white">All Batches</option>
            {batches.filter(b => b.standard === filterHistoryStandard).map(b => <option key={b._id} value={b._id} className="bg-slate-800 text-white">{b.name}</option>)}
          </select>
        </div>
        {(filterHistoryDate || filterHistoryStandard || filterHistoryBatch) && (
          <button onClick={() => {setFilterHistoryDate(''); setFilterHistoryStandard(''); setFilterHistoryBatch('');}} className="text-sm px-4 py-2.5 text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors whitespace-nowrap shadow border border-slate-600">
            Clear Filters
          </button>
        )}
      </div>

      <div className="glass-card p-0 overflow-hidden mb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-800/50 text-slate-300">
              <tr>
                <th className="p-4 px-6 font-medium">Batch</th>
                <th className="p-4 px-6 font-medium">Date</th>
                <th className="p-4 px-6 font-medium">Class Size</th>
                <th className="p-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {displayedHistory.map(att => (
                <React.Fragment key={att._id}>
                  <tr className="hover:bg-white/5 text-slate-300">
                    <td className="p-4 px-6 text-white font-medium">{att.batch?.name || 'Unknown'}</td>
                    <td className="p-4 px-6">{new Date(att.date).toLocaleDateString()}</td>
                    <td className="p-4 px-6">
                      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs border border-emerald-500/20">
                        {att.records?.length || 0} students
                      </span>
                    </td>
                    <td className="p-4 px-6 text-right">
                      {editingId === att._id ? (
                        <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-slate-600 hover:bg-slate-500 rounded text-xs text-white">Close</button>
                      ) : (
                        <button onClick={() => startEdit(att)} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded text-xs text-white">Edit Records</button>
                      )}
                    </td>
                  </tr>
                  
                  {/* EXPANDABLE EDIT ROW */}
                  {editingId === att._id && (
                    <tr className="bg-slate-900/80 border-y border-white/10">
                      <td colSpan="4" className="p-0">
                        <div className="p-6">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                            <h4 className="text-white font-semibold flex items-center gap-2">Edit Attendance Log:</h4>
                            <div className="flex gap-2 w-full sm:w-auto">
                              <button onClick={() => setEditRecords(editRecords.map(r => ({...r, status: 'present'})))} className="flex-1 sm:flex-none px-3 py-1.5 text-xs bg-emerald-600/20 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 rounded transition-colors whitespace-nowrap">Mark All Present</button>
                              <button onClick={() => setEditRecords(editRecords.map(r => ({...r, status: 'absent'})))} className="flex-1 sm:flex-none px-3 py-1.5 text-xs bg-red-600/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 rounded transition-colors whitespace-nowrap">Mark All Absent</button>
                            </div>
                          </div>
                          <div className="border border-white/10 rounded-lg overflow-x-auto">
                            <table className="w-full text-left min-w-[300px]">
                              <thead className="bg-slate-800/80 text-slate-300 text-sm">
                                <tr>
                                  <th className="p-3 px-6 font-medium">Student Name</th>
                                  <th className="p-3 px-6 font-medium text-center w-32 border-l border-white/5">Present</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5 bg-slate-800/30">
                                {editRecords.map((rec, i) => {
                                  const studentName = students.find(s => s._id === rec.student)?.name || 'Unknown';
                                  return (
                                    <tr key={i} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => updateEditStatus(i, rec.status === 'present' ? 'absent' : 'present')}>
                                      <td className="p-3 px-6 text-slate-200">{studentName}</td>
                                      <td className="p-3 px-6 flex justify-center border-l border-white/5">
                                        <input 
                                          type="checkbox" 
                                          checked={rec.status === 'present'} 
                                          onChange={(e) => { e.stopPropagation(); updateEditStatus(i, e.target.checked ? 'present' : 'absent'); }}
                                          className="w-5 h-5 rounded border-slate-600 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900 bg-slate-800 cursor-pointer"
                                        />
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                          <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => setEditingId(null)} className="px-5 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white font-medium transition-colors">Cancel</button>
                            <button onClick={() => saveEdit(att._id)} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-white font-medium transition-colors">Save Changes</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {displayedHistory.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500">No attendance logs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default ManageAttendance;
