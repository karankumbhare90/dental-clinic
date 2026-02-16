import React, { useState, useMemo } from 'react'
import { CheckCircle, Phone, Mail, MapPin } from 'lucide-react'
import { Service } from '@/types'
import { db } from '@/services/supabase'
import { emailService } from '@/services/email'

interface BookingSectionProps {
    services: Service[]
}

/* ----------------------------------
   STATIC CONTENT CONFIG
---------------------------------- */

const bookingContent = {
    title: "Book an Appointment",
    description:
        "Ready for your checkup? Fill out the form and we'll get back to you within 24 hours.",
    contactInfo: [
        { icon: Phone, value: "(555) 123-4567" },
        { icon: Mail, value: "hello@luminadental.com" },
        { icon: MapPin, value: "123 Main Street, NY" }
    ]
}

/* ----------------------------------
   TIME SLOT GENERATOR
---------------------------------- */

const generateTimeSlots = (
    start = "09:00",
    end = "17:00",
    interval = 30
) => {
    const slots: string[] = []
    const [startHour, startMinute] = start.split(":").map(Number)
    const [endHour, endMinute] = end.split(":").map(Number)

    const current = new Date()
    current.setHours(startHour, startMinute, 0)

    const endTime = new Date()
    endTime.setHours(endHour, endMinute, 0)

    while (current <= endTime) {
        const hours = current.getHours().toString().padStart(2, "0")
        const minutes = current.getMinutes().toString().padStart(2, "0")
        slots.push(`${hours}:${minutes}`)
        current.setMinutes(current.getMinutes() + interval)
    }

    return slots
}


export default function BookingSection({ services }: BookingSectionProps) {
    const [status, setStatus] =
        useState<'idle' | 'loading' | 'success' | 'error'>('idle')

    const timeSlots = useMemo(() => generateTimeSlots(), [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget
        setStatus('loading')

        const formData = new FormData(form)

        const appointment = {
            first_name: formData.get('firstName') as string,
            last_name: formData.get('lastName') as string,
            email: formData.get('email') as string,
            service_id: formData.get('service') as string,
            preferred_date: formData.get('date') as string,
            preferred_time: formData.get('time') as string,
            message: formData.get('message') as string,
            status: 'pending'
        }

        const { error } = await db.appointments.create(appointment)

        if (error) {
            setStatus('error')
        } else {
            setStatus('success')
            emailService.sendNewBookingNotification(appointment)
            form.reset()
        }
    }

    return (
        <section id="booking" className="py-20 bg-secondary-mint/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-xl border border-slate-100 bg-white">

                    <ContactPanel />

                    <BookingForm
                        services={services}
                        status={status}
                        onSubmit={handleSubmit}
                        timeSlots={timeSlots}
                    />

                </div>
            </div>
        </section>
    )
}

/* ----------------------------------
   CONTACT PANEL COMPONENT
---------------------------------- */

function ContactPanel() {
    return (
        <div className="bg-primary text-white p-6 md:p-8 lg:p-10 flex flex-col justify-between">
            <div>
                <h3 className="text-2xl font-bold mb-4">
                    {bookingContent.title}
                </h3>

                <p className="text-primary-light mb-8">
                    {bookingContent.description}
                </p>

                <div className="space-y-4 text-sm">
                    {bookingContent.contactInfo.map((item, index) => {
                        const Icon = item.icon
                        return (
                            <div key={index} className="flex items-center gap-3">
                                <Icon className="w-5 h-5" />
                                <span>{item.value}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

/* ----------------------------------
   FORM COMPONENT
---------------------------------- */

interface BookingFormProps {
    services: Service[]
    status: string
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    timeSlots: string[]
}

function BookingForm({
    services,
    status,
    onSubmit,
    timeSlots
}: BookingFormProps) {

    if (status === 'success') {
        return (
            <div className="p-10 text-center space-y-4 py-16">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-12 h-12" />
                </div>
                <h4 className="text-2xl font-bold">Request Sent!</h4>
                <p className="text-slate-600">We will contact you shortly.</p>
            </div>
        )
    }

    return (
        <div className="p-6 md:p-8 lg:p-10">
            <form onSubmit={onSubmit} className="space-y-6" noValidate>

                <div className="grid md:grid-cols-2 gap-4">

                    <div>
                        <label htmlFor="firstName" className="sr-only">
                            First Name
                        </label>
                        <input
                            required
                            id="firstName"
                            name="firstName"
                            placeholder="First Name"
                            autoComplete="given-name"
                            className="booking-form-input w-full rounded-xl border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label htmlFor="lastName" className="sr-only">
                            Last Name
                        </label>
                        <input
                            required
                            id="lastName"
                            name="lastName"
                            placeholder="Last Name"
                            autoComplete="family-name"
                            className="booking-form-input w-full rounded-xl border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                </div>

                <div>
                    <label htmlFor="email" className="sr-only">
                        Email Address
                    </label>
                    <input
                        required
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        autoComplete="email"
                        inputMode="email"
                        className="booking-form-input w-full rounded-xl border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div>
                    <label htmlFor="service" className="sr-only">
                        Select Service
                    </label>
                    <select
                        required
                        id="service"
                        name="service"
                        className="booking-form-input w-full rounded-xl border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="">Select Service</option>
                        {services.map(s => (
                            <option key={s.id} value={s.id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">

                    <div>
                        <label htmlFor="date" className="sr-only">
                            Preferred Date
                        </label>
                        <input
                            required
                            id="date"
                            type="date"
                            name="date"
                            min={new Date().toISOString().split("T")[0]}
                            className="booking-form-input w-full rounded-xl border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label htmlFor="time" className="sr-only">
                            Preferred Time
                        </label>
                        <select
                            required
                            id="time"
                            name="time"
                            className="booking-form-input w-full rounded-xl border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">Select Time</option>
                            {timeSlots.map(time => (
                                <option key={time} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>

                <div>
                    <label htmlFor="message" className="sr-only">
                        Additional Notes
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        placeholder="Any specific concerns?"
                        rows={4}
                        className="w-full rounded-xl border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <button
                    type="submit"
                    disabled={status === 'loading'}
                    aria-disabled={status === 'loading'}
                    aria-busy={status === 'loading'}
                    className="w-full bg-accent-coral hover:bg-accent-coral-dark text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-accent-coral"
                >
                    {status === 'loading' ? 'Submitting...' : 'Submit Request'}
                </button>

                {status === 'error' && (
                    <p
                        className="text-red-500 text-sm"
                        role="alert"
                    >
                        Something went wrong. Please try again.
                    </p>
                )}

                </form>
        </div>
    )
}
