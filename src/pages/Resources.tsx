import { Link } from 'react-router-dom';
import {
  HeartHandshake, ArrowLeft, BookOpen, Scale, GraduationCap,
  Users, Globe, Shield, FileText, Heart, Phone, ExternalLink
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const resources = [
  {
    icon: Scale,
    title: 'Legal Rights & Protections',
    items: [
      { label: 'USA Fair Labor Standards Act (FLSA)', desc: 'Minimum wage, overtime, and record-keeping requirements for domestic workers.', url: 'https://www.dol.gov/agencies/whd' },
      { label: 'USA Domestic Workers Bill of Rights', desc: 'State-specific protections in NY, CA, MA, IL, and other states.', url: 'https://www.domesticworkers.org' },
      { label: 'Canada Provincial Employment Standards', desc: 'Minimum wage, vacation pay, and termination rules by province.', url: 'https://www.canada.ca/en/employment-social-development.html' },
      { label: 'Workplace Safety (OSHA / Provincial)', desc: 'Rights to a safe workplace and how to report hazards.', url: 'https://www.osha.gov' },
    ],
  },
  {
    icon: GraduationCap,
    title: 'Training & Certification',
    items: [
      { label: 'Red Cross CPR / First Aid', desc: 'Nationally recognized certification for caregivers.', url: 'https://www.redcross.org/take-a-class/cpr' },
      { label: 'Newborn Care Specialist Certification', desc: 'Specialized training for infant and newborn care.', url: 'https://www.nannycertification.com' },
      { label: 'INA Nanny Credential Exam', desc: 'International Nanny Association professional credential.', url: 'https://nanny.org' },
      { label: 'ServSafe Food Handler', desc: 'Essential food safety certification for cooks and chefs.', url: 'https://www.servsafe.com' },
    ],
  },
  {
    icon: Users,
    title: 'Community & Support',
    items: [
      { label: 'International Nanny Association (INA)', desc: 'Professional network, conferences, and job resources.', url: 'https://nanny.org' },
      { label: 'National Domestic Workers Alliance', desc: 'Advocacy, benefits, and community for domestic workers.', url: 'https://www.domesticworkers.org' },
      { label: 'Caregiver Action Network', desc: 'Support and resources for family caregivers.', url: 'https://caregiveraction.org' },
      { label: 'South Asian Community Centers', desc: 'Cultural support, legal aid, and networking in your city.', url: '#' },
    ],
  },
  {
    icon: Globe,
    title: 'Immigration & Work Authorization',
    items: [
      { label: 'USA Work Visa Options', desc: 'H-2B, J-1 Au Pair, and other visa pathways for caregivers.', url: 'https://travel.state.gov/content/travel/en/us-visas/employment.html' },
      { label: 'Canada Caregiver Pilot Programs', desc: 'Home Child Care Provider and Home Support Worker pathways to PR.', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/caregivers.html' },
      { label: 'Tax ID & SSN Requirements', desc: 'How to get an ITIN or SIN for tax reporting.', url: 'https://www.irs.gov/individuals/international-taxpayers/taxpayer-identification-numbers-tin' },
      { label: 'Employment Authorization (EAD)', desc: 'How to apply for or renew work authorization in the USA.', url: 'https://www.uscis.gov/working-in-the-united-states' },
    ],
  },
  {
    icon: Shield,
    title: 'Safety & Background Checks',
    items: [
      { label: 'Background Check Services', desc: 'Trusted providers for caregiver background screening.', url: 'https://www.carecheck.com' },
      { label: 'National Sex Offender Registry', desc: 'Free public search for safety verification.', url: 'https://www.nsopw.gov' },
      { label: 'Elder Abuse Reporting', desc: 'How to recognize and report elder abuse in USA & Canada.', url: 'https://ncea.acl.gov' },
      { label: 'Child Safety Guidelines', desc: 'Best practices for keeping children safe in your care.', url: 'https://www.childwelfare.gov' },
    ],
  },
  {
    icon: FileText,
    title: 'Contracts & Tax Help',
    items: [
      { label: 'Sample Employment Contract', desc: 'Free template for caregiver-family agreements.', url: '#' },
      { label: 'USA Household Employer Taxes', desc: 'Nanny tax calculator and filing guide (IRS).', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/household-employers' },
      { label: 'Canada Payroll Deductions', desc: 'CPP, EI, and income tax requirements for household employers.', url: 'https://www.canada.ca/en/revenue-agency.html' },
      { label: '1099 vs W-2 Guide', desc: 'Understand your tax classification as a caregiver.', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/independent-contractor-self-employed-or-employee' },
    ],
  },
];

export default function Resources() {
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
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 relative">
          <div className="max-w-2xl mx-auto text-center">
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-5 ${
              isDark ? 'bg-gold/10 text-gold border border-gold/20' : 'bg-maroon/10 text-maroon border border-maroon/20'
            }`}>
              <BookOpen className="w-3.5 h-3.5" /> Helpful Links
            </span>
            <h1 className={`font-display text-4xl md:text-5xl font-semibold leading-tight mb-4 ${isDark ? 'text-ink' : 'text-light-text'}`}>
              Caregiver Resources
            </h1>
            <p className={`text-lg leading-relaxed ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>
              Everything you need to succeed as a caregiver — from legal rights and certifications to community support and tax guidance.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {resources.map((section) => (
            <div
              key={section.title}
              className={`rounded-2xl border p-6 transition-colors ${
                isDark
                  ? 'bg-void border-void-border hover:border-void-lighter'
                  : 'bg-white border-light-border hover:border-maroon/20'
              }`}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-void-lighter' : 'bg-light-surface-2'}`}>
                  <section.icon className={`w-5 h-5 ${isDark ? 'text-gold' : 'text-maroon'}`} />
                </div>
                <h2 className={`font-display text-xl font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>{section.title}</h2>
              </div>

              <div className="space-y-4">
                {section.items.map((item) => (
                  <a
                    key={item.label}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-start gap-3 p-3 rounded-xl transition-colors group ${
                      isDark ? 'hover:bg-void-lighter' : 'hover:bg-light-surface-2'
                    }`}
                  >
                    <ExternalLink className={`w-4 h-4 mt-0.5 shrink-0 ${isDark ? 'text-ink-muted group-hover:text-gold' : 'text-light-text-muted group-hover:text-maroon'}`} />
                    <div>
                      <div className={`text-sm font-medium ${isDark ? 'text-ink group-hover:text-gold' : 'text-light-text group-hover:text-maroon'}`}>{item.label}</div>
                      <div className={`text-xs mt-0.5 ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>{item.desc}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={`mt-16 text-center py-12 rounded-2xl border ${isDark ? 'bg-void border-void-border' : 'bg-white border-light-border'}`}>
          <Heart className={`w-10 h-10 mx-auto mb-4 ${isDark ? 'text-gold' : 'text-maroon'}`} />
          <h3 className={`font-display text-2xl font-semibold mb-3 ${isDark ? 'text-ink' : 'text-light-text'}`}>Need personalized help?</h3>
          <p className={`text-sm mb-6 max-w-md mx-auto ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>
            Our team is here to answer your questions about legal rights, certifications, or finding the right opportunity.
          </p>
          <a
            href="mailto:kanwaljeet0304@gmail.com?subject=Resource%20Help%20Request"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-gradient-to-r from-maroon to-gold text-white transition-all btn-press"
          >
            <Phone className="w-4 h-4" /> Contact Support
          </a>
        </div>
      </main>
    </div>
  );
}
