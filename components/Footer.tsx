import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: '#' },
    { name: 'Twitter', icon: Twitter, url: '#' },
    { name: 'Instagram', icon: Instagram, url: '#' }
  ];

  const quickLinks = [
    { name: 'Home', type: 'route', to: '/' },
    { name: 'About Us', type: 'anchor', href: '#about' },
    { name: 'Services', type: 'anchor', href: '#services' },
    { name: 'Dental Blog', type: 'route', to: '/blog' },
    { name: 'Book Appointment', type: 'anchor', href: '#booking' }
  ];

  const serviceLinks = [
    'Teeth Whitening',
    'Dental Implants',
    'Crowns & Bridges',
    'Family Dentistry',
    'Emergency Care'
  ];

  const clinicHours = [
    { day: 'Mon - Fri', time: '8:00 AM - 6:00 PM' },
    { day: 'Saturday', time: '9:00 AM - 2:00 PM' },
    { day: 'Sunday', time: 'Closed', highlight: true }
  ];

  const footerSections = [
    {
      title: 'Quick Links',
      content: (
        <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
          {quickLinks.map(link => (
            <li key={link.name}>
              {link.type === 'route' ? (
                <Link to={link.to!} className="hover:text-primary transition-colors">
                  {link.name}
                </Link>
              ) : (
                <a href={link.href!} className="hover:text-primary transition-colors">
                  {link.name}
                </a>
              )}
            </li>
          ))}
        </ul>
      )
    },
    {
      title: 'Services',
      content: (
        <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
          {serviceLinks.map(service => (
            <li key={service} className="hover:text-primary transition-colors">
              {service}
            </li>
          ))}
        </ul>
      )
    },
    {
      title: 'Clinic Hours',
      content: (
        <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
          {clinicHours.map(hour => (
            <li key={hour.day} className="flex justify-between">
              <span>{hour.day}</span>
              <span className={`font-medium ${hour.highlight
                ? 'text-accent-coral'
                : 'text-slate-800 dark:text-slate-200'
                }`}>
                {hour.time}
              </span>
            </li>
          ))}
        </ul>
      )
    }
  ];

  return (
    <footer className="bg-primary/5 dark:bg-slate-900 pt-16 pb-8 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Stethoscope className="w-8 h-8 text-primary" />
              <span className="font-bold text-xl text-primary dark:text-white tracking-tight">
                Lumina Dental
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              Bringing confidence to your smile with state-of-the-art dental care in a warm, family-friendly environment.
            </p>

            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Dynamic Sections */}
          {footerSections.map(section => (
            <div key={section.title}>
              <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-widest">
                {section.title}
              </h4>
              {section.content}
            </div>
          ))}

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Lumina Dental Clinic. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-slate-500 dark:text-slate-400">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
