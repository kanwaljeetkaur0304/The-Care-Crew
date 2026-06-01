import { useState } from 'react';
import { Heart, MapPin, Clock, Star, ArrowRight, Trash2 } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { type SavedCaregiver } from '../../../data/dashboardMockData';
import DashboardEmptyState from '../../../components/dashboard/DashboardEmptyState';

const availabilityColor = (status: string) => {
  if (status === 'Available Now') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (status === 'Available Today') return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-blue-100 text-blue-700 border-blue-200';
};

export default function FamilySavedCaregivers() {
  const { isDark } = useTheme();
  const [saved, setSaved] = useState<SavedCaregiver[]>([]);

  const removeSaved = (id: string) => {
    setSaved((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`font-display text-2xl font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
          Saved Caregivers
        </h2>
        <p className={`text-sm mt-1 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
          {saved.length} saved · caregivers you are interested in
        </p>
      </div>

      {saved.length === 0 ? (
        <DashboardEmptyState
          icon={Heart}
          title="No saved caregivers"
          description="Browse caregiver profiles and tap the heart icon to save ones you like."
          actionLabel="Browse Caregivers"
          onAction={() => window.open('/caregivers', '_self')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {saved.map((person) => (
            <div
              key={person.id}
              className={`rounded-2xl border p-5 transition-colors ${
                isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'
              }`}
            >
              {/* Top */}
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

              {/* Info */}
              <div className={`flex flex-wrap gap-x-4 gap-y-1 text-xs mb-3 ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {person.location}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {person.experience}</span>
              </div>

              {/* Languages */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {person.languages.map((lang) => (
                  <span key={lang} className={`px-2 py-0.5 rounded-md text-xs border ${isDark ? 'bg-void border-void-border text-ink-muted' : 'bg-light-bg border-light-border text-light-text-muted'}`}>
                    {lang}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className={`flex items-center justify-between pt-3 border-t ${isDark ? 'border-void-border' : 'border-light-border'}`}>
                <div>
                  <div className={`font-display text-base font-bold ${isDark ? 'text-ink' : 'text-light-text'}`}>{person.rate}</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                    <span className={`text-xs font-medium ${isDark ? 'text-ink' : 'text-light-text'}`}>{person.rating}</span>
                    <span className={`text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>({person.reviews})</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => removeSaved(person.id)}
                    className={`p-2 rounded-full border transition-colors ${
                      isDark ? 'border-red-400/20 text-red-400/50 hover:text-red-400 hover:border-red-400/40 hover:bg-red-400/10' : 'border-red-200 text-red-300 hover:text-red-500 hover:border-red-300 hover:bg-red-50'
                    }`}
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-gradient-to-r from-maroon to-gold text-white text-xs font-semibold hover:opacity-90 transition-opacity btn-press shadow-md shadow-maroon/20">
                    Contact <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Saved Date */}
              <div className={`mt-2 text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                Saved {new Date(person.savedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Browse More CTA */}
      {saved.length > 0 && (
        <div className={`p-5 rounded-2xl border text-center ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}>
          <p className={`text-sm mb-3 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
            Find more caregivers who match your family
          </p>
          <a
            href="/caregivers"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-maroon to-gold text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity btn-press"
          >
            Browse All Caregivers <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  );
}
