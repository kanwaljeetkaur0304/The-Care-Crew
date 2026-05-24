import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search, Users, ShieldCheck, MapPin, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeroProps {
  onPostAd: () => void;
  onBrowse: () => void;
}

export default function Hero({ onPostAd, onBrowse }: HeroProps) {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCity, setSearchCity] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (searchCity.trim()) params.set('city', searchCity.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <section className={`relative overflow-hidden grain transition-colors duration-300 ${
      isDark ? 'bg-void' : 'bg-light-bg'
    }`}>
      <div className="absolute top-20 right-[-80px] w-72 h-72 bg-maroon/15 blob animate-float blur-3xl" />
      <div className="absolute bottom-10 left-[-60px] w-56 h-56 bg-marigold/12 blob-2 animate-float-delayed blur-3xl" />
      <div className="absolute top-40 left-[20%] w-32 h-32 bg-lotus/10 rounded-full animate-float blur-2xl" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-32 right-[30%] w-48 h-48 bg-saffron/8 rounded-full animate-float-delayed blur-3xl" style={{ animationDelay: '3s' }} />
      <div className="absolute top-10 left-[40%] w-20 h-20 bg-haldi/10 rounded-full animate-float blur-2xl" style={{ animationDelay: '4s' }} />

      <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-4 md:pt-28 md:pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase mb-8 animate-fade-up border bg-saffron/10 border-saffron/30 text-saffron">
              <ShieldCheck className="w-3.5 h-3.5" />
              Trusted by Asian &amp; Desi families across USA &amp; Canada
            </div>

            <h1 className={`font-display text-4xl md:text-5xl font-semibold leading-[1.1] tracking-tight mb-5 animate-fade-up animate-delay-1 ${
              isDark ? 'text-ink' : 'text-light-text'
            }`}>
              Find caregivers who
              <span className="italic text-gold"> feel like family</span>
              <br />
              — for families like yours
            </h1>

            <p className={`text-base md:text-lg leading-relaxed max-w-lg mb-8 animate-fade-up animate-delay-2 ${
              isDark ? 'text-ink-light' : 'text-light-text-2'
            }`}>
              Because your parents deserve someone who understands them — their language, their food, their culture.
              Whether you are hiring or seeking work, your perfect match is here.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className={`flex flex-row items-stretch gap-2 p-2 rounded-2xl border shadow-lg mb-6 animate-fade-up animate-delay-3 ${
              isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'
            }`}>
              <div className="flex flex-col sm:flex-row flex-1 min-w-0">
                <div className="flex items-center gap-2 px-3 py-1.5 flex-1 min-w-0">
                  <Search className={`w-4 h-4 shrink-0 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder='e.g. Nanny, Cook, Elder Care...'
                    className={`w-full bg-transparent text-sm outline-none ${isDark ? 'text-ink placeholder:text-ink-muted' : 'text-light-text placeholder:text-light-text-muted'}`}
                  />
                </div>
                <div className={`sm:hidden mx-3 h-px ${isDark ? 'bg-void-border' : 'bg-light-border'}`} />
                <div className={`hidden sm:block w-px self-stretch my-1 ${isDark ? 'bg-void-border' : 'bg-light-border'}`} />
                <div className="flex items-center gap-2 px-3 py-1.5 flex-1 min-w-0">
                  <MapPin className={`w-4 h-4 shrink-0 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                  <input
                    type="text"
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    placeholder='City e.g. Toronto, Brampton...'
                    className={`w-full bg-transparent text-sm outline-none ${isDark ? 'text-ink placeholder:text-ink-muted' : 'text-light-text placeholder:text-light-text-muted'}`}
                  />
                </div>
              </div>
              <button type="submit" className="btn-press px-4 py-2 bg-gradient-to-r from-maroon to-gold text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shrink-0 self-center">
                Search
              </button>
            </form>

            <div className="flex flex-col sm:flex-row gap-3 animate-fade-up animate-delay-4">
              <button
                onClick={onBrowse}
                className="btn-press inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-maroon to-gold text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-maroon/20"
              >
                <Search className="w-4 h-4" />
                Browse Listings
              </button>
              <button
                onClick={onPostAd}
                className={`btn-press inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-colors border ${
                  isDark
                    ? 'bg-void-lighter text-ink border-void-border hover:border-gold/40 hover:text-gold'
                    : 'bg-white text-light-text border-light-border hover:border-maroon/30 hover:text-maroon'
                }`}
              >
                <Users className="w-4 h-4" />
                Post an Ad
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Urgent hire teaser */}
            <div className="mt-5 animate-fade-up animate-delay-4">
              <a
                href="#urgent-hire"
                onClick={e => { e.preventDefault(); document.getElementById('urgent-hire')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="inline-flex items-center gap-2 group"
              >
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-semibold animate-pulse">
                  <Zap className="w-3 h-3 fill-red-500" />
                  Freelance caregivers available now
                </span>
                <ArrowRight className={`w-3.5 h-3.5 group-hover:translate-x-1 transition-transform ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
              </a>
            </div>
          </div>

          <div className="relative flex items-center justify-center animate-fade-up animate-delay-2 lg:translate-x-10 lg:-translate-y-8">
            <div className="absolute w-[340px] h-[340px] md:w-[420px] md:h-[420px] rounded-full bg-gradient-to-br from-marigold/20 via-maroon/10 to-lotus/10 blur-2xl" />
            <div className="absolute w-[300px] h-[300px] md:w-[380px] md:h-[380px] rounded-full border-2 border-dashed border-marigold/60 animate-[spin_20s_linear_infinite]" />
            <div className="absolute w-[320px] h-[320px] md:w-[400px] md:h-[400px] rounded-full border-2 border-lotus/50 animate-[spin_30s_linear_infinite_reverse]" />
            <div className="absolute w-[360px] h-[360px] md:w-[440px] md:h-[440px] rounded-full border-2 border-dashed border-saffron/45 animate-[spin_45s_linear_infinite]" />

            <div className="relative w-[280px] h-[280px] md:w-[360px] md:h-[360px] rounded-full overflow-hidden shadow-2xl shadow-gold/10">
              <img
                src="/hero-right.png"
                alt="Caregivers at work"
                className="w-full h-full object-cover"
                style={{
                  maskImage: 'radial-gradient(circle, black 58%, transparent 72%)',
                  WebkitMaskImage: 'radial-gradient(circle, black 58%, transparent 72%)',
                }}
              />
              <div className="absolute inset-0 rounded-full ring-2 ring-inset ring-gold/30 pointer-events-none" />
            </div>

            <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full shadow-lg border ${
              isDark
                ? 'bg-void-lighter border-void-border'
                : 'bg-white border-light-border'
            }`}>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {['bg-accent-nanny', 'bg-accent-cook', 'bg-accent-house', 'bg-accent-elder'].map((c, i) => (
                    <div key={i} className={`w-6 h-6 rounded-full ${c} border-2 ${isDark ? 'border-void-lighter' : 'border-white'}`} />
                  ))}
                </div>
                <span className={`text-xs font-medium ${isDark ? 'text-ink' : 'text-light-text'}`}>5 Care Types</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 pb-6 animate-fade-up animate-delay-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { value: '12,400+', label: 'Active Listings', color: 'text-marigold' },
              { value: '8,200+', label: 'Caregivers', color: 'text-saffron' },
              { value: '4,500+', label: 'Families Hired', color: 'text-lotus' },
              { value: '96%', label: 'Satisfaction Rate', color: 'text-gold' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className={`font-display text-3xl md:text-4xl font-semibold ${stat.color}`}>{stat.value}</div>
                <div className={`text-sm mt-1.5 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
