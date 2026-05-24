import { useState } from 'react';
import { Lock, RefreshCw, FilePlus, HeartHandshake, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import SubscriptionModal from '../SubscriptionModal';
import ListingSubscriptionModal from '../ListingSubscriptionModal';

export default function SubscriptionExpiredGate() {
  const { isDark } = useTheme();
  const { user, logout } = useAuth();
  const { expiryDate, listingExpiryDate } = useSubscription();
  const navigate = useNavigate();

  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showNewAdModal, setShowNewAdModal] = useState(false);

  const hadSubscription = !!expiryDate || !!listingExpiryDate;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-6 ${isDark ? 'bg-void' : 'bg-light-bg'}`}>
      {/* Brand mark */}
      <div
        className="flex items-center gap-2.5 mb-10 cursor-pointer"
        onClick={() => navigate('/')}
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-maroon to-gold flex items-center justify-center shadow-lg">
          <HeartHandshake className="w-5 h-5 text-white" />
        </div>
        <span className={`font-display text-xl font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
          The Care Crew
        </span>
      </div>

      {/* Gate card */}
      <div className={`w-full max-w-md rounded-3xl border p-8 text-center shadow-xl ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}>
        {/* Icon */}
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isDark ? 'bg-void-lighter' : 'bg-light-surface-2'}`}>
          <Lock className={`w-9 h-9 ${isDark ? 'text-gold' : 'text-maroon'}`} />
        </div>

        {/* Message */}
        <h2 className={`font-display text-2xl font-semibold mb-2 ${isDark ? 'text-ink' : 'text-light-text'}`}>
          {hadSubscription ? 'Subscription Expired' : 'No Active Subscription'}
        </h2>
        <p className={`text-sm leading-relaxed mb-2 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
          {hadSubscription
            ? `Hi ${user?.name?.split(' ')[0] ?? 'there'}, your subscription has expired. Renew to get back into your dashboard and continue connecting with ${user?.role === 'caregiver' ? 'families' : 'caregivers'}.`
            : `Hi ${user?.name?.split(' ')[0] ?? 'there'}, you need an active subscription to access your dashboard.`}
        </p>

        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-8 ${isDark ? 'bg-red-900/30 text-red-400 border border-red-700/30' : 'bg-red-50 text-red-600 border border-red-200'}`}>
          Dashboard access requires an active plan
        </div>

        {/* Two options */}
        <div className="space-y-3">
          {/* Option 1: Renew with last listing */}
          <button
            onClick={() => setShowRenewModal(true)}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left transition-all hover:scale-[1.01] btn-press bg-gradient-to-r from-maroon to-gold text-white border-transparent shadow-lg shadow-maroon/20"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-sm">Renew Subscription</div>
              <div className="text-xs opacity-80 mt-0.5">
                {hadSubscription
                  ? 'Pick up where you left off — your previous listing is restored'
                  : 'Get access to contacts, job matches, and your dashboard'}
              </div>
            </div>
          </button>

          {/* Option 2: Post new ad */}
          <button
            onClick={() => setShowNewAdModal(true)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left transition-all hover:scale-[1.01] btn-press ${
              isDark
                ? 'border-void-border bg-void-lighter hover:border-gold/40'
                : 'border-light-border bg-light-surface-2 hover:border-maroon/30'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isDark ? 'bg-void text-gold' : 'bg-white text-maroon border border-light-border'}`}>
              <FilePlus className="w-5 h-5" />
            </div>
            <div>
              <div className={`font-semibold text-sm ${isDark ? 'text-ink' : 'text-light-text'}`}>
                Post a New Ad
              </div>
              <div className={`text-xs mt-0.5 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                Start fresh — create a brand-new listing with a new plan
              </div>
            </div>
          </button>
        </div>

        {/* Sign out link */}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-1.5 mx-auto mt-6 text-xs transition-colors ${isDark ? 'text-ink-muted hover:text-red-400' : 'text-light-text-muted hover:text-red-500'}`}
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
      </div>

      {/* Modals */}
      <SubscriptionModal
        isOpen={showRenewModal}
        onClose={() => setShowRenewModal(false)}
        contextMessage={hadSubscription ? 'Renew your plan to restore full dashboard access.' : undefined}
      />
      <ListingSubscriptionModal
        isOpen={showNewAdModal}
        onClose={() => setShowNewAdModal(false)}
      />
    </div>
  );
}
