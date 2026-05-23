import { useState } from 'react';
import { MapPin, Clock, DollarSign, Calendar, Briefcase, Filter, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { jobListings, categoryColors, categoryLabels, type JobListing } from '../data/mockData';
import { useLocation } from '../context/LocationContext';
import { useTheme } from '../context/ThemeContext';

export default function JobListings() {
  const [filter, setFilter] = useState<string>('all');
  const { matchesCity, selectedCity, isAllLocations } = useLocation();
  const { isDark } = useTheme();

  const filtered: JobListing[] =
    (filter === 'all' ? jobListings : jobListings.filter((j) => j.category === filter))
      .filter((j) => matchesCity(j.location));

  const filters = [
    { key: 'all', label: 'All Jobs' },
    { key: 'nanny', label: 'Nannies' },
    { key: 'eldercare', label: 'Elder Care' },
    { key: 'cook', label: 'Cooks' },
    { key: 'housekeeper', label: 'Housekeepers' },
    { key: 'cleaner', label: 'Cleaners' },
  ];

  return (
    <section id="listings" className={`py-24 grain transition-colors duration-300 ${
      isDark ? 'bg-void' : 'bg-light-bg'
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="divider-marigold max-w-16 mb-5" />
            <span className="text-xs font-semibold tracking-widest uppercase mb-3 block text-marigold">
              For Job Seekers
            </span>
            <h2 className={`font-display text-4xl md:text-5xl font-semibold ${
              isDark ? 'text-ink' : 'text-light-text'
            }`}>
              Families hiring now
            </h2>
            {!isAllLocations && (
              <p className={`mt-3 max-w-md ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                Showing jobs in <span className="text-gold font-medium">{selectedCity}</span>.{' '}
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="underline hover:text-gold">Change location</button>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
          <Filter className={`w-4 h-4 shrink-0 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
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
            }`}>No jobs found in {selectedCity}</h3>
            <p className={isDark ? 'text-ink-muted' : 'text-light-text-muted'}>
              Try selecting a different location or browse all locations.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.slice(0, 6).map((job) => {
              const colors = categoryColors[job.category];
              return (
              <Link key={job.id} to={`/jobs/${job.id}`} onClick={() => setTimeout(() => window.scrollTo(0, 0), 0)} className="block">
                <div
                  className={`group rounded-2xl border p-6 card-lift cursor-pointer transition-colors ${
                    isDark
                      ? 'bg-void-light border-void-border hover:border-void-lighter'
                      : 'bg-white border-light-border hover:border-maroon/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className={`tag-pill border ${
                      isDark
                        ? `bg-void-lighter ${colors.text} border-void-border`
                        : `bg-light-surface-2 ${colors.text} border-light-border`
                    }`}>
                      {categoryLabels[job.category]}
                    </span>
                    <span className={`text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>{job.postedDate}</span>
                  </div>

                  <h3 className={`font-display text-xl font-semibold mb-2 group-hover:text-gold transition-colors ${
                    isDark ? 'text-ink' : 'text-light-text'
                  }`}>
                    {job.title}
                  </h3>

                  <p className={`text-sm leading-relaxed mb-5 line-clamp-2 ${
                    isDark ? 'text-ink-light' : 'text-light-text-2'
                  }`}>
                    {job.description}
                  </p>

                  <div className="space-y-2.5 mb-5">
                    <div className={`flex items-center gap-2 text-sm ${
                      isDark ? 'text-ink-light' : 'text-light-text-2'
                    }`}>
                      <MapPin className={`w-4 h-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                      {job.location}
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${
                      isDark ? 'text-ink-light' : 'text-light-text-2'
                    }`}>
                      <DollarSign className={`w-4 h-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                      {job.salary}
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${
                      isDark ? 'text-ink-light' : 'text-light-text-2'
                    }`}>
                      <Clock className={`w-4 h-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                      {job.schedule}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {job.requirements.slice(0, 3).map((req) => (
                      <span
                        key={req}
                        className={`px-2.5 py-1 rounded-lg text-xs border ${
                          isDark
                            ? 'bg-void-lighter text-ink-light border-void-border'
                            : 'bg-light-surface-2 text-light-text-2 border-light-border'
                        }`}
                      >
                        {req}
                      </span>
                    ))}
                  </div>

                  <div className={`flex items-center justify-between pt-4 border-t ${
                    isDark ? 'border-void-border' : 'border-light-border'
                  }`}>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald to-teal flex items-center justify-center">
                        <Briefcase className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className={`text-sm ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>{job.postedBy}</span>
                    </div>
                    <span className={`text-xs flex items-center gap-1 ${
                      isDark ? 'text-ink-muted' : 'text-light-text-muted'
                    }`}>
                      <Calendar className="w-3 h-3" />
                      {job.postedDate}
                    </span>
                  </div>
                </div>
              </Link>
              );
            })}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Link
            to="/jobs"
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
