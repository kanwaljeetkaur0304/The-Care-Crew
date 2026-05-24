import { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff, Loader2, CheckCircle2, User, Phone, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSubscription } from '../context/SubscriptionContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailConfirmationSent, setEmailConfirmationSent] = useState(false);
  const { isDark } = useTheme();

  const { login, register, loginAsDemo, isLoading } = useAuth();
  const { purchaseSubscription, purchaseListingSubscription } = useSubscription();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'family' as 'family' | 'caregiver',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      if (form.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      const result = await register(form.name, form.email, form.password, form.role, form.phone);
      if (result.ok) {
        setEmailConfirmationSent(Boolean(result.needsEmailConfirmation));
        setSuccess(true);
        if (!result.needsEmailConfirmation) {
          setTimeout(() => {
            setSuccess(false);
            setEmailConfirmationSent(false);
            onClose();
          }, 1500);
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
        }, 1500);
      } else {
        setError(result.error ?? 'Invalid email or password');
      }
    }
  };

  const switchMode = (m: 'login' | 'register') => {
    setMode(m);
    setError('');
    setSuccess(false);
    setEmailConfirmationSent(false);
    setForm({ name: '', email: '', password: '', phone: '', role: 'family' });
  };

  const inputClass = `w-full pl-10 pr-4 py-3 border rounded-xl text-sm placeholder:text-opacity-60 ${
    isDark
      ? 'bg-void border-void-border text-ink placeholder:text-ink-muted'
      : 'bg-light-bg border-light-border text-light-text placeholder:text-light-text-muted'
  }`;

  const labelClass = `block text-sm font-medium mb-1.5 ${
    isDark ? 'text-ink' : 'text-light-text'
  }`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-void/60 modal-backdrop" onClick={onClose} />

      <div className={`relative rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border ${
        isDark
          ? 'bg-void-light border-void-border'
          : 'bg-white border-light-border'
      }`}>
        <div className={`sticky top-0 border-b px-6 py-4 flex items-center justify-between z-10 ${
          isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'
        }`}>
          <h3 className={`font-display text-xl font-semibold ${
            isDark ? 'text-ink' : 'text-light-text'
          }`}>
            {success ? 'Welcome!' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </h3>
          <button onClick={onClose} className={`p-1 rounded-lg transition-colors ${
            isDark ? 'hover:bg-void-lighter' : 'hover:bg-light-surface-2'
          }`}>
            <X className={`w-5 h-5 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald to-teal flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h4 className={`font-display text-2xl font-semibold mb-2 ${
                isDark ? 'text-ink' : 'text-light-text'
              }`}>
                {emailConfirmationSent
                  ? 'Check your email'
                  : mode === 'login'
                    ? 'Signed in!'
                    : 'Account created!'}
              </h4>
              <p className={`text-sm ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                {emailConfirmationSent
                  ? 'We sent a confirmation link. Click it, then sign in.'
                  : 'Redirecting you back...'}
              </p>
              {emailConfirmationSent && (
                <button
                  type="button"
                  onClick={() => {
                    setSuccess(false);
                    setEmailConfirmationSent(false);
                    switchMode('login');
                  }}
                  className="mt-6 text-sm font-medium text-gold hover:underline"
                >
                  Go to Sign In
                </button>
              )}
            </div>
          ) : (
            <>
              {/* ── Demo Access ── */}
              <div className={`mb-5 p-4 rounded-2xl border ${isDark ? 'bg-gold/5 border-gold/20' : 'bg-amber-50 border-amber-200'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gold' : 'text-amber-700'}`}>
                    Try the Dashboard — No account needed
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      loginAsDemo('family');
                      purchaseSubscription('2m');
                      purchaseListingSubscription('list-2m');
                      onClose();
                      navigate('/dashboard');
                    }}
                    className={`py-2.5 rounded-xl text-xs font-semibold border transition-all btn-press ${
                      isDark
                        ? 'bg-void-lighter border-void-border text-ink hover:border-gold/40 hover:text-gold'
                        : 'bg-white border-amber-200 text-amber-800 hover:border-amber-400'
                    }`}
                  >
                    👨‍👩‍👧 Family Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      loginAsDemo('caregiver');
                      purchaseSubscription('2m');
                      purchaseListingSubscription('list-2m');
                      onClose();
                      navigate('/dashboard');
                    }}
                    className={`py-2.5 rounded-xl text-xs font-semibold border transition-all btn-press ${
                      isDark
                        ? 'bg-void-lighter border-void-border text-ink hover:border-gold/40 hover:text-gold'
                        : 'bg-white border-amber-200 text-amber-800 hover:border-amber-400'
                    }`}
                  >
                    🧑‍🤝‍🧑 Caregiver Dashboard
                  </button>
                </div>
              </div>

              <div className={`flex items-center gap-3 mb-5`}>
                <div className={`flex-1 h-px ${isDark ? 'bg-void-border' : 'bg-light-border'}`} />
                <span className={`text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>or sign in with your account</span>
                <div className={`flex-1 h-px ${isDark ? 'bg-void-border' : 'bg-light-border'}`} />
              </div>

              <div className={`flex rounded-full p-1 mb-6 border ${
                isDark ? 'bg-void border-void-border' : 'bg-light-bg border-light-border'
              }`}>
                <button
                  onClick={() => switchMode('login')}
                  className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                    mode === 'login'
                      ? 'bg-gradient-to-r from-maroon to-gold text-white shadow-lg'
                      : isDark
                        ? 'text-ink-muted hover:text-ink'
                        : 'text-light-text-muted hover:text-light-text'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => switchMode('register')}
                  className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                    mode === 'register'
                      ? 'bg-gradient-to-r from-maroon to-gold text-white shadow-lg'
                      : isDark
                        ? 'text-ink-muted hover:text-ink'
                        : 'text-light-text-muted hover:text-light-text'
                  }`}
                >
                  Register
                </button>
              </div>

              {error && (
                <div className={`mb-4 px-4 py-3 border rounded-xl text-sm ${
                  isDark
                    ? 'bg-maroon/10 border-maroon/30 text-maroon-light'
                    : 'bg-red-50 border-red-200 text-red-600'
                }`}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <>
                    <div>
                      <label className={labelClass}>Full Name</label>
                      <div className="relative">
                        <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                          isDark ? 'text-ink-muted' : 'text-light-text-muted'
                        }`} />
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Jane Smith"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Phone Number</label>
                      <div className="relative">
                        <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                          isDark ? 'text-ink-muted' : 'text-light-text-muted'
                        }`} />
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+1 (555) 123-4567"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>I am a...</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, role: 'family' })}
                          className={`px-4 py-3 rounded-xl text-sm font-medium border transition-all ${
                            form.role === 'family'
                              ? 'bg-emerald/10 border-emerald text-emerald'
                              : isDark
                                ? 'bg-void border-void-border text-ink-light hover:border-ink-muted'
                                : 'bg-light-bg border-light-border text-light-text-2 hover:border-light-text-muted'
                          }`}
                        >
                          Family / Employer
                        </button>
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, role: 'caregiver' })}
                          className={`px-4 py-3 rounded-xl text-sm font-medium border transition-all ${
                            form.role === 'caregiver'
                              ? 'bg-gold/10 border-gold text-gold'
                              : isDark
                                ? 'bg-void border-void-border text-ink-light hover:border-ink-muted'
                                : 'bg-light-bg border-light-border text-light-text-2 hover:border-light-text-muted'
                          }`}
                        >
                          Caregiver / Job Seeker
                        </button>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className={labelClass}>Email</label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                      isDark ? 'text-ink-muted' : 'text-light-text-muted'
                    }`} />
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Password</label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                      isDark ? 'text-ink-muted' : 'text-light-text-muted'
                    }`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder={mode === 'register' ? 'Min. 6 characters' : 'Your password'}
                      className={`${inputClass} pr-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                        isDark ? 'text-ink-muted hover:text-ink' : 'text-light-text-muted hover:text-light-text'
                      }`}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-maroon to-gold text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity btn-press disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-maroon/20"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              <p className={`text-center text-xs mt-6 ${
                isDark ? 'text-ink-muted' : 'text-light-text-muted'
              }`}>
                {mode === 'login' ? (
                  <>
                    Don&apos;t have an account?{' '}
                    <button onClick={() => switchMode('register')} className="text-gold font-medium hover:underline">
                      Register
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button onClick={() => switchMode('login')} className="text-gold font-medium hover:underline">
                      Sign in
                    </button>
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
