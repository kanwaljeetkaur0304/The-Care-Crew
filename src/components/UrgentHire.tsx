import { useState } from 'react';
import { Zap, MapPin, Star, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import SubscriptionModal from './SubscriptionModal';

const CATEGORIES = ['All', 'Nanny', 'Housekeeper', 'Cook', 'Elder Care', 'Babysitter'];

const URGENT_PROFILES = [
  {
    id: 'u1',
    name: 'Priya S.',
    category: 'Nanny',
    location: 'Brampton, ON',
    rating: 4.9,
    reviews: 38,
    availability: 'Available Today',
    experience: '6 yrs exp',
    rate: '$18/hr',
    tags: ['Hindi', 'Punjabi', 'English'],
    color: 'from-pink-400 to-rose-500',
    initials: 'PS',
  },
  {
    id: 'u2',
    name: 'Meera K.',
    category: 'Housekeeper',
    location: 'Mississauga, ON',
    rating: 4.8,
    reviews: 54,
    availability: 'Available Now',
    experience: '8 yrs exp',
    rate: '$20/hr',
    tags: ['Tamil', 'English'],
    color: 'from-teal-400 to-emerald-500',
    initials: 'MK',
  },
  {
    id: 'u3',
    name: 'Sunita R.',
    category: 'Cook',
    location: 'Toronto, ON',
    rating: 5.0,
    reviews: 21,
    availability: 'Available Today',
    experience: '10 yrs exp',
    rate: '$22/hr',
    tags: ['Gujarati', 'Hindi', 'English'],
    color: 'from-amber-400 to-orange-500',
    initials: 'SR',
  },
  {
    id: 'u4',
    name: 'Harjit K.',
    category: 'Elder Care',
    location: 'Surrey, BC',
    rating: 4.7,
    reviews: 30,
    availability: 'Available Tomorrow',
    experience: '5 yrs exp',
    rate: '$21/hr',
    tags: ['Punjabi', 'Hindi', 'English'],
    color: 'from-violet-400 to-purple-500',
    initials: 'HK',
  },
  {
    id: 'u5',
    name: 'Anita D.',
    category: 'Babysitter',
    location: 'Scarborough, ON',
    rating: 4.9,
    reviews: 17,
    availability: 'Available Now',
    experience: '3 yrs exp',
    rate: '$16/hr',
    tags: ['Bengali', 'English'],
    color: 'from-sky-400 to-blue-500',
    initials: 'AD',
  },
  {
    id: 'u6',
    name: 'Kavya N.',
    category: 'Nanny',
    location: 'Vaughan, ON',
    rating: 4.8,
    reviews: 45,
    availability: 'Available Today',
    experience: '7 yrs exp',
    rate: '$19/hr',
    tags: ['Telugu', 'English'],
    color: 'from-fuchsia-400 to-pink-500',
    initials: 'KN',
  },
];

const availabilityColor = (status: string) => {
  if (status === 'Available Now') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (status === 'Available Today') return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-blue-100 text-blue-700 border-blue-200';
};

export default function UrgentHire() {
  const { isDark } = useTheme();
  const [activeCategory, setActiveCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);

  const filtered = activeCategory === 'All'
    ? URGENT_PROFILES
    : URGENT_PROFILES.filter((p) => p.category === activeCategory);

  return (
    <section id="urgent-hire" className={`py-16 md:py-20 transition-colors duration-300 ${isDark ? 'bg-void-light' : 'bg-light-surface-2'}`}>
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide mb-4 bg-red-100 text-red-600 border border-red-200">
              <Zap className="w-3.5 h-3.5 fill-red-500" />
              Urgent Hire
            </div>
            <h2 className={`font-display text-3xl md:text-4xl font-semibold mb-3 ${isDark ? 'text-ink' : 'text-light-text'}`}>
              Need someone <span className="text-gold italic">right away?</span>
            </h2>
            <p className={`text-base max-w-lg ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>
              Freelance caregivers, nannies, housekeepers & cooks available today — vetted, trusted, and ready to help.
            </p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium shrink-0 ${isDark ? 'bg-void border-void-border text-ink-light' : 'bg-white border-light-border text-light-text-2'}`}>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            All profiles background verified
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all btn-press ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-maroon to-gold text-white border-transparent shadow-md shadow-maroon/20'
                  : isDark
                    ? 'bg-void border-void-border text-ink-light hover:border-gold/40 hover:text-gold'
                    : 'bg-white border-light-border text-light-text-2 hover:border-maroon/30 hover:text-maroon'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((person) => (
            <div
              key={person.id}
              className={`group rounded-2xl border p-5 card-lift transition-colors cursor-pointer ${
                isDark
                  ? 'bg-void border-void-border hover:border-void-lighter'
                  : 'bg-white border-light-border hover:border-maroon/20'
              }`}
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${person.color} flex items-center justify-center font-display text-lg font-bold text-white shrink-0`}>
                    {person.initials}
                  </div>
                  <div>
                    <div className={`font-display font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>{person.name}</div>
                    <div className={`text-xs font-medium ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>{person.category}</div>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${availabilityColor(person.availability)}`}>
                  {person.availability}
                </span>
              </div>

              {/* Info row */}
              <div className={`flex flex-wrap gap-x-4 gap-y-1.5 text-sm mb-4 ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-maroon/60" />
                  {person.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 shrink-0 text-maroon/60" />
                  {person.experience}
                </span>
              </div>

              {/* Language tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {person.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`px-2 py-0.5 rounded-md text-xs border ${
                      isDark
                        ? 'bg-void-lighter text-ink-light border-void-border'
                        : 'bg-light-surface-2 text-light-text-2 border-light-border'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Bottom row */}
              <div className={`flex items-center justify-between pt-3 border-t ${isDark ? 'border-void-border' : 'border-light-border'}`}>
                <div>
                  <span className={`font-display text-lg font-bold ${isDark ? 'text-ink' : 'text-light-text'}`}>{person.rate}</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                    <span className={`text-xs font-medium ${isDark ? 'text-ink' : 'text-light-text'}`}>{person.rating}</span>
                    <span className={`text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>({person.reviews})</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-maroon to-gold text-white text-xs font-semibold hover:opacity-90 transition-opacity btn-press shadow-md shadow-maroon/20"
                >
                  Contact <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <p className={`text-sm mb-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
            Showing {filtered.length} caregivers available near you
          </p>
          <button className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium border transition-all btn-press ${
            isDark
              ? 'bg-void-lighter border-void-border text-ink hover:border-gold/40 hover:text-gold'
              : 'bg-white border-light-border text-light-text hover:border-maroon/30 hover:text-maroon'
          }`}>
            View All Available Caregivers <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      <SubscriptionModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </section>
  );
}
