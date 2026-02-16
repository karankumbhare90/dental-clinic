import React from 'react'
import { Link } from 'react-router-dom'
import { MoreVertical, ArrowUpRight } from 'lucide-react'
import { Appointment } from '@/types'
import { getOptimizedImage } from '@/utils/image'

interface RecentAppointmentsTableProps {
    appointments: Appointment[]
}

const RecentAppointmentsTable: React.FC<RecentAppointmentsTableProps> = ({
    appointments,
}) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                    Recent Appointments
                </h3>
                <Link
                    to="/admin/appointments"
                    className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
                >
                    View All <ArrowUpRight className="w-3 h-3" />
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
                            <th className="px-8 py-4 font-semibold">Patient</th>
                            <th className="px-8 py-4 font-semibold">Service</th>
                            <th className="px-8 py-4 font-semibold">Date & Time</th>
                            <th className="px-8 py-4 font-semibold">Status</th>
                            {/* <th className="px-8 py-4 font-semibold text-right">Actions</th> */}
                        </tr>
                    </thead>

                    <tbody className="text-slate-600 dark:text-slate-300 text-sm">
                        {appointments?.length ? (
                            appointments.map((appt) => (
                                <tr
                                    key={appt.id}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-0"
                                >
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <img
                                                alt="Avatar"
                                                className="w-8 h-8 rounded-full object-cover"
                                                src={getOptimizedImage(
                                                    `https://picsum.photos/seed/${appt.id ?? 'default'}/100/100`,
                                                    80,
                                                    80
                                                )}
                                            />
                                            <span className="font-medium text-slate-800 dark:text-white">
                                                {appt.first_name ?? ''} {appt.last_name ?? ''}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-8 py-5">
                                        General Checkup
                                    </td>

                                    <td className="px-8 py-5">
                                        {appt.preferred_date ?? '-'}
                                    </td>

                                    <td className="px-8 py-5">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${appt.status === 'confirmed'
                                                    ? 'bg-green-100 text-green-700'
                                                    : appt.status === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}
                                        >
                                            <span
                                                className={`w-1.5 h-1.5 rounded-full ${appt.status === 'confirmed'
                                                        ? 'bg-green-500'
                                                        : appt.status === 'pending'
                                                            ? 'bg-yellow-500'
                                                            : 'bg-red-500'
                                                    }`}
                                            />
                                            {(appt.status ?? 'unknown')
                                                .charAt(0)
                                                .toUpperCase() +
                                                (appt.status ?? '').slice(1)}
                                        </span>
                                    </td>

                                    {/* <td className="px-8 py-5 text-right">
                                        <button className="text-slate-400 hover:text-primary transition-colors p-1">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </td> */}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-8 py-10 text-center text-slate-400"
                                >
                                    No recent appointments found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default RecentAppointmentsTable
