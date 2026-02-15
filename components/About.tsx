import { getOptimizedImage } from '../utils/image';

const aboutContent = {
    eyebrow: "Meet The Team",
    title: "Experience Personalized Care",
    doctorName: `Dr. Sarah Smith`,
    designation: "Lead Dentist",
    description:
        `At Lumina Dental, we understand that visiting the dentist can be stressful for some. That's why we've designed our practice to be a calm, welcoming haven where your comfort is just as important as your oral health.

Led by Dr.Sarah Smith, our team of specialists is dedicated to providing personalized treatment plans using the latest minimally invasive techniques.`,
    quote: "We believe in treating the person, not just the teeth. Every smile has a story, and we are honored to be a part of yours.",
    image: {
        src: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        width: 600,
        height: 800,
        alt: "Lead Dentist"
    },
    statsData: [
        {
            value: "15+",
            label: "Years Experience",
        },
        {
            value: "50+",
            label: "Team Members",
        },
        {
            value: "2k+",
            label: "Happy Patients",
        },
        {
            value: "4.9",
            label: "Google Rating",
        },
    ]
};

export default function About() {
    return (
        <section id="about" className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-12 gap-12 items-center">

                    {/* Image */}
                    <div className="lg:col-span-5 relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[3/4]">
                            <img
                                alt={aboutContent.image.alt}
                                loading="lazy"
                                decoding="async"
                                width={600}
                                height={800}
                                className="w-full h-auto object-cover"
                                src={getOptimizedImage(
                                    aboutContent.image.src,
                                    600,
                                    800
                                )}
                                srcSet={`
    ${getOptimizedImage(aboutContent.image.src, 300, 400)} 300w,
    ${getOptimizedImage(aboutContent.image.src, 600, 800)} 600w
  `}
                                sizes="(max-width: 768px) 100vw, 40vw"
                            />
                        </div>
                    </div>

                    {/* Text */}
                    <div className="lg:col-span-7">
                        <h2 className="text-primary font-semibold tracking-wide uppercase text-sm mb-3">
                            {aboutContent.eyebrow}
                        </h2>

                        <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                            {aboutContent.title}
                        </h3>

                        <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                            {aboutContent.description}
                        </p>

                        <div className="bg-secondary-blue p-8 rounded-xl border-l-4 border-primary italic text-xl font-medium text-primary">
                            "{aboutContent.quote}"

                            <div className="flex items-center gap-1.5 not-italic">
                                <span className="block mt-2 text-sm font-semibold text-slate-700">
                                    - {aboutContent.doctorName},
                                </span>
                                <span className="block mt-2 text-xs font-normal text-slate-700">
                                    {aboutContent.designation}
                                </span>
                            </div>
                        </div>

                        <div>
                            {/* Render Stats Data */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                                {aboutContent.statsData.map((stat, index) => (
                                    <div key={index} className="text-center">
                                        <div className="text-2xl font-bold text-primary">
                                            {stat.value}
                                        </div>
                                        <div className="text-sm text-slate-600">
                                            {stat.label}
                                        </div>
                                    </div>))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
