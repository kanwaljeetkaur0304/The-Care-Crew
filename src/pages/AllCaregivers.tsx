import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Star, DollarSign, Clock, Award, Search, ArrowLeft,
  SlidersHorizontal, X, Briefcase, HeartHandshake, Users, ShieldCheck, Sparkles
} from 'lucide-react';
import { jobSeekers, categoryColors, categoryLabels, type JobSeeker } from '../data/mockData';
import { useLocation } from '../context/LocationContext';
import { useTheme } from '../context/ThemeContext';

const POPULAR_CITIES = [
  'All Locations', 'Toronto, ON', 'Vancouver, BC', 'Montreal, QC', 'Calgary, AB', 'Edmonton, AB',
  'Ottawa, ON', 'Winnipeg, MB', 'Quebec City, QC', 'Hamilton, ON', 'Kitchener, ON',
  'London, ON', 'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX',
  'San Francisco, CA', 'Seattle, WA', 'Miami, FL', 'Boston, MA', 'Dallas, TX',
  'Atlanta, GA', 'Denver, CO', 'Phoenix, AZ', 'Austin, TX', 'San Diego, CA',
  'Philadelphia, PA', 'San Jose, CA', 'Jacksonville, FL', 'Columbus, OH', 'Charlotte, NC',
  'Indianapolis, IN', 'Fort Worth, TX', 'Detroit, MI', 'El Paso, TX', 'Memphis, TN',
  'Louisville, KY', 'Milwaukee, WI', 'Baltimore, MD', 'Albuquerque, NM', 'Tucson, AZ',
  'Fresno, CA', 'Sacramento, CA', 'Kansas City, MO', 'Mesa, AZ', 'Omaha, NE',
  'Colorado Springs, CO', 'Raleigh, NC', 'Virginia Beach, VA', 'Oakland, CA', 'Minneapolis, MN',
  'Tulsa, OK', 'Arlington, TX', 'Wichita, KS', 'Bakersfield, CA', 'Portland, OR',
  'Las Vegas, NV', 'Washington, DC', 'Nashville, TN',
];

const EXPERIENCE_FILTERS = [
  { key: 'all', label: 'All Experience' },
  { key: '1-5', label: '1–5 years' },
  { key: '5-10', label: '5–10 years' },
  { key: '10+', label: '10+ years' },
];

const AVAILABILITY_FILTERS = [
  { key: 'all', label: 'All Availability' },
  { key: 'full-time', label: 'Full-time' },
  { key: 'part-time', label: 'Part-time' },
  { key: 'live-in', label: 'Live-in' },
];

