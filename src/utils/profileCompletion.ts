/**
 * Profile Completion Calculator
 * ──────────────────────────────────────────────────────────────────────────────
 * Checks each meaningful field on a CaregiverProfile and returns a 0-100 score,
 * a list of missing items, and a smart hint that surfaces the highest-value
 * improvement first.
 *
 * Total = 100 pts across 12 checks.
 * The bar on Overview reads this directly — no hardcoded numbers anywhere.
 */

import type { CaregiverProfile } from '../data/dashboardMockData';

interface Check {
  label: string;   // shown in the hint text
  points: number;
  passes: (p: CaregiverProfile) => boolean;
}

const CHECKS: Check[] = [
  {
    label: 'a profile photo',
    points: 12,
    passes: (p) => !!p.photoUrl,
  },
  {
    label: 'your full name',
    points: 10,
    passes: (p) => !!p.name?.trim(),
  },
  {
    label: 'a bio (20+ characters)',
    points: 10,
    passes: (p) => (p.bio?.trim().length ?? 0) >= 20,
  },
  {
    label: 'your location',
    points: 8,
    passes: (p) => !!p.location?.trim(),
  },
  {
    label: 'your hourly rate',
    points: 8,
    passes: (p) => !!p.rate?.trim(),
  },
  {
    label: 'at least one language',
    points: 8,
    passes: (p) => (p.languages?.length ?? 0) >= 1,
  },
  {
    label: 'at least one service category',
    points: 8,
    passes: (p) => (p.categories?.length ?? 0) >= 1,
  },
  {
    label: 'at least 3 skills',
    points: 8,
    passes: (p) => (p.skills?.length ?? 0) >= 3,
  },
  {
    label: 'at least one certification',
    points: 8,
    passes: (p) => (p.certifications?.length ?? 0) >= 1,
  },
  {
    label: 'your availability',
    points: 8,
    passes: (p) => (p.availability?.length ?? 0) >= 1,
  },
  {
    label: 'email verification',
    points: 7,
    passes: (p) => !!p.verifiedEmail,
  },
  {
    label: 'a background check',
    points: 5,
    passes: (p) => !!p.backgroundCheck,
  },
];

export interface CompletionResult {
  /** 0 – 100 score */
  score: number;
  /** Human-readable suggestion for the highest-value missing item */
  hint: string;
  /** All missing field labels, sorted highest-value first */
  missing: string[];
}

export function computeProfileCompletion(profile: CaregiverProfile): CompletionResult {
  let score = 0;
  const passed: Check[] = [];
  const failed: Check[] = [];

  for (const check of CHECKS) {
    if (check.passes(profile)) {
      score += check.points;
      passed.push(check);
    } else {
      failed.push(check);
    }
  }

  // Sort missing items by points descending so the hint surfaces the biggest win
  failed.sort((a, b) => b.points - a.points);

  const hint =
    failed.length === 0
      ? 'Your profile is 100% complete — you will appear at the top of search results!'
      : `Add ${failed[0].label} (+${failed[0].points}%) to get more contact requests`;

  return {
    score,
    hint,
    missing: failed.map((c) => c.label),
  };
}
