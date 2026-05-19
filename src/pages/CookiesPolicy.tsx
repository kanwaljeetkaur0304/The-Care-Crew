import { Link } from 'react-router-dom';
import {
  HeartHandshake, ArrowLeft, Cookie, Settings, Eye, Database,
  Clock, Shield, Mail
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const cookieTypes = [
  {
    icon: Settings,
    title: 'Essential Cookies',
    desc: 'Required for the platform to function. These enable core features like account login, security, and session management. You cannot disable these.',
    examples: ['Session tokens', 'CSRF protection', 'Authentication state'],
  },
  {
    icon: Eye,
    title: 'Analytics Cookies',
    desc: 'Help us understand how visitors interact with our platform by collecting anonymous usage data. This helps us improve performance and user experience.',
    examples: ['Page views', 'Time on site', 'Feature usage', 'Error tracking'],
  },
  {
    icon: Database,
    title: 'Preference Cookies',
    desc: 'Remember your settings and preferences so you do not have to reconfigure them on every visit.',
    examples: ['Theme selection (light/dark)', 'Location preference', 'Language settings', 'Filter preferences'],
  },
];

const managementOptions = [
  {
    icon: Clock,
    title: 'Cookie Duration',
    content: [
      'Session cookies expire when you close your browser.',
      'Persistent cookies remain for a set period (up to 1 year) to remember preferences and login status.',
      'You can clear all cookies through your browser settings at any time.',
    ],
  },
  {
    icon: Shield,
    title: 'Your Choices',
    content: [
      'You can manage or disable non-essential cookies through your browser settings.',
      'Chrome: Settings → Privacy and security → Cookies and other site data.',
      'Safari: Preferences → Privacy → Manage website data.',
      'Firefox: Preferences → Privacy & Security → Cookies and Site Data.',
      'Note: Disabling cookies may affect platform functionality.',
    ],
  },
  {
    icon: Mail,
    title: 'Contact Us',
    content: [
      'If you have questions about our cookie practices, contact us at:',
      'Email: kanwaljeet0304@gmail.com',
      'Phone: +1 (902) 489-2122',
      'We respect your privacy and are committed to transparency in all data practices.',
    ],
  },
];

export default function CookiesPolicy() {
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
            <span className={`font-display text-xl font-semibold tracking-tight ${isDark ? 'text-ink' : 'text-light-text'}`}>The Care Crew</span>
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
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20 relative">
          <div className="text-center">
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-5 ${
              isDark ? 'bg-gold/10 text-gold border border-gold/20' : 'bg-maroon/10 text-maroon border border-maroon/20'
            }`}>
              <Cookie className="w-3.5 h-3.5" /> Transparency
            </span>
            <h1 className={`font-display text-4xl md:text-5xl font-semibold leading-tight mb-4 ${isDark ? 'text-ink' : 'text-light-text'}`}>
              Cookies Policy
            </h1>
            <p className={`text-sm ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
              Last updated: January 1, 2025
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <p className={`text-sm leading-relaxed mb-10 ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>
          This Cookies Policy explains how The Care Crew uses cookies and similar technologies to recognize you when you visit our platform. It explains what these technologies are, why we use them, and your rights to control their use.
        </p>

        <div className="mb-10">
          <h2 className={`font-display text-xl font-semibold mb-4 ${isDark ? 'text-ink' : 'text-light-text'}`}>What Are Cookies?</h2>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>
            Cookies are small text files placed on your device by websites you visit. They are widely used to make websites work more efficiently, as well as to provide information to the site owners. We also use localStorage for storing preferences like theme selection and location.
          </p>
        </div>

        <div className="space-y-8 mb-12">
          {cookieTypes.map((type) => (
            <div
              key={type.title}
              className={`rounded-2xl border p-6 transition-colors ${
                isDark
                  ? 'bg-void border-void-border hover:border-void-lighter'
                  : 'bg-white border-light-border hover:border-maroon/20'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? 'bg-void-lighter' : 'bg-light-surface-2'}`}>
                  <type.icon className={`w-4.5 h-4.5 ${isDark ? 'text-gold' : 'text-maroon'}`} />
                </div>
                <h3 className={`font-display text-lg font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>{type.title}</h3>
              </div>
              <p className={`text-sm leading-relaxed mb-3 ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>{type.desc}</p>
              <div className="flex flex-wrap gap-2">
                {type.examples.map((ex) => (
                  <span
                    key={ex}
                    className={`px-2.5 py-1 rounded-lg text-xs border ${
                      isDark
                        ? 'bg-void-lighter text-ink-light border-void-border'
                        : 'bg-light-surface-2 text-light-text-2 border-light-border'
                    }`}
                  >
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-10">
          {managementOptions.map((section) => (
            <div key={section.title}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? 'bg-void-lighter' : 'bg-light-surface-2'}`}>
                  <section.icon className={`w-4.5 h-4.5 ${isDark ? 'text-gold' : 'text-maroon'}`} />
                </div>
                <h2 className={`font-display text-xl font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>{section.title}</h2>
              </div>
              <ul className="space-y-2 pl-12">
                {section.content.map((item, i) => (
                  <li key={i} className={`text-sm leading-relaxed ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={`mt-16 pt-8 border-t ${isDark ? 'border-void-border' : 'border-light-border'}`}>
          <p className={`text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
            We may update this Cookies Policy from time to time to reflect changes in technology or legal requirements. Continued use of The Care Crew after updates constitutes acceptance of the revised policy.
          </p>
        </div>
      </main>
    </div>
  );
}
