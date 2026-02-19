import { useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { db } from "@/services/supabase"
import { CheckCircle, Loader2, AlertTriangle } from "lucide-react"
import { emailService } from "@/services/email"

interface Appointment {
  id: string
  first_name: string
  preferred_date: string
  preferred_time: string
  proposed_date?: string
  proposed_time?: string
  status: string
}

export default function ConfirmReschedule() {
  const [params] = useSearchParams()
  const id = params.get("id")

  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!id) {
      setError(true)
      setLoading(false)
      return
    }

    fetchAppointment()
  }, [id])

  const fetchAppointment = async () => {
    if (!id) return
  
    const { data, error } = await db.appointments.getById(id);
  
    if (error || !data) {
      setError(true)
      setLoading(false)
      return
    }
  
    // If already confirmed
    if (data.status === 'confirmed' && !data.proposed_date) {
      setConfirmed(true)
      setLoading(false)
      return
    }
  
    // If not in reschedule flow
    if (data.status !== 'reschedule_pending' || !data.proposed_date) {
      setError(true)
      setLoading(false)
      return
    }
  
    // Valid reschedule
    setAppointment(data)
    setLoading(false)
  }

  const handleConfirm = async () => {
    if (!appointment) return
  
    setConfirming(true)
  
    const { data, error } = await db.appointments.update(
      appointment.id,
      {
        preferred_date: appointment.proposed_date,
        preferred_time: appointment.proposed_time,
        proposed_date: null,
        proposed_time: null,
        status: 'confirmed'
      }
    )
  
    if (error) {
      setError(true)
    } else {
        if (!error) {
            await emailService.sendRescheduleConfirmedEmail({
              ...appointment,
              confirmed_date: appointment.proposed_date,
              confirmed_time: appointment.proposed_time
            })
          
            setConfirmed(true)
          }
    }
  
    setConfirming(false)
  }

  {confirmed && (
    <p className="text-slate-600 text-sm">
      Your appointment has already been confirmed.
    </p>
  )}

  return (
    <div className="min-h-screen w-full absolute flex items-center justify-center bg-black/10 px-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center">

        {loading && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-slate-600">Checking appointment...</p>
          </div>
        )}

        {!loading && error && (
          <div className="space-y-4">
            <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
            <h2 className="text-lg font-bold text-red-600">
              Invalid or Expired Link
            </h2>
          </div>
        )}

        {!loading && appointment && !confirmed && (
          <>
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Confirm Your New Appointment
            </h2>

            <p className="text-slate-600 mb-6">
              Hi {appointment.first_name}, please confirm your new appointment time.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left mb-6">
              <p className="text-sm text-slate-500">New Date</p>
              <p className="font-semibold text-slate-800">
                {appointment.proposed_date}
              </p>

              <p className="text-sm text-slate-500 mt-3">New Time</p>
              <p className="font-semibold text-slate-800">
                {appointment.proposed_time}
              </p>
            </div>

            <button
              onClick={handleConfirm}
              disabled={confirming}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
            >
              {confirming ? "Confirming..." : "Confirm Appointment"}
            </button>
          </>
        )}

        {!loading && confirmed && (
          <div className="space-y-4">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
            <h2 className="text-xl font-bold text-green-600">
              Appointment Confirmed!
            </h2>
          </div>
        )}

      </div>
    </div>
  )
}