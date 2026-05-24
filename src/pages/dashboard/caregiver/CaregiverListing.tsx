import { useState } from 'react';
import { Eye, Mail, Edit2, Save, X, Pause, Play, FileText, Lock } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useSubscription } from '../../../context/SubscriptionContext';
import { MOCK_CAREGIVER_LISTING } from '../../../data/dashboardMockData';
import DashboardStatCard from '../../../components/dashboard/DashboardStatCard';
import DashboardBadge from '../../../components/dashboard/DashboardBadge';
import ListingSubscriptionModal from '../../../components/ListingSubscriptionModal';

const SKILL_OPTIONS = ['Indian Cooking', 'Homework Help', 'Medication Reminders', 'Elder Companionship', 'Creative Play', 'First Aid', 'Driving', 'House Cleaning', 'Laundry', 'Grocery Shopping'];

export default function CaregiverListing() {
  const { isDark } = useTheme();
  const { hasActiveListingSubscription, listingExpiryDate } = useSubscription();
  const [editing, setEditing] = useState(false);
  const [listing, setListing] = useState(MOCK_CAREGIVER_LISTING);
  const [showModal, setShowModal] = useState(false);

  const toggleSkill = (skill: string) => {
    setListing((p) => ({
      ...p,
      skills: p.skills.includes(skill) ? p.skills.filter((s) => s !== skill) : [...p.skills, skill],
    }));
  };

  const toggleStatus = () => {
    setListing((p) => ({ ...p, status: p.status === 'active' ? 'paused' : 'active' }));
  };

  if (!hasActiveListingSubscription) {
    return (
      <>
        <div className="space-y-6 max-w-2xl">
          {/* Header */}
          <div>
            <h2 className={`font-display text-2xl font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
              My Listing
            </h2>
            <p className={`text-sm mt-1 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
              How families find you on The Care Crew
            </p>
          </div>

          {/* Paywall Card */}
          <div className={`rounded-2xl border p-10 text-center ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 ${isDark ? 'bg-void-lighter' : 'bg-light-surface-2'}`}>
              <Lock className={`w-7 h-7 ${isDark ? 'text-gold' : 'text-maroon'}`} />
            </div>
            <h3 className={`font-display text-xl font-semibold mb-2 ${isDark ? 'text-ink' : 'text-light-text'}`}>
              No Active Listing Subscription
            </h3>
            <p className={`text-sm max-w-sm mx-auto mb-2 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
              Subscribe to post your freelance caregiver listing. Families in your area will be able to find and contact you directly.
            </p>
            <p className={`text-xs mb-6 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
              You can edit your listing freely once active — no extra charges.
            </p>

            {/* What you get */}
            <div className={`rounded-xl border p-4 mb-6 text-left max-w-xs mx-auto ${isDark ? 'bg-void border-void-border' : 'bg-light-bg border-light-border'}`}>
              {[
                'Appear in caregiver search results',
                'Receive contact requests from families',
                'Show your skills, rate & availability',
                'Featured badge on Standard & Premium',
              ].map((item) => (
                <div key={item} className={`flex items-start gap-2 py-1.5 text-sm ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>
                  <FileText className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isDark ? 'text-gold' : 'text-maroon'}`} />
                  {item}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="px-8 py-3 bg-gradient-to-r from-maroon to-gold text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity btn-press shadow-md shadow-maroon/20"
            >
              View Listing Plans
            </button>
          </div>
        </div>
        <ListingSubscriptionModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Listing Active Banner */}
      {listingExpiryDate && (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm ${isDark ? 'bg-emerald-900/20 border-emerald-700/30 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
          <FileText className="w-4 h-4 shrink-0" />
          <span>Listing active · expires <strong>{listingExpiryDate}</strong>. You can edit freely anytime.</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`font-display text-2xl font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
            My Listing
          </h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
            How families find you on The Care Crew
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleStatus}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
              isDark ? 'border-void-border text-ink-light hover:border-amber-400/40 hover:text-amber-400' : 'border-light-border text-light-text-2 hover:border-amber-400 hover:text-amber-600'
            }`}
          >
            {listing.status === 'active' ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Activate</>}
          </button>
          <button
            onClick={() => setEditing(!editing)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
              editing
                ? isDark ? 'border-red-400/30 text-red-400' : 'border-red-300 text-red-600'
                : isDark ? 'border-void-border text-ink-light hover:border-gold/40 hover:text-gold' : 'border-light-border text-light-text-2 hover:border-maroon/30 hover:text-maroon'
            }`}
          >
            {editing ? <><X className="w-4 h-4" /> Cancel</> : <><Edit2 className="w-4 h-4" /> Edit</>}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <DashboardStatCard label="Profile Views" value={listing.views} icon={Eye} color="maroon" trend="this month" trendUp />
        <DashboardStatCard label="Contact Requests" value={listing.contactRequests} icon={Mail} color="blue" />
      </div>

      {/* Status + Title */}
      <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}>
        <div className="flex items-center justify-between">
          <h4 className={`font-display font-semibold text-sm uppercase tracking-wide ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>Listing Status</h4>
          <DashboardBadge variant={listing.status as 'active' | 'paused'} />
        </div>
        <div>
          <div className={`text-xs mb-1.5 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>Title</div>
          {editing ? (
            <input
              type="text"
              value={listing.title}
              onChange={(e) => setListing((p) => ({ ...p, title: e.target.value }))}
              className={`w-full text-sm px-3 py-2 rounded-lg border outline-none ${isDark ? 'bg-void border-void-border text-ink' : 'bg-light-bg border-light-border text-light-text'}`}
            />
          ) : (
            <div className={`font-display font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>{listing.title}</div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Rate', field: 'rate' as const },
            { label: 'Experience', field: 'experience' as const },
            { label: 'Location', field: 'location' as const },
            { label: 'Category', field: 'category' as const },
          ].map(({ label, field }) => (
            <div key={field}>
              <div className={`text-xs mb-1.5 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>{label}</div>
              {editing ? (
                <input
                  type="text"
                  value={listing[field]}
                  onChange={(e) => setListing((p) => ({ ...p, [field]: e.target.value }))}
                  className={`w-full text-sm px-3 py-1.5 rounded-lg border outline-none ${isDark ? 'bg-void border-void-border text-ink' : 'bg-light-bg border-light-border text-light-text'}`}
                />
              ) : (
                <div className={`text-sm ${isDark ? 'text-ink' : 'text-light-text'}`}>{listing[field]}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bio */}
      <div className={`p-6 rounded-2xl border space-y-3 ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}>
        <h4 className={`font-display font-semibold text-sm uppercase tracking-wide ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>About Me</h4>
        {editing ? (
          <textarea
            value={listing.bio}
            onChange={(e) => setListing((p) => ({ ...p, bio: e.target.value }))}
            rows={5}
            className={`w-full text-sm px-3 py-2 rounded-lg border outline-none resize-none ${isDark ? 'bg-void border-void-border text-ink' : 'bg-light-bg border-light-border text-light-text'}`}
          />
        ) : (
          <p className={`text-sm leading-relaxed ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>{listing.bio}</p>
        )}
      </div>

      {/* Skills */}
      <div className={`p-6 rounded-2xl border space-y-3 ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}>
        <h4 className={`font-display font-semibold text-sm uppercase tracking-wide ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>Skills</h4>
        <div className="flex flex-wrap gap-2">
          {(editing ? SKILL_OPTIONS : listing.skills).map((skill) => {
            const sel = listing.skills.includes(skill);
            return (
              <button
                key={skill}
                onClick={() => editing && toggleSkill(skill)}
                disabled={!editing}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  sel ? 'bg-gradient-to-r from-maroon to-gold text-white border-transparent'
                    : isDark ? 'bg-void border-void-border text-ink-light' : 'bg-light-bg border-light-border text-light-text-2'
                } ${editing ? 'cursor-pointer' : 'cursor-default'}`}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </div>

      {/* Certifications */}
      <div className={`p-6 rounded-2xl border space-y-3 ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}>
        <h4 className={`font-display font-semibold text-sm uppercase tracking-wide ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>Certifications</h4>
        <div className="space-y-2">
          {listing.certifications.map((cert) => (
            <div key={cert} className={`flex items-center gap-2 text-sm ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              {cert}
            </div>
          ))}
        </div>
      </div>

      {editing && (
        <button
          onClick={() => setEditing(false)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-maroon to-gold text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity btn-press shadow-md shadow-maroon/20"
        >
          <Save className="w-4 h-4" /> Save Listing
        </button>
      )}
    </div>
  );
}

