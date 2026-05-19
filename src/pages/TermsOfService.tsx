import { Link } from 'react-router-dom';
import {
  HeartHandshake, ArrowLeft, FileText, Users, CreditCard, Shield,
  AlertTriangle, Scale, MessageCircle
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const sections = [
  {
    icon: FileText,
    title: 'Acceptance of Terms',
    content: [
      'By accessing or using The Care Crew platform, you agree to be bound by these Terms of Service.',
      'If you do not agree to these terms, you must not use our services.',
      'We reserve the right to modify these terms at any time. Changes take effect immediately upon posting.',
      'Continued use of the platform after changes constitutes acceptance of the revised terms.',
    ],
  },
  {
    icon: Users,
    title: 'User Accounts',
    content: [
      'You must be at least 18 years old to create an account.',
      'You are responsible for maintaining the confidentiality of your account credentials.',
      'You agree to provide accurate, current, and complete information during registration.',
      'You may not create multiple accounts or use another person\'s identity.',
      'We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.',
    ],
  },
  {
    icon: Shield,
    title: 'User Conduct',
    content: [
      'You agree not to post false, misleading, or defamatory content.',
      'You may not harass, discriminate against, or threaten other users.',
      'You may not use the platform for illegal activities including fraud, trafficking, or exploitation.',
      'You may not attempt to bypass security measures or access unauthorized data.',
      'You may not scrape, copy, or redistribute content from the platform without permission.',
    ],
  },
  {
    icon: CreditCard,
    title: 'Payments & Refunds',
    content: [
      'All payments are processed in USD through secure, PCI-compliant payment processors.',
      'Subscription fees are one-time charges unless otherwise stated.',
      'Job posting fees grant visibility for the selected duration only.',
      'All sales are final. Refunds are not guaranteed but may be issued at our discretion for exceptional cases.',
      'Failed payments may result in immediate suspension of services.',
      'Prices are subject to change with notice.',
    ],
  },
  {
    icon: Scale,
    title: 'Disclaimers & Liability',
    content: [
      'The Care Crew is a marketplace connecting families and caregivers. We do not employ caregivers directly.',
      'We do not guarantee the accuracy of user-provided information, including credentials, experience, or background checks.',
      'We strongly recommend that families conduct their own interviews, reference checks, and background screenings.',
      'The Care Crew is not liable for any disputes, damages, or injuries arising from employment relationships formed through the platform.',
      'We are not responsible for lost data, service interruptions, or technical errors beyond our reasonable control.',
    ],
  },
  {
    icon: AlertTriangle,
    title: 'Termination',
    content: [
      'Either party may terminate the account relationship at any time.',
      'We may suspend or terminate your account immediately for violations of these terms.',
      'Upon termination, your right to use the platform ceases immediately.',
      'Certain provisions (liability, indemnification, dispute resolution) survive termination.',
    ],
  },
  {
    icon: MessageCircle,
    title: 'Dispute Resolution',
    content: [
      'Any disputes arising from these terms shall first be addressed through informal negotiation.',
      'If unresolved, disputes shall be settled through binding arbitration in Halifax, Nova Scotia, Canada.',
      'You waive any right to participate in class action lawsuits against The Care Crew.',
      'These terms are governed by the laws of Nova Scotia, Canada, without regard to conflict of law principles.',
    ],
  },
];

export default function TermsOfService() {
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
              <Scale className="w-3.5 h-3.5" /> Legal
            </span>
            <h1 className={`font-display text-4xl md:text-5xl font-semibold leading-tight mb-4 ${isDark ? 'text-ink' : 'text-light-text'}`}>
              Terms of Service
            </h1>
            <p className={`text-sm ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
              Last updated: January 1, 2025
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <p className={`text-sm leading-relaxed mb-10 ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>
          Welcome to The Care Crew. These Terms of Service govern your use of our website, mobile applications, and services. Please read them carefully. If you have any questions, contact us before using the platform.
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
            By using The Care Crew, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree, please discontinue use of the platform immediately.
          </p>
        </div>
      </main>
    </div>
  );
}
