import { Stethoscope } from 'lucide-react'
import { Service } from '@/types'

interface ServicesProps {
    services: Service[]
    loading?: boolean
}

const servicesSectionContent = {
    eyebrow: "Our Expertise",
    title: "Complete Dental Care"
}

export default function Services({ services, loading }: ServicesProps) {

    if (loading) {
        return (
            <section className="py-20 bg-background-light">
                <div className="text-center text-slate-500">
                    Loading services...
                </div>
            </section>
        )
    }

    return (
        <section id="services" className="py-20 bg-background-light">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-primary font-semibold tracking-wide uppercase text-sm mb-3">
                        {servicesSectionContent.eyebrow}
                    </h2>

                    <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        {servicesSectionContent.title}
                    </h3>
                </div>

                {/* Services Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map(service => (
                        <div key={service.id} className="flex">
                            <ServiceCard service={service} />
                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}

interface ServiceCardProps {
    service: Service
}

function ServiceCard({ service }: ServiceCardProps) {
    return (
        <div className="group p-8 rounded-2xl bg-white border border-slate-100 transition-all hover:shadow-lg">

            <div className="w-14 h-14 rounded-xl bg-secondary-mint flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                <Stethoscope className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
            </div>

            <h4 className="text-xl font-bold text-slate-900 mb-3">
                {service.name}
            </h4>

            <p className="text-slate-600 leading-relaxed line-clamp-3">
                {service.description}
            </p>

        </div>
    )
}
