import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, User, Briefcase, Heart, Mail, MessageSquare,
  Bell, CreditCard, List, Sparkles, Star, Camera, Award,
  LogOut, HeartHandshake, X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const familyNav: SidebarItem[] = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Profile', href: '/dashboard/profile', icon: User },
  { label: 'My Job Posts', href: '/dashboard/job-posts', icon: Briefcase },
  { label: 'Saved Caregivers', href: '/dashboard/saved', icon: Heart },
  { label: 'Contact Requests', href: '/dashboard/contact-requests', icon: Mail },
  { label: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { label: 'Subscription', href: '/dashboard/subscription', icon: CreditCard },
];

const caregiverNav: SidebarItem[] = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Profile', href: '/dashboard/profile', icon: User },
  { label: 'My Listing', href: '/dashboard/listing', icon: List },
  { label: 'Job Matches', href: '/dashboard/job-matches', icon: Sparkles },
  { label: 'Contact Requests', href: '/dashboard/contact-requests', icon: Mail },
  { label: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  { label: 'Reviews', href: '/dashboard/reviews', icon: Star },
  { label: 'Photos & Videos', href: '/dashboard/photos', icon: Camera },
  { label: 'References', href: '/dashboard/references', icon: Award },
  { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
];

interface DashboardSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function DashboardSidebar({ mobileOpen, onClose }: DashboardSidebarProps) {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const nav = user?.role === 'caregiver' ? caregiverNav : familyNav;

  const initials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center justify-between px-5 py-4 border-b ${isDark ? 'border-void-border' : 'border-light-border'}`}>
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-maroon to-gold flex items-center justify-center shadow-lg shadow-maroon/20">
            <HeartHandshake className="w-4 h-4 text-white" />
          </div>
          <span className={`font-display text-base font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
            The Care Crew
          </span>
        </a>
        <button
          onClick={onClose}
          className={`md:hidden p-1.5 rounded-lg ${isDark ? 'text-ink-muted hover:bg-void-lighter' : 'text-light-text-muted hover:bg-light-surface-2'}`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* User Info */}
      {user && (
        <div className={`px-5 py-4 border-b ${isDark ? 'border-void-border' : 'border-light-border'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-maroon to-gold flex items-center justify-center text-sm font-bold text-white shrink-0">
              {initials(user.name)}
            </div>
            <div className="min-w-0">
              <div className={`text-sm font-semibold truncate ${isDark ? 'text-ink' : 'text-light-text'}`}>
                {user.name}
              </div>
              <div className={`text-xs capitalize ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                {user.role === 'caregiver' ? 'Caregiver Account' : 'Family Account'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {nav.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === '/dashboard'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-maroon/90 to-gold/80 text-white shadow-md shadow-maroon/20'
                  : isDark
                    ? 'text-ink-light hover:text-ink hover:bg-void-lighter'
                    : 'text-light-text-2 hover:text-light-text hover:bg-light-surface-2'
              }`
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className={`px-3 py-4 border-t space-y-1 ${isDark ? 'border-void-border' : 'border-light-border'}`}>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            isDark
              ? 'text-ink-light hover:text-red-400 hover:bg-red-400/10'
              : 'text-light-text-2 hover:text-red-600 hover:bg-red-50'
          }`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0 border-r ${
        isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'
      }`}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <aside className={`md:hidden fixed left-0 top-0 bottom-0 w-72 z-50 flex flex-col border-r ${
            isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'
          }`}>
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}
