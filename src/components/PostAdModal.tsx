import { useState, useRef, useEffect } from 'react';
import {
  X, Building2, User, MapPin, DollarSign, FileText,
  CheckCircle2, ChevronRight, ChevronLeft,
  ShieldCheck, Star, Briefcase, Plus, Trash2,
  Clock
} from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '../config/stripe';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import StripePaymentForm from './StripePaymentForm';
import { categoryLabels } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import LoginRequiredPrompt from './LoginRequiredPrompt';

const ALL_CITIES = [
  'Toronto, ON', 'Vancouver, BC', 'Montreal, QC', 'Calgary, AB', 'Edmonton, AB',
  'Ottawa, ON', 'Winnipeg, MB', 'Quebec City, QC', 'Hamilton, ON', 'Kitchener, ON',
  'London, ON', 'Halifax, NS', 'New York, NY', 'Los Angeles, CA', 'Chicago, IL',
  'Houston, TX', 'San Francisco, CA', 'Seattle, WA', 'Miami, FL', 'Boston, MA',
  'Dallas, TX', 'Atlanta, GA', 'Denver, CO', 'Phoenix, AZ', 'Austin, TX',
  'San Diego, CA', 'Philadelphia, PA', 'San Jose, CA', 'Jacksonville, FL',
  'Columbus, OH', 'Charlotte, NC', 'Indianapolis, IN', 'Fort Worth, TX',
  'Detroit, MI', 'El Paso, TX', 'Memphis, TN', 'Louisville, KY',
  'Milwaukee, WI', 'Baltimore, MD', 'Albuquerque, NM', 'Tucson, AZ',
  'Fresno, CA', 'Sacramento, CA', 'Kansas City, MO', 'Mesa, AZ', 'Omaha, NE',
  'Colorado Springs, CO', 'Raleigh, NC', 'Virginia Beach, VA', 'Oakland, CA',
  'Minneapolis, MN', 'Tulsa, OK', 'Arlington, TX', 'Wichita, KS', 'Bakersfield, CA',
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const EXPERIENCE_YEARS = ['Less than 1 year', '1 year', '2 years', '3 years', '4 years', '5 years', '6 years', '7 years', '8 years', '9 years', '10+ years'];

// Map PostAdModal short day names → full names used in CaregiverListing weeklySchedule
const DAY_FULL: Record<string, string> = {
  Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday',
  Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday',
};

// Days a plan keeps a post/listing active
const PLAN_DAYS: Record<string, number> = { '1m': 30, '2m': 60, '3m': 90 };

// Convert a start–end time pair into Morning / Afternoon / Evening / Overnight slots
function timeToSlots(start: string, end: string): string[] {
  const startH = parseInt(start.split(':')[0], 10);
  const endH   = parseInt(end.split(':')[0],   10);
  const slots: string[] = [];
  if (startH < 12)              slots.push('Morning');
  if (endH   > 12)              slots.push('Afternoon');
  if (endH   > 17)              slots.push('Evening');
  if (endH   >= 21 || endH < 6) slots.push('Overnight');
  return slots.length ? slots : ['Morning'];
}

const HIRING_PLANS = [
  { id: '1m', label: '1 Month', price: 19, duration: '30 days', popular: false },
  { id: '2m', label: '2 Months', price: 39, duration: '60 days', popular: true },
  { id: '3m', label: '3 Months', price: 69, duration: '90 days', popular: false },
];

const SEEKER_PLANS = [
  { id: '1m', label: '1 Month', price: 19, duration: '30 days', popular: false },
  { id: '2m', label: '2 Months', price: 39, duration: '60 days', popular: true },
  { id: '3m', label: '3 Months', price: 69, duration: '90 days', popular: false },
];

interface Reference {
  id: string;
  name: string;
  phone: string;
}

interface PostAdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PostAdModal({ isOpen, onClose }: PostAdModalProps) {
  const [adType, setAdType] = useState<'family' | 'seeker' | null>(null);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { openAuthModal } = useUI();

  // ===== HIRING FORM STATE =====
  const [hTitle, setHTitle] = useState('');
  const [hCategory, setHCategory] = useState('');
  const [hLocationQuery, setHLocationQuery] = useState('');
  const [hLocationFocused, setHLocationFocused] = useState(false);
  const [hSelectedLocation, setHSelectedLocation] = useState('');
  const [hSalaryMin, setHSalaryMin] = useState('');
  const [hSalaryMax, setHSalaryMax] = useState('');
  const [hLanguages, setHLanguages] = useState<string[]>([]); // #5 languages caregiver should speak
  const [hNeedDriver, setHNeedDriver] = useState('');      // #6 driver preference
  const [hScheduleDays, setHScheduleDays] = useState<Record<string, { active: boolean; start: string; end: string }>>({
    Mon: { active: false, start: '09:00', end: '17:00' },
    Tue: { active: false, start: '09:00', end: '17:00' },
    Wed: { active: false, start: '09:00', end: '17:00' },
    Thu: { active: false, start: '09:00', end: '17:00' },
    Fri: { active: false, start: '09:00', end: '17:00' },
    Sat: { active: false, start: '09:00', end: '17:00' },
    Sun: { active: false, start: '09:00', end: '17:00' },
  });
  const [hDescription, setHDescription] = useState('');
  const [hSelectedPlan, setHSelectedPlan] = useState('');
  const [hPaymentError, setHPaymentError] = useState('');
  const [hClientSecret, setHClientSecret] = useState<string | null>(null);
  const [hPaymentLoading, setHPaymentLoading] = useState(false);

  // ===== SEEKER FORM STATE =====
  const [sCategory, setSCategory] = useState('');
  const [sCuisines, setSCuisines] = useState<string[]>([]);  // #9 cook cuisines
  const [sBio, setSBio] = useState('');
  const [sExperience, setSExperience] = useState('');
  const [sReferences, setSReferences] = useState<Reference[]>([{ id: '1', name: '', phone: '' }]);
  const [sLocationQuery, setSLocationQuery] = useState('');
  const [sLocationFocused, setSLocationFocused] = useState(false);
  const [sSelectedLocation, setSSelectedLocation] = useState('');
  const [sSalaryMin, setSSalaryMin] = useState('');          // #7 pay range
  const [sSalaryMax, setSSalaryMax] = useState('');
  const [sLanguages, setSLanguages] = useState<string[]>([]); // #5 languages spoken
  const [sNativeLanguage, setSNativeLanguage] = useState(''); // #5 native language
  const [sCanDrive, setSCanDrive] = useState('');              // #6 can drive
  const [sSocialLink, setSSocialLink] = useState('');          // #2 social media link
  const [sScheduleDays, setSScheduleDays] = useState<Record<string, { active: boolean; start: string; end: string }>>({
    Mon: { active: false, start: '09:00', end: '17:00' },
    Tue: { active: false, start: '09:00', end: '17:00' },
    Wed: { active: false, start: '09:00', end: '17:00' },
    Thu: { active: false, start: '09:00', end: '17:00' },
    Fri: { active: false, start: '09:00', end: '17:00' },
    Sat: { active: false, start: '09:00', end: '17:00' },
    Sun: { active: false, start: '09:00', end: '17:00' },
  });
  const [sTerm, setSTerm] = useState('');
  const [sSelectedPlan, setSSelectedPlan] = useState('');
  const [sPaymentError, setSPaymentError] = useState('');
  const [sClientSecret, setSClientSecret] = useState<string | null>(null);
  const [sPaymentLoading, setSPaymentLoading] = useState(false);

  const hLocationRef = useRef<HTMLDivElement>(null);
  const sLocationRef = useRef<HTMLDivElement>(null);

  const hiringSteps = 7;
  const seekerSteps = 9;
  const totalSteps = adType === 'family' ? hiringSteps : seekerSteps;

  useEffect(() => {
    if (isOpen) {
      setAdType(null);
      setStep(1);
      setSubmitted(false);
      resetAllForms();
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (hLocationRef.current && !hLocationRef.current.contains(e.target as Node)) {
        setHLocationFocused(false);
      }
      if (sLocationRef.current && !sLocationRef.current.contains(e.target as Node)) {
        setSLocationFocused(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
    return undefined;
  }, [isOpen]);

  const resetAllForms = () => {
    // Hiring
    setHTitle(''); setHCategory(''); setHLocationQuery(''); setHSelectedLocation('');
    setHSalaryMin(''); setHSalaryMax(''); setHLanguages([]); setHNeedDriver('');
    setHScheduleDays({ Mon: { active: false, start: '09:00', end: '17:00' }, Tue: { active: false, start: '09:00', end: '17:00' }, Wed: { active: false, start: '09:00', end: '17:00' }, Thu: { active: false, start: '09:00', end: '17:00' }, Fri: { active: false, start: '09:00', end: '17:00' }, Sat: { active: false, start: '09:00', end: '17:00' }, Sun: { active: false, start: '09:00', end: '17:00' } });
    setHDescription(''); setHSelectedPlan(''); setHPaymentError(''); setHClientSecret(null); setHPaymentLoading(false);
    // Seeker
    setSCategory(''); setSCuisines([]); setSBio(''); setSExperience(''); setSReferences([{ id: '1', name: '', phone: '' }]);
    setSLocationQuery(''); setSSelectedLocation(''); setSSalaryMin(''); setSSalaryMax('');
    setSLanguages([]); setSNativeLanguage(''); setSCanDrive(''); setSSocialLink('');
    setSScheduleDays({ Mon: { active: false, start: '09:00', end: '17:00' }, Tue: { active: false, start: '09:00', end: '17:00' }, Wed: { active: false, start: '09:00', end: '17:00' }, Thu: { active: false, start: '09:00', end: '17:00' }, Fri: { active: false, start: '09:00', end: '17:00' }, Sat: { active: false, start: '09:00', end: '17:00' }, Sun: { active: false, start: '09:00', end: '17:00' } });
    setSTerm(''); setSSelectedPlan(''); setSPaymentError(''); setSClientSecret(null); setSPaymentLoading(false);
  };

  if (!isOpen) return null;

  // Not logged in — show sign-in prompt instead of ad form
  if (!user) {
    return (
      <LoginRequiredPrompt
        isOpen={isOpen}
        onClose={onClose}
        onSignIn={openAuthModal}
        message="Sign in or create a free account to post a job ad and connect with caregivers."
      />
    );
  }


  const categories = Object.entries(categoryLabels).map(([key, label]) => ({ key, label }));

  const hFilteredCities = ALL_CITIES.filter((city) => city.toLowerCase().includes(hLocationQuery.toLowerCase().trim()));
  const sFilteredCities = ALL_CITIES.filter((city) => city.toLowerCase().includes(sLocationQuery.toLowerCase().trim()));

  const handleSelectCity = (type: 'h' | 's', city: string) => {
    if (type === 'h') { setHSelectedLocation(city); setHLocationQuery(city); setHLocationFocused(false); }
    else { setSSelectedLocation(city); setSLocationQuery(city); setSLocationFocused(false); }
  };

  const toggleDay = (type: 'h' | 's', day: string) => {
    const setter = type === 'h' ? setHScheduleDays : setSScheduleDays;
    setter((prev) => ({ ...prev, [day]: { ...prev[day], active: !prev[day].active } }));
  };

  const updateDayTime = (type: 'h' | 's', day: string, field: 'start' | 'end', value: string) => {
    const setter = type === 'h' ? setHScheduleDays : setSScheduleDays;
    setter((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
  };

  const addReference = () => {
    setSReferences((prev) => [...prev, { id: Date.now().toString(), name: '', phone: '' }]);
  };

  const removeReference = (id: string) => {
    setSReferences((prev) => prev.filter((r) => r.id !== id));
  };

  const updateReference = (id: string, field: 'name' | 'phone', value: string) => {
    setSReferences((prev) => prev.map((r) => r.id === id ? { ...r, [field]: value } : r));
  };

  const canProceed = () => {
    if (adType === 'family') {
      switch (step) {
        case 1: return hTitle.trim() && hCategory;
        case 2: return hSelectedLocation && hSalaryMin.trim() && hNeedDriver;
        case 3: return Object.values(hScheduleDays).some((d) => d.active);
        case 4: return hDescription.trim().length > 20;
        case 5: return hSelectedPlan;
        case 6: return !!hClientSecret;
        default: return true;
      }
    } else {
      switch (step) {
        case 1: return sCategory;
        case 2: return sBio.trim().length > 20;
        case 3: return sExperience && sReferences.some((r) => r.name.trim() && r.phone.trim());
        case 4: return sSelectedLocation && sSalaryMin.trim() && sCanDrive;
        case 5: return Object.values(sScheduleDays).some((d) => d.active);
        case 6: return sTerm;
        case 7: return sSelectedPlan;
        case 8: return !!sClientSecret;
        default: return true;
      }
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      // If moving from plan step to payment step, initialize Stripe payment intent
      if (adType === 'family' && step === 5 && hSelectedPlan) {
        initializePaymentIntent('family', hSelectedPlan);
      } else if (adType === 'seeker' && step === 7 && sSelectedPlan) {
        initializePaymentIntent('seeker', sSelectedPlan);
      }
      setStep(step + 1);
    }
  };
  const handleBack = () => { if (step > 1) setStep(step - 1); };

  const handlePaymentSuccess = (type: 'family' | 'seeker') => {
    // ── Seeker: save collected ad data to caregiver_profiles ─────────────────
    if (type === 'seeker' && user && isSupabaseConfigured) {
      // Convert schedule (Mon/Tue + hours) → weeklySchedule (Monday/Tuesday + slots)
      const weeklySchedule: Record<string, string[]> = {};
      Object.entries(sScheduleDays).forEach(([short, val]) => {
        if (val.active) weeklySchedule[DAY_FULL[short]] = timeToSlots(val.start, val.end);
      });

      // Format rate as range: "$18–$25/hr"
      const rate = sSalaryMin && sSalaryMax
        ? `$${sSalaryMin}–$${sSalaryMax}/hr`
        : sSalaryMin ? `$${sSalaryMin}/hr`
        : '';

      // Auto-generate listing title
      const categoryName = categoryLabels[sCategory as keyof typeof categoryLabels] ?? sCategory;
      const expPart = sExperience && sExperience !== 'Less than 1 year'
        ? `${sExperience} Experienced `
        : 'Experienced ';
      const listingTitle = `${expPart}${categoryName}${sSelectedLocation ? ` in ${sSelectedLocation}` : ''}`;

      // Skills: add cuisines for cook category
      const skills = sCategory === 'cook' && sCuisines.length > 0 ? sCuisines : [];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      supabase.from('caregiver_profiles').upsert({
        id:             user.id,
        bio:            sBio,
        experience:     sExperience,
        location:       sSelectedLocation,
        rate,
        languages:      sLanguages,
        categories:     [sCategory],
        skills,
        weekly_schedule: weeklySchedule,
        listing_title:  listingTitle,
        listing_status: 'active',
        updated_at:     new Date().toISOString(),
      } as any).then(({ error }) => {
        if (error) console.warn('Save caregiver listing error:', error.message);
      });
    }

    // ── Family: save job post to Supabase job_posts table ────────────────────
    if (type === 'family' && user && isSupabaseConfigured) {
      // Format salary range
      const salary = hSalaryMin && hSalaryMax
        ? `$${hSalaryMin}–$${hSalaryMax}/hr`
        : hSalaryMin ? `$${hSalaryMin}/hr`
        : '';

      // Build schedule string from selected days + times
      const scheduleStr = Object.entries(hScheduleDays)
        .filter(([, v]) => v.active)
        .map(([day, v]) => `${day} ${v.start}–${v.end}`)
        .join(', ') || 'Flexible';

      // Build requirements from language prefs + driver pref
      const reqs: string[] = [];
      if (hLanguages.length > 0) reqs.push(`${hLanguages.join(' / ')} speaker preferred`);
      if (hNeedDriver === 'yes')        reqs.push("Valid driver's license required");
      else if (hNeedDriver === 'adjustable') reqs.push("Driver's license an asset");

      // Calculate expiry date from plan
      const days = PLAN_DAYS[hSelectedPlan] ?? 30;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + days);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      supabase.from('job_posts').insert({
        family_id:    user.id,
        family_name:  user.name,
        title:        hTitle,
        category:     hCategory,
        location:     hSelectedLocation,
        salary,
        schedule:     scheduleStr,
        description:  hDescription,
        requirements: reqs,
        languages:    hLanguages,
        status:       'active',
        expires_at:   expiresAt.toISOString(),
      } as any).then(({ error }) => {
        if (error) console.warn('Save family job post error:', error.message);
      });
    }

    if (type === 'family') {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setAdType(null);
        setStep(1);
        resetAllForms();
        onClose();
      }, 3000);
    } else {
      setSubmitted(true);
      setStep(9);
      setTimeout(() => {
        setSubmitted(false);
        setAdType(null);
        setStep(1);
        resetAllForms();
        onClose();
      }, 3000);
    }
  };

  const initializePaymentIntent = async (type: 'family' | 'seeker', planId: string) => {
    const setLoading = type === 'family' ? setHPaymentLoading : setSPaymentLoading;
    const setError = type === 'family' ? setHPaymentError : setSPaymentError;
    const setSecret = type === 'family' ? setHClientSecret : setSClientSecret;

    setLoading(true);
    setError('');
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      if (!accessToken) {
        // Shouldn't happen — guard above shows LoginRequiredPrompt first
        onClose();
        openAuthModal();
        setLoading(false);
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-intent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ planId }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to initialize payment.');
        setLoading(false);
        return;
      }

      setSecret(data.clientSecret);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentError = (type: 'family' | 'seeker', errorMsg: string) => {
    if (type === 'family') {
      setHPaymentError(errorMsg);
    } else {
      setSPaymentError(errorMsg);
    }
  };

  const hShowDropdown = hLocationFocused && hLocationQuery.trim().length > 0;
  const sShowDropdown = sLocationFocused && sLocationQuery.trim().length > 0;

  const inputClass = `w-full px-4 py-3 border rounded-xl text-sm placeholder:text-opacity-60 ${
    isDark ? 'bg-void border-void-border text-ink placeholder:text-ink-muted' : 'bg-light-bg border-light-border text-light-text placeholder:text-light-text-muted'
  }`;
  const labelClass = `block text-sm font-medium mb-1.5 ${isDark ? 'text-ink' : 'text-light-text'}`;

  const hiringStepTitles = ['', 'Job Title & Category', 'Location & Salary', 'Schedule', 'Description', 'Choose a Plan', 'Payment', 'Success'];
  const seekerStepTitles = ['', 'Work Category', 'About You', 'Experience & References', 'Location & Pay', 'Availability', 'Job Term', 'Choose a Plan', 'Payment', 'Success'];
  const stepTitles = adType === 'family' ? hiringStepTitles : seekerStepTitles;

  const currentPlan = adType === 'family'
    ? HIRING_PLANS.find((p) => p.id === hSelectedPlan)
    : SEEKER_PLANS.find((p) => p.id === sSelectedPlan);

  // ===== RENDER HELPERS =====
  const renderStepper = () => (
    <div className={`px-6 pt-4 pb-2 flex items-center gap-1.5 ${isDark ? 'bg-void-light' : 'bg-white'}`}>
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
        <div key={s} className="flex items-center gap-1.5 flex-1">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
            s < step ? 'bg-emerald text-white' : s === step ? 'bg-gradient-to-r from-maroon to-gold text-white' : isDark ? 'bg-void-lighter text-ink-muted border border-void-border' : 'bg-light-surface-2 text-light-text-muted border border-light-border'
          }`}>
            {s < step ? <CheckCircle2 className="w-4 h-4" /> : s}
          </div>
          {s < totalSteps && (
            <div className={`flex-1 h-0.5 rounded-full ${s < step ? 'bg-emerald' : isDark ? 'bg-void-border' : 'bg-light-border'}`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderNavButtons = () => (
    <div className="flex gap-3 pt-4 mt-2">
      <button
        type="button"
        onClick={step > 1 ? handleBack : () => setAdType(null)}
        className={`flex items-center justify-center gap-2 px-5 py-3 border rounded-full text-sm font-medium transition-colors ${
          isDark ? 'bg-void border-void-border text-ink hover:bg-void-lighter' : 'bg-light-bg border-light-border text-light-text hover:bg-light-surface-2'
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>
      {step < totalSteps && !((adType === 'family' && step === 6) || (adType === 'seeker' && step === 8)) ? (
        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed()}
          className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-opacity btn-press ${
            canProceed() ? 'bg-gradient-to-r from-maroon to-gold text-white shadow-lg shadow-maroon/20 hover:opacity-90' : 'bg-void-lighter text-ink-muted cursor-not-allowed'
          }`}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      ) : null}
    </div>
  );

  return (
    <div className={`fixed inset-0 z-[100] overflow-y-auto ${isDark ? 'bg-void-light' : 'bg-white'}`}>
      <div className="min-h-full max-w-4xl mx-auto flex flex-col">

        {/* Sticky header + stepper */}
        <div className={`sticky top-0 z-10 border-b ${
          isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'
        }`}>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h3 className={`font-display text-2xl font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
                {adType === null ? 'Post an Ad' : adType === 'family' ? 'Hire a Caregiver' : 'Find a Job'}
              </h3>
              {adType !== null && !submitted && (
                <div className={`text-xs mt-0.5 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                  Step {step} of {totalSteps} — {stepTitles[step]}
                </div>
              )}
            </div>
            <button onClick={onClose} className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-void-lighter text-ink-muted' : 'hover:bg-light-surface-2 text-light-text-muted'}`}>
              <X className="w-5 h-5" />
            </button>
          </div>
          {adType !== null && !submitted && renderStepper()}
        </div>

        <div className="flex-1 p-6 md:p-10">
          {/* ===== LANDING SCREEN ===== */}
          {adType === null ? (
            <div className="space-y-4">
              <p className={isDark ? 'text-ink-muted text-sm mb-6' : 'text-light-text-muted text-sm mb-6'}>
                What would you like to do?
              </p>
              {/* Hiring */}
              <button
                onClick={() => { setAdType('family'); setStep(1); }}
                className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all text-left group ${
                  isDark ? 'bg-void border-void-border hover:border-emerald/40 hover:bg-emerald/5' : 'bg-light-bg border-light-border hover:border-emerald/30 hover:bg-emerald/5'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border ${
                  isDark ? 'bg-gradient-to-br from-emerald/20 to-teal/20 border-emerald/20' : 'bg-gradient-to-br from-emerald/10 to-teal/10 border-emerald/10'
                }`}>
                  <Building2 className="w-6 h-6 text-emerald" />
                </div>
                <div>
                  <div className={`font-display text-lg font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>I am hiring</div>
                  <div className={isDark ? 'text-sm text-ink-muted' : 'text-sm text-light-text-muted'}>Post a job for families looking for caregivers</div>
                </div>
              </button>

              {/* Seeking */}
              <button
                onClick={() => { setAdType('seeker'); setStep(1); }}
                className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all text-left group ${
                  isDark ? 'bg-void border-void-border hover:border-gold/40 hover:bg-gold/5' : 'bg-light-bg border-light-border hover:border-gold/30 hover:bg-gold/5'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border ${
                  isDark ? 'bg-gradient-to-br from-gold/20 to-saffron/20 border-gold/20' : 'bg-gradient-to-br from-gold/10 to-saffron/10 border-gold/10'
                }`}>
                  <Briefcase className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <div className={`font-display text-lg font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>I am looking for work</div>
                  <div className={isDark ? 'text-sm text-ink-muted' : 'text-sm text-light-text-muted'}>Create a profile to showcase your skills to families</div>
                </div>
              </button>
            </div>
          ) : submitted ? (
            /* ===== SUCCESS ===== */
            <div className="text-center py-10">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald to-teal flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h4 className={`font-display text-2xl font-semibold mb-2 ${isDark ? 'text-ink' : 'text-light-text'}`}>Payment Successful!</h4>
              <p className={`mb-2 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>Your ad is now active and visible.</p>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mt-4 ${isDark ? 'bg-emerald/10 text-emerald' : 'bg-emerald/5 text-emerald'}`}>
                <ShieldCheck className="w-4 h-4" />
                Ad live for {currentPlan?.duration}
              </div>
            </div>
          ) : adType === 'family' ? (
            /* ===== HIRING WIZARD (7 steps) ===== */
            <>
              {/* Step 1: Title & Category */}
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>Job Title</label>
                    <input type="text" value={hTitle} onChange={(e) => setHTitle(e.target.value)} placeholder="e.g. Full-Time Nanny Needed" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Category</label>
                    <div className="grid grid-cols-1 gap-2">
                      {categories.map((c) => (
                        <button key={c.key} type="button" onClick={() => setHCategory(c.key)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all text-left ${
                            hCategory === c.key ? 'bg-gold/10 border-gold text-gold' : isDark ? 'bg-void border-void-border text-ink-light hover:border-ink-muted' : 'bg-light-bg border-light-border text-light-text-2 hover:border-light-text-muted'
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full ${c.key === 'nanny' ? 'bg-accent-nanny' : c.key === 'eldercare' ? 'bg-accent-elder' : c.key === 'cook' ? 'bg-accent-cook' : c.key === 'housekeeper' ? 'bg-accent-house' : 'bg-accent-clean'}`} />
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {renderNavButtons()}
                </div>
              )}

              {/* Step 2: Location & Salary */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="relative" ref={hLocationRef}>
                    <label className={labelClass}>Location</label>
                    <div className="relative">
                      <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                      <input type="text" value={hLocationQuery} onChange={(e) => { setHLocationQuery(e.target.value); setHSelectedLocation(''); }} onFocus={() => setHLocationFocused(true)} placeholder="Search city..."
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm ${isDark ? 'bg-void border-void-border text-ink placeholder:text-ink-muted' : 'bg-light-bg border-light-border text-light-text placeholder:text-light-text-muted'}`}
                      />
                    </div>
                    {hShowDropdown && (
                      <div className={`absolute z-50 left-0 right-0 mt-1 rounded-xl border shadow-xl max-h-48 overflow-y-auto ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}>
                        {hFilteredCities.length === 0 ? (
                          <div className={`px-4 py-3 text-sm ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>No cities found.</div>
                        ) : (
                          hFilteredCities.map((city) => (
                            <button key={city} type="button" onClick={() => handleSelectCity('h', city)}
                              className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${hSelectedLocation === city ? (isDark ? 'text-gold bg-gold/10' : 'text-maroon bg-maroon/10') : (isDark ? 'text-ink-light hover:text-ink hover:bg-void-lighter' : 'text-light-text-2 hover:text-light-text hover:bg-light-surface-2')}`}
                            >
                              <MapPin className={`w-3.5 h-3.5 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                              {city}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  {/* #7 Pay Rate Range */}
                  <div>
                    <label className={labelClass}>Pay Rate Range (per hour)</label>
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <DollarSign className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                        <input type="number" min="0" value={hSalaryMin} onChange={(e) => setHSalaryMin(e.target.value)} placeholder="Min e.g. 20" className={inputClass.replace('px-4', 'pl-10 pr-4')} />
                      </div>
                      <span className={`text-sm font-medium shrink-0 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>to</span>
                      <div className="relative flex-1">
                        <DollarSign className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                        <input type="number" min="0" value={hSalaryMax} onChange={(e) => setHSalaryMax(e.target.value)} placeholder="Max e.g. 28" className={inputClass.replace('px-4', 'pl-10 pr-4')} />
                      </div>
                    </div>
                  </div>

                  {/* #5 Language preference — multi-select */}
                  <div>
                    <label className={labelClass}>
                      Preferred Languages for Caregiver{' '}
                      <span className={`font-normal text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>(optional — select all that apply)</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Punjabi', 'Hindi', 'Urdu', 'Gujarati', 'Tamil', 'Telugu', 'Bengali', 'Tagalog', 'Mandarin', 'Cantonese', 'Korean', 'Arabic', 'English'].map((lang) => {
                        const selected = hLanguages.includes(lang);
                        return (
                          <button key={lang} type="button"
                            onClick={() => setHLanguages((prev) => selected ? prev.filter((l) => l !== lang) : [...prev, lang])}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all text-left ${
                              selected ? 'bg-gold/10 border-gold text-gold' : isDark ? 'bg-void border-void-border text-ink-light hover:border-ink-muted' : 'bg-light-bg border-light-border text-light-text-2 hover:border-light-text-muted'
                            }`}
                          >
                            <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${selected ? 'bg-gold border-gold' : isDark ? 'border-void-border' : 'border-light-border'}`}>
                              {selected && <span className="text-white text-[8px] font-bold">✓</span>}
                            </div>
                            {lang}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* #6 Driver */}
                  <div>
                    <label className={labelClass}>Do you need the caregiver to drive?</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[{ id: 'yes', label: 'Yes, required' }, { id: 'no', label: 'No driving' }, { id: 'adjustable', label: 'Flexible' }].map((opt) => (
                        <button key={opt.id} type="button" onClick={() => setHNeedDriver(opt.id)}
                          className={`px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                            hNeedDriver === opt.id ? 'bg-gold/10 border-gold text-gold' : isDark ? 'bg-void border-void-border text-ink-light hover:border-ink-muted' : 'bg-light-bg border-light-border text-light-text-2 hover:border-light-text-muted'
                          }`}
                        >{opt.label}</button>
                      ))}
                    </div>
                  </div>
                  {renderNavButtons()}
                </div>
              )}

              {/* Step 3: Schedule */}
              {step === 3 && (
                <div className="space-y-3">
                  <p className={`text-sm mb-2 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>Select the days you need care and set the hours.</p>
                  {DAYS.map((day) => (
                    <div key={day} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${hScheduleDays[day].active ? (isDark ? 'bg-gold/5 border-gold/30' : 'bg-gold/5 border-gold/20') : (isDark ? 'bg-void border-void-border' : 'bg-light-bg border-light-border')}`}>
                      <button type="button" onClick={() => toggleDay('h', day)} className={`w-10 h-10 rounded-lg text-sm font-bold transition-all shrink-0 ${hScheduleDays[day].active ? 'bg-gradient-to-r from-maroon to-gold text-white shadow-md' : (isDark ? 'bg-void-lighter text-ink-muted' : 'bg-light-surface-2 text-light-text-muted')}`}>{day}</button>
                      {hScheduleDays[day].active ? (
                        <>
                          <input type="time" value={hScheduleDays[day].start} onChange={(e) => updateDayTime('h', day, 'start', e.target.value)} className={`px-2 py-1.5 rounded-lg text-sm border ${isDark ? 'bg-void border-void-border text-ink' : 'bg-white border-light-border text-light-text'}`} />
                          <span className={`text-sm shrink-0 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>to</span>
                          <input type="time" value={hScheduleDays[day].end} onChange={(e) => updateDayTime('h', day, 'end', e.target.value)} className={`px-2 py-1.5 rounded-lg text-sm border ${isDark ? 'bg-void border-void-border text-ink' : 'bg-white border-light-border text-light-text'}`} />
                        </>
                      ) : (
                        <span className={`text-sm ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>Not selected</span>
                      )}
                    </div>
                  ))}
                  {renderNavButtons()}
                </div>
              )}

              {/* Step 4: Description */}
              {step === 4 && (
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Job Description</label>
                    <div className="relative">
                      <FileText className={`absolute left-3 top-3.5 w-4 h-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                      <textarea value={hDescription} onChange={(e) => setHDescription(e.target.value)} rows={6} placeholder="Describe the role, responsibilities, and what you are looking for..."
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm resize-none placeholder:text-opacity-60 ${isDark ? 'bg-void border-void-border text-ink placeholder:text-ink-muted' : 'bg-light-bg border-light-border text-light-text placeholder:text-light-text-muted'}`}
                      />
                    </div>
                    <div className={`text-xs mt-1.5 text-right ${hDescription.length < 20 ? 'text-red-400' : (isDark ? 'text-ink-muted' : 'text-light-text-muted')}`}>{hDescription.length} characters (min 20)</div>
                  </div>
                  {renderNavButtons()}
                </div>
              )}

              {/* Step 5: Plans */}
              {step === 5 && (
                <div className="space-y-4">
                  <p className={`text-sm mb-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>Choose how long you want your ad to stay active.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {HIRING_PLANS.map((plan) => (
                    <button key={plan.id} type="button" onClick={() => setHSelectedPlan(plan.id)}
                      className={`relative flex flex-col p-6 rounded-2xl border transition-all text-left ${hSelectedPlan === plan.id ? 'bg-gold/10 border-gold shadow-lg shadow-gold/10 ring-2 ring-gold/20' : (isDark ? 'bg-void border-void-border hover:border-gold/30' : 'bg-light-bg border-light-border hover:border-gold/20')}`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-maroon to-gold text-white text-xs font-semibold rounded-full">
                            <Star className="w-3 h-3 fill-white" /> Popular
                          </div>
                        </div>
                      )}
                      <div className="mb-3">
                        <div className={`font-display text-lg font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>{plan.label}</div>
                        <div className={`text-sm ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>{plan.duration} visibility</div>
                      </div>
                      <div className="font-display text-3xl font-bold text-gold mb-4">${plan.price}</div>
                      <div className={`mt-auto py-2.5 px-4 rounded-lg text-center text-sm font-medium ${hSelectedPlan === plan.id ? 'bg-gradient-to-r from-maroon to-gold text-white' : (isDark ? 'bg-void-lighter text-ink-light' : 'bg-light-surface-2 text-light-text-2')}`}>
                        {hSelectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                      </div>
                    </button>
                  ))}
                  </div>
                  {renderNavButtons()}
                </div>
              )}

              {/* Step 6: Payment */}
              {step === 6 && (
                <div className="space-y-5">
                  {hPaymentError && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                      <p className="text-sm text-red-800">{hPaymentError}</p>
                    </div>
                  )}
                  {hPaymentLoading && (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
                    </div>
                  )}
                  {hClientSecret ? (
                    <Elements stripe={getStripe()} options={{ clientSecret: hClientSecret }}>
                      <StripePaymentForm
                        amount={HIRING_PLANS.find((p) => p.id === hSelectedPlan)?.price || 0}
                        planLabel={`${HIRING_PLANS.find((p) => p.id === hSelectedPlan)?.label} plan`}
                        onSuccess={() => handlePaymentSuccess('family')}
                        onError={(err) => handlePaymentError('family', err)}
                        isLoading={hPaymentLoading}
                      />
                    </Elements>
                  ) : (
                    <div className={`p-4 rounded-xl border ${isDark ? 'bg-void border-void-border' : 'bg-light-bg border-light-border'}`}>
                      <div className={`text-sm ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>Total to pay</div>
                      <div className="font-display text-3xl font-bold text-gold">${HIRING_PLANS.find((p) => p.id === hSelectedPlan)?.price || 0}</div>
                      <div className={`text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>{HIRING_PLANS.find((p) => p.id === hSelectedPlan)?.label} plan</div>
                    </div>
                  )}
                  {renderNavButtons()}
                </div>
              )}
            </>
          ) : (
            /* ===== SEEKER WIZARD (9 steps) ===== */
            <>
              {/* Step 1: Work Category */}
              {step === 1 && (
                <div className="space-y-5">
                  <p className={`text-sm ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>What type of care work are you looking for?</p>
                  <div className="grid grid-cols-1 gap-2">
                    {categories.map((c) => (
                      <button key={c.key} type="button" onClick={() => { setSCategory(c.key); if (c.key !== 'cook') setSCuisines([]); }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all text-left ${
                          sCategory === c.key ? 'bg-gold/10 border-gold text-gold' : isDark ? 'bg-void border-void-border text-ink-light hover:border-ink-muted' : 'bg-light-bg border-light-border text-light-text-2 hover:border-light-text-muted'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${c.key === 'nanny' ? 'bg-accent-nanny' : c.key === 'eldercare' ? 'bg-accent-elder' : c.key === 'cook' ? 'bg-accent-cook' : c.key === 'housekeeper' ? 'bg-accent-house' : 'bg-accent-clean'}`} />
                        {c.label}
                      </button>
                    ))}
                  </div>

                  {/* #9 Cuisine types — shown only when Cook is selected */}
                  {sCategory === 'cook' && (
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-ink' : 'text-light-text'}`}>
                        What cuisines can you cook? <span className={`font-normal text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>(select all that apply)</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['North Indian', 'South Indian', 'Punjabi', 'Gujarati', 'Indo-Chinese', 'Pakistani / Halal', 'Bengali', 'Continental / Western', 'Other'].map((cuisine) => {
                          const selected = sCuisines.includes(cuisine);
                          return (
                            <button key={cuisine} type="button"
                              onClick={() => setSCuisines((prev) => selected ? prev.filter((c) => c !== cuisine) : [...prev, cuisine])}
                              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all text-left ${
                                selected ? 'bg-gold/10 border-gold text-gold' : isDark ? 'bg-void border-void-border text-ink-light hover:border-ink-muted' : 'bg-light-bg border-light-border text-light-text-2 hover:border-light-text-muted'
                              }`}
                            >
                              <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${selected ? 'bg-gold border-gold' : isDark ? 'border-void-border' : 'border-light-border'}`}>
                                {selected && <span className="text-white text-[8px] font-bold">✓</span>}
                              </div>
                              {cuisine}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {renderNavButtons()}
                </div>
              )}

              {/* Step 2: About You */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Tell us about yourself</label>
                    <div className="relative">
                      <User className={`absolute left-3 top-3.5 w-4 h-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                      <textarea value={sBio} onChange={(e) => setSBio(e.target.value)} rows={6} placeholder="Describe your background, skills, and why families should hire you..."
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm resize-none placeholder:text-opacity-60 ${isDark ? 'bg-void border-void-border text-ink placeholder:text-ink-muted' : 'bg-light-bg border-light-border text-light-text placeholder:text-light-text-muted'}`}
                      />
                    </div>
                    <div className={`text-xs mt-1.5 text-right ${sBio.length < 20 ? 'text-red-400' : (isDark ? 'text-ink-muted' : 'text-light-text-muted')}`}>{sBio.length} characters (min 20)</div>
                  </div>
                  {/* #2 Social media link */}
                  <div>
                    <label className={labelClass}>
                      Social Media Link{' '}
                      <span className={`font-normal text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>(optional — Instagram, LinkedIn, etc.)</span>
                    </label>
                    <input
                      type="url"
                      value={sSocialLink}
                      onChange={(e) => setSSocialLink(e.target.value)}
                      placeholder="e.g. https://instagram.com/yourprofile"
                      className={inputClass}
                    />
                  </div>
                  {renderNavButtons()}
                </div>
              )}

              {/* Step 3: Experience & References */}
              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>Years of Experience</label>
                    <div className="grid grid-cols-3 gap-2">
                      {EXPERIENCE_YEARS.map((yr) => (
                        <button key={yr} type="button" onClick={() => setSExperience(yr)}
                          className={`px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                            sExperience === yr ? 'bg-gold/10 border-gold text-gold' : isDark ? 'bg-void border-void-border text-ink-light hover:border-ink-muted' : 'bg-light-bg border-light-border text-light-text-2 hover:border-light-text-muted'
                          }`}
                        >
                          {yr}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className={labelClass}>References</label>
                      <button type="button" onClick={addReference} className="flex items-center gap-1 text-xs text-gold hover:underline">
                        <Plus className="w-3.5 h-3.5" /> Add
                      </button>
                    </div>
                    <div className="space-y-3">
                      {sReferences.map((ref, idx) => (
                        <div key={ref.id} className={`p-3 rounded-xl border ${isDark ? 'bg-void border-void-border' : 'bg-light-bg border-light-border'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs font-medium ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>Reference #{idx + 1}</span>
                            {sReferences.length > 1 && (
                              <button type="button" onClick={() => removeReference(ref.id)} className="text-red-400 hover:text-red-300">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input type="text" value={ref.name} onChange={(e) => updateReference(ref.id, 'name', e.target.value)} placeholder="Name" className={`px-3 py-2 rounded-lg text-sm border ${isDark ? 'bg-void-lighter border-void-border text-ink placeholder:text-ink-muted' : 'bg-white border-light-border text-light-text placeholder:text-light-text-muted'}`} />
                            <input type="text" value={ref.phone} onChange={(e) => updateReference(ref.id, 'phone', e.target.value)} placeholder="Phone" className={`px-3 py-2 rounded-lg text-sm border ${isDark ? 'bg-void-lighter border-void-border text-ink placeholder:text-ink-muted' : 'bg-white border-light-border text-light-text placeholder:text-light-text-muted'}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {renderNavButtons()}
                </div>
              )}

              {/* Step 4: Location & Pay */}
              {step === 4 && (
                <div className="space-y-5">
                  <div className="relative" ref={sLocationRef}>
                    <label className={labelClass}>Location</label>
                    <div className="relative">
                      <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                      <input type="text" value={sLocationQuery} onChange={(e) => { setSLocationQuery(e.target.value); setSSelectedLocation(''); }} onFocus={() => setSLocationFocused(true)} placeholder="Search city..."
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm ${isDark ? 'bg-void border-void-border text-ink placeholder:text-ink-muted' : 'bg-light-bg border-light-border text-light-text placeholder:text-light-text-muted'}`}
                      />
                    </div>
                    {sShowDropdown && (
                      <div className={`absolute z-50 left-0 right-0 mt-1 rounded-xl border shadow-xl max-h-48 overflow-y-auto ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}>
                        {sFilteredCities.length === 0 ? (
                          <div className={`px-4 py-3 text-sm ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>No cities found.</div>
                        ) : (
                          sFilteredCities.map((city) => (
                            <button key={city} type="button" onClick={() => handleSelectCity('s', city)}
                              className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${sSelectedLocation === city ? (isDark ? 'text-gold bg-gold/10' : 'text-maroon bg-maroon/10') : (isDark ? 'text-ink-light hover:text-ink hover:bg-void-lighter' : 'text-light-text-2 hover:text-light-text hover:bg-light-surface-2')}`}
                            >
                              <MapPin className={`w-3.5 h-3.5 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                              {city}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  {/* #7 Pay Rate Range */}
                  <div>
                    <label className={labelClass}>Expected Pay Rate Range (per hour)</label>
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <DollarSign className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                        <input type="number" min="0" value={sSalaryMin} onChange={(e) => setSSalaryMin(e.target.value)} placeholder="Min e.g. 18" className={inputClass.replace('px-4', 'pl-10 pr-4')} />
                      </div>
                      <span className={`text-sm font-medium shrink-0 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>to</span>
                      <div className="relative flex-1">
                        <DollarSign className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                        <input type="number" min="0" value={sSalaryMax} onChange={(e) => setSSalaryMax(e.target.value)} placeholder="Max e.g. 25" className={inputClass.replace('px-4', 'pl-10 pr-4')} />
                      </div>
                    </div>
                  </div>

                  {/* #5 Languages spoken */}
                  <div>
                    <label className={labelClass}>Languages you speak <span className={`font-normal text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>(select all that apply)</span></label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Punjabi', 'Hindi', 'Urdu', 'Gujarati', 'Tamil', 'Telugu', 'Bengali', 'Tagalog', 'Mandarin', 'Cantonese', 'Korean', 'Arabic', 'English'].map((lang) => {
                        const selected = sLanguages.includes(lang);
                        return (
                          <button key={lang} type="button"
                            onClick={() => setSLanguages((prev) => selected ? prev.filter((l) => l !== lang) : [...prev, lang])}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all text-left ${
                              selected ? 'bg-gold/10 border-gold text-gold' : isDark ? 'bg-void border-void-border text-ink-light hover:border-ink-muted' : 'bg-light-bg border-light-border text-light-text-2 hover:border-light-text-muted'
                            }`}
                          >
                            <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${selected ? 'bg-gold border-gold' : isDark ? 'border-void-border' : 'border-light-border'}`}>
                              {selected && <span className="text-white text-[8px] font-bold">✓</span>}
                            </div>
                            {lang}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Your native / first language</label>
                    <select value={sNativeLanguage} onChange={(e) => setSNativeLanguage(e.target.value)} className={inputClass}>
                      <option value="">Select your native language</option>
                      {['Punjabi', 'Hindi', 'Urdu', 'Gujarati', 'Tamil', 'Telugu', 'Bengali', 'Tagalog', 'Mandarin', 'Cantonese', 'Korean', 'Arabic', 'English', 'Other'].map((lang) => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>

                  {/* #6 Driving */}
                  <div>
                    <label className={labelClass}>Can you drive?</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[{ id: 'yes', label: "Yes, I have a driver's license" }, { id: 'no', label: "No, I don't drive" }].map((opt) => (
                        <button key={opt.id} type="button" onClick={() => setSCanDrive(opt.id)}
                          className={`px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                            sCanDrive === opt.id ? 'bg-gold/10 border-gold text-gold' : isDark ? 'bg-void border-void-border text-ink-light hover:border-ink-muted' : 'bg-light-bg border-light-border text-light-text-2 hover:border-light-text-muted'
                          }`}
                        >{opt.label}</button>
                      ))}
                    </div>
                  </div>
                  {renderNavButtons()}
                </div>
              )}

              {/* Step 5: Availability */}
              {step === 5 && (
                <div className="space-y-3">
                  <p className={`text-sm mb-2 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>Select your available days and hours.</p>
                  {DAYS.map((day) => (
                    <div key={day} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${sScheduleDays[day].active ? (isDark ? 'bg-gold/5 border-gold/30' : 'bg-gold/5 border-gold/20') : (isDark ? 'bg-void border-void-border' : 'bg-light-bg border-light-border')}`}>
                      <button type="button" onClick={() => toggleDay('s', day)} className={`w-10 h-10 rounded-lg text-sm font-bold transition-all shrink-0 ${sScheduleDays[day].active ? 'bg-gradient-to-r from-maroon to-gold text-white shadow-md' : (isDark ? 'bg-void-lighter text-ink-muted' : 'bg-light-surface-2 text-light-text-muted')}`}>{day}</button>
                      {sScheduleDays[day].active ? (
                        <>
                          <input type="time" value={sScheduleDays[day].start} onChange={(e) => updateDayTime('s', day, 'start', e.target.value)} className={`px-2 py-1.5 rounded-lg text-sm border ${isDark ? 'bg-void border-void-border text-ink' : 'bg-white border-light-border text-light-text'}`} />
                          <span className={`text-sm shrink-0 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>to</span>
                          <input type="time" value={sScheduleDays[day].end} onChange={(e) => updateDayTime('s', day, 'end', e.target.value)} className={`px-2 py-1.5 rounded-lg text-sm border ${isDark ? 'bg-void border-void-border text-ink' : 'bg-white border-light-border text-light-text'}`} />
                        </>
                      ) : (
                        <span className={`text-sm ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>Not available</span>
                      )}
                    </div>
                  ))}
                  {renderNavButtons()}
                </div>
              )}

              {/* Step 6: Job Term */}
              {step === 6 && (
                <div className="space-y-5">
                  <p className={`text-sm ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>What type of position are you looking for?</p>
                  {[
                    { id: 'short', label: 'Short Term', desc: 'Temporary, seasonal, or contract work' },
                    { id: 'long', label: 'Long Term', desc: 'Permanent, ongoing employment' },
                    { id: 'both', label: 'Open to Both', desc: 'Flexible — either short or long term' },
                  ].map((opt) => (
                    <button key={opt.id} type="button" onClick={() => setSTerm(opt.id)}
                      className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all text-left ${
                        sTerm === opt.id ? 'bg-gold/10 border-gold shadow-lg shadow-gold/10' : (isDark ? 'bg-void border-void-border hover:border-gold/30' : 'bg-light-bg border-light-border hover:border-gold/20')
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${sTerm === opt.id ? 'bg-gradient-to-br from-maroon to-gold' : (isDark ? 'bg-void-lighter' : 'bg-light-surface-2')}`}>
                        <Clock className={`w-6 h-6 ${sTerm === opt.id ? 'text-white' : 'text-gold'}`} />
                      </div>
                      <div>
                        <div className={`font-display text-lg font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>{opt.label}</div>
                        <div className={`text-sm ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>{opt.desc}</div>
                      </div>
                    </button>
                  ))}
                  {renderNavButtons()}
                </div>
              )}

              {/* Step 7: Plans */}
              {step === 7 && (
                <div className="space-y-4">
                  <p className={`text-sm mb-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>Choose how long you want your profile to stay active.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {SEEKER_PLANS.map((plan) => (
                    <button key={plan.id} type="button" onClick={() => setSSelectedPlan(plan.id)}
                      className={`relative flex flex-col p-6 rounded-2xl border transition-all text-left ${sSelectedPlan === plan.id ? 'bg-gold/10 border-gold shadow-lg shadow-gold/10 ring-2 ring-gold/20' : (isDark ? 'bg-void border-void-border hover:border-gold/30' : 'bg-light-bg border-light-border hover:border-gold/20')}`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-maroon to-gold text-white text-xs font-semibold rounded-full">
                            <Star className="w-3 h-3 fill-white" /> Popular
                          </div>
                        </div>
                      )}
                      <div className="mb-3">
                        <div className={`font-display text-lg font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>{plan.label}</div>
                        <div className={`text-sm ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>{plan.duration} visibility</div>
                      </div>
                      <div className="font-display text-3xl font-bold text-gold mb-4">${plan.price}</div>
                      <div className={`mt-auto py-2.5 px-4 rounded-lg text-center text-sm font-medium ${sSelectedPlan === plan.id ? 'bg-gradient-to-r from-maroon to-gold text-white' : (isDark ? 'bg-void-lighter text-ink-light' : 'bg-light-surface-2 text-light-text-2')}`}>
                        {sSelectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                      </div>
                    </button>
                  ))}
                  </div>
                  {renderNavButtons()}
                </div>
              )}

              {/* Step 8: Payment */}
              {step === 8 && (
                <div className="space-y-5">
                  {sPaymentError && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                      <p className="text-sm text-red-800">{sPaymentError}</p>
                    </div>
                  )}
                  {sPaymentLoading && (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
                    </div>
                  )}
                  {sClientSecret ? (
                    <Elements stripe={getStripe()} options={{ clientSecret: sClientSecret }}>
                      <StripePaymentForm
                        amount={SEEKER_PLANS.find((p) => p.id === sSelectedPlan)?.price || 0}
                        planLabel={`${SEEKER_PLANS.find((p) => p.id === sSelectedPlan)?.label} plan`}
                        onSuccess={() => handlePaymentSuccess('seeker')}
                        onError={(err) => handlePaymentError('seeker', err)}
                        isLoading={sPaymentLoading}
                      />
                    </Elements>
                  ) : (
                    <div className={`p-4 rounded-xl border ${isDark ? 'bg-void border-void-border' : 'bg-light-bg border-light-border'}`}>
                      <div className={`text-sm ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>Total to pay</div>
                      <div className="font-display text-3xl font-bold text-gold">${SEEKER_PLANS.find((p) => p.id === sSelectedPlan)?.price || 0}</div>
                      <div className={`text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>{SEEKER_PLANS.find((p) => p.id === sSelectedPlan)?.label} plan</div>
                    </div>
                  )}
                  {renderNavButtons()}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

