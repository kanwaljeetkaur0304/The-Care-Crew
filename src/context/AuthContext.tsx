import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { UserRole } from '../types/database';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
}

export interface AuthResult {
  ok: boolean;
  needsEmailConfirmation?: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    phone?: string
  ) => Promise<AuthResult>;
  logout: () => Promise<void>;
  loginAsDemo: (role: UserRole) => void;
  isLoading: boolean;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function userFromSession(session: Session | null): Promise<User | null> {
  if (!session?.user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', session.user.id)
    .single();

  const meta = session.user.user_metadata as { full_name?: string; role?: UserRole };

  return {
    id: session.user.id,
    name: profile?.full_name ?? meta.full_name ?? 'User',
    email: session.user.email ?? '',
    role: (profile?.role ?? meta.role ?? 'family') as UserRole,
  };
}

function mapAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('invalid login credentials')) {
    return 'Invalid email or password';
  }
  if (lower.includes('user already registered')) {
    return 'An account with this email already exists';
  }
  if (lower.includes('email not confirmed')) {
    return 'Please confirm your email before signing in';
  }
  if (lower.includes('password')) {
    return message;
  }
  return message;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let mounted = true;

    supabase.auth.getSession()
      .then(async ({ data: { session } }) => {
        if (!mounted) return;
        setUser(await userFromSession(session));
      })
      .catch(() => {
        // Supabase unreachable — silently ignore, user stays null
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      setUser(await userFromSession(session));
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    if (!isSupabaseConfigured) {
      return { ok: false, error: 'Supabase is not configured. Add your keys to .env' };
    }

    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);

    if (error) {
      return { ok: false, error: mapAuthError(error.message) };
    }

    const nextUser = await userFromSession(data.session);
    setUser(nextUser);
    return { ok: true };
  }, []);

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      role: UserRole,
      phone?: string
    ): Promise<AuthResult> => {
      if (!isSupabaseConfigured) {
        return { ok: false, error: 'Supabase is not configured. Add your keys to .env' };
      }

      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role,
            phone,
          },
        },
      });
      setIsLoading(false);

      if (error) {
        return { ok: false, error: mapAuthError(error.message) };
      }

      if (data.session) {
        const nextUser = await userFromSession(data.session);
        setUser(nextUser);
        return { ok: true };
      }

      return { ok: true, needsEmailConfirmation: true };
    },
    []
  );

  const logout = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setUser(null);
      return;
    }
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setIsLoading(false);
  }, []);

  const loginAsDemo = useCallback((role: UserRole) => {
    setUser({
      id: 'demo-user',
      name: role === 'caregiver' ? 'Priya Sharma' : 'Kanwal Kaur',
      email: role === 'caregiver' ? 'priya@demo.com' : 'kanwal@demo.com',
      role,
    });
  }, []);

  // Only mark as loading when actively doing a login/register operation,
  // NOT during the initial Supabase session bootstrap. This prevents the
  // dashboard from showing an infinite spinner while getSession is in-flight.
  const busy = isLoading;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loginAsDemo,
        isLoading: busy,
        isConfigured: isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
