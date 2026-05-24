import { useState } from 'react';
import { X, Send, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { useContactRequests } from '../context/ContactRequestContext';

interface SendRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  targetName: string;
  targetRole: 'family' | 'caregiver'; // role of the RECIPIENT
  targetCategory: string;
  targetLocation: string;
}

export default function SendRequestModal({
  isOpen,
  onClose,
  targetId,
  targetName,
  targetRole,
  targetCategory,
  targetLocation,
}: SendRequestModalProps) {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { openAuthModal } = useUI();
  const { sendRequest, hasSentTo } = useContactRequests();

  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const alreadySent = user ? hasSentTo(user.id, targetId) : false;

  const handleSend = () => {
    if (!user) {
      onClose();
      openAuthModal();
      return;
    }
    if (!message.trim()) {
      setError('Please write a short message before sending.');
      return;
    }

    const initials = user.name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    sendRequest({
      fromId: user.id,
      fromName: user.name,
      fromInitials: initials,
      fromColor: 'from-maroon to-gold',
      fromRole: user.role as 'family' | 'caregiver',
      toId: targetId,
      toRole: targetRole,
      category: targetCategory,
      location: targetLocation,
      message: message.trim(),
    });

    setSent(true);
    setError('');
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setMessage('');
      setSent(false);
      setError('');
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div
        className={`relative z-10 w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden ${
          isDark ? 'bg-void border-void-border' : 'bg-white border-light-border'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-5 border-b ${isDark ? 'border-void-border' : 'border-light-border'}`}>
          <div className="flex items-center gap-2">
            <Send className={`w-4 h-4 ${isDark ? 'text-gold' : 'text-maroon'}`} />
            <h3 className={`font-display text-base font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
              {sent ? 'Request Sent' : `Contact ${targetName.split(' ')[0]}`}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className={`p-1.5 rounded-full transition-colors ${isDark ? 'hover:bg-void-lighter' : 'hover:bg-light-surface-2'}`}
          >
            <X className={`w-4 h-4 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
          </button>
        </div>

        <div className="p-6">
          {sent || alreadySent ? (
            /* Success state */
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <h4 className={`font-display text-lg font-semibold mb-2 ${isDark ? 'text-ink' : 'text-light-text'}`}>
                {alreadySent && !sent ? 'Already Sent' : 'Request Sent!'}
              </h4>
              <p className={`text-sm mb-6 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                {alreadySent && !sent
                  ? `You've already sent a contact request to ${targetName.split(' ')[0]}. It will appear in their dashboard.`
                  : `Your request has been sent to ${targetName.split(' ')[0]}. It will appear in their Contact Requests.`}
              </p>
              <button
                onClick={handleClose}
                className="px-6 py-2.5 bg-gradient-to-r from-maroon to-gold text-white text-sm font-medium rounded-full btn-press"
              >
                Done
              </button>
            </div>
          ) : (
            /* Compose state */
            <div className="space-y-4">
              <div>
                <p className={`text-sm mb-1 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                  Sending to: <span className={`font-medium ${isDark ? 'text-ink' : 'text-light-text'}`}>{targetName}</span>
                  <span className={`ml-2 text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                    · {targetCategory} · {targetLocation}
                  </span>
                </p>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                  Your message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => { setMessage(e.target.value); setError(''); }}
                  placeholder={
                    targetRole === 'caregiver'
                      ? `Hi ${targetName.split(' ')[0]}, I came across your listing and I'm interested in connecting with you...`
                      : `Hi, I saw your job post and I'd love to help. I have experience in ${targetCategory}...`
                  }
                  rows={5}
                  maxLength={500}
                  className={`w-full text-sm px-4 py-3 rounded-xl border outline-none resize-none transition-colors ${
                    isDark
                      ? 'bg-void-light border-void-border text-ink placeholder:text-ink-muted focus:border-gold/50'
                      : 'bg-light-bg border-light-border text-light-text placeholder:text-light-text-muted focus:border-maroon/40'
                  }`}
                />
                <div className={`flex justify-between items-center mt-1 text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                  {error ? <span className="text-red-500">{error}</span> : <span />}
                  <span>{message.length}/500</span>
                </div>
              </div>

              {!user && (
                <p className={`text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                  You'll be asked to sign in before sending.
                </p>
              )}

              <button
                onClick={handleSend}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-maroon to-gold text-white font-medium rounded-xl transition-all btn-press shadow-md shadow-maroon/20"
              >
                <Send className="w-4 h-4" />
                Send Request
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
