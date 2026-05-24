import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, Bell, Sun, Moon, Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { MOCK_NOTIFICATIONS } from '../../data/dashboardMockData';
import DashboardSidebar from './DashboardSidebar';
import SubscriptionExpiredGate from './SubscriptionExpiredGate';

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { hasActiveSubscription, hasActiveListingSubscription } = useSubscription();
  const navigate = useNavigate();

  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  if (!user) {
    navigate('/');
    return null;
  }

  // Gate: at least one subscription must be active to enter the dashboard
  const hasAnySubscription = hasActiveSubscription || hasActiveListingSubscription;
  if (!hasAnySubscription) {
    return <SubscriptionExpiredGate />;
  }

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${isDark ? 'bg-void' : 'bg-light-bg'}`}>
      <DashboardSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className={`sticky top-0 z-30 flex items-center justify-between px-5 py-3.5 border-b backdrop-blur-xl ${
          isDark
            ? 'bg-void/90 border-void-border'
            : 'bg-white/80 border-light-border'
        }`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className={`md:hidden p-2 rounded-lg border ${
                isDark
                  ? 'border-void-border text-ink-light hover:bg-void-lighter'
                  : 'border-light-border text-light-text-2 hover:bg-light-surface-2'
              }`}
            >
              <Menu className="w-4 h-4" />
            </button>
            <div>
              <h1 className={`text-base font-display font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
                My Dashboard
              </h1>
              <p className={`text-xs hidden sm:block ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                {user.role === 'caregiver' ? 'Caregiver Portal' : 'Family Portal'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Post an Ad / Update Listing CTA */}
            {user.role === 'family' ? (
              <button
                onClick={() => navigate('/dashboard/job-posts')}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-maroon to-gold text-white text-xs font-semibold rounded-full hover:opacity-90 transition-opacity btn-press shadow-md shadow-maroon/20"
              >
                <Plus className="w-3.5 h-3.5" />
                Post a Job
              </button>
            ) : (
              <button
                onClick={() => navigate('/dashboard/listing')}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-maroon to-gold text-white text-xs font-semibold rounded-full hover:opacity-90 transition-opacity btn-press shadow-md shadow-maroon/20"
              >
                <Plus className="w-3.5 h-3.5" />
                Edit Listing
              </button>
            )}

            {/* Notifications */}
            <button
              onClick={() => navigate('/dashboard/notifications')}
              className={`relative p-2 rounded-full border transition-all ${
                isDark
                  ? 'border-void-border text-ink-light hover:bg-void-lighter hover:text-ink'
                  : 'border-light-border text-light-text-2 hover:bg-light-surface-2 hover:text-light-text'
              }`}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-maroon text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full border transition-all ${
                isDark
                  ? 'border-void-border text-gold hover:bg-gold/10'
                  : 'border-light-border text-maroon hover:bg-maroon/10'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-5 md:p-7 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
