import { createContext, useContext, useState, type ReactNode } from 'react';

interface UIContextType {
  authModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <UIContext.Provider
      value={{
        authModalOpen,
        openAuthModal: () => setAuthModalOpen(true),
        closeAuthModal: () => setAuthModalOpen(false),
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
}
