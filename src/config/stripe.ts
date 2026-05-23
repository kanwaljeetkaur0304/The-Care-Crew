import { loadStripe, type Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  
  if (!publishableKey) {
    console.error('Missing VITE_STRIPE_PUBLIC_KEY environment variable');
    return Promise.resolve(null);
  }

  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey);
  }

  return stripePromise;
};
