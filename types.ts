
export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  icon_name: string;
  is_active: boolean;
  created_at: string;
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  category: string
  featured_image_url: string
  author_name: string
  seo_title?: string
  seo_description?: string
  published_at: string | null
  created_at: string
}

export interface RecentPost {
  id: string
  title: string
  excerpt?: string,
  slug: string
  featured_image_url?: string | null
  created_at: string
}

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

export interface Appointment {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  service_id: string;
  service_name?: string;
  preferred_date: string;
  preferred_time?: string;
  message?: string;
  status: AppointmentStatus;
  created_at: string;
}

export interface Patient {
  id: string;
  full_name: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  emergency_contact: string;
  medical_history: string;
  created_at: string;
}

export interface ClinicSettings {
  id: string;
  key: string;
  value: any;
}
