import { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { MOCK_MESSAGE_THREADS, type MessageThread } from '../../../data/dashboardMockData';
import DashboardEmptyState from '../../../components/dashboard/DashboardEmptyState';

export default function FamilyMessages() {
  const { isDark } = useTheme();
  const [threads, setThreads] = useState<MessageThread[]>(MOCK_MESSAGE_THREADS);
  const [activeThread, setActiveThread] = useState<MessageThread | null>(threads[0] || null);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (!newMessage.trim() || !activeThread) return;
    const msg = {
      id: `m-${Date.now()}`,
      senderId: 'me',
      text: newMessage.trim(),
      time: 'Just now',
      status: 'sent' as const,
    };
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? { ...t, messages: [...t.messages, msg], lastMessage: msg.text, lastTime: 'Just now', unread: 0 }
          : t
      )
    );
    setActiveThread((prev) =>
      prev ? { ...prev, messages: [...prev.messages, msg], lastMessage: msg.text, lastTime: 'Just now' } : prev
    );
    setNewMessage('');
  };

  const selectThread = (thread: MessageThread) => {
    setThreads((prev) => prev.map((t) => t.id === thread.id ? { ...t, unread: 0 } : t));
    setActiveThread({ ...thread, unread: 0 });
  };

  const totalUnread = threads.reduce((acc, t) => acc + t.unread, 0);

  return (
    <div className="space-y-4">
      <div>
        <h2 className={`font-display text-2xl font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
          Messages
        </h2>
        <p className={`text-sm mt-1 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
          {totalUnread > 0 ? `${totalUnread} unread message${totalUnread > 1 ? 's' : ''}` : 'All caught up!'}
        </p>
      </div>

      {threads.length === 0 ? (
        <DashboardEmptyState
          icon={MessageSquare}
          title="No messages yet"
          description="When you connect with caregivers, your conversations will appear here."
        />
      ) : (
        <div className={`flex rounded-2xl border overflow-hidden h-[560px] ${isDark ? 'border-void-border' : 'border-light-border'}`}>
          {/* Thread List */}
          <div className={`w-full sm:w-72 shrink-0 flex flex-col border-r ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'} ${activeThread ? 'hidden sm:flex' : 'flex'}`}>
            <div className={`px-4 py-3 border-b text-xs font-semibold uppercase tracking-wide ${isDark ? 'border-void-border text-ink-muted' : 'border-light-border text-light-text-muted'}`}>
              Conversations
            </div>
            <div className="flex-1 overflow-y-auto">
              {threads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => selectThread(thread)}
                  className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors border-b ${
                    activeThread?.id === thread.id
                      ? isDark ? 'bg-void-lighter border-void-border' : 'bg-light-surface-2 border-light-border'
                      : isDark ? 'hover:bg-void-lighter border-void-border' : 'hover:bg-light-surface-2 border-light-border'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${thread.withColor} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                    {thread.withInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-sm font-semibold truncate ${isDark ? 'text-ink' : 'text-light-text'}`}>
                        {thread.withName}
                      </span>
                      <span className={`text-xs shrink-0 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                        {thread.lastTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-1 mt-0.5">
                      <span className={`text-xs truncate ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                        {thread.lastMessage}
                      </span>
                      {thread.unread > 0 && (
                        <span className="w-5 h-5 bg-maroon text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                          {thread.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Panel */}
          {activeThread ? (
            <div className={`flex-1 flex flex-col min-w-0 ${isDark ? 'bg-void' : 'bg-light-bg'}`}>
              {/* Chat Header */}
              <div className={`flex items-center gap-3 px-5 py-3.5 border-b ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}>
                <button
                  onClick={() => setActiveThread(null)}
                  className={`sm:hidden text-xs font-medium ${isDark ? 'text-ink-muted hover:text-gold' : 'text-light-text-muted hover:text-maroon'}`}
                >
                  ←
                </button>
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${activeThread.withColor} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                  {activeThread.withInitials}
                </div>
                <div>
                  <div className={`text-sm font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>{activeThread.withName}</div>
                  <div className={`text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>{activeThread.category}</div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeThread.messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                      msg.senderId === 'me'
                        ? 'bg-gradient-to-r from-maroon to-gold text-white rounded-br-sm'
                        : isDark
                          ? 'bg-void-lighter text-ink rounded-bl-sm'
                          : 'bg-white text-light-text rounded-bl-sm shadow-sm'
                    }`}>
                      {msg.text}
                      <div className={`text-[10px] mt-1 ${msg.senderId === 'me' ? 'text-white/60 text-right' : isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                        {msg.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className={`px-4 py-3 border-t ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}>
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${isDark ? 'bg-void border-void-border' : 'bg-light-bg border-light-border'}`}
                >
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className={`flex-1 bg-transparent text-sm outline-none ${isDark ? 'text-ink placeholder:text-ink-muted' : 'text-light-text placeholder:text-light-text-muted'}`}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="p-2 bg-gradient-to-r from-maroon to-gold text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className={`flex-1 hidden sm:flex items-center justify-center ${isDark ? 'bg-void' : 'bg-light-bg'}`}>
              <div className="text-center">
                <MessageSquare className={`w-10 h-10 mx-auto mb-3 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`} />
                <p className={`text-sm ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>Select a conversation</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
