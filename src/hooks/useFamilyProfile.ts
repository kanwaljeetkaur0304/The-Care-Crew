/**
 * useFamilyProfile
 *
 * Returns the logged-in family's profile data.
 * - Demo user → MOCK_FAMILY_PROFILE (no Supabase calls).
 * - Real user → fetches from `family_profiles` table.
 *
 * updateProfile saves changes locally + persists to Supabase for real users.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { MOCK_FAMILY_PROFILE, type FamilyProfile } from '../data/dashboardMockData';

export interface UseFamilyProfileReturn {
  profile: FamilyProfile;
  isLoading: boolean;
  updateProfile: (updates: Partial<FamilyProfile>) => Promise<void>;
}

const DEMO_ID = 'demo-user';

export function useFamilyProfile(): UseFamilyProfileReturn {
  const { user } = useAuth();
  const [profile, setProfile] = useState<FamilyProfile>(MOCK_FAMILY_PROFILE);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user || user.id === DEMO_ID || !isSupabaseConfigured) return;

    setIsLoading(true);

    supabase
      .from('family_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setIsLoading(false);

        if (!data) {
          // No row yet — show real auth data with empty extras (not mock)
          setProfile({
            name: user.name,
            email: user.email,
            phone: '',
            location: '',
            languages: [],
            description: '',
            lookingFor: [],
            verifiedEmail: true,
            verifiedPhone: false,
            memberSince: new Date().toISOString(),
            totalHires: 0,
          });
          return;
        }

        setProfile({
          name: user.name,
          email: user.email,
          phone: data.phone ?? '',
          location: data.location ?? '',
          languages: data.languages ?? [],
          description: data.description ?? '',
          lookingFor: data.looking_for ?? [],
          verifiedEmail: true,
          verifiedPhone: false,
          memberSince: data.created_at,
          totalHires: 0,
        });
      });
  }, [user]);

  const updateProfile = useCallback(
    async (updates: Partial<FamilyProfile>) => {
      setProfile((prev) => ({ ...prev, ...updates }));

      if (!user || user.id === DEMO_ID || !isSupabaseConfigured) return;

      const row: Record<string, unknown> = { id: user.id, updated_at: new Date().toISOString() };
      if (updates.phone !== undefined)       row.phone = updates.phone;
      if (updates.location !== undefined)    row.location = updates.location;
      if (updates.languages !== undefined)   row.languages = updates.languages;
      if (updates.description !== undefined) row.description = updates.description;
      if (updates.lookingFor !== undefined)  row.looking_for = updates.lookingFor;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await supabase.from('family_profiles').upsert(row as any);
    },
    [user]
  );

  return { profile, isLoading, updateProfile };
}
