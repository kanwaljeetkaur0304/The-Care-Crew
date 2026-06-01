/**
 * Job Matching Algorithm
 * ──────────────────────────────────────────────────────────────────────────────
 * Scores every JobListing in mockData against the caregiver's profile and
 * listing, producing a sorted list of JobMatch objects ready for the dashboard.
 *
 * Scoring weights (total 100 pts):
 *   30 pts  Category match   — must match; non-matching jobs are skipped entirely
 *   25 pts  Language match   — scans job description + requirements for language keywords
 *   20 pts  Location match   — same city = 20, same province/state = 10, other = 0
 *   15 pts  Budget vs rate   — hourly comparison; annual/visit salaries get neutral 7 pts
 *   10 pts  Availability     — compares schedule keywords with caregiver availability
 */

import { jobListings, type JobListing } from '../data/mockData';
import type { CaregiverProfile, CaregiverListing, JobMatch } from '../data/dashboardMockData';

// ── Language keyword map (English omitted — assumed universal) ─────────────────
const LANGUAGE_KEYWORDS: Record<string, string[]> = {
  Hindi:     ['hindi'],
  Punjabi:   ['punjabi'],
  Gujarati:  ['gujarati'],
  Tamil:     ['tamil'],
  Telugu:    ['telugu'],
  Urdu:      ['urdu'],
  Malayalam: ['malayalam'],
  Bengali:   ['bengali'],
  Marathi:   ['marathi'],
  Tagalog:   ['tagalog'],
  Arabic:    ['arabic'],
  Korean:    ['korean'],
};

