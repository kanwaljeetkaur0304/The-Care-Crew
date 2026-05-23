import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useTheme } from '../context/ThemeContext';

interface StripePaymentFormProps {
  amount: number;
  planLabel: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  isLoading: boolean;
}

export default function StripePaymentForm({
  amount,
  planLabel,
  onSuccess,
  onError,
  isLoading,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { isDark } = useTheme();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || processing) {
      return;
    }

    setProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (error) {
        onError(error.message || 'Payment failed');
      } else {
        onSuccess();
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className={`p-4 rounded-xl border mb-4 ${isDark ? 'bg-void border-void-border' : 'bg-light-bg border-light-border'}`}>
        <div className={`text-sm ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>Total to pay</div>
        <div className="font-display text-3xl font-bold text-gold">${amount}</div>
        <div className={`text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
          {planLabel}
        </div>
      </div>

      <div className={`p-4 rounded-xl border ${isDark ? 'bg-void border-void-border' : 'bg-light-bg border-light-border'}`}>
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      <button
        type="submit"
        disabled={processing || isLoading || !stripe || !elements}
        className={`w-full py-3 bg-gradient-to-r from-maroon to-gold text-white text-sm font-medium rounded-xl transition-all btn-press disabled:opacity-50 disabled:cursor-not-allowed ${
          processing || isLoading ? 'opacity-75' : ''
        }`}
      >
        {processing || isLoading ? 'Processing...' : `Pay $${amount}`}
      </button>

      <div className={`text-xs text-center ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
        💳 Secure payment powered by Stripe
      </div>
    </form>
  );
}
