import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Stethoscope } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', type: 'route', to: '/' },
    { name: 'Services', type: 'anchor', href: '#services' },
    { name: 'About Us', type: 'anchor', href: '#about' },
    { name: 'Blog', type: 'route', to: '/blog' },
  ];

  const isActiveRoute = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-primary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <Stethoscope className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl text-primary dark:text-white tracking-tight">
              Lumina Dental
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => {
              if (link.type === 'route') {
                return (
                  <Link
                    key={link.name}
                    to={link.to!}
                    className={`font-medium transition-colors ${isActiveRoute(link.to!)
                        ? 'text-primary'
                        : 'text-slate-600 dark:text-slate-300 hover:text-primary'
                      }`}
                  >
                    {link.name}
                  </Link>
                );
              }

              return (
                <a
                  key={link.name}
                  href={link.href}
                  className="font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              );
            })}

            {/* Book Button */}
            <a
              href="#booking"
              className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark transition-colors shadow-sm"
            >
              Book Now
            </a>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              type="button"
              className="text-slate-500 hover:text-primary p-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {isOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden container mx-auto bg-white dark:bg-background-dark border-b border-primary/10 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            if (link.type === 'route') {
              return (
                <Link
                  key={link.name}
                  to={link.to!}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-3 rounded-lg font-medium transition-colors ${isActiveRoute(link.to!)
                      ? 'text-primary bg-primary/10'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                >
                  {link.name}
                </Link>
              );
            }

            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-3 rounded-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50"
              >
                {link.name}
              </a>
            );
          })}

          <a
            href="#booking"
            onClick={() => setIsOpen(false)}
            className="block w-full text-center px-6 py-3 rounded-lg font-medium text-white bg-primary hover:bg-primary-dark transition-colors"
          >
            Book Now
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
