import { useSearchParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { db } from '../../services/supabase';
import { emailService } from '../../services/email';
import { Appointment, AppointmentStatus } from '../../types';
import { Check, X, Search, Calendar as CalendarIcon, List, ChevronLeft, ChevronRight, ClockPlus } from 'lucide-react';

const AppointmentManager: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false)
const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
const [newDate, setNewDate] = useState('')
const [newTime, setNewTime] = useState('')
const [rescheduleLoading, setRescheduleLoading] = useState(false)

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    setLoading(true);
    const { data } = await db.appointments.getAll();
    if (data) setAppointments(data);
    setLoading(false);
  }

  const handleUpdateStatus = async (id: string, status: string) => {
    const appointment = appointments.find(a => a.id === id);
    if (!appointment) return;

    const { error } = await db.appointments.updateStatus(id, status);

    if (!error) {
      // Update local state immediately for the Calendar & List
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: status as AppointmentStatus } : a));

      // Trigger Status update email (Scenario 3)
      emailService.sendAppointmentStatusUpdate(appointment, status as 'confirmed' | 'cancelled');
    }
  };

  const filteredAppointments = appointments.filter(a => {
    const matchesFilter = filter === 'all' || a.status === filter;
    const matchesSearch = (a.first_name + ' ' + a.last_name).toLowerCase().includes(searchTerm.toLowerCase()) || a.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calendar Logic
  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const startDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const calendarDays = [];
  const totalDays = daysInMonth(currentMonth);
  const startOffset = startDayOfMonth(currentMonth);

  for (let i = 0; i < startOffset; i++) calendarDays.push(null);
  for (let i = 1; i <= totalDays; i++) calendarDays.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));

  const handleRescheduleSubmit = async () => {
    if (!selectedAppointment) return
    setRescheduleLoading(true)
  
    const { error } = await db.appointments.update(
      selectedAppointment.id,
      {
        proposed_date: newDate,
        proposed_time: newTime,
        status: 'reschedule_pending'
      }
    )
  
    if (!error) {
      await emailService.sendRescheduleEmail({
        ...selectedAppointment,
        new_date: newDate,
        new_time: newTime
      })
  
      await fetchAppointments()
      setIsRescheduleOpen(false)
    }
  
    setRescheduleLoading(false)
  }

  const openRescheduleModal = (appt: Appointment) => {
    setSelectedAppointment(appt)
    setNewDate(appt.preferred_date)
    setNewTime(appt.preferred_time || '')
    setIsRescheduleOpen(true)
  }

  return (
    <div className="w-full grid grid-cols-1 gap-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Appointments</h2>
        <div className="w-full sm:w-auto bg-white p-1.5 rounded-xl border border-slate-200 grid grid-cols-2 shadow-sm">
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${view === 'list' ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <List className="w-4 h-4" /> List View
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${view === 'calendar' ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <CalendarIcon className="w-4 h-4" /> Calendar
          </button>
        </div>
      </div>

      {view === 'list' ? (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <div className="relative w-full md:w-96">
              <input
                className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary w-full outline-none"
                placeholder="Search patient..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
            </div>
            <select className="form-select w-full md:w-48 py-2.5 text-sm border-slate-200 rounded-xl bg-slate-50 outline-none cursor-pointer" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr className="text-slate-400 text-xs uppercase tracking-wider">
                    <th className="px-8 py-4 font-semibold">Patient</th>
                    <th className="px-8 py-4 font-semibold">Date</th>
                    <th className="px-8 py-4 font-semibold">Time</th>
                    <th className="px-8 py-4 font-semibold">Status</th>
                    <th className="px-8 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan={4} className="px-8 py-20 text-center text-slate-400 italic">Syncing with database...</td></tr>
                  ) : filteredAppointments.length === 0 ? (
                    <tr><td colSpan={4} className="px-8 py-20 text-center text-slate-400">No appointments found.</td></tr>
                  ) : filteredAppointments.map(appt => (
                    <tr key={appt.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-8 py-5">
                        <p className="font-bold text-slate-800">{appt.first_name} {appt.last_name}</p>
                        <p className="text-xs text-slate-500">{appt.email}</p>
                      </td>
                      <td className="px-8 py-5 text-sm font-medium">{new Date(appt.preferred_date).toLocaleDateString()}</td>
                      <td className="px-8 py-5 text-sm font-semibold text-primary">
                        {appt.preferred_time
                          ? new Date(`1970-01-01T${appt.preferred_time}`).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                          : '-'}
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${appt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          appt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>{appt.status === "reschedule_pending" ? "Reschedule" : appt.status}</span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                        {appt.status === 'pending' && (
                          <>
                            <button onClick={() => handleUpdateStatus(appt.id, 'confirmed')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Confirm"><Check className="w-4 h-4" /></button>
                            <button onClick={() => handleUpdateStatus(appt.id, 'cancelled')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject"><X className="w-4 h-4" /></button>
                          </>
                          )}
                        {(appt.status === 'pending' || appt.status === 'confirmed') && (
                          <button
                          onClick={() => openRescheduleModal(appt)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Reschedule"
                          >
    <ClockPlus className="w-4 h-4"/>
  </button>
)}
    </div>
                      </td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 md:p-8">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-bold text-slate-800">
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex gap-2">
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-2 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={() => setCurrentMonth(new Date())} className="px-4 py-2 text-sm font-bold border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Today</button>
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-2 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 border-t border-l border-slate-100">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="p-4 bg-slate-50 border-r border-b border-slate-100 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">{d}</div>
            ))}
            {calendarDays.map((date, i) => {
              const apptsToday = date ? appointments.filter(a => new Date(a.preferred_date).toDateString() === date.toDateString()) : [];
              return (
                <div key={i} className={`min-h-[140px] p-2 border-r border-b border-slate-100 group transition-colors ${date ? 'hover:bg-slate-50/50 bg-white' : 'bg-slate-50/30'}`}>
                  {date && (
                    <>
                      <div className="text-right text-sm font-semibold text-slate-400 mb-2">{date.getDate()}</div>
                      <div className="space-y-1">
                        {apptsToday.slice(0, 3).map(a => (
                          <div key={a.id} className={`text-[10px] p-1.5 rounded-md truncate font-bold border-l-2 shadow-sm ${a.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-500' :
                            a.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-500' :
                              'bg-yellow-50 text-yellow-700 border-yellow-500'
                            }`}>
                            <div className="font-semibold">
                              {a.preferred_time
                                ? new Date(`1970-01-01T${a.preferred_time}`).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                                : ''}
                            </div>
                            <div>
                              {a.first_name} {a.last_name[0]}.
                            </div>
                          </div>
                        ))}
                        {apptsToday.length > 3 && <div className="text-[10px] text-center text-slate-400 font-bold py-1">+{apptsToday.length - 3} more</div>}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

{isRescheduleOpen && selectedAppointment && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">

      {/* Header */}
      <div className="bg-primary text-white px-6 py-4">
        <h3 className="text-lg font-bold">Reschedule Appointment</h3>
        <p className="text-sm opacity-90">
          Update date & time for this patient
        </p>
      </div>

      <div className="p-6 space-y-6">

        {/* PATIENT INFO (READ ONLY) */}
        <div className="grid md:grid-cols-2 gap-4">

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">
              First Name
            </label>
            <input
              value={selectedAppointment.first_name}
              readOnly
              className="w-full rounded-xl bg-slate-100 border-slate-200 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">
              Last Name
            </label>
            <input
              value={selectedAppointment.last_name}
              readOnly
              className="w-full rounded-xl bg-slate-100 border-slate-200 cursor-not-allowed"
            />
          </div>

        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">
            Email Address
          </label>
          <input
            value={selectedAppointment.email}
            readOnly
            className="w-full rounded-xl bg-slate-100 border-slate-200 cursor-not-allowed"
          />
        </div>

        {/* CURRENT APPOINTMENT INFO */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 font-semibold uppercase mb-2">
            Current Appointment
          </p>

          <div className="flex justify-between text-sm">
            <span>Date:</span>
            <span className="font-semibold">
              {selectedAppointment.preferred_date}
            </span>
          </div>

          <div className="flex justify-between text-sm mt-1">
            <span>Time:</span>
            <span className="font-semibold">
              {selectedAppointment.preferred_time}
            </span>
          </div>

          <div className="flex justify-between text-sm mt-1">
            <span>Status:</span>
            <span className={`px-2 py-1 text-xs rounded-full font-bold
              ${selectedAppointment.status === 'confirmed'
                ? 'bg-green-100 text-green-700'
                : selectedAppointment.status === 'pending'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
              }`}>
              {selectedAppointment.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* NEW DATE & TIME (EDITABLE) */}
        <div className="grid md:grid-cols-2 gap-4">

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">
              New Date
            </label>
            <input
              type="date"
              value={newDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full rounded-xl border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">
              New Time
            </label>
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full rounded-xl border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary"
            />
          </div>

        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4 border-t">

          <button
            onClick={() => setIsRescheduleOpen(false)}
            className="px-5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            disabled={rescheduleLoading}
            onClick={handleRescheduleSubmit}
            className="px-6 py-2 bg-accent-coral text-white rounded-xl font-bold shadow-md hover:bg-accent-coral-dark transition disabled:opacity-50"
          >
            {rescheduleLoading ? "Updating..." : "Reschedule & Notify"}
          </button>

        </div>

      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default AppointmentManager;
