import { Link } from 'react-router-dom';
import {
  HeartHandshake, ArrowLeft, Check, Star, Briefcase, Zap, FileText
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { CONTACT_PLANS, LISTING_PLANS } from '../context/SubscriptionContext';


const CONTACT_FEATURES = [
  'View phone numbers \u0026 emails',
  'Contact unlimited caregivers',
  'Contact unlimited families',
  'Priority support',
  'Cancel anytime',
];


export default function Pricing() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-void' : 'bg-light-bg'}`}>
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors ${
        isDark ? 'bg-void/90 border-void-border' : 'bg-white/80 border-light-border'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-maroon to-gold flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-maroon/20">
              <HeartHandshake className="w-5 h-5 text-white" />
            </div>
            <span className={`font-display text-xl font-semibold tracking-tight ${isDark ? 'text-ink' : 'text-light-text'}`}>
              The Care Crew
            </span>
          </Link>
          <Link to="/" className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            isDark ? 'text-ink-light hover:text-gold' : 'text-light-text-2 hover:text-maroon'
          }`}>
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </header>

      <section className={`relative overflow-hidden ${isDark ? 'bg-void-light' : 'bg-light-surface-2'}`}>
        <div className="absolute inset-0 pattern-diagonal opacity-60" />
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 relative">
          <div className="max-w-2xl mx-auto text-center">
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-5 ${
              isDark ? 'bg-gold/10 text-gold border border-gold/20' : 'bg-maroon/10 text-maroon border border-maroon/20'
            }`}>
              <Zap className="w-3.5 h-3.5" /> Simple Pricing
            </span>
            <h1 className={`font-display text-4xl md:text-5xl font-semibold leading-tight mb-4 ${isDark ? 'text-ink' : 'text-light-text'}`}>
              Transparent pricing for everyone
            </h1>
            <p className={`text-lg leading-relaxed ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>
              No hidden fees. Choose the plan that works for you — whether you are hiring or looking for work.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Contact Unlock Plans */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Briefcase className={`w-5 h-5 ${isDark ? 'text-gold' : 'text-maroon'}`} />
              <h2 className={`font-display text-2xl md:text-3xl font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
                For Caregivers & Families
              </h2>
            </div>
            <p className={`text-sm max-w-md mx-auto ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>
              Unlock contact details to connect directly with caregivers or families. One subscription covers both.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CONTACT_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-2xl border p-6 transition-colors ${
                  plan.popular
                    ? 'bg-gradient-to-b from-gold/10 to-transparent border-gold shadow-lg shadow-gold/10'
                    : isDark
                      ? 'bg-void border-void-border hover:border-void-lighter'
                      : 'bg-white border-light-border hover:border-maroon/20'
                }`}
              >
                {plan.popular && (
                  <div className="flex items-center gap-1 text-xs text-gold mb-3">
                    <Star className="w-3 h-3 fill-gold" /> Most Popular
                  </div>
                )}
                <div className={`font-display text-lg font-semibold mb-1 ${isDark ? 'text-ink' : 'text-light-text'}`}>
                  {plan.label}
                </div>
                <div className={`text-sm mb-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                  {plan.durationDays} days access
                </div>
                <div className={`font-display text-4xl font-bold mb-6 ${isDark ? 'text-ink' : 'text-light-text'}`}>
                  ${plan.price}
                </div>
                <ul className="space-y-3 mb-6">
                  {CONTACT_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${isDark ? 'text-gold' : 'text-maroon'}`} />
                      <span className={`text-sm ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full py-3 bg-gradient-to-r from-maroon to-gold text-white text-sm font-medium rounded-xl transition-all btn-press">
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Freelance Listing Plans */}
        <div>
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <FileText className={`w-5 h-5 ${isDark ? 'text-gold' : 'text-maroon'}`} />
              <h2 className={`font-display text-2xl md:text-3xl font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
                Freelance Listings
              </h2>
            </div>
            <p className={`text-sm max-w-md mx-auto ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>
              One subscription for both — families post their freelance care needs, caregivers post their availability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LISTING_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-2xl border p-6 transition-colors ${
                  plan.popular
                    ? 'bg-gradient-to-b from-gold/10 to-transparent border-gold shadow-lg shadow-gold/10'
                    : isDark
                      ? 'bg-void border-void-border hover:border-void-lighter'
                      : 'bg-white border-light-border hover:border-maroon/20'
                }`}
              >
                {plan.popular && (
                  <div className="flex items-center gap-1 text-xs text-gold mb-3">
                    <Star className="w-3 h-3 fill-gold" /> Most Popular
                  </div>
                )}
                <div className={`font-display text-lg font-semibold mb-1 ${isDark ? 'text-ink' : 'text-light-text'}`}>
                  {plan.tier}
                </div>
                <div className={`text-sm mb-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                  {plan.durationDays} days visibility
                </div>
                <div className={`font-display text-4xl font-bold mb-6 ${isDark ? 'text-ink' : 'text-light-text'}`}>
                  ${plan.price}
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((f) => (
                    <li key={f.name} className={`flex items-start gap-2.5 ${!f.included ? 'opacity-40' : ''}`}>
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${f.included ? isDark ? 'text-gold' : 'text-maroon' : isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                      <span className={`text-sm ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>{f.name}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full py-3 bg-gradient-to-r from-maroon to-gold text-white text-sm font-medium rounded-xl transition-all btn-press">
                  Get Started
                </button>
              </div>
            ))}
          </div>

          {/* Note */}
          <p className={`text-center text-xs mt-6 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
            One listing slot per subscription · Edit your listing freely at any time · No auto-renewal
          </p>
        </div>

        {/* FAQ */}
        <div className={`mt-20 rounded-2xl border p-8 ${isDark ? 'bg-void border-void-border' : 'bg-white border-light-border'}`}>
          <h3 className={`font-display text-xl font-semibold mb-6 text-center ${isDark ? 'text-ink' : 'text-light-text'}`}>Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { q: 'Can I cancel my subscription?', a: 'Yes, you can cancel anytime. Your access continues until the end of your billing period.' },
              { q: 'Is the contact subscription one-time or recurring?', a: 'It is a one-time payment. No auto-renewal. You choose when to extend.' },
              { q: 'What payment methods are accepted?', a: 'We accept all major credit and debit cards (Visa, Mastercard, Amex).' },
              { q: 'Do you offer refunds?', a: 'Due to the digital nature of our service, all sales are final. Contact support for exceptional cases.' },
              { q: 'Can I switch plans?', a: 'Yes, you can upgrade or purchase a new plan at any time.' },
              { q: 'Is my payment information secure?', a: 'Yes. We do not store card details. All payments are processed through secure, PCI-compliant providers.' },
            ].map((faq) => (
              <div key={faq.q}>
                <div className={`font-medium text-sm mb-1 ${isDark ? 'text-ink' : 'text-light-text'}`}>{faq.q}</div>
                <div className={`text-sm ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
