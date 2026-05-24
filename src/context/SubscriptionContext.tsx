import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';

export const CONTACT_PLANS = [
  {
    id: '1m',
    label: '1 Month',
    price: 19,
    durationDays: 30,
    popular: false,
    tier: 'Basic',
    features: [
      { name: 'Access to 5 Job Listings', included: true },
      { name: 'Phone Numbers Unlocked', included: true },
      { name: 'Email Addresses Unlocked', included: true },
      { name: 'Contact Details Export', included: false },
      { name: 'Advanced Filters', included: false },
      { name: 'Priority Support', included: false },
      { name: 'Saved Searches', included: false },
      { name: 'Candidate Profiles View', included: false },
    ],
  },
  {
    id: '2m',
    label: '2 Months',
    price: 39,
    durationDays: 60,
    popular: true,
    tier: 'Standard',
    features: [
      { name: 'Access to 15 Job Listings', included: true },
      { name: 'Phone Numbers Unlocked', included: true },
      { name: 'Email Addresses Unlocked', included: true },
      { name: 'Contact Details Export', included: true },
      { name: 'Advanced Filters', included: true },
      { name: 'Priority Support', included: false },
      { name: 'Saved Searches', included: true },
      { name: 'Candidate Profiles View', included: false },
    ],
  },
  {
    id: '3m',
    label: '3 Months',
    price: 69,
    durationDays: 90,
    popular: false,
    tier: 'Premium',
    features: [
      { name: 'Access to 50 Job Listings', included: true },
      { name: 'Phone Numbers Unlocked', included: true },
      { name: 'Email Addresses Unlocked', included: true },
      { name: 'Contact Details Export', included: true },
      { name: 'Advanced Filters', included: true },
      { name: 'Priority Support', included: true },
      { name: 'Saved Searches (Unlimited)', included: true },
      { name: 'Candidate Profiles View', included: true },
    ],
  },
];

interface SubscriptionData {
  planId: string;
  purchasedAt: string;
  expiresAt: string;
  stripePaymentIntentId?: string;
}

interface SubscriptionContextType {
  hasActiveSubscription: boolean;
  subscription: SubscriptionData | null;
  purchaseSubscription: (planId: string, paymentIntentId?: string) => void;
  expiryDate: string | null;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const STORAGE_KEY = 'carecrew_subscription';

function loadSubscription(): SubscriptionData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SubscriptionData;
    const now = new Date().toISOString();
    if (parsed.expiresAt < now) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function saveSubscription(data: SubscriptionData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(loadSubscription);

  const hasActiveSubscription = useMemo(() => {
    if (!subscription) return false;
    return new Date(subscription.expiresAt) > new Date();
  }, [subscription]);

  const expiryDate = useMemo(() => {
    if (!subscription) return null;
    return new Date(subscription.expiresAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [subscription]);

  const purchaseSubscription = useCallback((planId: string, paymentIntentId?: string) => {
    const plan = CONTACT_PLANS.find((p) => p.id === planId);
    if (!plan) return;

    const now = new Date();
    const expires = new Date(now);
    expires.setDate(expires.getDate() + plan.durationDays);

    const data: SubscriptionData = {
      planId: plan.id,
      purchasedAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      stripePaymentIntentId: paymentIntentId,
    };

    saveSubscription(data);
    setSubscription(data);
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{ hasActiveSubscription, subscription, purchaseSubscription, expiryDate }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider');
  return ctx;
}
