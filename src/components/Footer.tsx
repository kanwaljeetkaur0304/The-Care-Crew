import { HeartHandshake, Mail, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Footer() {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const familyLinks = [
    { label: 'Post a Job', href: '#' },
    { label: 'Browse Caregivers', href: '/caregivers' },
    { label: 'Safety Tips', href: '/safety-tips' },
    { label: 'Pricing', href: '/pricing' },
  ];

  const caregiverLinks = [
    { label: 'Create Profile', href: '#' },
    { label: 'Browse Jobs', href: '/jobs' },
    { label: 'Resume Tips', href: '/resume-tips' },
    { label: 'Resources', href: '/resources' },
  ];

  const handleNavClick = (href: string) => {
    navigate(href);
    setTimeout(() => window.scrollTo(0, 0), 0);
  };

  return (
    <footer className={`border-t transition-colors duration-300 ${
      isDark
        ? 'bg-void-light border-void-border'
        : 'bg-light-surface-2 border-light-border'
    }`}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-maroon to-gold flex items-center justify-center">
                <HeartHandshake className="w-5 h-5 text-white" />
              </div>
              <span className={`font-display text-xl font-semibold tracking-tight ${
                isDark ? 'text-ink' : 'text-light-text'
              }`}>
                The Care Crew
              </span>
            </div>
            <p className={`text-sm leading-relaxed ${
              isDark ? 'text-ink-muted' : 'text-light-text-muted'
            }`}>
              Connecting South Asian families with compassionate caregivers across USA &amp; Canada since 2020.
            </p>
          </div>

          <div>
            <h4 className={`font-display text-sm font-semibold mb-4 tracking-wide uppercase ${
              isDark ? 'text-gold' : 'text-maroon'
            }`}>For Families</h4>
            <ul className="space-y-3">
              {familyLinks.map((item) => (
                <li key={item.label}>
                  {item.href.startsWith('/') ? (
                    <button
                      onClick={() => handleNavClick(item.href)}
                      className={`text-sm transition-colors text-left ${
                        isDark
                          ? 'text-ink-muted hover:text-gold'
                          : 'text-light-text-muted hover:text-maroon'
                      }`}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <a href={item.href} className={`text-sm transition-colors ${
                      isDark
                        ? 'text-ink-muted hover:text-gold'
                        : 'text-light-text-muted hover:text-maroon'
                    }`}>
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={`font-display text-sm font-semibold mb-4 tracking-wide uppercase ${
              isDark ? 'text-gold' : 'text-maroon'
            }`}>For Caregivers</h4>
            <ul className="space-y-3">
              {caregiverLinks.map((item) => (
                <li key={item.label}>
                  {item.href.startsWith('/') ? (
                    <button
                      onClick={() => handleNavClick(item.href)}
                      className={`text-sm transition-colors text-left ${
                        isDark
                          ? 'text-ink-muted hover:text-gold'
                          : 'text-light-text-muted hover:text-maroon'
                      }`}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <a href={item.href} className={`text-sm transition-colors ${
                      isDark
                        ? 'text-ink-muted hover:text-gold'
                        : 'text-light-text-muted hover:text-maroon'
                    }`}>
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={`font-display text-sm font-semibold mb-4 tracking-wide uppercase ${
              isDark ? 'text-gold' : 'text-maroon'
            }`}>Contact</h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:kanwaljeetkaur0304@gmail.com" className={`flex items-center gap-2 text-sm transition-colors ${
                  isDark ? 'text-ink-muted hover:text-gold' : 'text-light-text-muted hover:text-maroon'
                }`}>
                  <Mail className="w-4 h-4 shrink-0" />
                  kanwaljeetkaur0304@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+19027892122" className={`flex items-center gap-2 text-sm transition-colors ${
                  isDark ? 'text-ink-muted hover:text-gold' : 'text-light-text-muted hover:text-maroon'
                }`}>
                  <Phone className="w-4 h-4 shrink-0" />
                  +1 (902) 789-2122
                </a>
              </li>
              <li className={`flex items-center gap-2 text-sm ${
                isDark ? 'text-ink-muted' : 'text-light-text-muted'
              }`}>
                <MapPin className="w-4 h-4 shrink-0" />
                Halifax, Nova Scotia, Canada
              </li>
            </ul>
          </div>
        </div>

        <div className={`mt-16 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 ${
          isDark ? 'border-void-border' : 'border-light-border'
        }`}>
          <p className={`text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
            © 2025 The Care Crew. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {[
              { label: 'Privacy', href: '/privacy' },
              { label: 'Terms', href: '/terms' },
              { label: 'Cookies', href: '/cookies' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className={`text-xs transition-colors ${
                  isDark
                    ? 'text-ink-muted hover:text-gold'
                    : 'text-light-text-muted hover:text-maroon'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
