import { ClipboardList, Search, MessageCircle, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const steps = [
  {
    icon: ClipboardList,
    title: 'Post or Browse',
    description: 'Families post hiring ads. Caregivers create profiles. Everyone finds what they need in one place.',
    iconColor: 'text-saffron',
    iconBg: 'from-saffron/20 to-saffron/5 border-saffron/20',
    numColor: 'text-saffron/20',
    connector: 'from-saffron/40',
  },
  {
    icon: Search,
    title: 'Find Your Match',
    description: 'Filter by location, category, salary, and schedule. Browse detailed profiles and job descriptions.',
    iconColor: 'text-marigold',
    iconBg: 'from-marigold/20 to-marigold/5 border-marigold/20',
    numColor: 'text-marigold/20',
    connector: 'from-marigold/40',
  },
  {
    icon: MessageCircle,
    title: 'Connect Directly',
    description: 'Reach out through our secure messaging. Ask questions, arrange interviews, and discuss details.',
    iconColor: 'text-lotus',
    iconBg: 'from-lotus/20 to-lotus/5 border-lotus/20',
    numColor: 'text-lotus/20',
    connector: 'from-lotus/40',
  },
  {
    icon: ShieldCheck,
    title: 'Hire with Confidence',
    description: 'Every profile is reviewed. Read ratings, verify references, and hire someone you can truly trust.',
    iconColor: 'text-gold',
    iconBg: 'from-gold/20 to-gold/5 border-gold/20',
    numColor: 'text-gold/20',
    connector: '',
  },
];

export default function HowItWorks() {
  const { isDark } = useTheme();

  return (
    <section id="how-it-works" className={`py-24 grain transition-colors duration-300 ${
      isDark ? 'bg-void' : 'bg-light-bg'
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="divider-saffron max-w-24 mx-auto mb-6" />
          <span className="text-xs font-semibold tracking-widest uppercase mb-3 block text-saffron">
            How It Works
          </span>
          <h2 className={`font-display text-4xl md:text-5xl font-semibold ${
            isDark ? 'text-ink' : 'text-light-text'
          }`}>
            Simple steps to the right fit
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={step.title} className="relative">
              <div className={`rounded-2xl border p-8 h-full card-lift transition-colors ${
                isDark
                  ? 'bg-void-light border-void-border'
                  : 'bg-white border-light-border'
              }`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border bg-gradient-to-br ${step.iconBg}`}>
                  <step.icon className={`w-7 h-7 ${step.iconColor}`} />
                </div>
                <div className={`font-display text-5xl font-bold mb-4 ${step.numColor}`}>
                  0{i + 1}
                </div>
                <h3 className={`font-display text-xl font-semibold mb-3 ${
                  isDark ? 'text-ink' : 'text-light-text'
                }`}>{step.title}</h3>
                <p className={`text-sm leading-relaxed ${
                  isDark ? 'text-ink-light' : 'text-light-text-2'
                }`}>{step.description}</p>
              </div>
              {i < steps.length - 1 && (
                <div className={`hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r ${step.connector} to-transparent`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