// ── Category display label map ────────────────────────────────────────────────
const CATEGORY_LABEL: Record<string, string> = {
  nanny:       'Nanny',
  eldercare:   'Elder Care',
  cook:        'Cook / Chef',
  housekeeper: 'Housekeeper',
  cleaner:     'Cleaner',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Parse an hourly rate string like "$18/hr" or "$22 – $28 / hour". Returns null for annual/visit. */
function parseHourlyRate(s: string): { min: number; max: number } | null {
  const m = s.match(/\$(\d+)(?:\s*[–\-]\s*\$(\d+))?\s*\/\s*(?:hr|hour)/i);
  if (!m) return null;
  const min = parseInt(m[1], 10);
  const max = m[2] ? parseInt(m[2], 10) : min;
  return { min, max };
}

/** Languages from the caregiver's list that appear in the given job text. */
function detectMatchedLanguages(text: string, caregiverLangs: string[]): string[] {
  const lower = text.toLowerCase();
  return caregiverLangs.filter(lang => {
    const kws = LANGUAGE_KEYWORDS[lang];
    return kws ? kws.some(kw => lower.includes(kw)) : false;
  });
}

/** All languages (from the keyword map) mentioned anywhere in the job text. */
function detectAllJobLanguages(text: string): string[] {
  const lower = text.toLowerCase();
  return Object.entries(LANGUAGE_KEYWORDS)
    .filter(([, kws]) => kws.some(kw => lower.includes(kw)))
    .map(([lang]) => lang);
}

/** Convert a relative date string ("2 days ago", "1 week ago") to ISO YYYY-MM-DD. */
function relativeToISO(rel: string, referenceDate = '2026-05-24'): string {
  const base = new Date(referenceDate);
  const d = rel.match(/(\d+)\s*day/i);
  const w = rel.match(/(\d+)\s*week/i);
  if (d)  base.setDate(base.getDate() - parseInt(d[1], 10));
  if (w)  base.setDate(base.getDate() - parseInt(w[1], 10) * 7);
  return base.toISOString().slice(0, 10);
}

// ── Main function ─────────────────────────────────────────────────────────────

export function computeJobMatches(
  profile: CaregiverProfile,
  listing: CaregiverListing,
  jobs?: JobListing[],          // real Supabase jobs; falls back to mock data if omitted
): JobMatch[] {
  // Merge profile + listing data so either source can fill gaps
  const caregiverCategories = [
    ...(profile.categories ?? []),
    listing.category,
  ];
  const caregiverLangs  = (profile.languages?.length ? profile.languages : listing.languages) ?? [];
  const caregiverAvail  = (profile.availability?.length ? profile.availability : listing.availability) ?? [];
  const caregiverRateStr = profile.rate ?? listing.rate ?? '';

  const caregiverCity     = listing.location.split(',')[0].trim().toLowerCase();
  const caregiverProvince = (listing.location.split(',')[1] ?? '').trim().toLowerCase();
  const caregiverRate     = parseHourlyRate(caregiverRateStr);

  const pool = jobs ?? jobListings; // real jobs when available, mock as fallback
  const results: JobMatch[] = [];

  for (const job of pool) {
    // ── 1. Category match (30 pts) — HARD FILTER ──────────────────────────────
    const jobLabel = CATEGORY_LABEL[job.category] ?? job.category;
    const categoryMatch = caregiverCategories.some(cat => {
      const c = cat.toLowerCase();
      const j = jobLabel.toLowerCase();
      // 'babysitter' is treated as equivalent to 'nanny' for matching
      return c === j || (j === 'nanny' && c === 'babysitter');
    });
    if (!categoryMatch) continue; // skip irrelevant categories entirely

    let score = 30;

    // ── 2. Language match (25 pts) ─────────────────────────────────────────────
    const jobText      = [job.description, ...job.requirements].join(' ');
    const allJobLangs  = detectAllJobLanguages(jobText);
    const matchedLangs = detectMatchedLanguages(jobText, caregiverLangs);

    if (allJobLangs.length === 0) {
      score += 12; // No language requirement stated — neutral
    } else {
      score += Math.round((matchedLangs.length / allJobLangs.length) * 25);
    }

    // ── 3. Location match (20 pts) ─────────────────────────────────────────────
    const jobCity     = job.location.split(',')[0].trim().toLowerCase();
    const jobProvince = (job.location.split(',')[1] ?? '').trim().toLowerCase();

    if (jobCity === caregiverCity) {
      score += 20; // Same city — best match
    } else if (caregiverProvince && jobProvince && jobProvince === caregiverProvince) {
      score += 10; // Same province / state
    }
    // Different province/state → 0

    // ── 4. Budget vs Rate (15 pts) ─────────────────────────────────────────────
    const jobRate = parseHourlyRate(job.salary);

    if (caregiverRate && jobRate) {
      if (caregiverRate.min <= jobRate.max) {
        score += 15; // Caregiver is within or below the job's budget — great fit
      } else if (caregiverRate.min <= jobRate.max * 1.15) {
        score += 8;  // Slightly above budget — may negotiate
      } else {
        score += 3;  // Significantly above budget
      }
    } else {
      score += 7; // Annual / per-visit salary — can't compare hourly, neutral
    }

    // ── 5. Availability match (10 pts) ─────────────────────────────────────────
    const sched = (job.schedule + ' ' + job.description).toLowerCase();
    let availScore = 5; // default: neutral / unknown

    if (/full[\s-]time|mon[–\-]fri|mon[–\-]sat/i.test(sched)) {
      availScore = caregiverAvail.includes('full-time') ? 10
                 : caregiverAvail.includes('part-time') ? 5
                 : 2;
    } else if (/part[\s-]time|flexible/i.test(sched)) {
      availScore = (caregiverAvail.includes('part-time') || caregiverAvail.includes('full-time')) ? 10 : 4;
    } else if (/live[\s-]in/i.test(sched)) {
      availScore = caregiverAvail.includes('live-in') ? 10 : 3;
    } else if (/weekend|sat[–\-]sun/i.test(sched)) {
      availScore = (caregiverAvail.includes('weekends') || caregiverAvail.includes('part-time')) ? 10 : 5;
    } else if (/overnight|night shift/i.test(sched)) {
      availScore = 5; // Overnight — partial credit regardless
    }

    score += availScore;

    // ── Build the JobMatch object ──────────────────────────────────────────────
    // Languages displayed = what the job mentions (or 'English' if none detected)
    const displayLangs = allJobLangs.length > 0 ? allJobLangs : ['English'];

    results.push({
      id:          job.id,
      title:       job.title,
      family:      job.postedBy,
      location:    job.location,
      budget:      job.salary,
      postedDate:  relativeToISO(job.postedDate),
      matchScore:  Math.min(score, 99), // cap at 99; 100 would feel artificial
      languages:   displayLangs,
      category:    jobLabel,
      description: job.description,
      saved:       false,
    });
  }

  // Best matches first
  return results.sort((a, b) => b.matchScore - a.matchScore);
}
