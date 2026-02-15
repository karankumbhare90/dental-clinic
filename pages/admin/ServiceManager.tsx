
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../services/supabase';
import { Service } from '../../types';
import { Stethoscope, Plus, Edit, Trash, List, CheckCircle } from 'lucide-react';

const ServiceManager: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    setLoading(true);
    const { data } = await db.services.getAll();
    if (data) setServices(data);
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Remove this service from clinic list?')) {
      await db.services.delete(id);
      fetchServices();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex gap-10">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Total Treatments</p>
            <h3 className="text-3xl font-bold text-slate-800">{services.length}</h3>
          </div>
          <div className="h-10 w-px bg-slate-200 self-center"></div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Active Now</p>
            <h3 className="text-3xl font-bold text-primary">{services.filter(s => s.is_active).length}</h3>
          </div>
        </div>
        <Link to="/admin/services/new" className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95">
          <Plus className="w-5 h-5" /> New Service
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>)
        ) : services.map(service => (
          <div key={service.id} className={`bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col ${!service.is_active ? 'opacity-60' : ''}`}>
            <div className="p-6 flex-1">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{service.name}</h3>
              <p className="text-sm text-slate-500 mb-6 line-clamp-2">{service.description}</p>
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Base Rate</span>
                <span className="text-base font-bold text-primary">${service.price}</span>
              </div>
            </div>
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${service.is_active ? 'text-green-600 bg-green-50' : 'text-slate-400 bg-slate-100'}`}>
                {service.is_active ? 'Public' : 'Hidden'}
              </span>
              <div className="flex gap-1">
                <Link to={`/admin/services/edit/${service.id}`} className="p-2 text-slate-400 hover:text-primary transition-colors"><Edit className="w-4 h-4" /></Link>
                <button onClick={() => handleDelete(service.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceManager;
