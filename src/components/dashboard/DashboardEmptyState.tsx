import { type LucideIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface DashboardEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function DashboardEmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: DashboardEmptyStateProps) {
  const { isDark } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
        isDark ? 'bg-void-lighter' : 'bg-light-surface-2'
      }`}>
        <Icon className={`w-8 h-8 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
      </div>
      <h3 className={`font-display text-lg font-semibold mb-2 ${isDark ? 'text-ink' : 'text-light-text'}`}>
        {title}
      </h3>
      <p className={`text-sm max-w-xs mb-6 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 bg-gradient-to-r from-maroon to-gold text-white text-sm font-medium rounded-full hover:opacity-90 transition-opacity btn-press"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
