/**
 * useJobPosts
 *
 * Returns job posts for the logged-in family user.
 * Fetches from `job_posts` table where family_id = user.id.
 * Returns empty array when user has no posts yet.
 *
 * toggleStatus and deleteJob update local state + persist to Supabase.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { type JobPost } from '../data/dashboardMockData';

export interface UseJobPostsReturn {
  jobs: JobPost[];
  isLoading: boolean;
  toggleStatus: (id: string) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  addJob: (job: Omit<JobPost, 'id' | 'postedDate' | 'applicants' | 'views'>) => Promise<void>;
}

export function useJobPosts(): UseJobPostsReturn {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user || !isSupabaseConfigured) return;

    setIsLoading(true);

    supabase
      .from('job_posts')
      .select('*')
      .eq('family_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setIsLoading(false);
        if (!data) return;

        const mapped: JobPost[] = data.map((row) => {
          const now = new Date();
          const expiresAt = row.expires_at ? new Date(row.expires_at) : null;
          const autoStatus =
            expiresAt && expiresAt < now ? 'expired' : (row.status as 'active' | 'paused' | 'expired');

          return {
            id: row.id,
            title: row.title,
            category: row.category,
            location: row.location,
            postedDate: row.created_at.slice(0, 10),
            expiresDate: row.expires_at ? row.expires_at.slice(0, 10) : '',
            status: autoStatus,
            applicants: 0,
            views: 0,
            budget: row.salary,
            description: row.description ?? '',
            requirements: row.requirements ?? [],
            languages: row.languages ?? [],
          };
        });

        setJobs(mapped);
      });
  }, [user]);

  const toggleStatus = useCallback(
    async (id: string) => {
      let nextStatus: 'active' | 'paused' = 'active';

      setJobs((prev) => {
        const updated = prev.map((j) => {
          if (j.id !== id) return j;
          nextStatus = j.status === 'active' ? 'paused' : 'active';
          return { ...j, status: nextStatus };
        });
        return updated;
      });

      if (!user || !isSupabaseConfigured) return;

      await supabase
        .from('job_posts')
        .update({ status: nextStatus })
        .eq('id', id)
        .eq('family_id', user.id);
    },
    [user]
  );

  const deleteJob = useCallback(
    async (id: string) => {
      setJobs((prev) => prev.filter((j) => j.id !== id));

      if (!user || !isSupabaseConfigured) return;

      await supabase
        .from('job_posts')
        .delete()
        .eq('id', id)
        .eq('family_id', user.id);
    },
    [user]
  );

  const addJob = useCallback(
    async (job: Omit<JobPost, 'id' | 'postedDate' | 'applicants' | 'views'>) => {
      const newJob: JobPost = {
        ...job,
        id: `local-${Date.now()}`,
        postedDate: new Date().toISOString().slice(0, 10),
        applicants: 0,
        views: 0,
      };
      setJobs((prev) => [newJob, ...prev]);

      if (!user || !isSupabaseConfigured) return;

      const { data } = await supabase
        .from('job_posts')
        .insert({
          family_id: user.id,
          family_name: user.name,
          title: job.title,
          category: job.category,
          location: job.location,
          salary: job.budget,
          description: job.description,
          requirements: job.requirements,
          languages: job.languages,
          status: job.status,
          expires_at: job.expiresDate ? new Date(job.expiresDate).toISOString() : null,
        })
        .select('id')
        .single();

      if (data?.id) {
        setJobs((prev) =>
          prev.map((j) => (j.id === newJob.id ? { ...j, id: data.id } : j))
        );
      }
    },
    [user]
  );

  return { jobs, isLoading, toggleStatus, deleteJob, addJob };
}
