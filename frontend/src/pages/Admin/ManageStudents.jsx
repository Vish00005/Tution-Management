import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserPlus, Trash2, Filter } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const ManageStudents = () => {
  const { user } = useContext(AuthContext);
  const isManager = user?.role === 'manager';
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [filterStandard, setFilterStandard] = useState('');
  const [filterBatch, setFilterBatch] = useState('');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('student123'); // Default password
  const [standard, setStandard] = useState('');
  const [batchId, setBatchId] = useState('');
  const [fatherContact, setFatherContact] = useState('');
  const [motherContact, setMotherContact] = useState('');
  const [createdCreds, setCreatedCreds] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  // Edit State
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchStudents();
    fetchBatches();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/students`, { withCredentials: true });
      setStudents(res.data);
    } catch (err) { console.error('Error fetching students', err); }
  };

  const fetchBatches = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/batches`, { withCredentials: true });
      setBatches(res.data);
    } catch (err) { console.error(err); }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/students`, {
        name, email, password, standard, batch: batchId, fatherContact, motherContact
      }, { withCredentials: true });
      setCreatedCreds({ email, password });
      setName(''); setEmail(''); setStandard(''); setFatherContact(''); setMotherContact('');
      setShowAddForm(false);
      fetchStudents();
    } catch (err) { alert('Failed to add student'); }
  };

  const handleDelete = async (id) => {
    if(confirm('Are you sure you want to remove this student?')) {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/students/${id}`, { withCredentials: true });
      fetchStudents();
    }
  }

  const handleEditClick = (student) => {
    setEditingStudentId(student._id);
    setEditForm({
      name: student.name,
      email: student.email,
      standard: student.standard,
      batch: student.batch?._id || '',
      fatherContact: student.fatherContact || '',
      motherContact: student.motherContact || '',
      plainPassword: student.plainPassword || 'student123'
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/students/${id}`, editForm, { withCredentials: true });
      setEditingStudentId(null);
      fetchStudents();
    } catch (err) { alert('Failed to update student'); }
  };

  const handleAddSubject = async (id) => {
    const subject = prompt('Enter new subject name (e.g. Computer Science):');
    if(subject) {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/students/${id}/subject`, { subject }, { withCredentials: true });
      fetchStudents();
    }
  };

  const filteredStudents = students.filter(s => {
    if (filterStandard && s.batch?.standard !== filterStandard) return false;
    if (filterBatch && s.batch?._id !== filterBatch) return false;
    return true;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-white tracking-tight mb-8">Manage Students</h1>
      
      {createdCreds && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 mb-8">
          <h4 className="text-emerald-400 font-bold mb-2">Student Enrolled Successfully</h4>
          <p className="text-emerald-300"><strong>Email:</strong> {createdCreds.email}</p>
          <p className="text-emerald-300"><strong>Password:</strong> {createdCreds.password}</p>
          <p className="text-emerald-300 text-sm mt-2 opacity-80">Share these temporary credentials with the student.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        {!isManager && showAddForm && (
          <div className="glass-card mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Enroll New Student</h3>
              <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-white">Cancel</button>
            </div>
            <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} required className="w-full bg-slate-800/50 border border-slate-700 rounded p-3 text-white" />
              <input type="email" placeholder="Email Address" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full bg-slate-800/50 border border-slate-700 rounded p-3 text-white" />
              <select value={standard} onChange={e => { setStandard(e.target.value); setBatchId(''); }} required className="w-full bg-slate-800/50 border border-slate-700 rounded p-3 text-white appearance-none">
                <option value="" className="bg-slate-800 text-white">Select Standard</option>
                {[...new Set(batches.map(b => b.standard))].map(std => <option key={std} value={std} className="bg-slate-800 text-white">{std}</option>)}
              </select>
              <select value={batchId} onChange={e=>setBatchId(e.target.value)} disabled={!standard} className="w-full bg-slate-800/50 border border-slate-700 rounded p-3 text-white disabled:opacity-50 appearance-none" required>
                <option value="" className="bg-slate-800 text-white">{standard ? "Select Batch Letter" : "Select Standard First"}</option>
                {batches.filter(b => b.standard === standard).map(b => <option key={b._id} value={b._id} className="bg-slate-800 text-white">{b.name}</option>)}
              </select>
              <input type="text" placeholder="Father's Phone Number" value={fatherContact} onChange={e=>setFatherContact(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700 rounded p-3 text-white" />
              <input type="text" placeholder="Mother's Phone Number" value={motherContact} onChange={e=>setMotherContact(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700 rounded p-3 text-white" />
              <button type="submit" className="md:col-span-2 w-full bg-indigo-600 hover:bg-indigo-500 p-3 rounded text-white font-medium flex items-center justify-center">
                <UserPlus className="w-5 h-5 mr-2" /> Add Student
              </button>
            </form>
          </div>
        )}

        <div className="w-full">
          <div className="glass-card p-0 overflow-hidden">
            <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-black/20">
              <div className="flex items-center gap-4">
                <div className="text-white font-medium flex items-center">
                  <Filter className="w-4 h-4 mr-2 text-indigo-400" /> Filter Directory
                </div>
                {!isManager && !showAddForm && (
                  <button onClick={() => setShowAddForm(true)} className="bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded text-white text-sm font-medium flex items-center">
                    <UserPlus className="w-4 h-4 mr-1" /> Add Student
                  </button>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <select value={filterStandard} onChange={e => {setFilterStandard(e.target.value); setFilterBatch('');}} className="bg-slate-800/80 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 outline-none focus:border-indigo-500 w-full sm:w-auto appearance-none">
                  <option value="" className="bg-slate-800 text-white">All Standards</option>
                  {[...new Set(batches.map(b => b.standard))].map(std => <option key={std} value={std} className="bg-slate-800 text-white">{std}</option>)}
                </select>
                <select value={filterBatch} onChange={e => setFilterBatch(e.target.value)} disabled={!filterStandard} className="bg-slate-800/80 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 outline-none focus:border-indigo-500 disabled:opacity-50 w-full sm:w-auto appearance-none">
                  <option value="" className="bg-slate-800 text-white">{filterStandard ? 'All Batches' : 'Select Standard First'}</option>
                  {batches.filter(b => b.standard === filterStandard).map(b => <option key={b._id} value={b._id} className="bg-slate-800 text-white">{b.name}</option>)}
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/50 text-slate-300 text-sm uppercase tracking-wider border-b border-white/10">
                    <th className="p-4 font-medium px-6">Name</th>
                    {!isManager && <th className="p-4 font-medium px-6">Password</th>}
                    <th className="p-4 font-medium px-6">Contacts</th>
                    <th className="p-4 font-medium px-6">Batch</th>
                    <th className="p-4 font-medium px-6">Subjects</th>
                    <th className="p-4 font-medium px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredStudents.length > 0 ? filteredStudents.map((student) => {
                    if (editingStudentId === student._id) {
                      return (
                        <tr key={student._id} className="bg-slate-800/30 text-slate-300">
                          <td className="p-4 px-6 space-y-2">
                            <input type="text" value={editForm.name} onChange={e=>setEditForm({...editForm, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white text-sm" placeholder="Name" />
                            <input type="email" value={editForm.email} onChange={e=>setEditForm({...editForm, email: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white text-sm" placeholder="Email" />
                          </td>
                          {!isManager && (
                            <td className="p-4 px-6 space-y-2">
                              <input type="text" value={editForm.plainPassword} onChange={e=>setEditForm({...editForm, plainPassword: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-emerald-400/80 font-mono text-sm" placeholder="Password" />
                            </td>
                          )}
                          <td className="p-4 px-6 text-sm text-slate-300 space-y-2">
                            <input type="text" value={editForm.fatherContact} onChange={e=>setEditForm({...editForm, fatherContact: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white text-sm" placeholder="Father Phone" />
                            <input type="text" value={editForm.motherContact} onChange={e=>setEditForm({...editForm, motherContact: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white text-sm" placeholder="Mother Phone" />
                          </td>
                          <td className="p-4 px-6 space-y-2">
                            <select value={editForm.standard} onChange={e => setEditForm({...editForm, standard: e.target.value, batch: ''})} className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white text-sm appearance-none">
                              <option value="" className="bg-slate-800 text-white">Std</option>
                              {[...new Set(batches.map(b => b.standard))].map(std => <option key={std} value={std} className="bg-slate-800 text-white">{std}</option>)}
                            </select>
                            <select value={editForm.batch} onChange={e=>setEditForm({...editForm, batch: e.target.value})} disabled={!editForm.standard} className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white text-sm disabled:opacity-50 appearance-none">
                              <option value="" className="bg-slate-800 text-white">Batch</option>
                              {batches.filter(b => b.standard === editForm.standard).map(b => <option key={b._id} value={b._id} className="bg-slate-800 text-white">{b.name}</option>)}
                            </select>
                          </td>
                          <td className="p-4 px-6">
                            <span className="text-xs text-slate-500 italic">Subjects unchanged</span>
                          </td>
                          <td className="p-4 px-6 text-right space-x-2">
                            <button onClick={() => handleSaveEdit(student._id)} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-sm transition-colors">Save</button>
                            <button onClick={() => setEditingStudentId(null)} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition-colors">Cancel</button>
                          </td>
                        </tr>
                      );
                    }
                    return (
                    <tr key={student._id} className="hover:bg-white/5 text-slate-300">
                      <td className="p-4 px-6">
                        <div className="text-white font-medium">{student.name}</div>
                        <div className="text-xs text-slate-400 mt-1">{student.email}</div>
                      </td>
                      {!isManager && (
                        <td className="p-4 px-6 text-sm font-mono text-emerald-400/80">
                          {student.plainPassword || 'student123'}
                        </td>
                      )}
                      <td className="p-4 px-6 text-sm text-slate-300">
                        {student.fatherContact && <div><span className="text-slate-500 text-xs">F:</span> {student.fatherContact}</div>}
                        {student.motherContact && <div><span className="text-slate-500 text-xs">M:</span> {student.motherContact}</div>}
                      </td>
                      <td className="p-4 px-6">
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs border border-blue-500/20 whitespace-nowrap">
                          {student.batch ? `${student.batch.standard} - ${student.batch.name}` : 'Unassigned'}
                        </span>
                      </td>
                      <td className="p-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {student.subjects?.map((sub, i) => (
                            <span key={i} className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded text-[10px] border border-purple-500/20">{sub}</span>
                          ))}
                          {!isManager && <button onClick={() => handleAddSubject(student._id)} className="px-2 py-1 text-[10px] border border-slate-600 rounded hover:bg-slate-800 text-slate-300 transition-colors">+ Add</button>}
                        </div>
                      </td>
                      <td className="p-4 px-6 text-right flex justify-end gap-2">
                        {!isManager && (
                          <>
                            <button onClick={() => handleEditClick(student)} className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-colors">
                              Edit
                            </button>
                            <button onClick={() => handleDelete(student._id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-400 italic">No students match your filter criteria.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ManageStudents;
