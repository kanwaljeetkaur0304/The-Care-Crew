import { useState } from 'react';
import { Plus, Eye, Users, Pause, Play, Trash2, Briefcase, MapPin, Calendar, Lock } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useSubscription } from '../../../context/SubscriptionContext';
import { MOCK_JOB_POSTS, type JobPost } from '../../../data/dashboardMockData';
import DashboardEmptyState from '../../../components/dashboard/DashboardEmptyState';
import DashboardBadge from '../../../components/dashboard/DashboardBadge';
import ListingSubscriptionModal from '../../../components/ListingSubscriptionModal';

export default function FamilyJobPosts() {
  const { isDark } = useTheme();
  const { hasActiveListingSubscription, listingExpiryDate } = useSubscription();
  const [jobs, setJobs] = useState<JobPost[]>(MOCK_JOB_POSTS);
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'expired'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showListingModal, setShowListingModal] = useState(false);

  const filtered = filter === 'all' ? jobs : jobs.filter((j) => j.status === filter);

  const toggleStatus = (id: string) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === id
          ? { ...j, status: j.status === 'active' ? 'paused' : 'active' }
          : j
      )
    );
  };

  const filterBtns = ['all', 'active', 'paused', 'expired'] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`font-display text-2xl font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
            My Job Posts
          </h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
            {jobs.filter((j) => j.status === 'active').length} active · {jobs.length} total
          </p>
        </div>
        <button
          onClick={() => {
            if (!hasActiveListingSubscription) {
              setShowListingModal(true);
            }
            // If subscribed: open post form (PostAdModal / inline form — wired here)
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-maroon to-gold text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity btn-press shadow-md shadow-maroon/20 shrink-0"
        >
          {hasActiveListingSubscription ? (
            <Plus className="w-4 h-4" />
          ) : (
            <Lock className="w-4 h-4" />
          )}
          Post New Job
        </button>
      </div>

      {/* Listing subscription status banner */}
      {hasActiveListingSubscription ? (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm ${isDark ? 'bg-emerald-900/20 border-emerald-700/30 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
          <Plus className="w-4 h-4 shrink-0" />
          <span>Listing subscription active · expires <strong>{listingExpiryDate}</strong>. You can post and edit job listings freely.</span>
        </div>
      ) : (
        <div className={`flex items-center justify-between gap-4 px-4 py-3 rounded-xl border ${isDark ? 'bg-amber-900/10 border-amber-700/20' : 'bg-amber-50 border-amber-200'}`}>
          <div className="flex items-center gap-3">
            <Lock className={`w-4 h-4 shrink-0 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
            <span className={`text-sm ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
              A <strong>Freelance Listing subscription</strong> is required to post new jobs. Your existing posts remain active.
            </span>
          </div>
          <button
            onClick={() => setShowListingModal(true)}
            className="shrink-0 px-4 py-1.5 bg-gradient-to-r from-maroon to-gold text-white text-xs font-semibold rounded-full hover:opacity-90 transition-opacity btn-press"
          >
            Subscribe
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {filterBtns.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all btn-press ${
              filter === f
                ? 'bg-gradient-to-r from-maroon to-gold text-white border-transparent'
                : isDark
                  ? 'bg-void-light border-void-border text-ink-light hover:border-gold/40'
                  : 'bg-white border-light-border text-light-text-2 hover:border-maroon/30'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Job Cards */}
      {filtered.length === 0 ? (
        <DashboardEmptyState
          icon={Briefcase}
          title="No job posts yet"
          description="Post your first job to start receiving applications from caregivers in your area."
          actionLabel="Post a Job"
          onAction={() => {}}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((job) => (
            <div
              key={job.id}
              className={`rounded-2xl border overflow-hidden transition-all ${
                isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'
              }`}
            >
              {/* Card Header */}
              <div className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-display font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
                        {job.title}
                      </h3>
                      <DashboardBadge variant={job.status as 'active' | 'paused' | 'expired'} />
                    </div>
                    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Posted {new Date(job.postedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span>{job.budget}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                      <Eye className="w-3.5 h-3.5" /> {job.views}
                    </div>
                    <div className={`flex items-center gap-1 text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                      <Users className="w-3.5 h-3.5" /> {job.applicants}
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex flex-wrap gap-3 mb-3">
                  <div className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg ${isDark ? 'bg-void border-void-border border' : 'bg-light-bg border-light-border border'}`}>
                    <Eye className={`w-3.5 h-3.5 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                    <span className={isDark ? 'text-ink-light' : 'text-light-text-2'}>{job.views} views</span>
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg ${isDark ? 'bg-void border-void-border border' : 'bg-light-bg border-light-border border'}`}>
                    <Users className={`w-3.5 h-3.5 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                    <span className={isDark ? 'text-ink-light' : 'text-light-text-2'}>{job.applicants} applicants</span>
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg ${isDark ? 'bg-void border-void-border border' : 'bg-light-bg border-light-border border'}`}>
                    <Calendar className={`w-3.5 h-3.5 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                    <span className={isDark ? 'text-ink-light' : 'text-light-text-2'}>Expires {new Date(job.expiresDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setExpanded(expanded === job.id ? null : job.id)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                      isDark ? 'border-void-border text-ink-light hover:border-gold/40 hover:text-gold' : 'border-light-border text-light-text-2 hover:border-maroon/30 hover:text-maroon'
                    }`}
                  >
                    {expanded === job.id ? 'Hide Details' : 'View Details'}
                  </button>
                  {job.status !== 'expired' && (
                    <button
                      onClick={() => toggleStatus(job.id)}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                        isDark ? 'border-void-border text-ink-light hover:border-amber-400/40 hover:text-amber-400' : 'border-light-border text-light-text-2 hover:border-amber-400/40 hover:text-amber-600'
                      }`}
                    >
                      {job.status === 'active' ? <><Pause className="w-3 h-3" /> Pause</> : <><Play className="w-3 h-3" /> Reactivate</>}
                    </button>
                  )}
                  <button className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                    isDark ? 'border-red-400/20 text-red-400/60 hover:border-red-400/40 hover:text-red-400' : 'border-red-200 text-red-400 hover:border-red-300 hover:text-red-600'
                  }`}>
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expanded === job.id && (
                <div className={`px-5 pb-5 border-t pt-4 space-y-3 ${isDark ? 'border-void-border' : 'border-light-border'}`}>
                  <p className={`text-sm ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>{job.description}</p>
                  <div>
                    <div className={`text-xs font-semibold mb-2 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>Requirements</div>
                    <ul className="space-y-1">
                      {job.requirements.map((req) => (
                        <li key={req} className={`text-xs flex items-center gap-2 ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" /> {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className={`text-xs font-semibold mb-2 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>Languages Preferred</div>
                    <div className="flex flex-wrap gap-1.5">
                      {job.languages.map((lang) => (
                        <span key={lang} className={`px-2 py-0.5 rounded-md text-xs border ${isDark ? 'bg-void border-void-border text-ink-light' : 'bg-light-bg border-light-border text-light-text-2'}`}>{lang}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ListingSubscriptionModal isOpen={showListingModal} onClose={() => setShowListingModal(false)} />
    </div>
  );
}
