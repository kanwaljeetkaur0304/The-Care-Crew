import { useState, useEffect, useMemo } from 'react';
import { Sparkles, MapPin, Calendar, BookmarkPlus, BookmarkCheck, ArrowRight, Filter } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { useCaregiverProfile } from '../../../hooks/useCaregiverProfile';
import { type JobMatch } from '../../../data/dashboardMockData';
import { type JobListing } from '../../../data/mockData';
import { computeJobMatches } from '../../../utils/jobMatchingAlgorithm';
import DashboardEmptyState from '../../../components/dashboard/DashboardEmptyState';
import ApplyModal from '../../../components/ApplyModal';

const scoreColor = (score: number) => {
  if (score >= 90) return 'text-emerald-600 bg-emerald-100 border-emerald-200';
  if (score >= 75) return 'text-amber-600 bg-amber-100 border-amber-200';
  return 'text-blue-600 bg-blue-100 border-blue-200';
};

/** Map a Supabase job_posts row → JobListing shape the algorithm expects */
function mapRow(row: Record<string, unknown>): JobListing {
  return {
    id:           String(row.id ?? ''),
    title:        String(row.title ?? ''),
    category:     (row.category as JobListing['category']) ?? 'nanny',
    location:     String(row.location ?? ''),
    salary:       String(row.salary ?? ''),
    schedule:     String(row.schedule ?? ''),      // empty string if column absent — algorithm falls back to description
    description:  String(row.description ?? ''),
    requirements: (row.requirements as string[]) ?? [],
    postedBy:     String(row.family_name ?? ''),
    postedDate:   String(row.created_at ?? '').slice(0, 10),
  };
}

export default function CaregiverJobMatches() {
  const { isDark } = useTheme();
  const { user } = useAuth();

  // ── Real caregiver profile (fixes Problem 1) ───────────────────────────────
  const { profile, listing } = useCaregiverProfile();

  const [filter,    setFilter]    = useState<'all' | 'saved'>('all');
  const [expanded,  setExpanded]  = useState<string | null>(null);
  const [applyJob,  setApplyJob]  = useState<JobMatch | null>(null);
  const [savedIds,  setSavedIds]  = useState<Set<string>>(new Set());

  // ── Real jobs fetched from Supabase (fixes Problem 3) ────────────────────
  // null  = not yet fetched (show mock while loading)
  // []    = fetched but no active real jobs → fall back to mock
  // [...] = real jobs → use these for matching
  const [realJobs, setRealJobs] = useState<JobListing[] | null>(null);

  useEffect(() => {
    if (!user || !isSupabaseConfigured) return;

    supabase
      .from('job_posts')
      .select('*')
      .eq('status', 'active')
      .then(({ data }) => {
        if (data && data.length > 0) {
          setRealJobs(data.map(mapRow));
        } else {
          setRealJobs([]); // empty → useMemo will fall back to mock
        }
      });
  }, [user]);

  // ── Recompute matches whenever profile OR job pool changes ────────────────
  const baseMatches = useMemo(() => {
    // Use real jobs if we have them, otherwise pass undefined → mock fallback inside algorithm
    const jobPool = realJobs !== null && realJobs.length > 0 ? realJobs : undefined;
    return computeJobMatches(profile, listing, jobPool);
  }, [profile, listing, realJobs]);

  // Merge computed matches with saved state (savedIds is separate so useMemo stays pure)
  const matches = useMemo(
    () => baseMatches.map((m) => ({ ...m, saved: savedIds.has(m.id) })),
    [baseMatches, savedIds],
  );

  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const displayed = filter === 'saved' ? matches.filter((m) => m.saved) : matches;

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`font-display text-2xl font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
          Job Matches
        </h2>
        <p className={`text-sm mt-1 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
          Jobs that match your profile and languages — updated daily
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <Filter className={`w-4 h-4 shrink-0 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
        {(['all', 'saved'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              filter === f
                ? 'bg-gradient-to-r from-maroon to-gold text-white border-transparent'
                : isDark ? 'bg-void-light border-void-border text-ink-light hover:border-gold/40' : 'bg-white border-light-border text-light-text-2 hover:border-maroon/30'
            }`}
          >
            {f === 'all' ? `All Matches (${matches.length})` : `Saved (${matches.filter((m) => m.saved).length})`}
          </button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <DashboardEmptyState
          icon={Sparkles}
          title={filter === 'saved' ? 'No saved matches' : 'No job matches yet'}
          description={filter === 'saved' ? 'Bookmark jobs you are interested in to find them quickly.' : 'Complete your profile to start seeing relevant job matches.'}
        />
      ) : (
        <div className="space-y-4">
          {displayed.map((job) => (
            <div
              key={job.id}
              className={`rounded-2xl border overflow-hidden transition-colors ${
                isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'
              }`}
            >
              <div className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className={`font-display font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>{job.title}</h3>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${scoreColor(job.matchScore)}`}>
                        {job.matchScore}% match
                      </span>
                    </div>
                    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                      <span>{job.family}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                      <span>{job.budget}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(job.postedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSave(job.id)}
                    className={`p-2 rounded-xl border transition-colors shrink-0 ${
                      job.saved
                        ? 'bg-gold/10 border-gold/30 text-gold'
                        : isDark ? 'border-void-border text-ink-muted hover:border-gold/30 hover:text-gold' : 'border-light-border text-light-text-muted hover:border-gold/30 hover:text-gold'
                    }`}
                  >
                    {job.saved ? <BookmarkCheck className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
                  </button>
                </div>

                {/* Languages */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {job.languages.map((lang) => (
                    <span key={lang} className={`px-2 py-0.5 rounded-md text-xs border ${isDark ? 'bg-void border-void-border text-ink-muted' : 'bg-light-bg border-light-border text-light-text-muted'}`}>
                      {lang}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExpanded(expanded === job.id ? null : job.id)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${isDark ? 'border-void-border text-ink-light hover:border-gold/40 hover:text-gold' : 'border-light-border text-light-text-2 hover:border-maroon/30 hover:text-maroon'}`}
                  >
                    {expanded === job.id ? 'Hide' : 'View Details'}
                  </button>

                  <button
                    onClick={() => setApplyJob(job)}
                    className="flex items-center gap-1.5 text-xs px-4 py-1.5 rounded-lg bg-gradient-to-r from-maroon to-gold text-white font-semibold hover:opacity-90 transition-opacity btn-press shadow-md shadow-maroon/20"
                  >
                    Apply Now <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {expanded === job.id && (
                <div className={`px-5 pb-5 pt-4 border-t ${isDark ? 'border-void-border' : 'border-light-border'}`}>
                  <p className={`text-sm ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>{job.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {applyJob && (
        <ApplyModal
          isOpen={!!applyJob}
          onClose={() => setApplyJob(null)}
          job={applyJob}
        />
      )}
    </div>
  );
}
