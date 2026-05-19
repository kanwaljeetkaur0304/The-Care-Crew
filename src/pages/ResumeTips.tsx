import { Link } from 'react-router-dom';
import {
  HeartHandshake, ArrowLeft, FileText, CheckCircle, AlertCircle,
  Award, BookOpen, Briefcase, UserCheck, Star, PenTool
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const resumeSections = [
  {
    icon: UserCheck,
    title: 'Professional Summary',
    tips: [
      'Keep it to 3–4 sentences highlighting your years of experience and specialty (e.g., newborn care, elder care, special needs).',
      'Mention certifications upfront: CPR, First Aid, CNA, or specialized training.',
      'Use action verbs: "Compassionate nanny with 8+ years..." or "Certified elder caregiver skilled in dementia care..."',
      'Tailor the summary to the specific job you are applying for.',
    ],
  },
  {
    icon: Award,
    title: 'Certifications & Training',
    tips: [
      'List all relevant certifications with expiry dates: CPR, First Aid, Water Safety, Newborn Care Specialist.',
      'Include background check clearance dates if available.',
      'Add any culinary, nursing assistant, or Montessori certifications.',
      'Mention ongoing education — shows commitment to professional growth.',
    ],
  },
  {
    icon: Briefcase,
    title: 'Work Experience',
    tips: [
      'Use reverse chronological order (most recent first).',
      'Include family/employer type (e.g., "Private family with twins", "Assisted living facility").',
      'Quantify achievements: "Managed daily care for 3 children ages 2–8" or "Reduced medication errors by 100% through careful tracking".',
      'Describe duties using specific skills: meal prep, homework help, mobility assistance, etc.',
    ],
  },
  {
    icon: BookOpen,
    title: 'Skills Section',
    tips: [
      'Categorize skills: Child Care, Elder Care, Household, Languages, Technical.',
      'Include language proficiencies — bilingual caregivers are in high demand.',
      'List soft skills: patience, communication, cultural sensitivity, discretion.',
      'Add specialized skills: special needs care, sleep training, palliative care, gourmet cooking.',
    ],
  },
  {
    icon: FileText,
    title: 'References',
    tips: [
      'Provide 2–3 professional references with contact permission.',
      'Include former employers, agency supervisors, or training instructors.',
      'Always ask permission before listing someone as a reference.',
      'Prepare a separate reference sheet to bring to interviews.',
    ],
  },
  {
    icon: AlertCircle,
    title: 'Common Mistakes to Avoid',
    tips: [
      'Never lie about experience or certifications — families verify everything.',
      'Avoid generic summaries like "hard worker" — be specific about your caregiving niche.',
      'Do not include personal information like SSN, home address, or date of birth.',
      'Skip unprofessional email addresses — create a simple firstname.lastname@gmail.com.',
    ],
  },
];

const templates = [
  {
    title: 'Nanny Resume Template',
    desc: 'Emphasize child development knowledge, safety certifications, and creative activity planning.',
  },
  {
    title: 'Elder Care Resume Template',
    desc: 'Highlight medical training, patience, medication management, and companionship skills.',
  },
  {
    title: 'Housekeeper / Cleaner Resume Template',
    desc: 'Focus on attention to detail, knowledge of cleaning products, and experience with luxury homes.',
  },
  {
    title: 'Private Chef Resume Template',
    desc: 'Showcase culinary training, menu planning, dietary specialization, and food safety knowledge.',
  },
];

export default function ResumeTips() {
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
              <PenTool className="w-3.5 h-3.5" /> Stand Out
            </span>
            <h1 className={`font-display text-4xl md:text-5xl font-semibold leading-tight mb-4 ${isDark ? 'text-ink' : 'text-light-text'}`}>
              Resume Tips for Caregivers
            </h1>
            <p className={`text-lg leading-relaxed ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>
              A strong resume opens doors. Follow these guidelines to showcase your skills, experience, and professionalism to families across the USA & Canada.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {resumeSections.map((section) => (
            <div
              key={section.title}
              className={`rounded-2xl border p-6 transition-colors ${
                isDark
                  ? 'bg-void border-void-border hover:border-void-lighter'
                  : 'bg-white border-light-border hover:border-maroon/20'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${isDark ? 'bg-void-lighter' : 'bg-light-surface-2'}`}>
                <section.icon className={`w-5 h-5 ${isDark ? 'text-gold' : 'text-maroon'}`} />
              </div>
              <h3 className={`font-display text-lg font-semibold mb-4 ${isDark ? 'text-ink' : 'text-light-text'}`}>{section.title}</h3>
              <ul className="space-y-3">
                {section.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle className={`w-4 h-4 mt-0.5 shrink-0 ${isDark ? 'text-gold' : 'text-maroon'}`} />
                    <span className={`text-sm leading-relaxed ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Templates */}
        <div className={`rounded-2xl border p-8 ${isDark ? 'bg-void border-void-border' : 'bg-white border-light-border'}`}>
          <h3 className={`font-display text-xl font-semibold mb-6 text-center ${isDark ? 'text-ink' : 'text-light-text'}`}>Resume Templates by Role</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map((t) => (
              <div key={t.title} className={`p-5 rounded-xl border ${isDark ? 'bg-void-lighter border-void-border' : 'bg-light-surface-2 border-light-border'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Star className={`w-4 h-4 ${isDark ? 'text-gold' : 'text-maroon'}`} />
                  <div className={`font-medium text-sm ${isDark ? 'text-ink' : 'text-light-text'}`}>{t.title}</div>
                </div>
                <p className={`text-sm ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
