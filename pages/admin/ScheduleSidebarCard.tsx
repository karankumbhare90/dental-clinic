import React, { useMemo } from 'react'
import { Clock } from 'lucide-react'
import { Appointment } from '../../types'
import { useNavigate } from 'react-router-dom'

interface ScheduleSidebarCardProps {
    appointments: Appointment[]
}

const getAppointmentDateTime = (appt: Appointment): Date | null => {
    if (!appt.preferred_date || !appt.preferred_time) return null

    const dateTime = new Date(
        `${appt.preferred_date}T${appt.preferred_time}`
    )

    if (isNaN(dateTime.getTime())) return null

    return dateTime
}

const ScheduleSidebarCard: React.FC<ScheduleSidebarCardProps> = ({
    appointments,
}) => {
    const navigate = useNavigate()
    const now = new Date()

    const upcomingAppointments = useMemo(() => {
        return appointments
            .map((appt) => ({
                ...appt,
                dateTime: getAppointmentDateTime(appt),
            }))
            .filter((appt) => appt.dateTime && appt.dateTime >= now)
            .sort(
                (a, b) =>
                    a.dateTime!.getTime() - b.dateTime!.getTime()
            )
            .slice(0, 2)
    }, [appointments])

    console.log(upcomingAppointments)

    const pendingToday = useMemo(() => {
        const today = new Date().toDateString()

        return appointments.filter((appt) => {
            const dateTime = getAppointmentDateTime(appt)
            if (!dateTime) return false

            return (
                dateTime.toDateString() === today &&
                appt.status === 'pending'
            )
        }).length
    }, [appointments])

    return (
        <div className="bg-primary text-white p-6 rounded-lg shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div>
                <h3 className="font-bold text-xl mb-4">
                    Today's Schedule
                </h3>

                <p className="text-primary-light text-sm mb-8 opacity-80">
                    You have {pendingToday} pending request
                    {pendingToday !== 1 && 's'} today.
                </p>

                <div className="space-y-4">
                    {upcomingAppointments.length > 0 ? (
                        upcomingAppointments.map((appt) => (
                            <div
                                key={appt.id}
                                className="bg-white/10 p-4 rounded-lg flex items-center gap-4 backdrop-blur-sm border border-white/10"
                            >
                                <div className="bg-white/20 p-2 rounded-full">
                                    <Clock className="w-4 h-4" />
                                </div>

                                <div>
                                    <p className="font-semibold text-sm">
                                        Next:{' '}
                                        {appt.dateTime!.toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>

                                    <p className="text-primary-light text-xs opacity-70">
                                        {appt.first_name} {appt.last_name}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-primary-light opacity-70">
                            No upcoming appointments.
                        </p>
                    )}
                </div>
            </div>

            <button
                onClick={() =>
                    navigate('/admin/appointments')
                }
                className="w-full bg-white text-primary font-bold py-4 px-4 rounded-lg mt-8 hover:bg-slate-50 transition-colors shadow-lg shadow-black/10"
            >
                View Full Calendar
            </button>
        </div>
    )
}

export default ScheduleSidebarCard
