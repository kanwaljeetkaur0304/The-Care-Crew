import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, HeartHandshake, LogOut, ChevronDown, MapPin, Search, Sun, Moon, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { useTheme } from '../context/ThemeContext';

const POPULAR_CITIES = [
  'Toronto, ON', 'Vancouver, BC', 'Montreal, QC', 'Calgary, AB', 'Edmonton, AB',
  'Ottawa, ON', 'Winnipeg, MB', 'Quebec City, QC', 'Hamilton, ON', 'Kitchener, ON',
  'London, ON', 'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX',
  'San Francisco, CA', 'Seattle, WA', 'Miami, FL', 'Boston, MA', 'Dallas, TX',
  'Atlanta, GA', 'Denver, CO', 'Phoenix, AZ', 'Austin, TX', 'San Diego, CA',
  'Philadelphia, PA', 'San Jose, CA', 'Jacksonville, FL', 'Columbus, OH', 'Charlotte, NC',
  'Indianapolis, IN', 'Fort Worth, TX', 'Detroit, MI', 'El Paso, TX', 'Memphis, TN',
  'Louisville, KY', 'Milwaukee, WI', 'Baltimore, MD', 'Albuquerque, NM', 'Tucson, AZ',
  'Fresno, CA', 'Sacramento, CA', 'Kansas City, MO', 'Mesa, AZ', 'Omaha, NE',
  'Colorado Springs, CO', 'Raleigh, NC', 'Virginia Beach, VA', 'Oakland, CA', 'Minneapolis, MN',
  'Tulsa, OK', 'Arlington, TX', 'Wichita, KS', 'Bakersfield, CA',
];

interface NavbarProps {
  onPostAd: () => void;
  onAuth: () => void;
}

