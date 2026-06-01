import { useState } from 'react';
import {
  X, Mail, Lock, Eye, EyeOff, Loader2, CheckCircle2, User, Phone, MapPin,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

// Cities with strong South Asian communities across Canada & USA
const CITIES = [
  // Ontario
  'Brampton, ON','Mississauga, ON','Toronto, ON','Markham, ON','Scarborough, ON',
  'Richmond Hill, ON','Vaughan, ON','Ajax, ON','Pickering, ON','Oakville, ON',
  'Burlington, ON','Hamilton, ON','Kitchener, ON','Waterloo, ON','London, ON',
  'Windsor, ON','Ottawa, ON','Oshawa, ON','Whitby, ON','Milton, ON',
  // BC
  'Surrey, BC','Vancouver, BC','Burnaby, BC','Richmond, BC','Abbotsford, BC',
  'Langley, BC','Coquitlam, BC','Victoria, BC',
  // Alberta
  'Calgary, AB','Edmonton, AB','Red Deer, AB','Lethbridge, AB',
  // Other Canada
  'Winnipeg, MB','Saskatoon, SK','Regina, SK','Halifax, NS',
  'Montreal, QC','Laval, QC','Quebec City, QC',
  // New York / New Jersey
  'New York, NY','Brooklyn, NY','Queens, NY','Jersey City, NJ',
  'Newark, NJ','Edison, NJ','Iselin, NJ','Woodbridge, NJ','Parsippany, NJ',
  // California
  'Fremont, CA','San Jose, CA','Sunnyvale, CA','Santa Clara, CA','Cupertino, CA',
  'Milpitas, CA','Oakland, CA','San Francisco, CA','Los Angeles, CA',
  'San Diego, CA','Sacramento, CA','Irvine, CA','Anaheim, CA','Fresno, CA',
  // Texas
  'Houston, TX','Dallas, TX','Plano, TX','Frisco, TX','Irving, TX',
  'Garland, TX','Arlington, TX','Austin, TX','San Antonio, TX',
  // Illinois
  'Chicago, IL','Naperville, IL','Schaumburg, IL','Lisle, IL',
  // Washington
  'Seattle, WA','Bellevue, WA','Redmond, WA','Kirkland, WA',
  // Other USA
  'Atlanta, GA','Charlotte, NC','Raleigh, NC','Durham, NC',
  'Phoenix, AZ','Scottsdale, AZ','Tempe, AZ',
  'Boston, MA','Cambridge, MA',
  'Philadelphia, PA','Pittsburgh, PA',
  'Detroit, MI','Ann Arbor, MI',
  'Minneapolis, MN','Denver, CO',
  'Las Vegas, NV','Henderson, NV',
  'Miami, FL','Orlando, FL','Tampa, FL',
  'Washington, DC','Baltimore, MD','Silver Spring, MD',
  'Columbus, OH','Cleveland, OH','Cincinnati, OH',
  'Indianapolis, IN','Nashville, TN','Memphis, TN',
  'Portland, OR','Salt Lake City, UT',
];

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailConfirmationSent, setEmailConfirmationSent] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { isDark } = useTheme();

  const { login, register, isLoading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    role: 'family' as 'family' | 'caregiver',
  });

  if (!isOpen) return null;

  // ── Location autocomplete ──────────────────────────────────────────────────
  const handleLocationChange = (value: string) => {
    setForm((f) => ({ ...f, location: value }));
    if (value.length >= 2) {
      const q = value.toLowerCase();
      const matches = CITIES.filter((c) => c.toLowerCase().includes(q)).slice(0, 6);
      setLocationSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectLocation = (city: string) => {
    setForm((f) => ({ ...f, location: city }));
    setShowSuggestions(false);
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  const switchMode = (m: 'login' | 'register') => {
    setMode(m);
    setError('');
    setSuccess(false);
    setEmailConfirmationSent(false);
    setForm({ name: '', email: '', password: '', phone: '', location: '', role: 'family' });
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      if (form.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      const result = await register(
        form.name, form.email, form.password, form.role,
        form.phone || undefined,
        form.location || undefined,
      );
      if (result.ok) {
        setEmailConfirmationSent(Boolean(result.needsEmailConfirmation));
        setSuccess(true);
        if (!result.needsEmailConfirmation) {
          setTimeout(() => {
            setSuccess(false);
            setEmailConfirmationSent(false);
            onClose();
            navigate('/dashboard');
          }, 900);
        }
      } else {
        setError(result.error ?? 'Registration failed. Please try again.');
      }
    } else {
      const result = await login(form.email, form.password);
      if (result.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
          navigate('/dashboard');
        }, 900);
      } else {
        setError(result.error ?? 'Invalid email or password');
      }
    }
  };

  // ── Style helpers ──────────────────────────────────────────────────────────
  const inputClass = `w-full pl-10 pr-4 py-3 border rounded-xl text-sm placeholder:text-opacity-60 ${
    isDark
      ? 'bg-void border-void-border text-ink placeholder:text-ink-muted'
      : 'bg-light-bg border-light-border text-light-text placeholder:text-light-text-muted'
  }`;

  const labelClass = `block text-sm font-medium mb-1.5 ${isDark ? 'text-ink' : 'text-light-text'}`;

  const chipBtn = (active: boolean) =>
    `px-4 py-3 rounded-xl text-sm font-medium border transition-all ${
      active
        ? 'bg-emerald/10 border-emerald text-emerald'
        : isDark
          ? 'bg-void border-void-border text-ink-light hover:border-ink-muted'
          : 'bg-light-bg border-light-border text-light-text-2 hover:border-light-text-muted'
    }`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-void/60 modal-backdrop" onClick={onClose} />

      <div className={`relative rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border ${
        isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'
      }`}>
        {/* Header */}
        <div className={`sticky top-0 border-b px-6 py-4 flex items-center justify-between z-10 ${
          isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'
        }`}>
          <h3 className={`font-display text-xl font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
            {success ? 'Welcome!' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </h3>
          <button onClick={onClose} className={`p-1 rounded-lg transition-colors ${isDark ? 'hover:bg-void-lighter' : 'hover:bg-light-surface-2'}`}>
            <X className={`w-5 h-5 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            /* ── Success screen ── */
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald to-teal flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h4 className={`font-display text-2xl font-semibold mb-2 ${isDark ? 'text-ink' : 'text-light-text'}`}>
                {emailConfirmationSent ? 'Check your email' : mode === 'login' ? 'Signed in!' : 'Account created!'}
              </h4>
              <p className={`text-sm ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                {emailConfirmationSent ? 'We sent a confirmation link. Click it, then sign in.' : 'Redirecting you to your dashboard…'}
              </p>
              {emailConfirmationSent && (
                <button
                  type="button"
                  onClick={() => { setSuccess(false); setEmailConfirmationSent(false); switchMode('login'); }}
                  className="mt-6 text-sm font-medium text-gold hover:underline"
                >
                  Go to Sign In
                </button>
              )}
            </div>
          ) : (
            <>
              {/* ── Divider ── */}
              <div className="flex items-center gap-3 mb-5">
                <div className={`flex-1 h-px ${isDark ? 'bg-void-border' : 'bg-light-border'}`} />
                <span className={`text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>or sign in with your account</span>
                <div className={`flex-1 h-px ${isDark ? 'bg-void-border' : 'bg-light-border'}`} />
              </div>

              {/* ── Sign in / Register tabs ── */}
              <div className={`flex rounded-full p-1 mb-6 border ${isDark ? 'bg-void border-void-border' : 'bg-light-bg border-light-border'}`}>
                {(['login', 'register'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => switchMode(m)}
                    className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                      mode === m
                        ? 'bg-gradient-to-r from-maroon to-gold text-white shadow-lg'
                        : isDark ? 'text-ink-muted hover:text-ink' : 'text-light-text-muted hover:text-light-text'
                    }`}
                  >
                    {m === 'login' ? 'Sign In' : 'Register'}
                  </button>
                ))}
              </div>

              {/* ── Error banner ── */}
              {error && (
                <div className={`mb-4 px-4 py-3 border rounded-xl text-sm ${
                  isDark ? 'bg-maroon/10 border-maroon/30 text-maroon-light' : 'bg-red-50 border-red-200 text-red-600'
                }`}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* ── Register-only fields ── */}
                {mode === 'register' && (
                  <>
                    {/* Full Name */}
                    <div>
                      <label className={labelClass}>Full Name</label>
                      <div className="relative">
                        <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                        <input
                          type="text" required value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Jane Smith" className={inputClass}
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className={labelClass}>Phone Number</label>
                      <div className="relative">
                        <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+1 (555) 123-4567"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <label className={labelClass}>Location</label>
                      <div className="relative">
                        <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                        <input
                          type="text"
                          value={form.location}
                          onChange={(e) => handleLocationChange(e.target.value)}
                          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                          onFocus={() => form.location.length >= 2 && setShowSuggestions(locationSuggestions.length > 0)}
                          placeholder="e.g. Brampton, ON"
                          className={inputClass}
                          autoComplete="off"
                        />
                        {/* Suggestions dropdown */}
                        {showSuggestions && (
                          <ul className={`absolute z-50 left-0 right-0 top-full mt-1 rounded-xl border shadow-lg overflow-hidden ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}>
                            {locationSuggestions.map((city) => (
                              <li key={city}>
                                <button
                                  type="button"
                                  onMouseDown={() => selectLocation(city)}
                                  className={`w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${isDark ? 'text-ink-light hover:bg-void-lighter' : 'text-light-text-2 hover:bg-light-surface-2'}`}
                                >
                                  <MapPin className="w-3.5 h-3.5 shrink-0 opacity-50" />
                                  {city}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    {/* Role */}
                    <div>
                      <label className={labelClass}>I am a…</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button type="button" onClick={() => setForm({ ...form, role: 'family' })}
                          className={chipBtn(form.role === 'family')}>
                          Family / Employer
                        </button>
                        <button type="button" onClick={() => setForm({ ...form, role: 'caregiver' })}
                          className={`${chipBtn(form.role === 'caregiver')} ${
                            form.role === 'caregiver'
                              ? '!bg-gold/10 !border-gold !text-gold'
                              : ''
                          }`}>
                          Caregiver / Job Seeker
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Email */}
                <div>
                  <label className={labelClass}>Email</label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                    <input
                      type="email" required value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com" className={inputClass}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className={labelClass}>Password</label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                    <input
                      type={showPassword ? 'text' : 'password'} required value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder={mode === 'register' ? 'Min. 6 characters' : 'Your password'}
                      className={`${inputClass} pr-11`}
                    />
                    <button
                      type="button" onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-ink-muted hover:text-ink' : 'text-light-text-muted hover:text-light-text'}`}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit" disabled={isLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-maroon to-gold text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity btn-press disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-maroon/20"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              <p className={`text-center text-xs mt-6 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                {mode === 'login' ? (
                  <>Don&apos;t have an account?{' '}
                    <button onClick={() => switchMode('register')} className="text-gold font-medium hover:underline">Register</button>
                  </>
                ) : (
                  <>Already have an account?{' '}
                    <button onClick={() => switchMode('login')} className="text-gold font-medium hover:underline">Sign in</button>
                  </>
                )}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
