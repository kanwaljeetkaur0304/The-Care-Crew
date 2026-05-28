import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Mail, Star, TrendingUp, ArrowRight, Sparkles, Camera, Award } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import { useContactRequests } from '../../../context/ContactRequestContext';
import { useMessages } from '../../../context/MessagesContext';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import DashboardStatCard from '../../../components/dashboard/DashboardStatCard';
import {
  MOCK_REVIEWS,
  MOCK_NOTIFICATIONS,
  type Review,
  type Notification,
} from '../../../data/dashboardMockData';
import { computeJobMatches } from '../../../utils/jobMatchingAlgorithm';
import { computeProfileCompletion } from '../../../utils/profileCompletion';
import { useCaregiverProfile } from '../../../hooks/useCaregiverProfile';

// ── Same key used in CaregiverListing.tsx to persist pause/active ─────────────
const LISTING_STATUS_KEY = 'carecrew_listing_status';

// ── Helpers for mapping Supabase review rows to display shape ─────────────────
const REVIEW_COLORS = [
  'from-indigo-400 to-blue-500',
  'from-amber-400 to-orange-500',
  'from-emerald-400 to-teal-500',
  'from-rose-400 to-pink-500',
  'from-violet-400 to-purple-500',
];
function colorForName(name: string) {
  const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return REVIEW_COLORS[hash % REVIEW_COLORS.length];
}
function initialsForName(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

// ── Convert ISO timestamp to relative display string ──────────────────────────
function toRelativeTime(iso: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return iso;
  const diffMs    = Date.now() - date.getTime();
  const diffMins  = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays  = Math.floor(diffHours / 24);
  if (diffMins  <  1) return 'Just now';
  if (diffMins  < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays  === 1) return 'Yesterday';
  if (diffDays  <  7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function CaregiverOverview() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { caregiverInbox } = useContactRequests();
  const { threads } = useMessages();
  const navigate = useNavigate();
  const { profile, listing } = useCaregiverProfile();

  // ── 1. Profile Views — live from Supabase ────────────────────────────────────
  const [profileViews, setProfileViews] = useState<number | null>(null);
  const [viewsTrend,   setViewsTrend]   = useState<number | null>(null);

  // ── 2. Contact Requests — live from Supabase, fallback to localStorage ────────
  const [supabaseContactCount, setSupabaseContactCount] = useState<number | null>(null);
  const [supabasePendingCount, setSupabasePendingCount] = useState<number | null>(null);

  // ── 3. Avg Rating — live from Supabase, fallback to mock ─────────────────────
  const [supabaseRating, setSupabaseRating] = useState<string | null>(null);

  // ── 4. Recent Reviews — live from Supabase, fallback to mock ─────────────────
  const [recentReviews, setRecentReviews] = useState<Review[]>(MOCK_REVIEWS.slice(0, 2));

  // ── 5. Listing status — localStorage takes precedence (same key Listing page writes) ─
  const [listingStatus] = useState<'active' | 'paused'>(() => {
    try {
      const stored = localStorage.getItem(LISTING_STATUS_KEY);
      if (stored === 'paused' || stored === 'active') return stored;
    } catch { /* ignore */ }
    return listing.status;
  });

  useEffect(() => {
    if (!user || !isSupabaseConfigured) return;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Profile Views: total
    supabase
      .from('profile_views')
      .select('*', { count: 'exact', head: true })
      .eq('caregiver_id', user.id)
      .then(({ count }) => { if (count !== null) setProfileViews(count); });

    // Profile Views: this-month trend
    supabase
      .from('profile_views')
      .select('*', { count: 'exact', head: true })
      .eq('caregiver_id', user.id)
      .gte('viewed_at', startOfMonth.toISOString())
      .then(({ count }) => { if (count !== null) setViewsTrend(count); });

    // Contact Requests: total + pending breakdown
    supabase
      .from('contact_requests')
      .select('status')
      .eq('to_id', user.id)
      .then(({ data }) => {
        if (data) {
          setSupabaseContactCount(data.length);
          setSupabasePendingCount(data.filter((r) => r.status === 'pending').length);
        }
      });

    // Avg Rating: average from real reviews
    supabase
      .from('reviews')
      .select('rating')
      .eq('caregiver_id', user.id)
      .then(({ data }) => {
        if (data && data.length > 0) {
          const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
          setSupabaseRating(avg.toFixed(1));
        }
      });

    // Recent Reviews: latest 2 real reviews
    supabase
      .from('reviews')
      .select('*')
      .eq('caregiver_id', user.id)
      .order('created_at', { ascending: false })
      .limit(2)
      .then(({ data }) => {
        if (data && data.length > 0) {
          const mapped: Review[] = data.map((r) => ({
            id:           r.id,
            fromFamily:   r.from_family_name,
            fromInitials: initialsForName(r.from_family_name),
            fromColor:    colorForName(r.from_family_name),
            rating:       r.rating,
            comment:      r.comment ?? '',
            date:         r.created_at,
            category:     r.category ?? '',
          }));
          setRecentReviews(mapped);
        }
        // If 0 real reviews, the default state (MOCK_REVIEWS) stays shown as demo
      });

  }, [user]);

  // ── Derived: Contact Requests ─────────────────────────────────────────────────
  const totalContactRequests = supabaseContactCount ?? caregiverInbox.length;
  const pendingRequests       = supabasePendingCount  ?? caregiverInbox.filter((r) => r.status === 'pending').length;

  // ── Derived: Avg Rating ───────────────────────────────────────────────────────
  const mockAvgRating = MOCK_REVIEWS.length
    ? (MOCK_REVIEWS.reduce((a, r) => a + r.rating, 0) / MOCK_REVIEWS.length).toFixed(1)
    : '—';
  const avgRating = supabaseRating ?? mockAvgRating;

  // ── Derived: Profile Completion ───────────────────────────────────────────────
  const { score: profileCompletion, hint: completionHint } = useMemo(
    () => computeProfileCompletion(profile),
    [profile]
  );

  // ── Derived: Job Matches count ────────────────────────────────────────────────
  const jobMatchCount = useMemo(
    () => computeJobMatches(profile, listing).length,
    [profile, listing]
  );

  // ── Derived: Recent Activity — built from REAL events first ──────────────────
  // Priority: unread messages → pending contact requests → mock notifications (fill gaps)
  const recentActivity = useMemo((): Notification[] => {
    const items: Notification[] = [];

    // Real unread message threads
    threads
      .filter((t) => t.unread > 0)
      .slice(0, 2)
      .forEach((t) => {
        items.push({
          id:     `msg-${t.id}`,
          type:   'message',
          title:  `New message from ${t.withName}`,
          body:   t.lastMessage,
          time:   t.lastTime,
          read:   false,
          action: '/dashboard/messages',
        });
      });

    // Real pending contact requests
    caregiverInbox
      .filter((r) => r.status === 'pending')
      .slice(0, 2)
      .forEach((r) => {
        items.push({
          id:     `req-${r.id}`,
          type:   'contact',
          title:  'New contact request',
          body:   `${r.fromName} sent you a contact request for ${r.category} in ${r.location}`,
          time:   toRelativeTime(r.date),
          read:   false,
          action: '/dashboard/contact-requests',
        });
      });

    // Fill remaining slots with mock notifications (skip any already covered above)
    const usedIds = new Set(items.map((i) => i.id));
    for (const n of MOCK_NOTIFICATIONS) {
      if (items.length >= 4) break;
      if (!usedIds.has(n.id)) items.push(n);
    }

    return items.slice(0, 4);
  }, [threads, caregiverInbox]);

  const quickActions = [
    { label: 'Edit Listing', icon: TrendingUp, href: '/dashboard/listing',    color: 'bg-maroon/10 text-maroon' },
    { label: 'Job Matches',  icon: Sparkles,   href: '/dashboard/job-matches', color: 'bg-gold/10 text-gold' },
    { label: 'Add Photos',   icon: Camera,     href: '/dashboard/photos',      color: 'bg-blue-500/10 text-blue-500' },
    { label: 'References',   icon: Award,      href: '/dashboard/references',  color: 'bg-purple-500/10 text-purple-500' },
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
          {completionHint}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStatCard
          label="Profile Views"
          value={profileViews ?? listing.views}
          icon={Eye}
          trend={viewsTrend !== null ? `${viewsTrend} this month` : 'this month'}
          trendUp
          color="maroon"
        />
        <DashboardStatCard
          label="Contact Requests"
          value={totalContactRequests}
          icon={Mail}
          trend={pendingRequests > 0 ? `${pendingRequests} pending` : 'all reviewed'}
          trendUp={pendingRequests > 0}
          color="blue"
        />
        <DashboardStatCard label="Avg. Rating" value={avgRating} icon={Star} color="gold" />
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

      {/* My Listing — status badge reads from localStorage (same source as Listing page) */}
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
              <h4 className={`font-display font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
                {listing.title || profile.name + ' — Caregiver'}
              </h4>
              <p className={`text-sm mt-0.5 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                {listing.location} · {listing.rate}
              </p>
            </div>
            {/* Badge reads real status from localStorage (same key Listing page writes) */}
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${
              listingStatus === 'active'
                ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                : 'bg-amber-100 text-amber-700 border-amber-200'
            }`}>
              {listingStatus.charAt(0).toUpperCase() + listingStatus.slice(1)}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {listing.languages.map((lang) => (
              <span key={lang} className={`px-2.5 py-0.5 rounded-md text-xs border ${isDark ? 'bg-void border-void-border text-ink-muted' : 'bg-light-bg border-light-border text-light-text-muted'}`}>
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Reviews — real from Supabase, falls back to mock for demo */}
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
          {recentReviews.map((review) => (
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

      {/* Recent Activity — real messages + real contact requests, mock fills gaps */}
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
          {recentActivity.map((n) => (
            <div
              key={n.id}
              onClick={() => n.action && navigate(n.action)}
              className={`flex items-start gap-3 p-4 ${n.action ? 'cursor-pointer' : ''} ${
                !n.read ? (isDark ? 'bg-gold/5' : 'bg-maroon/5') : ''
              }`}
            >
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
