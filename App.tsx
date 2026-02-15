
import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';

import { supabase } from './services/supabase';

// Shared Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import BlogListingPage from './pages/BlogListingPage';
import BlogDetailPage from './pages/BlogDetailPage';
import LoginPage from './pages/LoginPage';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AppointmentManager from './pages/admin/AppointmentManager';
import PatientManager from './pages/admin/PatientManager';
import PatientForm from './pages/admin/PatientForm';
import ServiceManager from './pages/admin/ServiceManager';
import ServiceForm from './pages/admin/ServiceForm';
import BlogEditor from './pages/admin/BlogEditor';
import BlogPostForm from './pages/admin/BlogPostForm';
import AdminLayout from './pages/admin/AdminLayout';

// Context
const AuthContext = createContext<{ user: any; loading: boolean; login: any; logout: any }>({
  user: null, loading: true, login: null, logout: null
});

export const useAuth = () => useContext(AuthContext);

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    return await supabase.auth.signInWithPassword({ email, password: pass });
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-background-light text-primary font-bold">LUMINA DENTAL...</div>;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
          <Route path="/blog" element={<PublicLayout><BlogListingPage /></PublicLayout>} />
          <Route path="/blog/:slug" element={<PublicLayout><BlogDetailPage /></PublicLayout>} />
          <Route path="/login" element={<LoginPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/appointments" element={<ProtectedRoute><AdminLayout><AppointmentManager /></AdminLayout></ProtectedRoute>} />

          <Route path="/admin/patients" element={<ProtectedRoute><AdminLayout><PatientManager /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/patients/new" element={<ProtectedRoute><AdminLayout><PatientForm /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/patients/edit/:id" element={<ProtectedRoute><AdminLayout><PatientForm /></AdminLayout></ProtectedRoute>} />

          <Route path="/admin/services" element={<ProtectedRoute><AdminLayout><ServiceManager /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/services/new" element={<ProtectedRoute><AdminLayout><ServiceForm /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/services/edit/:id" element={<ProtectedRoute><AdminLayout><ServiceForm /></AdminLayout></ProtectedRoute>} />

          <Route path="/admin/blog" element={<ProtectedRoute><AdminLayout><BlogEditor /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/blog/new" element={<ProtectedRoute><AdminLayout><BlogPostForm /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/blog/edit/:id" element={<ProtectedRoute><AdminLayout><BlogPostForm /></AdminLayout></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);



export default App;
