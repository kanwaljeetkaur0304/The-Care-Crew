import { Link } from 'react-router-dom';
import { HeartHandshake, ArrowLeft, Shield, Eye, Database, Share2, Lock, Mail } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const sections = [
  {
    icon: Eye,
    title: 'Information We Collect',
    content: [
      'Personal Information: name, email address, phone number, mailing address, and profile photo.',
      'Professional Information: work history, certifications, skills, availability, and expected salary.',
      'Usage Data: IP address, browser type, pages visited, time spent on site, and referring URLs.',
      'Device Information: device type, operating system, and unique device identifiers.',
      'Location Data: city and state provided by you or inferred from your IP address.',
      'Payment Information: credit card details processed securely by our PCI-compliant payment processor. We do not store full card numbers.',
    ],
  },
  {
    icon: Database,
    title: 'How We Use Your Information',
    content: [
      'To create and manage your account and profile.',
      'To connect families with caregivers and facilitate job postings.',
      'To process payments for subscriptions and job postings.',
      'To send service-related notifications, updates, and security alerts.',
      'To improve our platform, fix bugs, and develop new features.',
      'To comply with legal obligations and enforce our Terms of Service.',
      'To prevent fraud, abuse, and unauthorized access.',
    ],
  },
  {
    icon: Share2,
    title: 'Information Sharing',
    content: [
      'We do not sell your personal information to third parties.',
      'Your contact details (email and phone) are only shared with subscribed users who have purchased a contact unlock plan.',
      'We share data with trusted service providers: payment processors, hosting providers, and analytics services — all under strict confidentiality agreements.',
      'We may disclose information if required by law, court order, or to protect our rights and safety.',
      'In the event of a merger or acquisition, user data may be transferred to the new entity with notice.',
    ],
  },
  {
    icon: Lock,
    title: 'Data Security',
    content: [
      'All data is transmitted over HTTPS with TLS encryption.',
      'Passwords are hashed using industry-standard algorithms.',
      'Payment information is processed through PCI-DSS compliant gateways; we never store full card details.',
      'We conduct regular security audits and vulnerability assessments.',
      'Access to user data is restricted to authorized personnel only.',
    ],
  },
  {
    icon: Shield,
    title: 'Your Rights',
    content: [
      'Access: request a copy of the personal data we hold about you.',
      'Correction: update or correct inaccurate information in your profile.',
      'Deletion: request deletion of your account and associated data (subject to legal retention requirements).',
      'Opt-out: unsubscribe from marketing emails at any time.',
      'Data portability: request your data in a machine-readable format.',
      'For California residents: additional rights under CCPA including the right to know, delete, and opt-out of sale (we do not sell data).',
      'For Canadian residents: rights under PIPEDA including access, correction, and withdrawal of consent.',
    ],
  },
  {
    icon: Mail,
    title: 'Contact Us',
    content: [
      'If you have questions about this Privacy Policy or wish to exercise your rights, contact us at:',
      'Email: kanwaljeet0304@gmail.com',
      'Phone: +1 (902) 489-2122',
      'Address: Halifax, Nova Scotia, Canada',
      'We aim to respond to all privacy-related inquiries within 30 business days.',
    ],
  },
];

export default function PrivacyPolicy() {
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
              <Shield className="w-3.5 h-3.5" /> Legal
            </span>
            <h1 className={`font-display text-4xl md:text-5xl font-semibold leading-tight mb-4 ${isDark ? 'text-ink' : 'text-light-text'}`}>
              Privacy Policy
            </h1>
            <p className={`text-sm ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
              Last updated: January 1, 2025
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <p className={`text-sm leading-relaxed mb-10 ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>
          The Care Crew ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and safeguard your personal information when you use our platform. By using The Care Crew, you agree to the practices described in this policy.
        </p>

        <div className="space-y-10">
          {sections.map((section) => (
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
            This Privacy Policy may be updated from time to time. We will notify users of material changes via email or a prominent notice on our platform. Continued use of The Care Crew after changes constitutes acceptance of the updated policy.
          </p>
        </div>
      </main>
    </div>
  );
}
