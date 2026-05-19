import { Link } from 'react-router-dom';
import {
  Shield, HeartHandshake, ArrowLeft, CheckCircle, AlertTriangle,
  Lock, Eye, Phone, FileText, Users, Home, Clock, Star, MessageCircle, Mail
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const familyTips = [
  {
    icon: Shield,
    title: 'Verify Identity & Credentials',
    points: [
      'Request government-issued photo ID before any in-person meeting.',
      'Verify CPR, First Aid, and any professional certifications directly with the issuing organization.',
      'Conduct a background check through a reputable service.',
      'Ask for and contact at least 2–3 professional references.',
    ],
  },
  {
    icon: Eye,
    title: 'Interview Thoroughly',
    points: [
      'Conduct an initial video interview before inviting anyone to your home.',
      'Ask scenario-based questions relevant to your care needs (e.g., "What would you do if my child fell?").',
      'Discuss boundaries, discipline philosophy, and household rules upfront.',
      'Observe how the caregiver interacts with your loved one during a paid trial session.',
    ],
  },
  {
    icon: Home,
    title: 'Safe Home Environment',
    points: [
      'Never leave valuables, firearms, or sensitive documents accessible.',
      'Install security cameras in common areas (disclose this to the caregiver).',
      'Keep emergency contacts, medical info, and house rules in a visible place.',
      'Ensure smoke detectors, carbon monoxide alarms, and first-aid kits are functional.',
    ],
  },
  {
    icon: FileText,
    title: 'Written Agreement',
    points: [
      'Draft a clear contract covering duties, hours, pay, overtime, and termination terms.',
      'Specify payment method, frequency, and any tax responsibilities.',
      'Include a confidentiality clause to protect your family\'s privacy.',
      'Both parties should sign and retain a copy of the agreement.',
    ],
  },
  {
    icon: Clock,
    title: 'Trial Period & Check-Ins',
    points: [
      'Start with a 2–4 week trial period to evaluate fit.',
      'Schedule regular check-ins (weekly at first, then monthly).',
      'Encourage open communication and address concerns immediately.',
      'Be prepared to end the arrangement if red flags appear.',
    ],
  },
  {
    icon: Lock,
    title: 'Protect Personal Information',
    points: [
      'Do not share banking details, passwords, or security codes.',
      'Use a separate Wi-Fi network or guest access for caregivers.',
      'Limit access to personal devices and accounts.',
      'Review privacy settings on smart home devices.',
    ],
  },
];

const caregiverTips = [
  {
    icon: Shield,
    title: 'Verify the Family & Job',
    points: [
      'Research the family online and verify their identity before accepting a position.',
      'Ensure the job description matches what was discussed in the interview.',
      'Be wary of families who refuse to meet in person or conduct video interviews.',
      'Never pay any fees to secure a job — legitimate families do not charge caregivers.',
    ],
  },
  {
    icon: Phone,
    title: 'Meet Safely',
    points: [
      'For the first meeting, choose a public place or bring a friend/family member.',
      'Share the family\'s address and your expected return time with someone you trust.',
      'Trust your instincts — if something feels off, do not proceed.',
      'Use The Care Crew\'s messaging system for all initial communication.',
    ],
  },
  {
    icon: FileText,
    title: 'Get Everything in Writing',
    points: [
      'Insist on a written contract before starting work.',
      'Clarify pay rate, schedule, duties, overtime, and time-off policies.',
      'Keep records of hours worked and payments received.',
      'Understand your tax obligations (W-2 employee vs. 1099 independent contractor).',
    ],
  },
  {
    icon: Users,
    title: 'Know Your Rights',
    points: [
      'In the USA, domestic workers have rights under the Fair Labor Standards Act (FLSA).',
      'In Canada, caregivers are protected under provincial employment standards.',
      'You are entitled to minimum wage, overtime pay, and safe working conditions.',
      'Report any abuse, harassment, or unsafe conditions to the appropriate authorities.',
    ],
  },
  {
    icon: Star,
    title: 'Maintain Professional Boundaries',
    points: [
      'Keep personal relationships separate from your professional role.',
      'Do not share your home address or personal financial information.',
      'Set clear boundaries around social media and photography of the family.',
      'Respect the family\'s privacy and confidentiality at all times.',
    ],
  },
  {
    icon: AlertTriangle,
    title: 'Red Flags to Watch For',
    points: [
      'Families who ask you to work "off the books" without a contract.',
      'Requests to perform duties far outside the agreed scope (e.g., construction, financial tasks).',
      'Any form of verbal, physical, or emotional abuse — document and report immediately.',
      'Pressure to start immediately without an interview or background check.',
    ],
  },
];

const legalNotes = [
  {
    title: 'USA — Fair Labor Standards Act (FLSA)',
    desc: 'Domestic workers (nannies, housekeepers, caregivers) are entitled to federal minimum wage and overtime pay (1.5x after 40 hours/week). Some live-in workers may be exempt from overtime under specific conditions.',
  },
  {
    title: 'USA — State-Specific Laws',
    desc: 'States like California, New York, and Massachusetts have additional protections including paid sick leave, rest breaks, and domestic workers\' bills of rights. Check your state\'s labor department website.',
  },
  {
    title: 'Canada — Provincial Employment Standards',
    desc: 'Each province sets minimum wage, overtime rules, and vacation pay. Caregivers on the Home Child Care Provider or Home Support Worker pilot programs have specific immigration and employment requirements.',
  },
  {
    title: 'Background Checks',
    desc: 'In both USA and Canada, employers should obtain written consent before conducting background checks. Caregivers have the right to review and dispute inaccurate findings under the Fair Credit Reporting Act (USA) and PIPEDA (Canada).',
  },
  {
    title: 'Tax Compliance',
    desc: 'In the USA, household employers who pay a caregiver $2,700+ per year (2024 threshold) must pay Social Security, Medicare, and unemployment taxes. In Canada, caregivers may need to register for a SIN and file annual tax returns.',
  },
  {
    title: 'Workplace Safety',
    desc: 'OSHA (USA) and provincial occupational health agencies (Canada) protect domestic workers from hazardous conditions. Report unsafe environments to OSHA (1-800-321-OSHA) or your provincial ministry of labour.',
  },
];

export default function SafetyTips() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-void' : 'bg-light-bg'}`}>
      {/* Header */}
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

          <Link
            to="/"
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              isDark ? 'text-ink-light hover:text-gold' : 'text-light-text-2 hover:text-maroon'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className={`relative overflow-hidden ${isDark ? 'bg-void-light' : 'bg-light-surface-2'}`}>
        <div className="absolute inset-0 pattern-diagonal opacity-60" />
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 relative">
          <div className="max-w-2xl">
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-5 ${
              isDark ? 'bg-gold/10 text-gold border border-gold/20' : 'bg-maroon/10 text-maroon border border-maroon/20'
            }`}>
              <Shield className="w-3.5 h-3.5" />
              Your Safety Matters
            </span>
            <h1 className={`font-display text-4xl md:text-5xl font-semibold leading-tight mb-4 ${isDark ? 'text-ink' : 'text-light-text'}`}>
              Safety Tips for Families & Caregivers
            </h1>
            <p className={`text-lg leading-relaxed mb-8 ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>
              Building trust starts with safety. Follow these guidelines to protect yourself, your loved ones, and your home when hiring or working as a caregiver.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* For Families */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-10">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-maroon/20' : 'bg-maroon/10'}`}>
              <Home className={`w-5 h-5 ${isDark ? 'text-gold' : 'text-maroon'}`} />
            </div>
            <h2 className={`font-display text-2xl md:text-3xl font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
              For Families Hiring Caregivers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {familyTips.map((tip) => (
              <div
                key={tip.title}
                className={`rounded-2xl border p-6 transition-colors ${
                  isDark
                    ? 'bg-void border-void-border hover:border-void-lighter'
                    : 'bg-white border-light-border hover:border-maroon/20'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                  isDark ? 'bg-void-lighter' : 'bg-light-surface-2'
                }`}>
                  <tip.icon className={`w-5 h-5 ${isDark ? 'text-gold' : 'text-maroon'}`} />
                </div>
                <h3 className={`font-display text-lg font-semibold mb-4 ${isDark ? 'text-ink' : 'text-light-text'}`}>
                  {tip.title}
                </h3>
                <ul className="space-y-3">
                  {tip.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle className={`w-4 h-4 mt-0.5 shrink-0 ${isDark ? 'text-gold' : 'text-maroon'}`} />
                      <span className={`text-sm leading-relaxed ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* For Caregivers */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-10">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-maroon/20' : 'bg-maroon/10'}`}>
              <Users className={`w-5 h-5 ${isDark ? 'text-gold' : 'text-maroon'}`} />
            </div>
            <h2 className={`font-display text-2xl md:text-3xl font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
              For Caregivers Seeking Work
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caregiverTips.map((tip) => (
              <div
                key={tip.title}
                className={`rounded-2xl border p-6 transition-colors ${
                  isDark
                    ? 'bg-void border-void-border hover:border-void-lighter'
                    : 'bg-white border-light-border hover:border-maroon/20'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                  isDark ? 'bg-void-lighter' : 'bg-light-surface-2'
                }`}>
                  <tip.icon className={`w-5 h-5 ${isDark ? 'text-gold' : 'text-maroon'}`} />
                </div>
                <h3 className={`font-display text-lg font-semibold mb-4 ${isDark ? 'text-ink' : 'text-light-text'}`}>
                  {tip.title}
                </h3>
                <ul className="space-y-3">
                  {tip.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle className={`w-4 h-4 mt-0.5 shrink-0 ${isDark ? 'text-gold' : 'text-maroon'}`} />
                      <span className={`text-sm leading-relaxed ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Legal & Compliance */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-10">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-maroon/20' : 'bg-maroon/10'}`}>
              <FileText className={`w-5 h-5 ${isDark ? 'text-gold' : 'text-maroon'}`} />
            </div>
            <h2 className={`font-display text-2xl md:text-3xl font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
              Legal & Compliance (USA & Canada)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {legalNotes.map((note) => (
              <div
                key={note.title}
                className={`rounded-2xl border p-6 transition-colors ${
                  isDark
                    ? 'bg-void border-void-border hover:border-void-lighter'
                    : 'bg-white border-light-border hover:border-maroon/20'
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <AlertTriangle className={`w-5 h-5 mt-0.5 shrink-0 ${isDark ? 'text-gold' : 'text-maroon'}`} />
                  <h3 className={`font-display text-lg font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
                    {note.title}
                  </h3>
                </div>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>
                  {note.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className={`text-center py-16 rounded-2xl border mt-16 ${
          isDark ? 'bg-void-light border-void-border' : 'bg-light-surface-2 border-light-border'
        }`}>
          <MessageCircle className={`w-10 h-10 mx-auto mb-4 ${isDark ? 'text-gold' : 'text-maroon'}`} />
          <h3 className={`font-display text-2xl font-semibold mb-3 ${isDark ? 'text-ink' : 'text-light-text'}`}>
            Have a safety concern?
          </h3>
          <p className={`text-sm mb-6 max-w-md mx-auto ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>
            If you experience or witness anything that violates our safety guidelines, please report it to us immediately.
          </p>
          <a
            href="mailto:kanwaljeet0304@gmail.com?subject=Safety%20Concern%20Report"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-gradient-to-r from-maroon to-gold text-white transition-all btn-press"
          >
            <Mail className="w-4 h-4" />
            Report a Concern
          </a>
        </div>
      </main>
    </div>
  );
}
