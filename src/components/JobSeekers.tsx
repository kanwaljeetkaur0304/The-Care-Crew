import { useState } from 'react';
import { MapPin, Star, DollarSign, Clock, Award, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { jobSeekers, categoryColors, categoryLabels, type JobSeeker } from '../data/mockData';
import { useLocation } from '../context/LocationContext';
import { useTheme } from '../context/ThemeContext';

export default function JobSeekers() {
  const [filter, setFilter] = useState<string>('all');
  const { matchesCity, selectedCity, isAllLocations } = useLocation();
  const { isDark } = useTheme();

  const filtered: JobSeeker[] =
    (filter === 'all' ? jobSeekers : jobSeekers.filter((s) => s.category === filter))
      .filter((s) => matchesCity(s.location));

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'nanny', label: 'Nannies' },
    { key: 'eldercare', label: 'Elder Care' },
    { key: 'cook', label: 'Cooks' },
    { key: 'housekeeper', label: 'Housekeepers' },
    { key: 'cleaner', label: 'Cleaners' },
  ];

  const initials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('');

  return (
    <section id="seekers" className={`py-24 pattern-diagonal transition-colors duration-300 ${
      isDark ? 'bg-void-light' : 'bg-light-surface-2'
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="divider-lotus max-w-16 mb-5" />
            <span className="text-xs font-semibold tracking-widest uppercase mb-3 block text-lotus">
              For Families
            </span>
            <h2 className={`font-display text-4xl md:text-5xl font-semibold ${
              isDark ? 'text-ink' : 'text-light-text'
            }`}>
              Meet our caregivers
            </h2>
            {!isAllLocations && (
              <p className={`mt-3 max-w-md ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                Showing caregivers in <span className="text-gold font-medium">{selectedCity}</span>.{' '}
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="underline hover:text-gold">Change location</button>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all btn-press ${
                filter === f.key
                  ? 'bg-gradient-to-r from-maroon to-gold text-white shadow-lg shadow-maroon/20'
                  : isDark
                    ? 'bg-void-lighter text-ink-light border border-void-border hover:border-gold/40 hover:text-gold'
                    : 'bg-white text-light-text-2 border border-light-border hover:border-maroon/30 hover:text-maroon'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isDark ? 'bg-void-lighter' : 'bg-light-surface-2'
            }`}>
              <MapPin className={`w-8 h-8 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
            </div>
            <h3 className={`font-display text-xl font-semibold mb-2 ${
              isDark ? 'text-ink' : 'text-light-text'
            }`}>No caregivers found in {selectedCity}</h3>
            <p className={isDark ? 'text-ink-muted' : 'text-light-text-muted'}>
              Try selecting a different location or browse all locations.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.slice(0, 6).map((seeker) => {
              const colors = categoryColors[seeker.category];
              return (
              <Link key={seeker.id} to={`/caregivers/${seeker.id}`} onClick={() => setTimeout(() => window.scrollTo(0, 0), 0)} className="block">
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
                        <h3 className={`font-display text-lg font-semibold ${
                          isDark ? 'text-ink' : 'text-light-text'
                        }`}>{seeker.name}</h3>
                        <span className={`text-xs font-medium ${colors.text}`}>
                          {categoryLabels[seeker.category]}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {seeker.socialLink && (
                        <a
                          href={seeker.socialLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-ink-muted hover:text-gold' : 'text-light-text-muted hover:text-maroon'}`}
                          title="Social profile"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <div className={`flex items-center gap-1 text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                        <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                        <span className={`font-medium ${isDark ? 'text-ink' : 'text-light-text'}`}>
                          {seeker.rating ?? '—'}
                        </span>
                        {seeker.reviewCount && (
                          <span className={`${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                            ({seeker.reviewCount})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className={`text-sm leading-relaxed mb-5 line-clamp-3 ${
                    isDark ? 'text-ink-light' : 'text-light-text-2'
                  }`}>
                    {seeker.bio}
                  </p>

                  <div className="space-y-2.5 mb-5">
                    <div className={`flex items-center gap-2 text-sm ${
                      isDark ? 'text-ink-light' : 'text-light-text-2'
                    }`}>
                      <MapPin className={`w-4 h-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                      {seeker.location}
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${
                      isDark ? 'text-ink-light' : 'text-light-text-2'
                    }`}>
                      <Award className={`w-4 h-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                      {seeker.experience} experience
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${
                      isDark ? 'text-ink-light' : 'text-light-text-2'
                    }`}>
                      <DollarSign className={`w-4 h-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                      {seeker.expectedSalary}
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${
                      isDark ? 'text-ink-light' : 'text-light-text-2'
                    }`}>
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
              </Link>
              );
            })}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Link
            to="/caregivers"
            onClick={() => setTimeout(() => window.scrollTo(0, 0), 0)}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all btn-press ${
              isDark
                ? 'bg-void-lighter text-ink-light border border-void-border hover:border-gold/40 hover:text-gold'
                : 'bg-white text-light-text-2 border border-light-border hover:border-maroon/30 hover:text-maroon'
            }`}
          >
            More
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
