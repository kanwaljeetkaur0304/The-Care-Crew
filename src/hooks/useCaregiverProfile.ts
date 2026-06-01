/**
 * useCaregiverProfile
 *
 * Returns the logged-in caregiver's profile + listing data.
 * Fetches from `caregiver_profiles` table. If no row exists yet
 * (new account), returns blank defaults so the UI is never empty.
 *
 * updateProfile / updateListing save changes locally and persist to Supabase.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import {
  type CaregiverProfile,
  type CaregiverListing,
  type AvailabilityType,
} from '../data/dashboardMockData';

export interface UseCaregiverProfileReturn {
  profile: CaregiverProfile;
  listing: CaregiverListing;
  isLoading: boolean;
  updateProfile: (updates: Partial<CaregiverProfile>) => Promise<void>;
  updateListing: (updates: Partial<CaregiverListing>) => Promise<void>;
}

function blankProfile(user: { name: string; email: string }): CaregiverProfile {
  return {
    name: user.name,
    email: user.email,
    phone: '',
    location: '',
    bio: '',
    experience: '',
    rate: '',
    languages: [],
    categories: [],
    certifications: [],
    skills: [],
    availability: [],
    verifiedEmail: true,
    verifiedPhone: false,
    backgroundCheck: false,
    memberSince: new Date().toISOString(),
    photoUrl: undefined,
  };
}

function blankListing(): CaregiverListing {
  return {
    title: '',
    category: '',
    location: '',
    rate: '',
    availability: [],
    weeklySchedule: {},
    experience: '',
    bio: '',
    languages: [],
    skills: [],
    certifications: [],
    status: 'active',
    views: 0,
    contactRequests: 0,
    createdDate: new Date().toISOString(),
  };
}

export function useCaregiverProfile(): UseCaregiverProfileReturn {
  const { user } = useAuth();

  const [profile, setProfile] = useState<CaregiverProfile>(() =>
    blankProfile(user ?? { name: '', email: '' })
  );
  const [listing,   setListing]   = useState<CaregiverListing>(blankListing());
  const [isLoading, setIsLoading] = useState(false);

  // Keep name/email in sync whenever auth user changes
  useEffect(() => {
    if (!user) return;
    setProfile((prev) => ({ ...prev, name: user.name, email: user.email }));
  }, [user?.id]);

  useEffect(() => {
    if (!user || !isSupabaseConfigured) return;

    setIsLoading(true);

    supabase
      .from('caregiver_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setIsLoading(false);
        if (!data) {
          setProfile(blankProfile(user));
          return;
        }

        setProfile({
          name: user.name,
          email: user.email,
          phone: data.phone ?? '',
          location: data.location ?? '',
          languages: data.languages ?? [],
          bio: data.bio ?? '',
          categories: data.categories ?? [],
          experience: data.experience ?? '',
          rate: data.rate ?? '',
          certifications: data.certifications ?? [],
          skills: data.skills ?? [],
          availability: (data.availability ?? []) as AvailabilityType[],
          verifiedEmail: true,
          verifiedPhone: false,
          backgroundCheck: data.background_check ?? false,
          memberSince: data.created_at,
          photoUrl: data.photo_url ?? undefined,
        });

        setListing({
          title: data.listing_title ?? '',
          category: (data.categories ?? [])[0] ?? '',
          location: data.location ?? '',
          rate: data.rate ?? '',
          availability: (data.availability ?? []) as AvailabilityType[],
          weeklySchedule: (data.weekly_schedule as Record<string, string[]>) ?? {},
          experience: data.experience ?? '',
          bio: data.bio ?? '',
          languages: data.languages ?? [],
          skills: data.skills ?? [],
          certifications: data.certifications ?? [],
          status: (data.listing_status as 'active' | 'paused') ?? 'active',
          views: 0,
          contactRequests: 0,
          createdDate: data.created_at,
        });
      });
  }, [user]);

  const updateProfile = useCallback(
    async (updates: Partial<CaregiverProfile>) => {
      setProfile((prev) => ({ ...prev, ...updates }));

      if (!user || !isSupabaseConfigured) return;

      const row: Record<string, unknown> = { id: user.id, updated_at: new Date().toISOString() };
      if (updates.phone !== undefined)          row.phone = updates.phone;
      if (updates.location !== undefined)       row.location = updates.location;
      if (updates.languages !== undefined)      row.languages = updates.languages;
      if (updates.bio !== undefined)            row.bio = updates.bio;
      if (updates.categories !== undefined)     row.categories = updates.categories;
      if (updates.experience !== undefined)     row.experience = updates.experience;
      if (updates.rate !== undefined)           row.rate = updates.rate;
      if (updates.certifications !== undefined) row.certifications = updates.certifications;
      if (updates.skills !== undefined)         row.skills = updates.skills;
      if (updates.availability !== undefined)   row.availability = updates.availability;
      if (updates.photoUrl !== undefined)       row.photo_url = updates.photoUrl;
      if (updates.backgroundCheck !== undefined) row.background_check = updates.backgroundCheck;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await supabase.from('caregiver_profiles').upsert(row as any);
    },
    [user]
  );

  const updateListing = useCallback(
    async (updates: Partial<CaregiverListing>) => {
      setListing((prev) => ({ ...prev, ...updates }));

      if (!user || !isSupabaseConfigured) return;

      const row: Record<string, unknown> = { id: user.id, updated_at: new Date().toISOString() };
      if (updates.title !== undefined)          row.listing_title = updates.title;
      if (updates.status !== undefined)         row.listing_status = updates.status;
      if (updates.weeklySchedule !== undefined) row.weekly_schedule = updates.weeklySchedule;
      if (updates.bio !== undefined)            row.bio = updates.bio;
      if (updates.rate !== undefined)           row.rate = updates.rate;
      if (updates.location !== undefined)       row.location = updates.location;
      if (updates.availability !== undefined)   row.availability = updates.availability;
      if (updates.languages !== undefined)      row.languages = updates.languages;
      if (updates.skills !== undefined)         row.skills = updates.skills;
      if (updates.certifications !== undefined) row.certifications = updates.certifications;
      if (updates.experience !== undefined)     row.experience = updates.experience;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await supabase.from('caregiver_profiles').upsert(row as any);
    },
    [user]
  );

  return { profile, listing, isLoading, updateProfile, updateListing };
}
