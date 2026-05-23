import { Baby, Heart, ChefHat, Home, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const categories = [
  {
    icon: Baby,
    title: 'Nannies',
    description: 'Loving childcare professionals for infants, toddlers, and school-age kids.',
    count: '3,240',
    gradient: 'from-rose-500/20 to-pink-500/10',
    accent: 'text-accent-nanny',
    border: 'hover:border-accent-nanny/40',
    iconBg: 'bg-accent-nanny/15',
  },
  {
    icon: Heart,
    title: 'Elder Care',
    description: 'Compassionate caregivers providing companionship and daily assistance.',
    count: '2,180',
    gradient: 'from-teal-500/20 to-cyan-500/10',
    accent: 'text-accent-elder',
    border: 'hover:border-accent-elder/40',
    iconBg: 'bg-accent-elder/15',
  },
  {
    icon: ChefHat,
    title: 'Cooks \u0026 Chefs',
    description: 'Private chefs and family cooks for daily meals and special occasions.',
    count: '1,560',
    gradient: 'from-saffron/20 to-amber-500/10',
    accent: 'text-accent-cook',
    border: 'hover:border-accent-cook/40',
    iconBg: 'bg-accent-cook/15',
  },
  {
    icon: Home,
    title: 'Housekeepers',
    description: 'Detail-oriented professionals to keep your home immaculate and organized.',
    count: '2,890',
    gradient: 'from-emerald/20 to-green-500/10',
    accent: 'text-accent-house',
    border: 'hover:border-accent-house/40',
    iconBg: 'bg-accent-house/15',
  },
  {
    icon: Sparkles,
    title: 'Cleaners',
    description: 'Reliable cleaning services for homes, offices, and move-in/move-out.',
    count: '2,530',
    gradient: 'from-indigo/20 to-violet-500/10',
    accent: 'text-accent-clean',
    border: 'hover:border-accent-clean/40',
    iconBg: 'bg-accent-clean/15',
  },
];

export default function Categories() {
  const { isDark } = useTheme();

  return (
    <section className={`pt-6 pb-12 pattern-diagonal transition-colors duration-300 ${
      isDark ? 'bg-void' : 'bg-light-bg'
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="divider-marigold max-w-24 mx-auto mb-6" />
          <span className="text-xs font-semibold tracking-widest uppercase mb-3 block text-marigold">
            Categories
          </span>
          <h2 className={`font-display text-4xl md:text-5xl font-semibold ${
            isDark ? 'text-ink' : 'text-light-text'
          }`}>
            Find care in every form
          </h2>
          <p className={`mt-4 max-w-lg mx-auto ${
            isDark ? 'text-ink-muted' : 'text-light-text-muted'
          }`}>
            From nurturing nannies to meticulous housekeepers, discover the right help for your home.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {categories.map((cat) => (
            <a
              key={cat.title}
              href="#listings"
              className={`group relative p-6 rounded-2xl border card-lift overflow-hidden transition-colors ${
                isDark
                  ? `bg-void border-void-border ${cat.border}`
                  : `bg-white border-light-border ${cat.border}`
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative">
                <div className={`w-12 h-12 rounded-xl ${cat.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <cat.icon className={`w-6 h-6 ${cat.accent}`} />
                </div>
                <h3 className={`font-display text-lg font-semibold mb-1 ${
                  isDark ? 'text-ink' : 'text-light-text'
                }`}>{cat.title}</h3>
                <p className={`text-sm leading-relaxed mb-4 ${
                  isDark ? 'text-ink-muted' : 'text-light-text-muted'
                }`}>{cat.description}</p>
                <span className={`text-xs font-medium ${
                  isDark ? 'text-ink-muted' : 'text-light-text-muted'
                }`}>{cat.count} listings</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
