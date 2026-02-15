
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { db } from '../../services/supabase';
import { ChevronLeft, Save, Stethoscope, Tag, DollarSign } from 'lucide-react';

const ServiceForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'General',
    price: 0,
    is_active: true,
    icon_name: 'Stethoscope'
  });

  useEffect(() => {
    if (id) {
      db.services.getById(id).then(({ data }) => {
        if (data) setFormData(data);
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await db.services.upsert(id ? { id, ...formData } : formData);
    navigate('/admin/services');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/admin/services" className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ChevronLeft className="w-6 h-6" /></Link>
        <h2 className="text-2xl font-bold">{id ? 'Edit Dental Service' : 'Add New Service'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Service Title</label>
            <input required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g., Composite Filling" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Category</label>
              <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option>General</option>
                <option>Cosmetic</option>
                <option>Surgery</option>
                <option>Orthodontics</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Base Price ($)</label>
              <div className="relative">
                <input required type="number" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                <DollarSign className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Description</label>
            <textarea required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary h-32" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Tell patients about this treatment..."></textarea>
          </div>

          <div className="flex items-center gap-3 py-4">
            <input type="checkbox" id="isActive" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-5 h-5 text-primary rounded border-slate-300" />
            <label htmlFor="isActive" className="text-sm font-bold text-slate-700">Active (Visible on website)</label>
          </div>
        </div>

        <div className="bg-slate-50 p-8 border-t border-slate-100 flex justify-end gap-4">
          <Link to="/admin/services" className="px-6 py-3 font-bold text-slate-500">Cancel</Link>
          <button type="submit" disabled={loading} className="px-10 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all flex items-center gap-2">
            <Save className="w-5 h-5" /> {loading ? 'Saving...' : 'Save Service'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;