function parseExperience(exp: string): number {
  const match = exp.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function matchesExperience(exp: string, filter: string): boolean {
  const years = parseExperience(exp);
  if (filter === '1-5') return years >= 1 && years <= 5;
  if (filter === '5-10') return years > 5 && years <= 10;
  if (filter === '10+') return years > 10;
  return true;
}

function matchesAvailability(avail: string, filter: string): boolean {
  const lower = avail.toLowerCase();
  if (filter === 'full-time') return lower.includes('full-time');
  if (filter === 'part-time') return lower.includes('part-time');
  if (filter === 'live-in') return lower.includes('live-in');
  return true;
}

export default function AllCaregivers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [expFilter, setExpFilter] = useState('all');
  const [availFilter, setAvailFilter] = useState('all');
  const [locFilter, setLocFilter] = useState('All Locations');
  const [showFilters, setShowFilters] = useState(false);
  const { matchesCity, selectedCity, isAllLocations } = useLocation();
  const { isDark } = useTheme();

  const categories = [
    { key: 'all', label: 'All Caregivers' },
    { key: 'nanny', label: 'Nannies' },
    { key: 'eldercare', label: 'Elder Care' },
    { key: 'cook', label: 'Cooks' },
    { key: 'housekeeper', label: 'Housekeepers' },
    { key: 'cleaner', label: 'Cleaners' },
  ];

  const filtered = useMemo(() => {
    return jobSeekers
      .filter((s) => matchesCity(s.location))
      .filter((s) => locFilter === 'All Locations' || s.location.toLowerCase().includes(locFilter.split(',')[0].toLowerCase().trim()))
      .filter((s) => categoryFilter === 'all' || s.category === categoryFilter)
      .filter((s) => matchesExperience(s.experience, expFilter))
      .filter((s) => matchesAvailability(s.availability, availFilter))
      .filter((s) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.bio.toLowerCase().includes(q) ||
          s.location.toLowerCase().includes(q) ||
          s.skills.some((skill) => skill.toLowerCase().includes(q))
        );
      });
  }, [categoryFilter, expFilter, availFilter, locFilter, searchQuery, matchesCity]);

  const activeFiltersCount =
    (categoryFilter !== 'all' ? 1 : 0) +
    (expFilter !== 'all' ? 1 : 0) +
    (availFilter !== 'all' ? 1 : 0) +
    (locFilter !== 'All Locations' ? 1 : 0);

  const clearFilters = () => {
    setCategoryFilter('all');
    setExpFilter('all');
    setAvailFilter('all');
    setLocFilter('All Locations');
    setSearchQuery('');
  };

  const inputClass = `w-full pl-10 pr-4 py-3 border rounded-xl text-sm placeholder:text-opacity-60 ${
    isDark ? 'bg-void border-void-border text-ink placeholder:text-ink-muted' : 'bg-light-bg border-light-border text-light-text placeholder:text-light-text-muted'
  }`;

  const avgExp = useMemo(() => {
    const total = filtered.reduce((sum, s) => sum + parseExperience(s.experience), 0);
    return filtered.length ? Math.round(total / filtered.length) : 0;
  }, [filtered]);

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
              <Sparkles className="w-3.5 h-3.5" />
              Trusted Caregivers
            </span>
            <h1 className={`font-display text-4xl md:text-5xl font-semibold leading-tight mb-4 ${isDark ? 'text-ink' : 'text-light-text'}`}>
              Find the perfect caregiver for your family
            </h1>
            <p className={`text-lg leading-relaxed mb-8 ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>
              Browse verified nannies, elder care specialists, chefs, housekeepers, and cleaners across the USA & Canada.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-6 md:gap-10">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-void-lighter' : 'bg-white'}`}>
                  <Users className={`w-5 h-5 ${isDark ? 'text-gold' : 'text-maroon'}`} />
                </div>
                <div>
                  <div className={`font-display text-xl font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>{jobSeekers.length}+</div>
                  <div className={`text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>Caregivers</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-void-lighter' : 'bg-white'}`}>
                  <ShieldCheck className={`w-5 h-5 ${isDark ? 'text-gold' : 'text-maroon'}`} />
                </div>
                <div>
                  <div className={`font-display text-xl font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>100%</div>
                  <div className={`text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>Verified</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-void-lighter' : 'bg-white'}`}>
                  <Star className={`w-5 h-5 ${isDark ? 'text-gold' : 'text-maroon'}`} />
                </div>
                <div>
                  <div className={`font-display text-xl font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>4.9</div>
                  <div className={`text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>Avg Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, skill, location..."
              className={inputClass}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-ink-muted hover:text-ink' : 'text-light-text-muted hover:text-light-text'}`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-colors ${
              showFilters || activeFiltersCount > 0
                ? 'bg-gradient-to-r from-maroon to-gold text-white border-transparent'
                : isDark
                  ? 'bg-void border-void-border text-ink-light hover:border-gold/40'
                  : 'bg-white border-light-border text-light-text-2 hover:border-maroon/30'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-white/20 text-xs flex items-center justify-center">{activeFiltersCount}</span>
            )}
          </button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className={`p-5 rounded-2xl border mb-8 ${isDark ? 'bg-void border-void-border' : 'bg-white border-light-border'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Location */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-ink' : 'text-light-text'}`}>Location</label>
                <select
                  value={locFilter}
                  onChange={(e) => setLocFilter(e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-xl text-sm ${isDark ? 'bg-void-lighter border-void-border text-ink' : 'bg-light-bg border-light-border text-light-text'}`}
                >
                  {POPULAR_CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-ink' : 'text-light-text'}`}>Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-xl text-sm ${isDark ? 'bg-void-lighter border-void-border text-ink' : 'bg-light-bg border-light-border text-light-text'}`}
                >
                  {categories.map((c) => (
                    <option key={c.key} value={c.key}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Experience */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-ink' : 'text-light-text'}`}>Experience</label>
                <select
                  value={expFilter}
                  onChange={(e) => setExpFilter(e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-xl text-sm ${isDark ? 'bg-void-lighter border-void-border text-ink' : 'bg-light-bg border-light-border text-light-text'}`}
                >
                  {EXPERIENCE_FILTERS.map((f) => (
                    <option key={f.key} value={f.key}>{f.label}</option>
                  ))}
                </select>
              </div>

              {/* Availability */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-ink' : 'text-light-text'}`}>Availability</label>
                <select
                  value={availFilter}
                  onChange={(e) => setAvailFilter(e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-xl text-sm ${isDark ? 'bg-void-lighter border-void-border text-ink' : 'bg-light-bg border-light-border text-light-text'}`}
                >
                  {AVAILABILITY_FILTERS.map((f) => (
                    <option key={f.key} value={f.key}>{f.label}</option>
                  ))}
                </select>
              </div>
            </div>
            {activeFiltersCount > 0 && (
              <button onClick={clearFilters} className="mt-4 text-sm text-gold hover:underline">
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Category Pills */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategoryFilter(c.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all btn-press ${
                categoryFilter === c.key
                  ? 'bg-gradient-to-r from-maroon to-gold text-white shadow-lg shadow-maroon/20'
                  : isDark
                    ? 'bg-void-lighter text-ink-light border border-void-border hover:border-gold/40 hover:text-gold'
                    : 'bg-white text-light-text-2 border border-light-border hover:border-maroon/30 hover:text-maroon'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Results summary */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div className={`text-sm ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
            Showing <span className={`font-medium ${isDark ? 'text-ink' : 'text-light-text'}`}>{filtered.length}</span> caregiver{filtered.length !== 1 ? 's' : ''}
            {!isAllLocations && (
              <span> in <span className="text-gold font-medium">{selectedCity}</span></span>
            )}
          </div>
          {avgExp > 0 && (
            <div className={`text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
              Avg experience: <span className={`font-medium ${isDark ? 'text-ink' : 'text-light-text'}`}>{avgExp} years</span>
            </div>
          )}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-void-lighter' : 'bg-light-surface-2'}`}>
              <Briefcase className={`w-8 h-8 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
            </div>
            <h3 className={`font-display text-xl font-semibold mb-2 ${isDark ? 'text-ink' : 'text-light-text'}`}>No caregivers found</h3>
            <p className={isDark ? 'text-ink-muted' : 'text-light-text-muted'}>
              Try adjusting your filters or search query.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 px-5 py-2.5 bg-gradient-to-r from-maroon to-gold text-white text-sm font-medium rounded-full"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((seeker) => (
              <Link key={seeker.id} to={`/caregivers/${seeker.id}`} onClick={() => setTimeout(() => window.scrollTo(0, 0), 0)} className="block">
                <CaregiverCard seeker={seeker} isDark={isDark} />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function CaregiverCard({ seeker, isDark }: { seeker: JobSeeker; isDark: boolean }) {
  const colors = categoryColors[seeker.category];
  const initials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('');

  return (
    <div
      className={`group rounded-2xl border p-6 card-lift cursor-pointer transition-colors ${
        isDark
          ? 'bg-void border-void-border hover:border-void-lighter'
          : 'bg-white border-light-border hover:border-maroon/20'
      }`}
    >
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald to-teal flex items-center justify-center font-display text-lg font-bold text-white">
            {initials(seeker.name)}
          </div>
          <div>
            <h3 className={`font-display text-lg font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>{seeker.name}</h3>
            <span className={`text-xs font-medium ${colors.text}`}>
              {categoryLabels[seeker.category]}
            </span>
          </div>
        </div>
        <div className={`flex items-center gap-1 text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
          <Star className="w-3.5 h-3.5 fill-gold text-gold" />
          <span className={`font-medium ${isDark ? 'text-ink' : 'text-light-text'}`}>4.9</span>
        </div>
      </div>

      <p className={`text-sm leading-relaxed mb-5 ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>
        {seeker.bio}
      </p>

      <div className="space-y-2.5 mb-5">
        <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>
          <MapPin className={`w-4 h-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
          {seeker.location}
        </div>
        <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>
          <Award className={`w-4 h-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
          {seeker.experience} experience
        </div>
        <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>
          <DollarSign className={`w-4 h-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
          {seeker.expectedSalary}
        </div>
        <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>
          <Clock className={`w-4 h-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
          {seeker.availability}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-2">
        {seeker.skills.map((skill) => (
          <span
            key={skill}
            className={`px-2.5 py-1 rounded-lg text-xs border ${
              isDark
                ? 'bg-void-lighter text-ink-light border-void-border'
                : 'bg-light-surface-2 text-light-text-2 border-light-border'
            }`}
          >
            {skill}
          </span>
        ))}
      </div>

      <div className={`flex items-center justify-between pt-4 border-t mt-4 ${
        isDark ? 'border-void-border' : 'border-light-border'
      }`}>
        <span className={`text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>Posted {seeker.postedDate}</span>
        <button className="text-sm font-medium text-gold hover:text-gold-light transition-colors">
          View Profile →
        </button>
      </div>
    </div>
  );
}
