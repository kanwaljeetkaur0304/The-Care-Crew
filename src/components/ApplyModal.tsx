import { useState } from 'react';
import { X, Send, CheckCircle2, User, Mail, Phone, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessagesContext';
import type { JobMatch } from '../data/dashboardMockData';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobMatch;
}

export default function ApplyModal({ isOpen, onClose, job }: ApplyModalProps) {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { addThread } = useMessages();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: '',
    description: '',
  });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.description.trim()) {
      setError('Please write a short cover message.');
      return;
    }

    const applicationText =
      `Hi, I'm ${form.name} and I'd like to apply for your "${job.title}" position.\n\n` +
      `📞 Phone: ${form.phone || 'Not provided'}\n` +
      `📧 Email: ${form.email}\n\n` +
      `${form.description}`;

    addThread({
      id: `apply-${job.id}`,
      withName: job.family,
      withInitials: job.family
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      withColor: 'from-maroon to-gold',
      withRole: 'family',
      category: job.category,
      lastMessage: applicationText.slice(0, 60) + '…',
      lastTime: 'Just now',
      unread: 0,
      messages: [
        {
          id: `m-apply-${Date.now()}`,
          senderId: 'me',
          text: applicationText,
          time: 'Just now',
          status: 'sent',
        },
      ],
    });

    setSent(true);
  };

  const handleGoToMessages = () => {
    setSent(false);
    onClose();
    navigate('/dashboard/messages');
  };

  const inputClass = `w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-colors ${
    isDark
      ? 'bg-void border-void-border text-ink placeholder:text-ink-muted focus:border-gold/50'
      : 'bg-light-bg border-light-border text-light-text placeholder:text-light-text-muted focus:border-maroon/40'
  }`;

  const labelClass = `block text-xs font-semibold uppercase tracking-wide mb-1.5 ${
    isDark ? 'text-ink-muted' : 'text-light-text-muted'
  }`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-void/60 backdrop-blur-sm" onClick={onClose} />

      <div
        className={`relative rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border ${
          isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'
        }`}
      >
        {/* Header */}
        <div
          className={`sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b ${
            isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'
          }`}
        >
          <div>
            <h3 className={`font-display text-lg font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
              {sent ? 'Application Sent!' : 'Apply for Position'}
            </h3>
            {!sent && (
              <p className={`text-xs mt-0.5 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                {job.family} · {job.category}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'hover:bg-void-lighter text-ink-muted' : 'hover:bg-light-surface-2 text-light-text-muted'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {sent ? (
            /* ── Success State ── */
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h4 className={`font-display text-xl font-semibold mb-2 ${isDark ? 'text-ink' : 'text-light-text'}`}>
                Application sent!
              </h4>
              <p className={`text-sm mb-6 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                Your application has been sent to <strong>{job.family}</strong>. You can track the conversation in your Messages.
              </p>
              <button
                onClick={handleGoToMessages}
                className="w-full py-3 bg-gradient-to-r from-maroon to-gold text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity btn-press"
              >
                Go to Messages →
              </button>
            </div>
          ) : (
            /* ── Application Form ── */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Job info pill */}
              <div className={`px-4 py-3 rounded-xl text-sm ${isDark ? 'bg-void border-void-border' : 'bg-light-bg border border-light-border'}`}>
                <div className={`font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>{job.title}</div>
                <div className={`text-xs mt-0.5 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                  {job.location} · {job.budget}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className={labelClass}>Full Name</label>
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Priya Sharma"
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className={labelClass}>Email</label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className={labelClass}>Phone Number</label>
                <div className="relative">
                  <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+1 (647) 555-0199"
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>

              {/* Cover message */}
              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Cover Message
                  </span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Tell the family about your experience, availability, and why you're a great fit..."
                  className={`${inputClass} resize-none`}
                />
                <div className={`text-right text-xs mt-1 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                  {form.description.length} / 800
                </div>
              </div>

              {error && (
                <div className={`px-4 py-3 rounded-xl text-sm border ${
                  isDark ? 'bg-maroon/10 border-maroon/30 text-red-400' : 'bg-red-50 border-red-200 text-red-600'
                }`}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-maroon to-gold text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity btn-press shadow-md shadow-maroon/20"
              >
                <Send className="w-4 h-4" />
                Send Application
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
