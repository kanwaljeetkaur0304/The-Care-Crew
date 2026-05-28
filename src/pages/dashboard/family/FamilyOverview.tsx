import { useNavigate } from 'react-router-dom';
import { Briefcase, Heart, Mail, MessageSquare, Bell, TrendingUp, ArrowRight, Eye } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import { useMessages } from '../../../context/MessagesContext';
import { useContactRequests } from '../../../context/ContactRequestContext';
import DashboardStatCard from '../../../components/dashboard/DashboardStatCard';
import {
  MOCK_SAVED_CAREGIVERS,
  MOCK_NOTIFICATIONS,
  MOCK_SUBSCRIPTION,
} from '../../../data/dashboardMockData';
import { useFamilyProfile } from '../../../hooks/useFamilyProfile';
import { useJobPosts } from '../../../hooks/useJobPosts';

export default function FamilyOverview() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { profile } = useFamilyProfile();
  const { jobs } = useJobPosts();
  const { threads } = useMessages();
  const { familyInbox } = useContactRequests();

  const activeJobs = jobs.filter((j) => j.status === 'active').length;
  const unreadMessages = threads.reduce((acc, t) => acc + t.unread, 0);
  const unreadNotifications = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;
  const pendingRequests = familyInbox.filter((r) => r.status === 'pending').length;

  const quickActions = [
    { label: 'Post a Job', icon: Briefcase, href: '/dashboard/job-posts', color: 'bg-maroon/10 text-maroon' },
    { label: 'Browse Caregivers', icon: Heart, href: '/caregivers', color: 'bg-pink-500/10 text-pink-600' },
    { label: 'View Messages', icon: MessageSquare, href: '/dashboard/messages', color: 'bg-blue-500/10 text-blue-600' },
    { label: 'Notifications', icon: Bell, href: '/dashboard/notifications', color: 'bg-amber-500/10 text-amber-600' },
  ];

  return (
    <div className="space-y-7">
      {/* Welcome */}
      <div>
        <h2 className={`font-display text-2xl font-semibold mb-1 ${isDark ? 'text-ink' : 'text-light-text'}`}>
          Welcome back, {(profile.name || user?.name || '').split(' ')[0]} 👋
        </h2>
        <p className={`text-sm ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
          Here is what is happening with your care search today.
        </p>
      </div>

      {/* Subscription Banner */}
      {MOCK_SUBSCRIPTION.status === 'active' && (
        <div className="rounded-2xl bg-gradient-to-r from-maroon to-gold p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide opacity-80 mb-1">Active Plan</div>
            <div className="font-display text-xl font-bold">{MOCK_SUBSCRIPTION.tier} Plan</div>
            <div className="text-sm opacity-80">{MOCK_SUBSCRIPTION.daysLeft} days remaining · {MOCK_SUBSCRIPTION.contactsUnlocked} contacts unlocked</div>
          </div>
          <button
            onClick={() => navigate('/dashboard/subscription')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 rounded-full text-sm font-semibold transition-colors backdrop-blur-sm shrink-0"
          >
            Manage Plan <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStatCard label="Active Job Posts" value={activeJobs} icon={Briefcase} trend="2 this month" trendUp color="maroon" />
        <DashboardStatCard label="Saved Caregivers" value={MOCK_SAVED_CAREGIVERS.length} icon={Heart} color="purple" />
        <DashboardStatCard label="Pending Requests" value={pendingRequests} icon={Mail} color="blue" />
        <DashboardStatCard label="Unread Messages" value={unreadMessages} icon={MessageSquare} trend={`${unreadNotifications} alerts`} trendUp color="emerald" />
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className={`font-display text-base font-semibold mb-4 ${isDark ? 'text-ink' : 'text-light-text'}`}>
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.href)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all btn-press hover:-translate-y-0.5 ${
                isDark
                  ? 'bg-void-light border-void-border hover:border-gold/30'
                  : 'bg-white border-light-border hover:border-maroon/20'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${action.color}`}>
                <action.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-medium text-center ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Job Posts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-display text-base font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
            Recent Job Posts
          </h3>
          <button
            onClick={() => navigate('/dashboard/job-posts')}
            className={`text-xs font-medium flex items-center gap-1 ${isDark ? 'text-gold hover:text-gold/80' : 'text-maroon hover:text-maroon/80'}`}
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="space-y-3">
          {jobs.slice(0, 2).map((job) => (
            <div
              key={job.id}
              className={`flex items-center justify-between p-4 rounded-2xl border ${
                isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'
              }`}
            >
              <div>
                <div className={`text-sm font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>{job.title}</div>
                <div className={`text-xs mt-0.5 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                  {job.location} · {job.applicants} applicants
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Eye className={`w-3.5 h-3.5 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                  <span className={`text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>{job.views}</span>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                  job.status === 'active'
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                    : job.status === 'paused'
                      ? 'bg-amber-100 text-amber-700 border-amber-200'
                      : 'bg-gray-100 text-gray-600 border-gray-200'
                }`}>
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Feed */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-display text-base font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
            Recent Activity
          </h3>
          <button
            onClick={() => navigate('/dashboard/notifications')}
            className={`text-xs font-medium flex items-center gap-1 ${isDark ? 'text-gold hover:text-gold/80' : 'text-maroon hover:text-maroon/80'}`}
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className={`rounded-2xl border divide-y ${
          isDark ? 'bg-void-light border-void-border divide-void-border' : 'bg-white border-light-border divide-light-border'
        }`}>
          {MOCK_NOTIFICATIONS.slice(0, 4).map((n) => (
            <div key={n.id} className={`flex items-start gap-3 p-4 ${!n.read ? isDark ? 'bg-gold/5' : 'bg-maroon/5' : ''}`}>
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-maroon' : isDark ? 'bg-void-border' : 'bg-light-border'}`} />
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${isDark ? 'text-ink' : 'text-light-text'}`}>{n.title}</div>
                <div className={`text-xs mt-0.5 truncate ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>{n.body}</div>
              </div>
              <div className={`text-xs shrink-0 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>{n.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Tip */}
      <div className={`flex items-start gap-4 p-5 rounded-2xl border ${
        isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'
      }`}>
        <div className="p-2.5 rounded-xl bg-gold/10">
          <TrendingUp className="w-5 h-5 text-gold" />
        </div>
        <div className="flex-1">
          <div className={`text-sm font-semibold mb-1 ${isDark ? 'text-ink' : 'text-light-text'}`}>
            Boost your listings
          </div>
          <div className={`text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
            Families with complete profiles get 3× more applications. Fill in your family description and preferred languages.
          </div>
        </div>
        <button
          onClick={() => navigate('/dashboard/profile')}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg border shrink-0 ${
            isDark ? 'border-void-border text-ink-light hover:text-gold hover:border-gold/40' : 'border-light-border text-light-text-2 hover:text-maroon hover:border-maroon/30'
          }`}
        >
          Update
        </button>
      </div>
    </div>
  );
}
