import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageMarks = () => {
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [standard, setStandard] = useState('');
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [marks, setMarks] = useState({});
  const [absent, setAbsent] = useState({});
  const [totalMarks, setTotalMarks] = useState(100);
  
  // History UI
  const [history, setHistory] = useState([]);
  const [filterHistoryDate, setFilterHistoryDate] = useState('');
  const [filterHistoryStandard, setFilterHistoryStandard] = useState('');
  const [filterHistoryBatch, setFilterHistoryBatch] = useState('');
  const [filterHistorySubject, setFilterHistorySubject] = useState('');

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
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/marksheets`, { withCredentials: true });
      setHistory(res.data);
    } catch (err) { console.error('Failed to load marksheet history'); }
  };

  const handleSubmit = async () => {
    if (!title || !subject || !selectedBatch) return alert('Title, Subject, and Batch are required');
    const records = filteredStudents.map(student => ({
      student: student._id,
      marksObtained: absent[student._id] ? 0 : (marks[student._id] || 0),
      totalMarks,
      isAbsent: !!absent[student._id]
    }));
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/marksheets`, { title, subject, date, batch: selectedBatch, records }, { withCredentials: true });
      alert('Marksheet published successfully!');
      fetchHistory();
      setTitle(''); setSubject(''); setMarks({}); setAbsent({});
    } catch (err) { alert('Failed to publish marksheet'); }
  };

  const startEdit = (marksheet) => {
    setEditingId(marksheet._id);
    setEditRecords(JSON.parse(JSON.stringify(marksheet.records)));
  };

  const saveEdit = async (marksheetId) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/marksheets/${marksheetId}`, { records: editRecords }, { withCredentials: true });
      alert('Marksheet updated successfully!');
      setEditingId(null);
      fetchHistory();
    } catch (err) { alert('Failed to update marksheet'); }
  };

  const updateEditMark = (index, value) => {
    const updated = [...editRecords];
    updated[index].marksObtained = Number(value);
    setEditRecords(updated);
  };

  const updateEditAbsent = (index, checked) => {
    const updated = [...editRecords];
    updated[index].isAbsent = checked;
    if (checked) updated[index].marksObtained = 0;
    setEditRecords(updated);
  };

  const filteredStudents = students.filter(s => s.batch && s.batch._id === selectedBatch);
  const displayedHistory = history.filter(h => {
    let matches = true;
    if (filterHistoryDate && new Date(h.date).toISOString().split('T')[0] !== filterHistoryDate) matches = false;
    if (filterHistoryStandard && h.batch?.standard !== filterHistoryStandard) matches = false;
    if (filterHistoryBatch && h.batch?._id !== filterHistoryBatch) matches = false;
    if (filterHistorySubject && (h.subject || 'General') !== filterHistorySubject) matches = false;
    return matches;
  });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white tracking-tight mb-8">Generate Marksheet</h1>
      <div className="glass-card mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input type="text" placeholder="Exam Title (e.g. Midterm)" value={title} onChange={e=>setTitle(e.target.value)} className="flex-1 w-full bg-slate-800 border border-slate-700 text-white rounded p-3" />
          <select value={subject} onChange={e=>setSubject(e.target.value)} required className="flex-1 w-full bg-slate-800 border border-slate-700 text-white rounded p-3 appearance-none">
            <option value="" className="bg-slate-800 text-slate-400">Select Subject</option>
            {[...new Set([...students.flatMap(s => s.subjects || []), ...history.map(h => h.subject).filter(Boolean)])].map(sub => (
              <option key={sub} value={sub} className="bg-slate-800 text-white">{sub}</option>
            ))}
          </select>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full md:w-48 bg-slate-800 border border-slate-700 text-white rounded p-3" />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
           <select value={standard} onChange={e=>{setStandard(e.target.value); setSelectedBatch('');}} className="flex-1 w-full bg-slate-800 border border-slate-700 text-white rounded p-3">
             <option value="">Select Standard</option>
             {[...new Set(batches.map(b => b.standard))].map(std => <option key={std} value={std}>{std}</option>)}
           </select>
           <select value={selectedBatch} onChange={e=>setSelectedBatch(e.target.value)} disabled={!standard} className="flex-1 w-full bg-slate-800 border border-slate-700 text-white rounded p-3 disabled:opacity-50">
             <option value="">{standard ? "Select Batch Letter" : "Select Standard First"}</option>
             {batches.filter(b => b.standard === standard).map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
           </select>
           <input type="number" placeholder="Total Marks" value={totalMarks} onChange={e=>setTotalMarks(Number(e.target.value))} className="w-full md:w-32 bg-slate-800 border border-slate-700 text-white rounded p-3" />
        </div>
      </div>

      {selectedBatch && (
        <div className="glass-card p-0 overflow-hidden mb-12">
          {Object.keys(marks).length > 0 && (
            <div className="p-4 sm:p-6 bg-slate-800/80 border-b border-white/10 flex justify-between">
              <div className="text-center w-1/3 border-r border-white/5">
                <p className="text-xs sm:text-sm text-slate-400">Highest Rank</p>
                <p className="text-xl sm:text-2xl font-bold text-emerald-400">{Math.max(...Object.values(marks))}</p>
              </div>
              <div className="text-center w-1/3 border-r border-white/5">
                <p className="text-xs sm:text-sm text-slate-400">Class Avg</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-400">{(Object.values(marks).reduce((a, b) => a + b, 0) / Object.values(marks).length).toFixed(1)}</p>
              </div>
              <div className="text-center w-1/3">
                <p className="text-xs sm:text-sm text-slate-400">Lowest Rank</p>
                <p className="text-xl sm:text-2xl font-bold text-red-400">{Math.min(...Object.values(marks))}</p>
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[300px]">
              <thead className="bg-slate-800/50 text-slate-300">
                <tr><th className="p-4 px-6">Student</th><th className="p-4 px-6 w-48">Score</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredStudents.map(student => (
                  <tr key={student._id} className="hover:bg-white/5 text-slate-300">
                    <td className="p-4 px-6 text-white font-medium">{student.name}</td>
                    <td className="p-4 px-6 flex items-center gap-4">
                      <input 
                        type="number" 
                        placeholder="0" 
                        disabled={absent[student._id]}
                        className={`w-24 bg-slate-800 border border-slate-700 rounded p-2 text-white ${absent[student._id] ? 'opacity-50 cursor-not-allowed' : ''}`} 
                        value={marks[student._id] !== undefined ? marks[student._id] : ''} 
                        onChange={(e) => setMarks({...marks, [student._id]: Number(e.target.value)})} 
                      />
                      <label className="flex items-center text-sm text-slate-400 cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          className="mr-2 rounded border-slate-700 bg-slate-900" 
                          checked={!!absent[student._id]} 
                          onChange={(e) => setAbsent({...absent, [student._id]: e.target.checked})} 
                        />
                        Absent
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-black/20 text-right">
            <button onClick={handleSubmit} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium shadow-lg">Publish Results</button>
          </div>
        </div>
      )}

      {/* HISTORY TABLE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-12 mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Marksheet History</h2>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end bg-slate-800/30 p-4 rounded-lg border border-white/5">
        <div className="w-full">
          <label className="block text-xs text-slate-400 mb-1 ml-1">Filter by Date</label>
          <input type="date" value={filterHistoryDate} onChange={e => setFilterHistoryDate(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 text-sm border-slate-600" />
        </div>
        <div className="w-full">
          <label className="block text-xs text-slate-400 mb-1 ml-1">Filter by Standard</label>
          <select value={filterHistoryStandard} onChange={e => {setFilterHistoryStandard(e.target.value); setFilterHistoryBatch('');}} className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 text-sm appearance-none border-slate-600">
            <option value="" className="bg-slate-800 text-white">All Standards</option>
            {[...new Set(batches.map(b => b.standard))].map(std => <option key={std} value={std} className="bg-slate-800 text-white">{std}</option>)}
          </select>
        </div>
        <div className="w-full">
          <label className="block text-xs text-slate-400 mb-1 ml-1">Filter by Batch</label>
          <select value={filterHistoryBatch} onChange={e => setFilterHistoryBatch(e.target.value)} disabled={!filterHistoryStandard} className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 text-sm disabled:opacity-50 appearance-none border-slate-600">
            <option value="" className="bg-slate-800 text-white">All Batches</option>
            {batches.filter(b => b.standard === filterHistoryStandard).map(b => <option key={b._id} value={b._id} className="bg-slate-800 text-white">{b.name}</option>)}
          </select>
        </div>
        <div className="w-full">
          <label className="block text-xs text-slate-400 mb-1 ml-1">Filter by Subject</label>
          <select value={filterHistorySubject} onChange={e => setFilterHistorySubject(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 text-sm appearance-none border-slate-600">
            <option value="" className="bg-slate-800 text-white">All Subjects</option>
            {[...new Set(history.map(h => h.subject || 'General'))].map(sub => <option key={sub} value={sub} className="bg-slate-800 text-white">{sub}</option>)}
          </select>
        </div>
        <div className="w-full lg:flex lg:justify-end">
          {(filterHistoryDate || filterHistoryStandard || filterHistoryBatch || filterHistorySubject) && (
            <button onClick={() => {setFilterHistoryDate(''); setFilterHistoryStandard(''); setFilterHistoryBatch(''); setFilterHistorySubject('');}} className="w-full lg:w-auto text-sm px-4 py-2.5 text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors whitespace-nowrap shadow border border-slate-600">
              Clear Filters
            </button>
          )}
        </div>
      </div>
      <div className="glass-card p-0 overflow-hidden mb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-800/50 text-slate-300">
              <tr>
                <th className="p-4 px-6 font-medium">Title</th>
                <th className="p-4 px-6 font-medium">Subject</th>
                <th className="p-4 px-6 font-medium">Batch</th>
                <th className="p-4 px-6 font-medium">Date</th>
                <th className="p-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {displayedHistory.map(h => (
                <React.Fragment key={h._id}>
                  <tr className="hover:bg-white/5 text-slate-300">
                    <td className="p-4 px-6 text-white font-medium">{h.title}</td>
                    <td className="p-4 px-6">
                      <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded text-xs border border-indigo-500/20">{h.subject || 'General'}</span>
                    </td>
                    <td className="p-4 px-6">{h.batch?.name || 'Unknown'}</td>
                    <td className="p-4 px-6">{new Date(h.date).toLocaleDateString()}</td>
                    <td className="p-4 px-6 text-right">
                      {editingId === h._id ? (
                        <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-slate-600 hover:bg-slate-500 rounded text-xs text-white">Close</button>
                      ) : (
                        <button onClick={() => startEdit(h)} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded text-xs text-white">Edit Scores</button>
                      )}
                    </td>
                  </tr>

                  {/* EXPANDABLE EDIT ROW */}
                  {editingId === h._id && (
                    <tr className="bg-black/30 border-y border-white/10">
                      <td colSpan="5" className="p-6">
                        <h4 className="text-white font-semibold mb-4">Edit Exam Scores (out of {h.records[0]?.totalMarks || 100}):</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {editRecords.map((rec, i) => {
                            const studentName = students.find(s => s._id === rec.student)?.name || 'Unknown';
                            return (
                              <div key={i} className="flex justify-between items-center bg-slate-800/80 p-3 rounded border border-white/5">
                                <span className="text-slate-300">{studentName}</span>
                                <div className="flex items-center gap-3">
                                  <label className="flex items-center text-xs text-slate-400 cursor-pointer select-none">
                                    <input 
                                      type="checkbox" 
                                      className="mr-1.5 rounded border-slate-700 bg-slate-900" 
                                      checked={!!rec.isAbsent} 
                                      onChange={(e) => updateEditAbsent(i, e.target.checked)} 
                                    />
                                    Absent
                                  </label>
                                  <input 
                                    type="number" 
                                    value={rec.marksObtained} 
                                    onChange={e => updateEditMark(i, e.target.value)}
                                    disabled={rec.isAbsent}
                                    className={`w-20 bg-slate-900 border border-slate-700 text-white rounded p-1 text-right ${rec.isAbsent ? 'opacity-50 cursor-not-allowed' : ''}`} 
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="mt-6 flex justify-end">
                          <button onClick={() => saveEdit(h._id)} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-white font-medium">Save Changes</button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {displayedHistory.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">No marksheets found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default ManageMarks;
