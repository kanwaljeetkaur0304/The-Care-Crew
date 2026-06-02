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
    phone?: string,
    location?: string
  ) => Promise<AuthResult>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function userFromSession(session: Session | null): Promise<User | null> {
  if (!session?.user) return null;

  const meta = session.user.user_metadata as { full_name?: string; role?: UserRole };

  // Fallback user built from auth metadata — works even if profiles table is missing
  const fallback: User = {
    id: session.user.id,
    name: meta?.full_name ?? session.user.email?.split('@')[0] ?? 'User',
    email: session.user.email ?? '',
    role: (meta?.role ?? 'family') as UserRole,
  };

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, role')
      .eq('id', session.user.id)
      .maybeSingle();

    return {
      ...fallback,
      name: profile?.full_name ?? fallback.name,
      role: (profile?.role ?? fallback.role) as UserRole,
    };
  } catch {
    // profiles table unreachable — use metadata fallback
    return fallback;
  }
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
    try {
      // Race: auth call vs 15-second timeout — prevents infinite spinner
      const authPromise = supabase.auth.signInWithPassword({ email, password });
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 15_000)
      );

      const { data, error } = await Promise.race([authPromise, timeoutPromise]);

      if (error) {
        return { ok: false, error: mapAuthError(error.message) };
      }

      // Set user immediately from auth metadata — no DB round-trip needed.
      // onAuthStateChange will also fire and may enrich the data from profiles.
      const meta = data.user?.user_metadata as { full_name?: string; role?: UserRole };
      setUser({
        id: data.user!.id,
        name: meta?.full_name ?? data.user!.email?.split('@')[0] ?? 'User',
        email: data.user!.email ?? '',
        role: (meta?.role ?? 'family') as UserRole,
      });

      return { ok: true };
    } catch (err) {
      const isTimeout = err instanceof Error && err.message === 'timeout';
      console.error('Login error:', err);
      return {
        ok: false,
        error: isTimeout
          ? 'Sign in is taking too long — check your connection and try again.'
          : 'Sign in failed. Please try again.',
      };
    } finally {
      // Always reset loading — prevents infinite spinner no matter what
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      role: UserRole,
      phone?: string,
      location?: string
    ): Promise<AuthResult> => {
      if (!isSupabaseConfigured) {
        return { ok: false, error: 'Supabase is not configured. Add your keys to .env' };
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name, role, phone: phone ?? null, location: location ?? null },
          },
        });

        if (error) {
          return { ok: false, error: mapAuthError(error.message) };
        }

        if (data.session && data.user) {
          // Save phone + location BEFORE signing out (needs active session for RLS)
          const table = role === 'family' ? 'family_profiles' : 'caregiver_profiles';
          const profileRow: Record<string, unknown> = { id: data.user.id };
          if (phone)    profileRow.phone    = phone;
          if (location) profileRow.location = location;
          if (phone || location) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error: e } = await supabase.from(table).upsert(profileRow as any);
            if (e) console.warn('Profile save after register:', e.message);
          }

          // Sign out immediately — registration must NOT create an automatic session.
          // The user is shown a success screen and must sign in manually.
          await supabase.auth.signOut();

          return { ok: true };
        }

        return { ok: true, needsEmailConfirmation: true };
      } catch (err) {
        console.error('Register error:', err);
        return { ok: false, error: 'Registration failed. Please try again.' };
      } finally {
        setIsLoading(false);
      }
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
