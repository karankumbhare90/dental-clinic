
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../../services/supabase';
import { Patient } from '../../types';
import { Search, Plus, Mail, Phone, Edit, Trash2 } from 'lucide-react';
import { getOptimizedImage } from '../../utils/image';

const PatientManager: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    setLoading(true);
    const { data } = await db.patients.getAll();
    if (data) setPatients(data);
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this patient file permanently?')) {
      await db.patients.delete(id);
      fetchPatients();
    }
  };

  const filteredPatients = patients.filter(p => 
    p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
          <input 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary shadow-sm outline-none" 
            placeholder="Find patient..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Link to="/admin/patients/new" className="flex items-center justify-center gap-2 px-6 py-3 bg-accent-coral hover:bg-accent-coral-dark text-white rounded-xl font-bold shadow-lg shadow-accent-coral/20 transition-all active:scale-95">
          <Plus className="w-5 h-5" /> Add Patient
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-slate-400 text-xs uppercase tracking-wider">
                <th className="py-4 px-8 font-bold">Patient Name</th>
                <th className="py-4 px-8 font-bold">Contact</th>
                <th className="py-4 px-8 font-bold">Status</th>
                <th className="py-4 px-8 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={4} className="px-8 py-20 text-center text-slate-400">Syncing database...</td></tr>
              ) : filteredPatients.length === 0 ? (
                <tr><td colSpan={4} className="px-8 py-20 text-center text-slate-400">No patients found.</td></tr>
              ) : filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-3">
                      <img 
                        className="h-10 w-10 rounded-full border-2 border-white shadow-sm" 
                        src={getOptimizedImage(`https://ui-avatars.com/api/?name=${patient.full_name}&background=0f6d75&color=fff`, 80, 80)} 
                        alt="" 
                      />
                      <div>
                        <p className="font-bold text-slate-800">{patient.full_name}</p>
                        <p className="text-xs text-slate-400">DOB: {new Date(patient.dob).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-8 text-sm">
                    <p className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-slate-400" /> {patient.email}</p>
                    <p className="flex items-center gap-1.5 text-slate-500"><Phone className="w-3 h-3 text-slate-400" /> {patient.phone}</p>
                  </td>
                  <td className="py-5 px-8">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-green-100 text-green-700">Active</span>
                  </td>
                  <td className="py-5 px-8 text-right">
                    <div className="flex justify-end gap-1">
                      <Link to={`/admin/patients/edit/${patient.id}`} className="p-2 text-slate-400 hover:text-primary transition-colors"><Edit className="w-4 h-4" /></Link>
                      <button onClick={() => handleDelete(patient.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientManager;
