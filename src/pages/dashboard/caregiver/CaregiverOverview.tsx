import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Mail, Star, TrendingUp, ArrowRight, Sparkles, Camera, Award } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import { useContactRequests } from '../../../context/ContactRequestContext';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import DashboardStatCard from '../../../components/dashboard/DashboardStatCard';
import {
  MOCK_CAREGIVER_LISTING,
  MOCK_CAREGIVER_PROFILE,
  MOCK_REVIEWS,
  MOCK_CAREGIVER_CONTACT_REQUESTS,
  MOCK_NOTIFICATIONS,
  MOCK_JOB_MATCHES,
} from '../../../data/dashboardMockData';

export default function CaregiverOverview() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { caregiverInbox } = useContactRequests();
  const navigate = useNavigate();

  // ── Live profile view count from Supabase ───────────────────────────────────
  const [profileViews, setProfileViews] = useState<number | null>(null);
  const [viewsTrend, setViewsTrend] = useState<number | null>(null);

  useEffect(() => {
    if (!user || !isSupabaseConfigured) return;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Total views for this caregiver
    supabase
      .from('profile_views')
      .select('*', { count: 'exact', head: true })
      .eq('caregiver_id', user.id)
      .then(({ count }) => {
        if (count !== null) setProfileViews(count);
      });

    // Views this month (for trend badge)
    supabase
      .from('profile_views')
      .select('*', { count: 'exact', head: true })
      .eq('caregiver_id', user.id)
      .gte('viewed_at', startOfMonth.toISOString())
      .then(({ count }) => {
        if (count !== null) setViewsTrend(count);
      });
  }, [user]);

  // ── Contact Requests: real inbox (from families who sent requests) + mock data ──
  const allRequests = useMemo(
    () => [...caregiverInbox, ...MOCK_CAREGIVER_CONTACT_REQUESTS],
    [caregiverInbox]
  );
  const totalContactRequests = allRequests.length;
  const pendingRequests = allRequests.filter((r) => r.status === 'pending').length;

  // ── Avg Rating: calculated from reviews (accurate when reviews are real) ──
  const avgRating = MOCK_REVIEWS.length
    ? (MOCK_REVIEWS.reduce((a, r) => a + r.rating, 0) / MOCK_REVIEWS.length).toFixed(1)
    : '—';

  // ── Profile Completion: from profile data ──
  const profileCompletion = MOCK_CAREGIVER_PROFILE.profileCompletion;

  // ── Job Matches: count of actual job matches array ──
  const jobMatchCount = MOCK_JOB_MATCHES.length;

  // NOTE: Profile Views (MOCK_CAREGIVER_LISTING.views) requires a backend to track
  // accurately. It remains a mock value until Supabase view-tracking is wired up.

  const quickActions = [
    { label: 'Edit Listing', icon: TrendingUp, href: '/dashboard/listing', color: 'bg-maroon/10 text-maroon' },
    { label: 'Job Matches', icon: Sparkles, href: '/dashboard/job-matches', color: 'bg-gold/10 text-gold' },
    { label: 'Add Photos', icon: Camera, href: '/dashboard/photos', color: 'bg-blue-500/10 text-blue-500' },
    { label: 'References', icon: Award, href: '/dashboard/references', color: 'bg-purple-500/10 text-purple-500' },
  ];

  return (
    <div className="space-y-7">
      {/* Welcome */}
      <div>
        <h2 className={`font-display text-2xl font-semibold mb-1 ${isDark ? 'text-ink' : 'text-light-text'}`}>
          Welcome back, {user?.name.split(' ')[0]} 👋
        </h2>
        <p className={`text-sm ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
          Here is how your caregiver profile is performing.
        </p>
      </div>

      {/* Profile Completion Banner */}
      <div className={`rounded-2xl border p-5 ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className={`text-sm font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
            Profile Completion
          </div>
          <span className="text-sm font-bold text-gold">{profileCompletion}%</span>
        </div>
        <div className={`h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-void-lighter' : 'bg-light-surface-2'}`}>
          <div className="h-full bg-gradient-to-r from-maroon to-gold rounded-full" style={{ width: `${profileCompletion}%` }} />
        </div>
        <p className={`text-xs mt-2.5 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
          Add a profile photo to reach 100% and get 3× more contact requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Profile Views — live from Supabase, falls back to mock for demo accounts */}
        <DashboardStatCard
          label="Profile Views"
          value={profileViews ?? MOCK_CAREGIVER_LISTING.views}
          icon={Eye}
          trend={viewsTrend !== null ? `${viewsTrend} this month` : 'this month'}
          trendUp
          color="maroon"
        />
        {/* Contact Requests — real inbox (caregiverInbox) + seeded mock data */}
        <DashboardStatCard label="Contact Requests" value={totalContactRequests} icon={Mail} trend={pendingRequests > 0 ? `${pendingRequests} pending` : 'all reviewed'} trendUp={pendingRequests > 0} color="blue" />
        {/* Avg Rating — calculated from reviews array */}
        <DashboardStatCard label="Avg. Rating" value={avgRating} icon={Star} color="gold" />
        {/* Job Matches — real count from job matches data */}
        <DashboardStatCard label="Job Matches" value={jobMatchCount} icon={Sparkles} trend="new today" trendUp color="emerald" />
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
                isDark ? 'bg-void-light border-void-border hover:border-gold/30' : 'bg-white border-light-border hover:border-maroon/20'
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

      {/* Listing Status */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-display text-base font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
            My Listing
          </h3>
          <button
            onClick={() => navigate('/dashboard/listing')}
            className={`text-xs font-medium flex items-center gap-1 ${isDark ? 'text-gold hover:text-gold/80' : 'text-maroon hover:text-maroon/80'}`}
          >
            Edit <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h4 className={`font-display font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>{MOCK_CAREGIVER_LISTING.title}</h4>
              <p className={`text-sm mt-0.5 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>{MOCK_CAREGIVER_LISTING.location} · {MOCK_CAREGIVER_LISTING.rate}</p>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${
              MOCK_CAREGIVER_LISTING.status === 'active'
                ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                : 'bg-amber-100 text-amber-700 border-amber-200'
            }`}>
              {MOCK_CAREGIVER_LISTING.status.charAt(0).toUpperCase() + MOCK_CAREGIVER_LISTING.status.slice(1)}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {MOCK_CAREGIVER_LISTING.languages.map((lang) => (
              <span key={lang} className={`px-2.5 py-0.5 rounded-md text-xs border ${isDark ? 'bg-void border-void-border text-ink-muted' : 'bg-light-bg border-light-border text-light-text-muted'}`}>
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-display text-base font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
            Recent Reviews
          </h3>
          <button
            onClick={() => navigate('/dashboard/reviews')}
            className={`text-xs font-medium flex items-center gap-1 ${isDark ? 'text-gold hover:text-gold/80' : 'text-maroon hover:text-maroon/80'}`}
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="space-y-3">
          {MOCK_REVIEWS.slice(0, 2).map((review) => (
            <div key={review.id} className={`p-4 rounded-2xl border ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${review.fromColor} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                  {review.fromInitials}
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>{review.fromFamily}</div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-gold text-gold' : isDark ? 'text-void-border' : 'text-light-border'}`} />
                    ))}
                  </div>
                </div>
                <span className={`text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                  {new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <p className={`text-sm ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>{review.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Notifications */}
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
        <div className={`rounded-2xl border divide-y ${isDark ? 'bg-void-light border-void-border divide-void-border' : 'bg-white border-light-border divide-light-border'}`}>
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
    </div>
  );
}
