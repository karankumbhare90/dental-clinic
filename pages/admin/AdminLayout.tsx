import { useAuth } from '@/App'
import {
    Calendar,
    Users,
    BookOpen,
    LayoutDashboard,
    Stethoscope,
    Menu,
    ChevronRight,
    LogOut,
} from 'lucide-react'
import React, { useState, useMemo, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

interface AdminLayoutProps {
    children: React.ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const location = useLocation()
    const { logout, user } = useAuth()
    const navigate = useNavigate()

    const navItems = useMemo(
        () => [
            { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
            { name: 'Appointments', path: '/admin/appointments', icon: Calendar },
            { name: 'Patients', path: '/admin/patients', icon: Users },
            { name: 'Services', path: '/admin/services', icon: Stethoscope },
            { name: 'Blog Content', path: '/admin/blog', icon: BookOpen },
        ],
        []
    )

    const handleLogout = useCallback(async () => {
        try {
            await logout()
            navigate('/')
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }, [logout, navigate])

    const displayName = useMemo(() => {
        return user?.email?.split('@')[0] ?? 'Admin'
    }, [user?.email])

    const avatarUrl = useMemo(() => {
        return `https://ui-avatars.com/api/?name=${user?.email ?? 'Admin'}&background=random`
    }, [user?.email])

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 h-screen w-64 bg-primary text-white transition-transform duration-300 transform lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="h-20 flex items-center px-8 border-b border-primary-dark/30">
                    <Link to="/admin" className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <Stethoscope className="w-6 h-6" />
                        </div>
                        <h1 className="text-xl font-bold tracking-wide">
                            DentalCMS
                        </h1>
                    </Link>
                </div>

                <div className="flex flex-col justify-between h-[90%]">
                    <nav className="overflow-y-auto py-6 px-4 space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon

                            const isActive =
                                item.path === '/admin'
                                    ? location.pathname === '/admin'
                                    : location.pathname.startsWith(item.path)

                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors group ${isActive
                                            ? 'bg-white/10 text-white shadow-sm'
                                            : 'text-primary-light hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="w-full p-4 border-t border-primary-dark/30 flex items-center justify-between">
                        <div className="w-full p-2 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-between">
                            <div className="flex items-center gap-3 min-w-0">
                                <img
                                    alt="Admin"
                                    className="w-8 h-8 rounded-full object-cover border-2 border-primary-light/30"
                                    src={avatarUrl}
                                />
                                <div className="flex flex-col flex-1 overflow-hidden">
                                    <span className="text-sm font-semibold text-white truncate">
                                        {displayName}
                                    </span>
                                    <span className="text-xs text-primary-light/70 uppercase">
                                        Doctor
                                    </span>
                                </div>
                            </div>

                            <button onClick={handleLogout}>
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col h-full min-w-0">
                <header className="h-20 bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-5 md:px-8 z-10">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                            Admin Management
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/"
                            target="_blank"
                            className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary"
                        >
                            View Website
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-5 md:p-8 custom-scrollbar">
                    {children ?? null}
                </div>
            </div>
        </div>
    )
}

export default AdminLayout
