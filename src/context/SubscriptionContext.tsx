import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';

export const LISTING_PLANS = [
  {
    id: 'list-1m',
    label: '1 Month',
    price: 15,
    durationDays: 30,
    popular: false,
    tier: 'Basic',
    features: [
      { name: '1 Active Freelance Listing', included: true },
      { name: 'Visible to Families & Caregivers', included: true },
      { name: 'Appear in Search Results', included: true },
      { name: 'Featured Badge', included: false },
      { name: 'Priority Placement', included: false },
      { name: 'Listing Analytics', included: false },
    ],
  },
  {
    id: 'list-2m',
    label: '2 Months',
    price: 25,
    durationDays: 60,
    popular: true,
    tier: 'Standard',
    features: [
      { name: '1 Active Freelance Listing', included: true },
      { name: 'Visible to Families & Caregivers', included: true },
      { name: 'Appear in Search Results', included: true },
      { name: 'Featured Badge', included: true },
      { name: 'Priority Placement', included: false },
      { name: 'Listing Analytics', included: true },
    ],
  },
  {
    id: 'list-3m',
    label: '3 Months',
    price: 45,
    durationDays: 90,
    popular: false,
    tier: 'Premium',
    features: [
      { name: '1 Active Freelance Listing', included: true },
      { name: 'Visible to Families & Caregivers', included: true },
      { name: 'Appear in Search Results', included: true },
      { name: 'Featured Badge', included: true },
      { name: 'Priority Placement', included: true },
      { name: 'Listing Analytics', included: true },
    ],
  },
];

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
  // Contact unlock
  hasActiveSubscription: boolean;
  subscription: SubscriptionData | null;
  purchaseSubscription: (planId: string, paymentIntentId?: string) => void;
  expiryDate: string | null;
  // Freelance listing
  hasActiveListingSubscription: boolean;
  listingSubscription: SubscriptionData | null;
  purchaseListingSubscription: (planId: string, paymentIntentId?: string) => void;
  listingExpiryDate: string | null;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const STORAGE_KEY = 'carecrew_subscription';
const LISTING_STORAGE_KEY = 'carecrew_listing_subscription';

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

function loadListingSubscription(): SubscriptionData | null {
  try {
    const raw = localStorage.getItem(LISTING_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SubscriptionData;
    const now = new Date().toISOString();
    if (parsed.expiresAt < now) {
      localStorage.removeItem(LISTING_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function saveListingSubscription(data: SubscriptionData) {
  try {
    localStorage.setItem(LISTING_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(loadSubscription);
  const [listingSubscription, setListingSubscription] = useState<SubscriptionData | null>(loadListingSubscription);

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

  const hasActiveListingSubscription = useMemo(() => {
    if (!listingSubscription) return false;
    return new Date(listingSubscription.expiresAt) > new Date();
  }, [listingSubscription]);

  const listingExpiryDate = useMemo(() => {
    if (!listingSubscription) return null;
    return new Date(listingSubscription.expiresAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [listingSubscription]);

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

  const purchaseListingSubscription = useCallback((planId: string, paymentIntentId?: string) => {
    const plan = LISTING_PLANS.find((p) => p.id === planId);
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

    saveListingSubscription(data);
    setListingSubscription(data);
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{
        hasActiveSubscription, subscription, purchaseSubscription, expiryDate,
        hasActiveListingSubscription, listingSubscription, purchaseListingSubscription, listingExpiryDate,
      }}
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
