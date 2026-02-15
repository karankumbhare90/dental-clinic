import { getOptimizedImage } from "@/utils/image";

const HeroSection = () => {
    return (
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-24 lg:pb-32 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    <div className="order-2 lg:order-1">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-mint text-primary text-sm font-semibold mb-6">
                            <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                            Accepting New Patients
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                            Your Smile, <br />
                            <span className="text-primary">Our Priority.</span>
                        </h1>
                        <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
                            Experience comprehensive family dentistry in a modern environment. We blend advanced technology with compassionate care.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a href="#booking" className="inline-flex justify-center items-center px-8 py-3.5 border border-transparent text-base font-semibold rounded-lg text-white bg-primary hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
                                Schedule Visit
                            </a>
                        </div>
                        <div className="mt-10 flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map(i => (
                                    <img
                                        key={i}
                                        alt="Happy patient"
                                        className="w-10 h-10 rounded-full border-2 border-white object-cover"
                                        src={getOptimizedImage(`https://picsum.photos/seed/${i}/100/100`, 100, 100)}
                                    />
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-secondary-blue flex items-center justify-center text-xs font-bold text-primary">
                                    2k+
                                </div>
                            </div>
                            <p className="text-sm text-slate-500 font-medium">Trusted by 2,000+ local families</p>
                        </div>
                    </div>
                    <div className="order-1 lg:order-2 relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                alt="Smile"
                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                                src={getOptimizedImage("https://images.unsplash.com/photo-1606811841689-23dfddce3e95", 800, 600)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
