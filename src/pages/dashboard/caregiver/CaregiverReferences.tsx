import { useState } from 'react';
import { Award, Phone, Mail, ShieldCheck, Plus, Trash2, CheckCircle, Clock } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { type Reference } from '../../../data/dashboardMockData';
import DashboardEmptyState from '../../../components/dashboard/DashboardEmptyState';
import DashboardBadge from '../../../components/dashboard/DashboardBadge';

export default function CaregiverReferences() {
  const { isDark } = useTheme();
  const [refs, setRefs] = useState<Reference[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newRef, setNewRef] = useState({ name: '', relationship: '', phone: '', email: '', comment: '' });

  const deleteRef = (id: string) => setRefs((prev) => prev.filter((r) => r.id !== id));

  const addRef = () => {
    if (!newRef.name || !newRef.relationship) return;
    const ref: Reference = {
      id: `ref-${Date.now()}`,
      ...newRef,
      years: 1,
      verified: false,
      initials: newRef.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
      color: 'from-gray-400 to-slate-500',
    };
    setRefs((prev) => [...prev, ref]);
    setNewRef({ name: '', relationship: '', phone: '', email: '', comment: '' });
    setShowForm(false);
  };

  const verifiedCount = refs.filter((r) => r.verified).length;

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`font-display text-2xl font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
            References
          </h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
            {refs.length} references · {verifiedCount} verified
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-maroon to-gold text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity btn-press shadow-md shadow-maroon/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Reference
        </button>
      </div>

      {/* Info Banner */}
      <div className={`p-4 rounded-2xl border flex items-start gap-3 ${isDark ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'}`}>
        <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
        <div>
          <div className={`text-sm font-semibold text-emerald-700`}>Build trust with verified references</div>
          <div className={`text-xs mt-0.5 text-emerald-600`}>
            We will send a verification email to your references. Verified references appear with a green badge and increase your profile trust score.
          </div>
        </div>
      </div>

      {/* Add Reference Form */}
      {showForm && (
        <div className={`p-5 rounded-2xl border space-y-3 ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}>
          <h4 className={`font-display font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>New Reference</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'Full Name *', field: 'name', placeholder: 'e.g. Meena Patel' },
              { label: 'Relationship *', field: 'relationship', placeholder: 'e.g. Former Employer' },
              { label: 'Phone', field: 'phone', placeholder: '+1 (647) 555-0000' },
              { label: 'Email', field: 'email', placeholder: 'their@email.com' },
            ].map(({ label, field, placeholder }) => (
              <div key={field}>
                <label className={`text-xs mb-1 block ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>{label}</label>
                <input
                  type="text"
                  value={newRef[field as keyof typeof newRef]}
                  onChange={(e) => setNewRef((p) => ({ ...p, [field]: e.target.value }))}
                  placeholder={placeholder}
                  className={`w-full text-sm px-3 py-2 rounded-lg border outline-none ${isDark ? 'bg-void border-void-border text-ink placeholder:text-ink-muted' : 'bg-light-bg border-light-border text-light-text placeholder:text-light-text-muted'}`}
                />
              </div>
            ))}
          </div>
          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>What they say about you</label>
            <textarea
              value={newRef.comment}
              onChange={(e) => setNewRef((p) => ({ ...p, comment: e.target.value }))}
              placeholder="Optional — they can also add this themselves when they verify"
              rows={3}
              className={`w-full text-sm px-3 py-2 rounded-lg border outline-none resize-none ${isDark ? 'bg-void border-void-border text-ink placeholder:text-ink-muted' : 'bg-light-bg border-light-border text-light-text placeholder:text-light-text-muted'}`}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowForm(false)}
              className={`flex-1 py-2.5 rounded-xl border text-sm font-medium ${isDark ? 'border-void-border text-ink-muted' : 'border-light-border text-light-text-muted'}`}
            >
              Cancel
            </button>
            <button
              onClick={addRef}
              disabled={!newRef.name || !newRef.relationship}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-maroon to-gold text-white text-sm font-semibold hover:opacity-90 transition-opacity btn-press disabled:opacity-50"
            >
              Add & Send Verification
            </button>
          </div>
        </div>
      )}

      {/* References List */}
      {refs.length === 0 ? (
        <DashboardEmptyState
          icon={Award}
          title="No references yet"
          description="Add references from former employers or colleagues to build trust with families."
          actionLabel="Add Your First Reference"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="space-y-4">
          {refs.map((ref) => (
            <div key={ref.id} className={`rounded-2xl border p-5 ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${ref.color} flex items-center justify-center text-sm font-bold text-white shrink-0`}>
                    {ref.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-display font-semibold text-sm ${isDark ? 'text-ink' : 'text-light-text'}`}>{ref.name}</span>
                      <DashboardBadge variant={ref.verified ? 'verified' : 'unverified'} />
                    </div>
                    <div className={`text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>{ref.relationship}</div>
                  </div>
                </div>
                <button
                  onClick={() => deleteRef(ref.id)}
                  className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-ink-muted hover:text-red-400 hover:bg-red-400/10' : 'text-light-text-muted hover:text-red-500 hover:bg-red-50'}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Contact Details */}
              <div className={`flex flex-wrap gap-x-4 gap-y-1 text-xs mb-3 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                {ref.phone && (
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{ref.phone}</span>
                )}
                {ref.email && (
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{ref.email}</span>
                )}
                {ref.years > 0 && (
                  <span>{ref.years} year{ref.years > 1 ? 's' : ''} together</span>
                )}
              </div>

              {/* Comment */}
              {ref.comment && (
                <div className={`p-3 rounded-xl text-sm italic border ${isDark ? 'bg-void border-void-border text-ink-light' : 'bg-light-bg border-light-border text-light-text-2'}`}>
                  "{ref.comment}"
                </div>
              )}

              {/* Verification Status */}
              <div className={`flex items-center gap-2 mt-3 text-xs ${ref.verified ? 'text-emerald-600' : isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                {ref.verified
                  ? <><CheckCircle className="w-3.5 h-3.5" /> Verified by {ref.name.split(' ')[0]}</>
                  : <><Clock className="w-3.5 h-3.5" /> Verification email sent — awaiting response</>
                }
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
