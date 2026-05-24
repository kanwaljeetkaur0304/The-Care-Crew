import { useState } from 'react';
import { X, Star, CheckCircle, Lock, Check, LogIn, UserPlus, ArrowLeft } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import { useTheme } from '../context/ThemeContext';
import { useSubscription, CONTACT_PLANS } from '../context/SubscriptionContext';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { getStripe } from '../config/stripe';
import { supabase } from '../lib/supabase';
import StripePaymentForm from './StripePaymentForm';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const { isDark } = useTheme();
  const { purchaseSubscription } = useSubscription();
  const { user } = useAuth();
  const { openAuthModal } = useUI();
  // 'auth' step is shown when user clicks Continue without being logged in
  const [step, setStep] = useState<'plans' | 'auth' | 'payment' | 'success'>('plans');
  const [selectedPlan, setSelectedPlan] = useState('2m');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  if (!isOpen) return null;

  const plan = CONTACT_PLANS.find((p) => p.id === selectedPlan)!;
  const stripePromise = getStripe();

  const handleContinueToPayment = async () => {
    // Not logged in → show auth step inline inside this modal
    if (!user) {
      setStep('auth');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      if (!accessToken) {
        setStep('auth');
        setIsLoading(false);
        return;
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      let res: Response;
      try {
        res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-intent`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ planId: selectedPlan }),
            signal: controller.signal,
          }
        );
      } catch (fetchErr) {
        const msg = fetchErr instanceof Error && fetchErr.name === 'AbortError'
          ? 'Request timed out. Please check your Supabase Edge Function and STRIPE_SECRET_KEY secret.'
          : `Network error: ${fetchErr instanceof Error ? fetchErr.message : 'Unknown error'}`;
        setError(msg);
        return;
      } finally {
        clearTimeout(timeout);
      }

      let data: Record<string, string>;
      try {
        data = await res.json();
      } catch {
        setError(`Server returned an unexpected response (status ${res.status}). Check Edge Function logs.`);
        return;
      }

      if (!res.ok) {
        setError(data.error || `Payment setup failed (status ${res.status}). Check Supabase secrets.`);
        return;
      }

      setClientSecret(data.clientSecret);
      setStep('payment');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    purchaseSubscription(selectedPlan);
    setStep('success');
    setError('');
  };

  const handlePaymentError = (errorMsg: string) => {
    setError(errorMsg);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep('plans');
      setError('');
      setIsLoading(false);
      setClientSecret(null);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className={`relative z-10 w-full max-w-4xl rounded-3xl border shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto ${
        isDark ? 'bg-void border-void-border' : 'bg-white border-light-border'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-void-border' : 'border-light-border'}`}>
          <div className="flex items-center gap-2">
            <Lock className={`w-5 h-5 ${isDark ? 'text-gold' : 'text-maroon'}`} />
            <h3 className={`font-display text-lg font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
              {step === 'plans' && 'Unlock Contact Details'}
              {step === 'auth' && 'Sign In to Continue'}
              {step === 'payment' && 'Payment'}
              {step === 'success' && 'Subscription Active'}
            </h3>
          </div>
          <button onClick={handleClose} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-void-lighter' : 'hover:bg-light-surface-2'}`}>
            <X className={`w-5 h-5 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
          </button>
        </div>

        <div className="p-6">
          {step === 'plans' && (
            <div className="space-y-4">
              <p className={`text-sm mb-6 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                Choose a plan to unlock phone numbers and email addresses for all job listings.
              </p>

              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 mb-2">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
              
              {/* Three-Column Plan Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {CONTACT_PLANS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlan(p.id)}
                    className={`relative flex flex-col p-6 rounded-2xl border transition-all text-left h-full ${
                      selectedPlan === p.id
                        ? 'bg-gold/10 border-gold shadow-lg shadow-gold/10 ring-2 ring-gold/20'
                        : isDark
                          ? 'bg-void border-void-border hover:border-gold/30'
                          : 'bg-light-bg border-light-border hover:border-gold/20'
                    }`}
                  >
                    {/* Popular Badge */}
                    {p.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-maroon to-gold text-white text-xs font-semibold rounded-full">
                          <Star className="w-3 h-3 fill-white" /> Popular
                        </div>
                      </div>
                    )}

                    {/* Plan Header */}
                    <div className="mb-4">
                      <div className={`font-display text-lg font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
                        {p.tier}
                      </div>
                      <div className={`text-sm ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                        {p.label}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="font-display text-3xl font-bold text-gold">
                        ${p.price}
                      </div>
                      <div className={`text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                        {p.durationDays} days access
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 flex-1">
                      {p.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          {feature.included ? (
                            <div className="flex-shrink-0 pt-0.5">
                              <Check className="w-4 h-4 text-emerald" />
                            </div>
                          ) : (
                            <div className={`flex-shrink-0 pt-0.5 w-4 h-4 rounded-full ${isDark ? 'bg-void-lighter' : 'bg-light-surface-2'}`} />
                          )}
                          <span className={`text-sm ${
                            feature.included
                              ? isDark ? 'text-ink' : 'text-light-text'
                              : isDark ? 'text-ink-muted line-through' : 'text-light-text-muted line-through'
                          }`}>
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Selection Indicator */}
                    <div className={`mt-6 py-3 px-4 rounded-lg text-center text-sm font-medium transition-colors ${
                      selectedPlan === p.id
                        ? 'bg-gradient-to-r from-maroon to-gold text-white'
                        : isDark
                          ? 'bg-void-lighter text-ink-light'
                          : 'bg-light-surface-2 text-light-text-2'
                    }`}>
                      {selectedPlan === p.id ? 'Selected' : 'Select Plan'}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleContinueToPayment}
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-maroon to-gold text-white font-medium rounded-xl transition-all btn-press mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Loading...' : 'Continue to Payment'}
              </button>
            </div>
          )}

          {step === 'auth' && (
            <div className="space-y-6 py-2">
              <div className="text-center">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-void-lighter' : 'bg-light-surface-2'}`}>
                  <Lock className={`w-7 h-7 ${isDark ? 'text-gold' : 'text-maroon'}`} />
                </div>
                <p className={`text-sm ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                  You're one step away from unlocking contact details. Sign in or create a free account to complete your purchase.
                </p>
              </div>

              <div className="space-y-3">
                {/* Sign In button */}
                <button
                  onClick={() => {
                    handleClose();
                    openAuthModal();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-maroon to-gold text-white font-medium rounded-xl transition-all btn-press"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In to Continue
                </button>

                {/* Register button */}
                <button
                  onClick={() => {
                    handleClose();
                    openAuthModal();
                  }}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border font-medium transition-all btn-press ${
                    isDark
                      ? 'bg-void border-gold/40 text-gold hover:bg-gold/10'
                      : 'bg-white border-maroon/30 text-maroon hover:bg-maroon/5'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  Create a Free Account
                </button>
              </div>

              {/* Back to Plans */}
              <button
                onClick={() => setStep('plans')}
                className={`w-full flex items-center justify-center gap-1.5 text-sm font-medium transition-colors ${
                  isDark ? 'text-ink-muted hover:text-ink-light' : 'text-light-text-muted hover:text-light-text-2'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Plans
              </button>
            </div>
          )}

          {step === 'payment' && clientSecret && (
            <div className="space-y-5">
              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
              
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripePaymentForm
                  amount={plan.price}
                  planLabel={`${plan.tier} - ${plan.label}`}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  isLoading={isLoading}
                />
              </Elements>

              <button
                onClick={() => setStep('plans')}
                className={`w-full py-3 rounded-xl border text-sm font-medium transition-colors ${
                  isDark
                    ? 'bg-void-lighter border-void-border text-ink-light hover:border-gold/40'
                    : 'bg-white border-light-border text-light-text-2 hover:border-maroon/30'
                }`}
              >
                Back to Plans
              </button>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald to-teal flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className={`font-display text-xl font-semibold mb-2 ${isDark ? 'text-ink' : 'text-light-text'}`}>
                Subscription Activated!
              </h3>
              <p className={`text-sm mb-2 ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>
                You now have access to contact details for all job listings.
              </p>
              <p className={`text-xs mb-6 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                Valid until {new Date(new Date().getTime() + plan.durationDays * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <button
                onClick={handleClose}
                className="px-6 py-3 bg-gradient-to-r from-maroon to-gold text-white text-sm font-medium rounded-full transition-all btn-press"
              >
                Start Browsing
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
