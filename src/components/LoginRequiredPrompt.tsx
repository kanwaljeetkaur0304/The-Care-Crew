import { Lock, X, LogIn, UserPlus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface LoginRequiredPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: () => void;
  message?: string;
}

export default function LoginRequiredPrompt({
  isOpen,
  onClose,
  onSignIn,
  message = 'You need to be signed in to continue.',
}: LoginRequiredPromptProps) {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className={`relative z-10 w-full max-w-sm rounded-3xl border shadow-2xl overflow-hidden ${
        isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'
      }`}>
        {/* Close */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors ${
            isDark ? 'hover:bg-void-lighter text-ink-muted' : 'hover:bg-light-surface-2 text-light-text-muted'
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-maroon/20 to-gold/20 flex items-center justify-center mx-auto mb-5">
            <Lock className="w-7 h-7 text-gold" />
          </div>

          {/* Title */}
          <h3 className={`font-display text-xl font-semibold mb-2 ${isDark ? 'text-ink' : 'text-light-text'}`}>
            Sign in to continue
          </h3>

          {/* Message */}
          <p className={`text-sm mb-7 leading-relaxed ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
            {message}
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => {
                onClose();
                onSignIn();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-maroon to-gold text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity btn-press shadow-lg shadow-maroon/20"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>

            <button
              onClick={() => {
                onClose();
                onSignIn();
              }}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-full border text-sm font-medium transition-colors ${
                isDark
                  ? 'border-void-border text-ink-light hover:border-gold/40 hover:text-gold'
                  : 'border-light-border text-light-text-2 hover:border-maroon/30 hover:text-maroon'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Create a Free Account
            </button>

            <button
              onClick={onClose}
              className={`w-full text-sm ${isDark ? 'text-ink-muted hover:text-ink' : 'text-light-text-muted hover:text-light-text'}`}
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
