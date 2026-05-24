import { type LucideIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface DashboardStatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: 'gold' | 'maroon' | 'emerald' | 'blue' | 'purple';
}

const colorMap = {
  gold: { bg: 'bg-gold/10', text: 'text-gold', icon: 'text-gold' },
  maroon: { bg: 'bg-maroon/10', text: 'text-maroon', icon: 'text-maroon' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', icon: 'text-emerald-500' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-600', icon: 'text-blue-500' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-600', icon: 'text-purple-500' },
};

export default function DashboardStatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendUp,
  color = 'gold',
}: DashboardStatCardProps) {
  const { isDark } = useTheme();
  const c = colorMap[color];

  return (
    <div className={`rounded-2xl border p-5 transition-colors ${
      isDark
        ? 'bg-void-light border-void-border'
        : 'bg-white border-light-border'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${c.bg}`}>
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            trendUp
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-red-100 text-red-600'
          }`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
      <div className={`font-display text-2xl font-bold mb-1 ${isDark ? 'text-ink' : 'text-light-text'}`}>
        {value}
      </div>
      <div className={`text-sm ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>{label}</div>
    </div>
  );
}
