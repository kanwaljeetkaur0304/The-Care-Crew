import { ArrowRight, Search, Users, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeroProps {
  onPostAd: () => void;
  onBrowse: () => void;
}

export default function Hero({ onPostAd, onBrowse }: HeroProps) {
  const { isDark } = useTheme();

  return (
    <section className={`relative overflow-hidden grain transition-colors duration-300 ${
      isDark ? 'bg-void' : 'bg-light-bg'
    }`}>
      <div className="absolute top-20 right-[-80px] w-72 h-72 bg-maroon/15 blob animate-float blur-3xl" />
      <div className="absolute bottom-10 left-[-60px] w-56 h-56 bg-gold/10 blob-2 animate-float-delayed blur-3xl" />
      <div className="absolute top-40 left-[20%] w-32 h-32 bg-emerald/10 rounded-full animate-float blur-2xl" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-32 right-[30%] w-48 h-48 bg-indigo/10 rounded-full animate-float-delayed blur-3xl" style={{ animationDelay: '3s' }} />

      <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-4 md:pt-28 md:pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="max-w-xl">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase mb-8 animate-fade-up border ${
              isDark
                ? 'bg-void-lighter border-void-border text-gold'
                : 'bg-white border-light-border text-maroon'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              Trusted by 12,000+ families across USA &amp; Canada
            </div>

            <h1 className={`font-display text-4xl md:text-5xl font-semibold leading-[1.1] tracking-tight mb-5 animate-fade-up animate-delay-1 ${
              isDark ? 'text-ink' : 'text-light-text'
            }`}>
              Where families find
              <span className="italic text-gold"> trusted</span>
              <br />
              caregivers &amp; care jobs
            </h1>

            <p className={`text-base md:text-lg leading-relaxed max-w-lg mb-8 animate-fade-up animate-delay-2 ${
              isDark ? 'text-ink-light' : 'text-light-text-2'
            }`}>
              Connect with compassionate nannies, elder caregivers, cooks, housekeepers, and cleaners. 
              Whether you are hiring or seeking work, your perfect match is here.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 animate-fade-up animate-delay-3">
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
          </div>

          <div className="relative flex items-center justify-center animate-fade-up animate-delay-2">
            <div className="absolute w-[340px] h-[340px] md:w-[420px] md:h-[420px] rounded-full bg-gradient-to-br from-gold/20 via-maroon/10 to-transparent blur-2xl" />
            <div className="absolute w-[300px] h-[300px] md:w-[380px] md:h-[380px] rounded-full border-2 border-dashed border-gold/20 animate-[spin_20s_linear_infinite]" />
            <div className="absolute w-[320px] h-[320px] md:w-[400px] md:h-[400px] rounded-full border border-maroon/10 animate-[spin_30s_linear_infinite_reverse]" />

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
              { value: '12,400+', label: 'Active Listings' },
              { value: '8,200+', label: 'Caregivers' },
              { value: '4,500+', label: 'Families Hired' },
              { value: '96%', label: 'Satisfaction Rate' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-3xl md:text-4xl font-semibold text-gold">{stat.value}</div>
                <div className={`text-sm mt-1.5 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
