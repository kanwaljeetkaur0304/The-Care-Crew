import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  MapPin, Clock, DollarSign, Calendar, Briefcase, ArrowLeft,
  HeartHandshake, Mail, Phone, Lock, CheckCircle, ShieldCheck, Send
} from 'lucide-react';
import { jobListings, categoryColors, categoryLabels } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';
import { useSubscription } from '../context/SubscriptionContext';
import { useAuth } from '../context/AuthContext';
import { useContactRequests } from '../context/ContactRequestContext';
import SubscriptionModal from '../components/SubscriptionModal';
import SendRequestModal from '../components/SendRequestModal';

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const { isDark } = useTheme();
  const { hasActiveSubscription, expiryDate } = useSubscription();
  const { user } = useAuth();
  const { hasSentTo } = useContactRequests();
  const [showModal, setShowModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const job = useMemo(() => {
    return jobListings.find((j) => j.id === id);
  }, [id]);

  if (!job) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-void' : 'bg-light-bg'}`}>
        <div className="text-center">
          <Briefcase className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
          <h2 className={`font-display text-2xl font-semibold mb-2 ${isDark ? 'text-ink' : 'text-light-text'}`}>Job not found</h2>
          <Link to="/jobs" className="text-gold hover:underline text-sm">Browse all jobs →</Link>
        </div>
      </div>
    );
  }

  const colors = categoryColors[job.category];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-void' : 'bg-light-bg'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors ${
        isDark ? 'bg-void/90 border-void-border' : 'bg-white/80 border-light-border'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-maroon to-gold flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-maroon/20">
              <HeartHandshake className="w-5 h-5 text-white" />
            </div>
            <span className={`font-display text-xl font-semibold tracking-tight ${isDark ? 'text-ink' : 'text-light-text'}`}>
              The Care Crew
            </span>
          </Link>

          <Link
            to="/jobs"
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              isDark ? 'text-ink-light hover:text-gold' : 'text-light-text-2 hover:text-maroon'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Job Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`tag-pill border ${
              isDark
                ? `bg-void-lighter ${colors.text} border-void-border`
                : `bg-light-surface-2 ${colors.text} border-light-border`
            }`}>
              {categoryLabels[job.category]}
            </span>
            <span className={`text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>Posted {job.postedDate}</span>
          </div>

          <h1 className={`font-display text-3xl md:text-4xl font-semibold mb-4 ${isDark ? 'text-ink' : 'text-light-text'}`}>
            {job.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4">
            <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>
              <MapPin className={`w-4 h-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
              {job.location}
            </div>
            <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>
              <DollarSign className={`w-4 h-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
              {job.salary}
            </div>
            <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>
              <Clock className={`w-4 h-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
              {job.schedule}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className={`rounded-2xl border p-6 mb-6 ${isDark ? 'bg-void border-void-border' : 'bg-white border-light-border'}`}>
          <h2 className={`font-display text-lg font-semibold mb-3 ${isDark ? 'text-ink' : 'text-light-text'}`}>About the Role</h2>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>{job.description}</p>
        </div>

        {/* Requirements */}
        <div className={`rounded-2xl border p-6 mb-6 ${isDark ? 'bg-void border-void-border' : 'bg-white border-light-border'}`}>
          <h2 className={`font-display text-lg font-semibold mb-3 ${isDark ? 'text-ink' : 'text-light-text'}`}>Requirements</h2>
          <ul className="space-y-2">
            {job.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <CheckCircle className={`w-4 h-4 mt-0.5 shrink-0 ${isDark ? 'text-gold' : 'text-maroon'}`} />
                <span className={`text-sm ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Posted By */}
        <div className={`rounded-2xl border p-6 mb-6 ${isDark ? 'bg-void border-void-border' : 'bg-white border-light-border'}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald to-teal flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className={`font-medium text-sm ${isDark ? 'text-ink' : 'text-light-text'}`}>{job.postedBy}</div>
              <div className={`text-xs flex items-center gap-1 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                <Calendar className="w-3 h-3" /> Posted {job.postedDate}
              </div>
            </div>
          </div>
        </div>

        {/* Apply — visible to everyone, gated behind subscription */}
        <div className={`rounded-2xl border p-6 mb-6 ${isDark ? 'bg-void border-void-border' : 'bg-white border-light-border'}`}>
          <div className="flex items-center gap-2 mb-3">
            <Send className={`w-5 h-5 ${isDark ? 'text-gold' : 'text-maroon'}`} />
            <h2 className={`font-display text-lg font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
              Apply for this Job
            </h2>
          </div>
          <p className={`text-sm mb-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
            Send your introduction directly to the family. Your request will appear in their dashboard inbox.
          </p>
          {user && hasSentTo(user.id, job.id) ? (
            <div className={`flex items-center gap-2 py-3 px-4 rounded-xl text-sm font-medium ${isDark ? 'bg-emerald-900/20 border border-emerald-700/30 text-emerald-400' : 'bg-emerald-50 border border-emerald-200 text-emerald-700'}`}>
              <CheckCircle className="w-4 h-4 shrink-0" />
              Application already sent for this job
            </div>
          ) : (
            <button
              onClick={() => {
                if (!hasActiveSubscription) {
                  setShowModal(true);
                } else {
                  setShowRequestModal(true);
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-maroon to-gold text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity btn-press shadow-md shadow-maroon/20"
            >
              <Send className="w-4 h-4" />
              Apply for this Job
            </button>
          )}
        </div>

        {/* Contact Section */}
        <div className={`rounded-2xl border p-6 ${isDark ? 'bg-void border-void-border' : 'bg-white border-light-border'}`}>
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className={`w-5 h-5 ${isDark ? 'text-gold' : 'text-maroon'}`} />
            <h2 className={`font-display text-lg font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
              Contact Information
            </h2>
          </div>

          {hasActiveSubscription ? (
            <div className="space-y-4">
              <div className={`flex items-center gap-3 p-4 rounded-xl ${isDark ? 'bg-void-lighter' : 'bg-light-surface-2'}`}>
                <Mail className={`w-5 h-5 ${isDark ? 'text-gold' : 'text-maroon'}`} />
                <div>
                  <div className={`text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>Email</div>
                  <a href={`mailto:${job.contactEmail}`} className={`text-sm font-medium hover:underline ${isDark ? 'text-ink' : 'text-light-text'}`}>
                    {job.contactEmail}
                  </a>
                </div>
              </div>

              <div className={`flex items-center gap-3 p-4 rounded-xl ${isDark ? 'bg-void-lighter' : 'bg-light-surface-2'}`}>
                <Phone className={`w-5 h-5 ${isDark ? 'text-gold' : 'text-maroon'}`} />
                <div>
                  <div className={`text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>Phone</div>
                  <a href={`tel:${job.contactPhone}`} className={`text-sm font-medium hover:underline ${isDark ? 'text-ink' : 'text-light-text'}`}>
                    {job.contactPhone}
                  </a>
                </div>
              </div>

              {expiryDate && (
                <div className={`text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                  Your subscription is active until <span className="text-gold font-medium">{expiryDate}</span>
                </div>
              )}

              <a
                href={`mailto:${job.contactEmail}?subject=Application%20for%20${encodeURIComponent(job.title)}`}
                className="block w-full py-3.5 mt-4 text-center bg-gradient-to-r from-maroon to-gold text-white font-medium rounded-xl transition-all btn-press"
              >
                Apply Now via Email
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              <div className={`flex items-center gap-3 p-4 rounded-xl blur-sm select-none ${isDark ? 'bg-void-lighter' : 'bg-light-surface-2'}`}>
                <Mail className={`w-5 h-5 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                <div>
                  <div className={`text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>Email</div>
                  <div className={`text-sm font-medium ${isDark ? 'text-ink' : 'text-light-text'}`}>••••••••@email.com</div>
                </div>
              </div>

              <div className={`flex items-center gap-3 p-4 rounded-xl blur-sm select-none ${isDark ? 'bg-void-lighter' : 'bg-light-surface-2'}`}>
                <Phone className={`w-5 h-5 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                <div>
                  <div className={`text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>Phone</div>
                  <div className={`text-sm font-medium ${isDark ? 'text-ink' : 'text-light-text'}`}>+1 (•••) •••-••••</div>
                </div>
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="w-full py-3.5 bg-gradient-to-r from-maroon to-gold text-white font-medium rounded-xl transition-all btn-press flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Unlock Contact Details
              </button>

              <p className={`text-xs text-center ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                Subscribe to a plan to view phone numbers and email addresses for all job listings.
              </p>
            </div>
          )}
        </div>
      </main>

      <SubscriptionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        contextMessage="To apply for this job, please subscribe to a plan to continue. You can then send your application directly to the family."
      />
      <SendRequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        targetId={job.id}
        targetName={job.postedBy}
        targetRole="family"
        targetCategory={categoryLabels[job.category] ?? job.category}
        targetLocation={job.location}
      />
    </div>
  );
}
