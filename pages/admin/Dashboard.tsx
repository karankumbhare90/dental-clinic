import React, { useState, useEffect, lazy, Suspense } from 'react'
import {
  Users,
  Calendar,
  Clock,
} from 'lucide-react'
import { db } from '../../services/supabase'
import { Appointment } from '../../types'
import StatCard from './StatCard'
import RecentAppointmentsTable from './RecentAppointmentsTable'
const AppointmentTrendsCard = lazy(
  () => import("./AppointmentTrendsCard")
)
import ScheduleSidebarCard from './ScheduleSidebarCard'

/* -----------------------------
   Utility: Generate Weekly Data
-------------------------------- */
const generateWeeklyData = (appointments: Appointment[]) => {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const counts = Array(7).fill(0)

  appointments.forEach((appt) => {
    if (!appt?.preferred_date) return
    const date = new Date(appt.preferred_date)
    if (isNaN(date.getTime())) return
    const dayIndex = date.getDay()
    counts[dayIndex] += 1
  })

  return weekDays.map((day, i) => ({
    name: day,
    count: counts[i],
  }))
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    appointments: 0,
    patients: 0,
    pending: 0,
  })

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [chartData, setChartData] = useState<
    { name: string; count: number }[]
  >([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function fetchData() {
      try {
        const { data: appts } = await db.appointments.getAll()
        const { data: pats } = await db.patients.getAll()

        if (!isMounted) return

        if (appts) {
          const totalAppointments = appts.length

          const pendingCount = appts.filter(
            (appt) => appt.status === 'pending'
          ).length

          setAppointments(appts.slice(0, 5))

          setStats({
            appointments: totalAppointments,
            patients: 0, // temporary, will update below
            pending: pendingCount,
          })

          setChartData(generateWeeklyData(appts))
        }

        if (pats) {
          setStats((prev) => ({
            ...prev,
            patients: pats.length,
          }))
        }
      } catch (error) {
        console.error('Dashboard fetch error:', error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [])
  const statItems = [
    {
      title: 'Total Appointments',
      value: stats.appointments.toString(),
      icon: Calendar,
      color: 'bg-primary',
    },
    {
      title: 'Total Patients',
      value: stats.patients.toString(),
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Pending Appointments',
      value: stats.pending.toString(),
      icon: Clock,
      color: 'bg-yellow-500',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {statItems.map((item) => (
          <StatCard
            key={item.title}
            title={item.title}
            value={item.value}
            change=""
            isUp={true}
            icon={item.icon}
            color={item.color}
          />
        ))}
      </div>

      {/* Chart + Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Suspense fallback={<div>Loading chart...</div>}>
          <AppointmentTrendsCard data={chartData} />
        </Suspense>
        <ScheduleSidebarCard appointments={appointments} />
      </div>

      {/* Table */}
      <RecentAppointmentsTable appointments={appointments} />
    </div>
  )
}

export default AdminDashboard
