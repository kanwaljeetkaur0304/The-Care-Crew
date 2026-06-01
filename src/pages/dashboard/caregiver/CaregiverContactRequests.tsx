import { useState, useMemo } from 'react';
import { Mail, MapPin, Check, X, MessageSquare } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { type ContactRequest } from '../../../data/dashboardMockData';
import { useContactRequests } from '../../../context/ContactRequestContext';
import DashboardEmptyState from '../../../components/dashboard/DashboardEmptyState';
import DashboardBadge from '../../../components/dashboard/DashboardBadge';

export default function CaregiverContactRequests() {
  const { isDark } = useTheme();
  const { caregiverInbox, updateStatus: contextUpdateStatus } = useContactRequests();
  const [mockRequests, setMockRequests] = useState<ContactRequest[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');

  // Merge real requests (from families contacting this caregiver) with mock data
  const allRequests: ContactRequest[] = useMemo(() => [
    ...caregiverInbox.map((r) => ({
      id: r.id,
      fromName: r.fromName,
      fromInitials: r.fromInitials,
      fromColor: r.fromColor,
      fromRole: r.fromRole,
      category: r.category,
      location: r.location,
      date: r.date,
      status: r.status,
      message: r.message,
    })),
    ...mockRequests,
  ], [caregiverInbox, mockRequests]);

  const filtered = filter === 'all' ? allRequests : allRequests.filter((r) => r.status === filter);

  const updateStatus = (id: string, status: 'accepted' | 'declined') => {
    if (caregiverInbox.some((r) => r.id === id)) {
      contextUpdateStatus(id, status);
    } else {
      setMockRequests((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`font-display text-2xl font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
          Contact Requests
        </h2>
        <p className={`text-sm mt-1 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
          Families who want to hire you
        </p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'pending', 'accepted', 'declined'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              filter === f
                ? 'bg-gradient-to-r from-maroon to-gold text-white border-transparent'
                : isDark ? 'bg-void-light border-void-border text-ink-light hover:border-gold/40' : 'bg-white border-light-border text-light-text-2 hover:border-maroon/30'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== 'all' && (
              <span className="ml-1.5 text-xs opacity-70">
                ({allRequests.filter((r) => r.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <DashboardEmptyState
          icon={Mail}
          title="No contact requests"
          description="When families are interested in hiring you, their requests will appear here."
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((req) => (
            <div
              key={req.id}
              className={`rounded-2xl border p-5 ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${req.fromColor} flex items-center justify-center font-display text-sm font-bold text-white shrink-0`}>
                    {req.fromInitials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-display font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>{req.fromName}</span>
                      <DashboardBadge variant={req.status as 'pending' | 'accepted' | 'declined'} />
                    </div>
                    <div className={`flex items-center gap-2 text-xs mt-0.5 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                      <span>{req.category}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{req.location}</span>
                      <span>·</span>
                      <span>{new Date(req.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>

                {req.status === 'pending' && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => updateStatus(req.id, 'declined')}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium ${isDark ? 'border-red-400/20 text-red-400/60 hover:text-red-400 hover:border-red-400/40 hover:bg-red-400/10' : 'border-red-200 text-red-400 hover:text-red-600 hover:border-red-300 hover:bg-red-50'}`}
                    >
                      <X className="w-3.5 h-3.5" /> Decline
                    </button>
                    <button
                      onClick={() => updateStatus(req.id, 'accepted')}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-maroon to-gold text-white text-xs font-semibold hover:opacity-90 btn-press shadow-md shadow-maroon/20"
                    >
                      <Check className="w-3.5 h-3.5" /> Accept
                    </button>
                  </div>
                )}
                {req.status === 'accepted' && (
                  <button className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium shrink-0 ${isDark ? 'border-void-border text-ink-light hover:border-gold/40 hover:text-gold' : 'border-light-border text-light-text-2 hover:border-maroon/30 hover:text-maroon'}`}>
                    <MessageSquare className="w-3.5 h-3.5" /> Message
                  </button>
                )}
              </div>

              <div className={`mt-4 p-3 rounded-xl text-sm border ${isDark ? 'bg-void border-void-border' : 'bg-light-bg border-light-border'}`}>
                <p className={isDark ? 'text-ink-light' : 'text-light-text-2'}>{req.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
