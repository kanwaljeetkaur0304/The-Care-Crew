import { CreditCard, Check, ShieldCheck, Calendar, Zap, ArrowRight } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { MOCK_SUBSCRIPTION } from '../../../data/dashboardMockData';
import { CONTACT_PLANS } from '../../../context/SubscriptionContext';

export default function FamilySubscription() {
  const { isDark } = useTheme();
  const sub = MOCK_SUBSCRIPTION;

  const daysPercent = Math.round((sub.daysLeft / 60) * 100);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className={`font-display text-2xl font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
          Subscription
        </h2>
        <p className={`text-sm mt-1 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
          Manage your plan and contact access
        </p>
      </div>

      {/* Current Plan Card */}
      {sub.status === 'active' ? (
        <div className="rounded-2xl bg-gradient-to-br from-maroon via-maroon to-gold p-6 text-white">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide opacity-75 mb-1">Current Plan</div>
              <div className="font-display text-2xl font-bold">{sub.tier} Plan</div>
              <div className="text-sm opacity-80 mt-1">${sub.price} · {sub.daysLeft} days remaining</div>
            </div>
            <div className="p-3 bg-white/15 rounded-xl">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-5">
            <div className="flex justify-between text-xs opacity-75 mb-1.5">
              <span>Time remaining</span>
              <span>{sub.daysLeft} / 60 days</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${daysPercent}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1.5 text-sm opacity-90">
              <ShieldCheck className="w-4 h-4" />
              <span>{sub.contactsUnlocked} contacts unlocked</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm opacity-90">
              <Calendar className="w-4 h-4" />
              <span>Renews {new Date(sub.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className={`rounded-2xl border p-6 text-center ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-void-lighter' : 'bg-light-surface-2'}`}>
            <CreditCard className={`w-7 h-7 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
          </div>
          <h3 className={`font-display text-lg font-semibold mb-2 ${isDark ? 'text-ink' : 'text-light-text'}`}>No Active Plan</h3>
          <p className={`text-sm mb-5 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
            Unlock phone numbers and email addresses for all caregiver profiles
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-maroon to-gold text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity btn-press shadow-md shadow-maroon/20">
            View Plans
          </button>
        </div>
      )}

      {/* Features */}
      {sub.status === 'active' && (
        <div className={`rounded-2xl border p-5 ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}>
          <h3 className={`font-display font-semibold mb-4 ${isDark ? 'text-ink' : 'text-light-text'}`}>Included in your plan</h3>
          <div className="space-y-3">
            {sub.features.map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-emerald-600" />
                </div>
                <span className={`text-sm ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upgrade / Other Plans */}
      <div>
        <h3 className={`font-display font-semibold mb-4 ${isDark ? 'text-ink' : 'text-light-text'}`}>
          {sub.status === 'active' ? 'Upgrade or Change Plan' : 'Choose a Plan'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CONTACT_PLANS.map((plan) => {
            const isCurrent = plan.tier === sub.tier && sub.status === 'active';
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-5 transition-all ${
                  isCurrent
                    ? 'bg-gold/10 border-gold ring-2 ring-gold/20'
                    : isDark
                      ? 'bg-void border-void-border hover:border-gold/30'
                      : 'bg-light-bg border-light-border hover:border-gold/20'
                }`}
              >
                {plan.popular && !isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-maroon to-gold text-white text-xs font-semibold rounded-full">
                      <Zap className="w-3 h-3" /> Popular
                    </div>
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="px-3 py-1 bg-gold text-void text-xs font-bold rounded-full">Current Plan</div>
                  </div>
                )}
                <div className={`font-display font-semibold mb-1 ${isDark ? 'text-ink' : 'text-light-text'}`}>{plan.tier}</div>
                <div className={`text-xs mb-3 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>{plan.label}</div>
                <div className="font-display text-2xl font-bold text-gold mb-4">${plan.price}</div>
                <div className="space-y-2 mb-5">
                  {plan.features.filter((f) => f.included).slice(0, 3).map((f) => (
                    <div key={f.name} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className={`text-xs ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>{f.name}</span>
                    </div>
                  ))}
                </div>
                <button className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isCurrent
                    ? isDark ? 'bg-void-lighter text-ink-muted cursor-default' : 'bg-light-surface-2 text-light-text-muted cursor-default'
                    : 'bg-gradient-to-r from-maroon to-gold text-white hover:opacity-90 btn-press shadow-md shadow-maroon/20'
                }`}>
                  {isCurrent ? 'Current' : <span className="flex items-center justify-center gap-1.5">Select <ArrowRight className="w-3.5 h-3.5" /></span>}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Billing History */}
      <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}>
        <div className={`px-5 py-4 border-b ${isDark ? 'border-void-border' : 'border-light-border'}`}>
          <h3 className={`font-display font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>Billing History</h3>
        </div>
        <div className={`divide-y ${isDark ? 'divide-void-border' : 'divide-light-border'}`}>
          {[
            { date: 'May 1, 2026', plan: 'Standard Plan · 60 days', amount: '$39.00', status: 'Paid' },
            { date: 'Feb 28, 2026', plan: 'Basic Plan · 30 days', amount: '$19.00', status: 'Paid' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3.5">
              <div>
                <div className={`text-sm font-medium ${isDark ? 'text-ink' : 'text-light-text'}`}>{item.plan}</div>
                <div className={`text-xs mt-0.5 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>{item.date}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full">{item.status}</span>
                <span className={`text-sm font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>{item.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
