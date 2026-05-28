import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface ContactRequest {
  id: string;
  // Sender
  fromId: string;
  fromName: string;
  fromInitials: string;
  fromColor: string;
  fromRole: 'family' | 'caregiver';
  // Recipient
  toId: string;
  toRole: 'family' | 'caregiver';
  // Display
  category: string;
  location: string;
  message: string;
  date: string;
  status: 'pending' | 'accepted' | 'declined';
}

interface ContactRequestContextType {
  /** All requests sent by caregivers → received by families */
  familyInbox: ContactRequest[];
  /** All requests sent by families → received by caregivers */
  caregiverInbox: ContactRequest[];
  /** Send a new request */
  sendRequest: (req: Omit<ContactRequest, 'id' | 'date' | 'status'>) => void;
  /** Update status of a request */
  updateStatus: (id: string, status: 'accepted' | 'declined') => void;
  /** Check if current user already sent a request to a given target */
  hasSentTo: (fromId: string, toId: string) => boolean;
}

const ContactRequestContext = createContext<ContactRequestContextType | undefined>(undefined);

const STORAGE_KEY = 'carecrew_contact_requests';

function load(): ContactRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ContactRequest[]) : [];
  } catch {
    return [];
  }
}

function save(data: ContactRequest[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

const AVATAR_COLORS = [
  'from-maroon to-gold',
  'from-blue-500 to-cyan-400',
  'from-purple-500 to-pink-400',
  'from-emerald-500 to-teal-400',
  'from-amber-500 to-orange-400',
  'from-rose-500 to-red-400',
];

function colorForId(id: string) {
  const hash = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function ContactRequestProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<ContactRequest[]>(load);

  const familyInbox = requests.filter((r) => r.toRole === 'family');
  const caregiverInbox = requests.filter((r) => r.toRole === 'caregiver');

  const sendRequest = useCallback(
    (req: Omit<ContactRequest, 'id' | 'date' | 'status'>) => {
      const newReq: ContactRequest = {
        ...req,
        id: `req-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        fromColor: colorForId(req.fromId),
        date: new Date().toISOString(),
        status: 'pending',
      };

      // ── Persist to Supabase so the caregiver's dashboard shows a real count ──
      if (isSupabaseConfigured) {
        supabase.from('contact_requests').insert({
          id:        newReq.id,
          from_id:   newReq.fromId || null,
          from_name: newReq.fromName,
          from_role: newReq.fromRole,
          to_id:     newReq.toId,
          to_role:   newReq.toRole,
          category:  newReq.category || null,
          location:  newReq.location || null,
          message:   newReq.message,
          status:    'pending',
        }).then();
      }

      setRequests((prev) => {
        const updated = [newReq, ...prev];
        save(updated);
        return updated;
      });
    },
    []
  );

  const updateStatus = useCallback((id: string, status: 'accepted' | 'declined') => {
    setRequests((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, status } : r));
      save(updated);
      return updated;
    });
  }, []);

  const hasSentTo = useCallback(
    (fromId: string, toId: string) =>
      requests.some((r) => r.fromId === fromId && r.toId === toId),
    [requests]
  );

  return (
    <ContactRequestContext.Provider
      value={{ familyInbox, caregiverInbox, sendRequest, updateStatus, hasSentTo }}
    >
      {children}
    </ContactRequestContext.Provider>
  );
}

export function useContactRequests() {
  const ctx = useContext(ContactRequestContext);
  if (!ctx) throw new Error('useContactRequests must be used within ContactRequestProvider');
  return ctx;
}
