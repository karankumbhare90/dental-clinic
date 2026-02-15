
import React, { useState, useEffect } from 'react';
import { db } from '../services/supabase';
import { emailService } from '../services/email';
import HeroSection from '@/components/HeroSection';
import Services from '@/components/Services';
import { Service } from '@/types';
import About from '@/components/About';
import BookingSection from '@/components/BookingSection';

const LandingPage: React.FC = () => {

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      const { data, error } = await db.services.getAll();
      if (!error && data) {
        setServices(data.filter(s => s.is_active));
      }
      setLoading(false);
    }
    fetchServices();
  }, []);

  return (
    <div className="space-y-0">
      <HeroSection />

      {/* Services Section */}
      <Services services={services} loading={loading} />

      {/* About Section */}
      <About />

      {/* Booking Section */}
      <BookingSection services={services} />
    </div>
  );
};

export default LandingPage;
