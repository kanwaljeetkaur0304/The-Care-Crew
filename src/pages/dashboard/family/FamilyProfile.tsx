import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, CheckCircle, AlertCircle, Edit2, Save, X } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import { useFamilyProfile } from '../../../hooks/useFamilyProfile';

export default function FamilyProfile() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { profile: savedProfile, updateProfile } = useFamilyProfile();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(savedProfile);
  const [saving, setSaving] = useState(false);

  // Sync local state from hook whenever NOT editing
  useEffect(() => {
    if (!editing) {
      setProfile(savedProfile);
    }
  }, [savedProfile, editing]);

  const languageOptions = ['Hindi', 'Punjabi', 'Gujarati', 'Bengali', 'Tamil', 'Telugu', 'Urdu', 'English', 'Marathi', 'Malayalam'];
  const careTypes = ['Nanny', 'Housekeeper', 'Cook', 'Elder Care', 'Babysitter', 'Driver'];

  const toggleLanguage = (lang: string) => {
    setProfile((p) => ({
      ...p,
      languages: p.languages.includes(lang)
        ? p.languages.filter((l) => l !== lang)
        : [...p.languages, lang],
    }));
  };

  const toggleCareType = (type: string) => {
    setProfile((p) => ({
      ...p,
      lookingFor: p.lookingFor.includes(type)
        ? p.lookingFor.filter((t) => t !== type)
        : [...p.lookingFor, type],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    await updateProfile({
      phone: profile.phone,
      location: profile.location,
      languages: profile.languages,
      description: profile.description,
      lookingFor: profile.lookingFor,
    });
    setSaving(false);
    setEditing(false);
  };

  const handleCancel = () => {
    setProfile(savedProfile);
    setEditing(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`font-display text-2xl font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
            My Profile
          </h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
            Help caregivers understand your family better
          </p>
        </div>
        <button
          onClick={() => editing ? handleCancel() : setEditing(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
            editing
              ? isDark ? 'border-red-400/30 text-red-400 hover:bg-red-400/10' : 'border-red-300 text-red-600 hover:bg-red-50'
              : isDark ? 'border-void-border text-ink-light hover:border-gold/40 hover:text-gold' : 'border-light-border text-light-text-2 hover:border-maroon/30 hover:text-maroon'
          }`}
        >
          {editing ? <><X className="w-4 h-4" /> Cancel</> : <><Edit2 className="w-4 h-4" /> Edit Profile</>}
        </button>
      </div>

      {/* Avatar */}
      <div className={`p-6 rounded-2xl border ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}>
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-maroon to-gold flex items-center justify-center text-2xl font-bold text-white shrink-0">
            {(user?.name || profile.name).split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div>
            <h3 className={`font-display text-lg font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>{profile.name || user?.name}</h3>
            <p className={`text-sm ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
              Family Account · Member since {new Date(profile.memberSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs text-emerald-600 font-medium">Email Verified</span>
              {!profile.verifiedPhone && (
                <>
                  <span className={`text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>·</span>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-xs text-amber-600 font-medium">Phone not verified</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}>
        <h4 className={`font-display font-semibold text-sm uppercase tracking-wide ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
          Contact Information
        </h4>
        <div className="space-y-3">
          {[
            { icon: User, label: 'Full Name', value: profile.name, field: 'name', readOnly: true },
            { icon: Mail, label: 'Email', value: profile.email, field: 'email', readOnly: true },
            { icon: Phone, label: 'Phone', value: profile.phone, field: 'phone', readOnly: false },
            { icon: MapPin, label: 'Location', value: profile.location, field: 'location', readOnly: false },
          ].map(({ icon: Icon, label, value, field, readOnly }) => (
            <div key={field} className="flex items-center gap-3">
              <Icon className={`w-4 h-4 shrink-0 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
              <div className="flex-1 min-w-0">
                <div className={`text-xs mb-0.5 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>{label}</div>
                {editing && !readOnly ? (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setProfile((p) => ({ ...p, [field]: e.target.value }))}
                    className={`w-full text-sm px-3 py-1.5 rounded-lg border outline-none ${
                      isDark ? 'bg-void border-void-border text-ink' : 'bg-light-bg border-light-border text-light-text'
                    }`}
                  />
                ) : (
                  <div className={`text-sm ${value ? (isDark ? 'text-ink' : 'text-light-text') : (isDark ? 'text-ink-muted' : 'text-light-text-muted')}`}>
                    {value || (editing ? '' : `Add ${label.toLowerCase()}`)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About Family */}
      <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}>
        <h4 className={`font-display font-semibold text-sm uppercase tracking-wide ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
          About Our Family
        </h4>
        {editing ? (
          <textarea
            value={profile.description}
            onChange={(e) => setProfile((p) => ({ ...p, description: e.target.value }))}
            rows={4}
            placeholder="Tell caregivers about your family, schedule, and what you're looking for..."
            className={`w-full text-sm px-3 py-2 rounded-lg border outline-none resize-none placeholder:opacity-60 ${
              isDark ? 'bg-void border-void-border text-ink placeholder:text-ink-muted' : 'bg-light-bg border-light-border text-light-text placeholder:text-light-text-muted'
            }`}
          />
        ) : (
          <p className={`text-sm leading-relaxed ${profile.description ? (isDark ? 'text-ink-light' : 'text-light-text-2') : (isDark ? 'text-ink-muted' : 'text-light-text-muted')}`}>
            {profile.description || 'No description yet. Click Edit Profile to add one.'}
          </p>
        )}
      </div>

      {/* Languages */}
      <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}>
        <h4 className={`font-display font-semibold text-sm uppercase tracking-wide ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
          Languages Spoken
        </h4>
        {!editing && profile.languages.length === 0 ? (
          <p className={`text-sm ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>No languages added yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(editing ? languageOptions : profile.languages).map((lang) => {
              const selected = profile.languages.includes(lang);
              return (
                <button
                  key={lang}
                  onClick={() => editing && toggleLanguage(lang)}
                  disabled={!editing}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    selected
                      ? 'bg-gradient-to-r from-maroon to-gold text-white border-transparent'
                      : isDark
                        ? 'bg-void border-void-border text-ink-light'
                        : 'bg-light-bg border-light-border text-light-text-2'
                  } ${editing ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
                >
                  {lang}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Looking For */}
      <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}>
        <h4 className={`font-display font-semibold text-sm uppercase tracking-wide ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
          We Are Looking For
        </h4>
        {!editing && profile.lookingFor.length === 0 ? (
          <p className={`text-sm ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>No care types selected yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(editing ? careTypes : profile.lookingFor).map((type) => {
              const selected = profile.lookingFor.includes(type);
              return (
                <button
                  key={type}
                  onClick={() => editing && toggleCareType(type)}
                  disabled={!editing}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    selected
                      ? 'bg-gradient-to-r from-maroon to-gold text-white border-transparent'
                      : isDark
                        ? 'bg-void border-void-border text-ink-light'
                        : 'bg-light-bg border-light-border text-light-text-2'
                  } ${editing ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Save Button */}
      {editing && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-maroon to-gold text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity btn-press shadow-md shadow-maroon/20 disabled:opacity-70"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      )}
    </div>
  );
}
