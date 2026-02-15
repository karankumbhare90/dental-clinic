
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { db } from '../../services/supabase';
import { ChevronLeft, Save, User, HeartPulse, ShieldAlert } from 'lucide-react';

const PatientForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'other',
    address: '',
    emergency_contact: '',
    medical_history: ''
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      db.patients.getById(id).then(({ data }) => {
        if (data) setFormData({
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          dob: data.dob,
          gender: data.gender,
          address: data.address,
          emergency_contact: data.emergency_contact,
          medical_history: data.medical_history
        });
        setLoading(false);
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error: upsertError } = await db.patients.upsert(id ? { id, ...formData } : formData);
    if (upsertError) {
      setError(upsertError.message);
      setLoading(false);
    } else {
      navigate('/admin/patients');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/admin/patients" className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ChevronLeft className="w-6 h-6" /></Link>
        <h2 className="text-2xl font-bold">{id ? 'Edit Patient File' : 'New Patient Registration'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 space-y-8">
          {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-3"><ShieldAlert className="w-5 h-5" /> {error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><User className="w-4 h-4" /> Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                  <input required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white transition-all" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} placeholder="John Doe" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Date of Birth</label>
                    <input required type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Gender</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                  <input required type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Phone</label>
                  <input required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="(555) 000-0000" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><HeartPulse className="w-4 h-4" /> Medical Records</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Emergency Contact</label>
                  <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary" value={formData.emergency_contact} onChange={e => setFormData({...formData, emergency_contact: e.target.value})} placeholder="Name - Relationship - Phone" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Medical History & Allergies</label>
                  <textarea className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary h-40" value={formData.medical_history} onChange={e => setFormData({...formData, medical_history: e.target.value})} placeholder="Notes about medical conditions..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Home Address</label>
                  <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Street, City, State, Zip" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-8 border-t border-slate-100 flex justify-end gap-4">
          <Link to="/admin/patients" className="px-6 py-3 font-bold text-slate-500 hover:text-slate-800 transition-colors">Discard</Link>
          <button type="submit" disabled={loading} className="px-10 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all flex items-center gap-2">
            <Save className="w-5 h-5" /> {loading ? 'Saving...' : 'Save Patient File'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
