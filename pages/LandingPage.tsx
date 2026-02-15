
import React, { useState, useEffect } from 'react';
import { db } from '../services/supabase';
import HeroSection from '@/components/HeroSection';
import { Service } from '@/types';
import About from '@/components/About';
import { lazy, Suspense } from "react";

const Services = lazy(() => import("@/components/Services"));
const BookingSection = lazy(() => import("@/components/BookingSection"));

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
      <Suspense fallback={<div className="h-64" />}>
        <Services services={services} loading={loading} />
      </Suspense>

      {/* About Section */}
      <About />

      {/* Booking Section */}
      <Suspense fallback={<div className="h-64" />}>
        <BookingSection services={services} />
      </Suspense>
    </div>
  );
};

export default LandingPage;
