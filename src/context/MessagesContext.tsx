import { createContext, useContext, useState, type ReactNode } from 'react';
import { MOCK_MESSAGE_THREADS, type MessageThread, type ChatMessage } from '../data/dashboardMockData';

interface MessagesContextType {
  threads: MessageThread[];
  addThread: (thread: MessageThread) => void;
  sendMessage: (threadId: string, text: string) => void;
  markRead: (threadId: string) => void;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export function MessagesProvider({ children }: { children: ReactNode }) {
  const [threads, setThreads] = useState<MessageThread[]>(MOCK_MESSAGE_THREADS);

  const addThread = (thread: MessageThread) => {
    setThreads((prev) => {
      if (prev.some((t) => t.id === thread.id)) return prev;
      return [thread, ...prev];
    });
  };

  const sendMessage = (threadId: string, text: string) => {
    const msg: ChatMessage = {
      id: `m-${Date.now()}`,
      senderId: 'me',
      text,
      time: 'Just now',
      status: 'sent',
    };
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? { ...t, messages: [...t.messages, msg], lastMessage: text, lastTime: 'Just now', unread: 0 }
          : t
      )
    );
  };

  const markRead = (threadId: string) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, unread: 0 } : t))
    );
  };

  return (
    <MessagesContext.Provider value={{ threads, addThread, sendMessage, markRead }}>
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const ctx = useContext(MessagesContext);
  if (!ctx) throw new Error('useMessages must be used within MessagesProvider');
  return ctx;
}
