import { useState } from 'react';
import { Bell, MessageSquare, Mail, Sparkles, Star, Settings, Check } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { MOCK_NOTIFICATIONS, type Notification } from '../../../data/dashboardMockData';

const typeIcon: Record<string, React.ElementType> = {
  message: MessageSquare,
  contact: Mail,
  match: Sparkles,
  review: Star,
  system: Settings,
};

const typeColor: Record<string, string> = {
  message: 'bg-blue-500/10 text-blue-500',
  contact: 'bg-maroon/10 text-maroon',
  match: 'bg-gold/10 text-gold',
  review: 'bg-amber-500/10 text-amber-500',
  system: 'bg-gray-500/10 text-gray-500',
};

export default function FamilyNotifications() {
  const { isDark } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`font-display text-2xl font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
            Notifications
          </h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
              isDark ? 'border-void-border text-ink-light hover:text-gold hover:border-gold/40' : 'border-light-border text-light-text-2 hover:text-maroon hover:border-maroon/30'
            }`}
          >
            <Check className="w-3.5 h-3.5" /> Mark all read
          </button>
        )}
      </div>

      <div className={`rounded-2xl border overflow-hidden divide-y ${isDark ? 'bg-void-light border-void-border divide-void-border' : 'bg-white border-light-border divide-light-border'}`}>
        {notifications.length === 0 ? (
          <div className="py-16 text-center">
            <Bell className={`w-10 h-10 mx-auto mb-3 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
            <p className={`text-sm ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>No notifications yet</p>
          </div>
        ) : (
          notifications.map((n) => {
            const Icon = typeIcon[n.type] || Bell;
            return (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`flex items-start gap-4 p-4 cursor-pointer transition-colors hover:${isDark ? 'bg-void-lighter' : 'bg-light-surface-2'} ${
                  !n.read ? (isDark ? 'bg-gold/5' : 'bg-maroon/5') : ''
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 ${typeColor[n.type]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>{n.title}</div>
                  <div className={`text-sm mt-0.5 ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>{n.body}</div>
                  <div className={`text-xs mt-1 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>{n.time}</div>
                </div>
                {!n.read && (
                  <div className="w-2 h-2 rounded-full bg-maroon shrink-0 mt-1.5" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
