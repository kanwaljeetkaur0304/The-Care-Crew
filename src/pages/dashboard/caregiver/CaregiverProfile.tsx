import { useState } from 'react';
import { Edit2, Save, X, CheckCircle, AlertCircle, ShieldCheck, User, Mail, Phone, MapPin } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { MOCK_CAREGIVER_PROFILE } from '../../../data/dashboardMockData';

const LANG_OPTIONS = ['Hindi', 'Punjabi', 'Gujarati', 'Bengali', 'Tamil', 'Telugu', 'Urdu', 'English', 'Marathi', 'Malayalam'];
const CATEGORY_OPTIONS = ['Nanny', 'Housekeeper', 'Cook', 'Elder Care', 'Babysitter', 'Driver'];
const AVAIL_OPTIONS = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'weekends', label: 'Weekends' },
  { value: 'live-in', label: 'Live-in' },
];

export default function CaregiverProfile() {
  const { isDark } = useTheme();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(MOCK_CAREGIVER_PROFILE);

  const toggle = <T extends string>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`font-display text-2xl font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
            My Profile
          </h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
            Your public caregiver profile · {profile.profileCompletion}% complete
          </p>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
            editing
              ? isDark ? 'border-red-400/30 text-red-400 hover:bg-red-400/10' : 'border-red-300 text-red-600 hover:bg-red-50'
              : isDark ? 'border-void-border text-ink-light hover:border-gold/40 hover:text-gold' : 'border-light-border text-light-text-2 hover:border-maroon/30 hover:text-maroon'
          }`}
        >
          {editing ? <><X className="w-4 h-4" /> Cancel</> : <><Edit2 className="w-4 h-4" /> Edit</>}
        </button>
      </div>

      {/* Avatar & Verification */}
      <div className={`p-6 rounded-2xl border ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}>
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-maroon to-gold flex items-center justify-center text-2xl font-bold text-white">
              {profile.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            {profile.backgroundCheck && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>
          <div>
            <h3 className={`font-display text-lg font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>{profile.name}</h3>
            <p className={`text-sm ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>{profile.experience} experience</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
              {profile.verifiedEmail && (
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-xs text-emerald-600 font-medium">Email</span>
                </div>
              )}
              {profile.verifiedPhone && (
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-xs text-emerald-600 font-medium">Phone</span>
                </div>
              )}
              {profile.backgroundCheck && (
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-xs text-emerald-600 font-medium">Background Check</span>
                </div>
              )}
              {!profile.verifiedPhone && (
                <div className="flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-xs text-amber-600 font-medium">Verify phone</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}>
        <h4 className={`font-display font-semibold text-sm uppercase tracking-wide ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>Contact Information</h4>
        <div className="space-y-3">
          {[
            { icon: User, label: 'Full Name', field: 'name' as const, value: profile.name },
            { icon: Mail, label: 'Email', field: 'email' as const, value: profile.email },
            { icon: Phone, label: 'Phone', field: 'phone' as const, value: profile.phone },
            { icon: MapPin, label: 'Location', field: 'location' as const, value: profile.location },
          ].map(({ icon: Icon, label, field, value }) => (
            <div key={field} className="flex items-center gap-3">
              <Icon className={`w-4 h-4 shrink-0 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
              <div className="flex-1">
                <div className={`text-xs mb-0.5 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>{label}</div>
                {editing ? (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setProfile((p) => ({ ...p, [field]: e.target.value }))}
                    className={`w-full text-sm px-3 py-1.5 rounded-lg border outline-none ${isDark ? 'bg-void border-void-border text-ink' : 'bg-light-bg border-light-border text-light-text'}`}
                  />
                ) : (
                  <div className={`text-sm ${isDark ? 'text-ink' : 'text-light-text'}`}>{value}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bio */}
      <div className={`p-6 rounded-2xl border space-y-3 ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}>
        <h4 className={`font-display font-semibold text-sm uppercase tracking-wide ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>About Me</h4>
        {editing ? (
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
            rows={4}
            className={`w-full text-sm px-3 py-2 rounded-lg border outline-none resize-none ${isDark ? 'bg-void border-void-border text-ink' : 'bg-light-bg border-light-border text-light-text'}`}
          />
        ) : (
          <p className={`text-sm leading-relaxed ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>{profile.bio}</p>
        )}
      </div>

      {/* Rate & Experience */}
      <div className={`p-6 rounded-2xl border grid grid-cols-2 gap-5 ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}>
        {[
          { label: 'Hourly Rate', field: 'rate' as const, value: profile.rate },
          { label: 'Experience', field: 'experience' as const, value: profile.experience },
        ].map(({ label, field, value }) => (
          <div key={field}>
            <div className={`text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>{label}</div>
            {editing ? (
              <input
                type="text"
                value={value}
                onChange={(e) => setProfile((p) => ({ ...p, [field]: e.target.value }))}
                className={`w-full text-sm px-3 py-1.5 rounded-lg border outline-none ${isDark ? 'bg-void border-void-border text-ink' : 'bg-light-bg border-light-border text-light-text'}`}
              />
            ) : (
              <div className={`font-display text-lg font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>{value}</div>
            )}
          </div>
        ))}
      </div>

      {/* Categories */}
      <div className={`p-6 rounded-2xl border space-y-3 ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}>
        <h4 className={`font-display font-semibold text-sm uppercase tracking-wide ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>Care Categories</h4>
        <div className="flex flex-wrap gap-2">
          {(editing ? CATEGORY_OPTIONS : profile.categories).map((cat) => {
            const sel = profile.categories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => editing && setProfile((p) => ({ ...p, categories: toggle(p.categories, cat) }))}
                disabled={!editing}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  sel ? 'bg-gradient-to-r from-maroon to-gold text-white border-transparent'
                    : isDark ? 'bg-void border-void-border text-ink-light' : 'bg-light-bg border-light-border text-light-text-2'
                } ${editing ? 'cursor-pointer' : 'cursor-default'}`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Languages */}
      <div className={`p-6 rounded-2xl border space-y-3 ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}>
        <h4 className={`font-display font-semibold text-sm uppercase tracking-wide ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>Languages</h4>
        <div className="flex flex-wrap gap-2">
          {(editing ? LANG_OPTIONS : profile.languages).map((lang) => {
            const sel = profile.languages.includes(lang);
            return (
              <button
                key={lang}
                onClick={() => editing && setProfile((p) => ({ ...p, languages: toggle(p.languages, lang) }))}
                disabled={!editing}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  sel ? 'bg-gradient-to-r from-maroon to-gold text-white border-transparent'
                    : isDark ? 'bg-void border-void-border text-ink-light' : 'bg-light-bg border-light-border text-light-text-2'
                } ${editing ? 'cursor-pointer' : 'cursor-default'}`}
              >
                {lang}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability */}
      <div className={`p-6 rounded-2xl border space-y-3 ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}>
        <h4 className={`font-display font-semibold text-sm uppercase tracking-wide ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>Availability</h4>
        <div className="flex flex-wrap gap-2">
          {(editing ? AVAIL_OPTIONS : AVAIL_OPTIONS.filter((a) => profile.availability.includes(a.value as typeof profile.availability[number]))).map((opt) => {
            const sel = profile.availability.includes(opt.value as typeof profile.availability[number]);
            return (
              <button
                key={opt.value}
                onClick={() => editing && setProfile((p) => ({ ...p, availability: toggle(p.availability, opt.value as typeof p.availability[number]) }))}
                disabled={!editing}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  sel ? 'bg-gradient-to-r from-maroon to-gold text-white border-transparent'
                    : isDark ? 'bg-void border-void-border text-ink-light' : 'bg-light-bg border-light-border text-light-text-2'
                } ${editing ? 'cursor-pointer' : 'cursor-default'}`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Certifications */}
      <div className={`p-6 rounded-2xl border space-y-3 ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}>
        <h4 className={`font-display font-semibold text-sm uppercase tracking-wide ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>Certifications</h4>
        <div className="space-y-2">
          {profile.certifications.map((cert) => (
            <div key={cert} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className={`text-sm ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>{cert}</span>
            </div>
          ))}
        </div>
      </div>

      {editing && (
        <button
          onClick={() => setEditing(false)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-maroon to-gold text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity btn-press shadow-md shadow-maroon/20"
        >
          <Save className="w-4 h-4" /> Save Changes
        </button>
      )}
    </div>
  );
}