export default function Navbar({ onPostAd, onAuth }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const locationRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user, logout } = useAuth();
  const { selectedCity, setSelectedCity } = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Browse Jobs', href: '#listings' },
    { label: 'Caregivers', href: '#seekers' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'About Us', href: '/about' },
  ];

  const initials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const filteredCities = POPULAR_CITIES.filter((city) =>
    city.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setLocationOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (locationOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [locationOpen]);

  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    setSearchQuery('');
    setLocationOpen(false);
  };

  const handleClearLocation = () => {
    setSelectedCity('All Locations');
    setSearchQuery('');
    setLocationOpen(false);
  };

  const displayCity = selectedCity === 'All Locations' ? 'Select Location' : selectedCity;

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors ${
      isDark
        ? 'bg-void/90 border-void-border'
        : 'bg-white/80 border-light-border'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <a href="#" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-maroon to-gold flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-maroon/20">
            <HeartHandshake className="w-5 h-5 text-white" />
          </div>
          <span className={`font-display text-xl font-semibold tracking-tight whitespace-nowrap ${
            isDark ? 'text-ink' : 'text-light-text'
          }`}>
            The Care Crew
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            link.href.startsWith('/') ? (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium link-underline transition-colors whitespace-nowrap ${
                  isDark
                    ? 'text-ink-light hover:text-gold'
                    : 'text-light-text-2 hover:text-maroon'
                }`}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium link-underline transition-colors whitespace-nowrap ${
                  isDark
                    ? 'text-ink-light hover:text-gold'
                    : 'text-light-text-2 hover:text-maroon'
                }`}
              >
                {link.label}
              </a>
            )
          )}

          {/* Location Selector */}
          <div className="relative" ref={locationRef}>
            <button
              onClick={() => setLocationOpen(!locationOpen)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border transition-all ${
                selectedCity !== 'All Locations'
                  ? isDark
                    ? 'bg-gold/10 border-gold/40 text-gold'
                    : 'bg-maroon/10 border-maroon/30 text-maroon'
                  : isDark
                    ? 'bg-void-lighter border-void-border text-ink-light hover:border-gold/40 hover:text-gold'
                    : 'bg-light-surface-2 border-light-border text-light-text-2 hover:border-maroon/30 hover:text-maroon'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="max-w-[140px] truncate">{displayCity}</span>
              <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${locationOpen ? 'rotate-180' : ''}`} />
            </button>

            {locationOpen && (
              <div className={`absolute right-0 mt-2 w-72 rounded-2xl border shadow-2xl py-3 z-50 ${
                isDark
                  ? 'bg-void-light border-void-border'
                  : 'bg-white border-light-border'
              }`}>
                <div className="px-3 pb-2">
                  <div className="relative">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                      isDark ? 'text-ink-muted' : 'text-light-text-muted'
                    }`} />
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search city..."
                      className={`w-full pl-9 pr-8 py-2.5 border rounded-xl text-sm placeholder:text-opacity-60 ${
                        isDark
                          ? 'bg-void border-void-border text-ink placeholder:text-ink-muted'
                          : 'bg-light-bg border-light-border text-light-text placeholder:text-light-text-muted'
                      }`}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                          isDark ? 'text-ink-muted hover:text-ink' : 'text-light-text-muted hover:text-light-text'
                        }`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto">
                  {searchQuery.trim() && filteredCities.length === 0 ? (
                    <div className={`px-4 py-3 text-sm ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                      No cities found. Try another search.
                    </div>
                  ) : (
                    <>
                      {selectedCity !== 'All Locations' && (
                        <>
                          <button
                            onClick={handleClearLocation}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                              isDark
                                ? 'text-ink-muted hover:text-gold hover:bg-void-lighter'
                                : 'text-light-text-muted hover:text-maroon hover:bg-light-surface-2'
                            }`}
                          >
                            ← All Locations
                          </button>
                          <div className={`mx-3 my-1 h-px ${isDark ? 'bg-void-border' : 'bg-light-border'}`} />
                        </>
                      )}

                      {(searchQuery.trim() ? filteredCities : POPULAR_CITIES.slice(0, 8)).map((city) => (
                        <button
                          key={city}
                          onClick={() => handleSelectCity(city)}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                            selectedCity === city
                              ? isDark
                                ? 'text-gold bg-gold/10'
                                : 'text-maroon bg-maroon/10'
                              : isDark
                                ? 'text-ink-light hover:text-ink hover:bg-void-lighter'
                                : 'text-light-text-2 hover:text-light-text hover:bg-light-surface-2'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <MapPin className={`w-3.5 h-3.5 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                            {city}
                          </span>
                          {selectedCity === city && (
                            <div className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-gold' : 'bg-maroon'}`} />
                          )}
                        </button>
                      ))}

                      {!searchQuery.trim() && (
                        <>
                          <div className={`mx-3 my-1 h-px ${isDark ? 'bg-void-border' : 'bg-light-border'}`} />
                          <div className={`px-4 py-2 text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                            Type to search all {POPULAR_CITIES.length}+ cities
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full border transition-all ${
              isDark
                ? 'bg-void-lighter border-void-border text-gold hover:bg-gold/10'
                : 'bg-light-surface-2 border-light-border text-maroon hover:bg-maroon/10'
            }`}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {user ? (
            <>
              <button
                onClick={onPostAd}
                className="btn-press px-5 py-2.5 bg-gradient-to-r from-maroon to-gold text-white text-sm font-medium rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-maroon/20 whitespace-nowrap"
              >
                Post an Ad
              </button>
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center gap-2 pl-1 pr-2 py-1 rounded-full transition-colors border ${
                    isDark
                      ? 'hover:bg-void-lighter border-void-border'
                      : 'hover:bg-light-surface-2 border-light-border'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald to-teal flex items-center justify-center text-xs font-bold text-white">
                    {initials(user.name)}
                  </div>
                  <span className={`text-sm font-medium ${isDark ? 'text-ink' : 'text-light-text'}`}>{user.name.split(' ')[0]}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''} ${
                    isDark ? 'text-ink-muted' : 'text-light-text-muted'
                  }`} />
                </button>

                {userMenuOpen && (
                  <>
                    <div className={`absolute right-0 mt-2 w-48 rounded-2xl border shadow-2xl py-2 ${
                      isDark
                        ? 'bg-void-light border-void-border'
                        : 'bg-white border-light-border'
                    }`}>
                      <div className={`px-4 py-2 border-b mb-1 ${isDark ? 'border-void-border' : 'border-light-border'}`}>
                        <div className={`text-sm font-medium ${isDark ? 'text-ink' : 'text-light-text'}`}>{user.name}</div>
                        <div className={`text-xs capitalize ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>{user.role}</div>
                      </div>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          navigate('/dashboard');
                        }}
                        className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                          isDark
                            ? 'text-ink-light hover:text-gold hover:bg-void-lighter'
                            : 'text-light-text-2 hover:text-maroon hover:bg-light-surface-2'
                        }`}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        My Dashboard
                      </button>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                        }}
                        className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                          isDark
                            ? 'text-ink-light hover:text-gold hover:bg-void-lighter'
                            : 'text-light-text-2 hover:text-maroon hover:bg-light-surface-2'
                        }`}
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                    <div className="fixed inset-0 z-[-1]" onClick={() => setUserMenuOpen(false)} />
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={onAuth}
                className={`text-sm font-medium link-underline transition-colors whitespace-nowrap ${
                  isDark
                    ? 'text-ink-light hover:text-gold'
                    : 'text-light-text-2 hover:text-maroon'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={onAuth}
                className="btn-press px-5 py-2.5 bg-gradient-to-r from-maroon to-gold text-white text-sm font-medium rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-maroon/20 whitespace-nowrap"
              >
                Get Started
              </button>
            </>
          )}
        </div>

        <button
          className={`md:hidden p-2 ${isDark ? 'text-ink' : 'text-light-text'}`}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className={`md:hidden border-b px-6 pb-6 space-y-4 ${
          isDark
            ? 'bg-void-light border-void-border'
            : 'bg-white border-light-border'
        }`}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block text-sm font-medium ${
                isDark
                  ? 'text-ink-light hover:text-gold'
                  : 'text-light-text-2 hover:text-maroon'
              }`}
            >
              {link.label}
            </a>
          ))}

          <div className="py-2">
            <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
              isDark ? 'text-ink-muted' : 'text-light-text-muted'
            }`}>Location</div>
            <div className="relative mb-2">
              <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                isDark ? 'text-ink-muted' : 'text-light-text-muted'
              }`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your city..."
                className={`w-full pl-9 pr-4 py-3 border rounded-xl text-sm placeholder:text-opacity-60 ${
                  isDark
                    ? 'bg-void border-void-border text-ink placeholder:text-ink-muted'
                    : 'bg-light-bg border-light-border text-light-text placeholder:text-light-text-muted'
                }`}
              />
            </div>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {selectedCity !== 'All Locations' && (
                <button
                  onClick={() => {
                    handleClearLocation();
                    setMobileOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm ${
                    isDark ? 'text-ink-muted hover:text-gold' : 'text-light-text-muted hover:text-maroon'
                  }`}
                >
                  ← All Locations
                </button>
              )}
              {(searchQuery.trim() ? filteredCities : POPULAR_CITIES.slice(0, 6)).map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    handleSelectCity(city);
                    setMobileOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                    selectedCity === city
                      ? isDark
                        ? 'text-gold bg-gold/10'
                        : 'text-maroon bg-maroon/10'
                      : isDark
                        ? 'text-ink-light hover:bg-void-lighter'
                        : 'text-light-text-2 hover:bg-light-surface-2'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 py-2">
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-2 px-3 py-2 rounded-full border text-sm transition-colors ${
                isDark
                  ? 'bg-void-lighter border-void-border text-gold'
                  : 'bg-light-surface-2 border-light-border text-maroon'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>

          {user ? (
            <>
              <div className={`flex items-center gap-3 pt-2 border-t ${
                isDark ? 'border-void-border' : 'border-light-border'
              }`}>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald to-teal flex items-center justify-center text-xs font-bold text-white">
                  {initials(user.name)}
                </div>
                <div>
                  <div className={`text-sm font-medium ${isDark ? 'text-ink' : 'text-light-text'}`}>{user.name}</div>
                  <div className={`text-xs capitalize ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>{user.role}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  navigate('/dashboard');
                }}
                className={`w-full flex items-center justify-center gap-2 px-5 py-2.5 border text-sm font-medium rounded-full ${
                  isDark
                    ? 'bg-void-lighter border-void-border text-ink'
                    : 'bg-light-surface-2 border-light-border text-light-text'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                My Dashboard
              </button>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onPostAd();
                }}
                className="w-full btn-press px-5 py-2.5 bg-gradient-to-r from-maroon to-gold text-white text-sm font-medium rounded-full"
              >
                Post an Ad
              </button>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  logout();
                }}
                className={`w-full flex items-center justify-center gap-2 px-5 py-2.5 border text-sm font-medium rounded-full ${
                  isDark
                    ? 'bg-void-lighter border-void-border text-ink'
                    : 'bg-light-surface-2 border-light-border text-light-text'
                }`}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onAuth();
                }}
                className="w-full btn-press px-5 py-2.5 bg-gradient-to-r from-maroon to-gold text-white text-sm font-medium rounded-full"
              >
                Sign In / Register
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
