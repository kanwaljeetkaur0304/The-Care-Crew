import { useState } from 'react';
import {
  X, Mail, Lock, Eye, EyeOff, Loader2, CheckCircle2, User, Phone,
  MapPin, ShieldCheck,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

/** Normalise any phone number to E.164 (+1XXXXXXXXXX for North America) */
function toE164(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits[0] === '1') return `+${digits}`;
  return `+${digits}`;
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailConfirmationSent, setEmailConfirmationSent] = useState(false);
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

  // ── Phone OTP state ────────────────────────────────────────────────────────
  type PhoneStep = 'idle' | 'sending' | 'sent' | 'verifying' | 'verified';
  const [phoneStep, setPhoneStep] = useState<PhoneStep>('idle');
  const [otpCode, setOtpCode]     = useState('');
  const [otpError, setOtpError]   = useState('');

  const phoneDigits = form.phone.replace(/\D/g, '');
  const phoneReady  = phoneDigits.length >= 10;

  if (!isOpen) return null;

  // ── Helpers ────────────────────────────────────────────────────────────────
  const resetPhone = () => {
    setPhoneStep('idle');
    setOtpCode('');
    setOtpError('');
  };

  const switchMode = (m: 'login' | 'register') => {
    setMode(m);
    setError('');
    setSuccess(false);
    setEmailConfirmationSent(false);
    resetPhone();
    setForm({ name: '', email: '', password: '', phone: '', location: '', role: 'family' });
  };

  const handleSendCode = async () => {
    setPhoneStep('sending');
    setOtpError('');
    try {
      const { error: otpErr } = await supabase.auth.signInWithOtp({
        phone: toE164(form.phone),
      });
      if (otpErr) {
        const msg = otpErr.message.toLowerCase();
        setOtpError(
          msg.includes('not enabled') || msg.includes('twilio') || msg.includes('phone provider')
            ? 'SMS service is not yet configured. Your phone will be saved but unverified.'
            : otpErr.message,
        );
        setPhoneStep('idle');
      } else {
        setPhoneStep('sent');
      }
    } catch {
      setOtpError('Could not send code. Please try again.');
      setPhoneStep('idle');
    }
  };

  const handleVerifyOtp = async () => {
    setPhoneStep('verifying');
    setOtpError('');
    try {
      const { error: verifyErr } = await supabase.auth.verifyOtp({
        phone: toE164(form.phone),
        token: otpCode,
        type: 'sms',
      });
      if (verifyErr) {
        setOtpError('Incorrect code. Please try again.');
        setPhoneStep('sent');
      } else {
        setPhoneStep('verified');
      }
    } catch {
      setOtpError('Verification failed. Please try again.');
      setPhoneStep('sent');
    }
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

                    {/* Phone Number + Send Code */}
                    <div>
                      <label className={labelClass}>Phone Number</label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                          <input
                            type="tel"
                            value={form.phone}
                            onChange={(e) => { setForm({ ...form, phone: e.target.value }); resetPhone(); }}
                            placeholder="+1 (555) 123-4567"
                            disabled={phoneStep === 'verified'}
                            className={`${inputClass} ${phoneStep === 'verified' ? 'pr-10' : ''}`}
                          />
                          {phoneStep === 'verified' && (
                            <ShieldCheck className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                          )}
                        </div>

                        {/* Send Code button */}
                        {phoneReady && phoneStep === 'idle' && (
                          <button
                            type="button"
                            onClick={handleSendCode}
                            className="shrink-0 px-3 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-maroon to-gold text-white hover:opacity-90 transition-opacity"
                          >
                            Send Code
                          </button>
                        )}
                        {phoneStep === 'sending' && (
                          <span className={`shrink-0 flex items-center gap-1 px-3 text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending…
                          </span>
                        )}
                        {phoneStep === 'verified' && (
                          <span className="shrink-0 flex items-center gap-1 px-3 text-xs font-semibold text-emerald-600">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                          </span>
                        )}
                      </div>

                      {/* OTP input */}
                      {(phoneStep === 'sent' || phoneStep === 'verifying') && (
                        <div className="mt-2 flex gap-2">
                          <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                            placeholder="6-digit code"
                            className={`flex-1 px-3 py-2 text-sm border rounded-xl ${isDark ? 'bg-void border-void-border text-ink placeholder:text-ink-muted' : 'bg-light-bg border-light-border text-light-text placeholder:text-light-text-muted'}`}
                          />
                          <button
                            type="button"
                            onClick={handleVerifyOtp}
                            disabled={otpCode.length < 6 || phoneStep === 'verifying'}
                            className="shrink-0 px-3 py-2 text-xs font-semibold rounded-xl border border-emerald/40 text-emerald-600 bg-emerald/5 hover:bg-emerald/10 disabled:opacity-50 transition-colors"
                          >
                            {phoneStep === 'verifying' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Verify'}
                          </button>
                        </div>
                      )}

                      {/* OTP error / info */}
                      {otpError && (
                        <p className={`text-xs mt-1.5 ${otpError.includes('not yet') ? (isDark ? 'text-ink-muted' : 'text-light-text-muted') : 'text-red-500'}`}>
                          {otpError}
                        </p>
                      )}
                      {phoneStep === 'sent' && !otpError && (
                        <p className={`text-xs mt-1.5 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                          Code sent to {form.phone}. Check your SMS.
                        </p>
                      )}
                    </div>

                    {/* Location */}
                    <div>
                      <label className={labelClass}>Location</label>
                      <div className="relative">
                        <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                        <input
                          type="text"
                          value={form.location}
                          onChange={(e) => setForm({ ...form, location: e.target.value })}
                          placeholder="e.g. Brampton, ON"
                          className={inputClass}
                        />
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
