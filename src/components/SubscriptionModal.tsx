import { useState } from 'react';
import { X, CreditCard, Calendar, Star, CheckCircle, Lock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSubscription, CONTACT_PLANS } from '../context/SubscriptionContext';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const { isDark } = useTheme();
  const { purchaseSubscription } = useSubscription();
  const [step, setStep] = useState<'plans' | 'payment' | 'success'>('plans');
  const [selectedPlan, setSelectedPlan] = useState('2m');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');

  if (!isOpen) return null;

  const plan = CONTACT_PLANS.find((p) => p.id === selectedPlan)!;

  const handlePay = () => {
    if (cardNumber.length < 16 || cardExpiry.length < 5 || cardCvc.length < 3 || !cardName.trim()) return;
    purchaseSubscription(selectedPlan);
    setStep('success');
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep('plans');
      setCardNumber('');
      setCardExpiry('');
      setCardCvc('');
      setCardName('');
    }, 300);
  };

  const inputClass = `w-full pl-10 pr-4 py-3 border rounded-xl text-sm placeholder:text-opacity-60 ${
    isDark ? 'bg-void border-void-border text-ink placeholder:text-ink-muted' : 'bg-light-bg border-light-border text-light-text placeholder:text-light-text-muted'
  }`;

  const labelClass = `block text-sm font-medium mb-1.5 ${isDark ? 'text-ink' : 'text-light-text'}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className={`relative w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto ${
        isDark ? 'bg-void border-void-border' : 'bg-white border-light-border'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-void-border' : 'border-light-border'}`}>
          <div className="flex items-center gap-2">
            <Lock className={`w-5 h-5 ${isDark ? 'text-gold' : 'text-maroon'}`} />
            <h3 className={`font-display text-lg font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
              {step === 'plans' && 'Unlock Contact Details'}
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
              <p className={`text-sm mb-2 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                Choose a plan to unlock phone numbers and email addresses for all job listings.
              </p>
              {CONTACT_PLANS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPlan(p.id)}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all text-left ${
                    selectedPlan === p.id
                      ? 'bg-gold/10 border-gold shadow-lg shadow-gold/10'
                      : isDark
                        ? 'bg-void border-void-border hover:border-gold/30'
                        : 'bg-light-bg border-light-border hover:border-gold/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      selectedPlan === p.id
                        ? 'bg-gradient-to-br from-maroon to-gold'
                        : isDark
                          ? 'bg-void-lighter'
                          : 'bg-light-surface-2'
                    }`}>
                      <Calendar className={`w-6 h-6 ${selectedPlan === p.id ? 'text-white' : 'text-gold'}`} />
                    </div>
                    <div>
                      <div className={`font-display text-lg font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>{p.label}</div>
                      <div className={`text-sm ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>{p.durationDays} days access</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-display text-2xl font-bold ${
                      selectedPlan === p.id
                        ? 'text-gold'
                        : isDark
                          ? 'text-ink'
                          : 'text-light-text'
                    }`}>
                      ${p.price}
                    </div>
                    {p.popular && (
                      <div className="flex items-center gap-1 text-xs text-gold mt-1">
                        <Star className="w-3 h-3 fill-gold" /> Popular
                      </div>
                    )}
                  </div>
                </button>
              ))}

              <button
                onClick={() => setStep('payment')}
                className="w-full py-3.5 bg-gradient-to-r from-maroon to-gold text-white font-medium rounded-xl transition-all btn-press mt-2"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-5">
              <div className={`p-4 rounded-xl border mb-4 ${isDark ? 'bg-void border-void-border' : 'bg-light-bg border-light-border'}`}>
                <div className={`text-sm ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>Total to pay</div>
                <div className="font-display text-3xl font-bold text-gold">${plan.price}</div>
                <div className={`text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>{plan.label} plan — {plan.durationDays} days access</div>
              </div>

              <div>
                <label className={labelClass}>Card Number</label>
                <div className="relative">
                  <CreditCard className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                    placeholder="1234 5678 9012 3456"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Expiry</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                      if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2);
                      setCardExpiry(v);
                    }}
                    placeholder="MM/YY"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>CVC</label>
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="123"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Name on Card</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="John Smith"
                  className={inputClass}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('plans')}
                  className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-colors ${
                    isDark
                      ? 'bg-void-lighter border-void-border text-ink-light hover:border-gold/40'
                      : 'bg-white border-light-border text-light-text-2 hover:border-maroon/30'
                  }`}
                >
                  Back
                </button>
                <button
                  onClick={handlePay}
                  className="flex-1 py-3 bg-gradient-to-r from-maroon to-gold text-white text-sm font-medium rounded-xl transition-all btn-press"
                >
                  Pay ${plan.price}
                </button>
              </div>
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
              <p className={`text-sm mb-6 ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>
                You now have access to contact details for all job listings until your plan expires.
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
