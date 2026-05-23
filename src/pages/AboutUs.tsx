import { Link } from 'react-router-dom';
import { HeartHandshake, ArrowLeft, Heart, Users, ShieldCheck, Mail, Phone } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function AboutUs() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-void' : 'bg-light-bg'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors ${
        isDark ? 'bg-void/90 border-void-border' : 'bg-white/80 border-light-border'
      }`}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
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

      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">

        {/* Hero */}
        <div className="text-center mb-16">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase mb-6 border ${
            isDark ? 'bg-void-lighter border-void-border text-gold' : 'bg-white border-light-border text-maroon'
          }`}>
            <Heart className="w-3.5 h-3.5" />
            Our Story
          </div>
          <h1 className={`font-display text-4xl md:text-5xl font-semibold leading-tight mb-6 ${isDark ? 'text-ink' : 'text-light-text'}`}>
            Built from
            <span className="italic text-gold"> experience,</span>
            <br />
            driven by community
          </h1>
          <p className={`text-lg leading-relaxed max-w-2xl mx-auto ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>
            The Care Crew was created by someone who lived both sides of this story — as a caregiver, and as someone who watched families struggle to find the right one.
          </p>
        </div>

        {/* Founder Story */}
        <div className={`rounded-3xl border p-8 md:p-12 mb-12 ${
          isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'
        }`}>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-maroon to-gold flex items-center justify-center shadow-lg shadow-maroon/20">
                <span className="font-display text-3xl font-bold text-white">K</span>
              </div>
              <div className="mt-3 text-center">
                <div className={`font-display text-sm font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>Kanwaljeet Kaur</div>
                <div className={`text-xs mt-0.5 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>Founder, The Care Crew</div>
              </div>
            </div>

            {/* Story */}
            <div className="space-y-5">
              <p className={`text-base leading-relaxed ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>
                When I was a student in Canada, I worked as a caregiver part-time — both in Canada and in the US. I needed the work, and I was good at it. But finding the right families to work with was harder than it should have been. There was no easy way to connect with families who shared my background, my language, my values.
              </p>
              <p className={`text-base leading-relaxed ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>
                At the same time, I saw so many families — South Asian, Punjabi, Gujarati, Tamil — struggling to find caregivers who could truly settle in. Not just someone who could do the job, but someone who spoke the same language as Dadi Ji, who understood why shoes come off at the door, who could cook dal and roti for the elders who had just arrived from back home.
              </p>
              <p className={`text-base leading-relaxed ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>
                And on the other side, so many skilled, caring people from our community — women from Punjab, caregivers from the Philippines, cooks from South India — were struggling to find good families who would treat them with respect and pay them fairly.
              </p>
              <p className={`text-base leading-relaxed font-medium ${isDark ? 'text-ink' : 'text-light-text'}`}>
                So I created The Care Crew — a place where families like ours can find caregivers who feel like family. Where community, language, and culture are not afterthoughts, but the whole point.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: Heart,
              title: 'Community First',
              desc: 'We built this for South Asian and Asian families across North America — people who want care that feels familiar, not foreign.',
            },
            {
              icon: Users,
              title: 'Both Sides Matter',
              desc: 'We care as much about the caregivers as the families. Fair pay, respect, and the right match matter equally on both sides.',
            },
            {
              icon: ShieldCheck,
              title: 'Trust & Safety',
              desc: 'Every listing is real. Every caregiver profile is from someone genuine. We build trust through transparency, not just promises.',
            },
          ].map((v) => (
            <div key={v.title} className={`rounded-2xl border p-6 ${
              isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'
            }`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                isDark ? 'bg-gold/10' : 'bg-maroon/5'
              }`}>
                <v.icon className={`w-6 h-6 ${isDark ? 'text-gold' : 'text-maroon'}`} />
              </div>
              <h3 className={`font-display text-lg font-semibold mb-2 ${isDark ? 'text-ink' : 'text-light-text'}`}>{v.title}</h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className={`rounded-3xl border p-8 text-center ${
          isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'
        }`}>
          <h2 className={`font-display text-2xl font-semibold mb-3 ${isDark ? 'text-ink' : 'text-light-text'}`}>
            Have questions? Reach out directly.
          </h2>
          <p className={`text-sm mb-6 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
            I read every message personally.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:kanwaljeetkaur0304@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-maroon to-gold text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-maroon/20"
            >
              <Mail className="w-4 h-4" />
              kanwaljeetkaur0304@gmail.com
            </a>
            <a
              href="tel:+19027892122"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium border transition-colors ${
                isDark
                  ? 'bg-void-lighter text-ink border-void-border hover:border-gold/40 hover:text-gold'
                  : 'bg-light-bg text-light-text border-light-border hover:border-maroon/30 hover:text-maroon'
              }`}
            >
              <Phone className="w-4 h-4" />
              +1 (902) 789-2122
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
