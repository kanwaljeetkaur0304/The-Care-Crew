// ─── Shared Types ────────────────────────────────────────────────────────────

export type ContactRequestStatus = 'pending' | 'accepted' | 'declined';
export type NotificationType = 'message' | 'contact' | 'match' | 'review' | 'system';
export type MessageStatus = 'sent' | 'delivered' | 'read';
export type AvailabilityType = 'full-time' | 'part-time' | 'weekends' | 'live-in';

// ─── Job Post (Family) ────────────────────────────────────────────────────────

export interface JobPost {
  id: string;
  title: string;
  category: string;
  location: string;
  postedDate: string;
  expiresDate: string;
  status: 'active' | 'paused' | 'expired';
  applicants: number;
  views: number;
  budget: string;
  description: string;
  requirements: string[];
  languages: string[];
}

export const MOCK_JOB_POSTS: JobPost[] = [
  {
    id: 'jp1',
    title: 'Experienced Nanny Needed — Brampton',
    category: 'Nanny',
    location: 'Brampton, ON',
    postedDate: '2026-05-10',
    expiresDate: '2026-06-10',
    status: 'active',
    applicants: 12,
    views: 184,
    budget: '$18–$22/hr',
    description: 'Looking for a caring nanny for our two children (ages 3 and 6). Must be comfortable with Indian culture and cooking light snacks.',
    requirements: ['2+ years experience', 'First Aid certified', 'Non-smoker'],
    languages: ['Hindi', 'English'],
  },
  {
    id: 'jp2',
    title: 'Part-time Housekeeper — Mississauga',
    category: 'Housekeeper',
    location: 'Mississauga, ON',
    postedDate: '2026-04-28',
    expiresDate: '2026-05-28',
    status: 'expired',
    applicants: 7,
    views: 92,
    budget: '$20/hr',
    description: 'Need a reliable housekeeper for 3 days a week. Experience with traditional Indian household preferred.',
    requirements: ['References required', '3 days/week'],
    languages: ['Punjabi', 'English'],
  },
  {
    id: 'jp3',
    title: 'Elder Care Companion — Toronto',
    category: 'Elder Care',
    location: 'Toronto, ON',
    postedDate: '2026-05-18',
    expiresDate: '2026-06-18',
    status: 'paused',
    applicants: 4,
    views: 61,
    budget: '$21–$24/hr',
    description: 'Companion needed for elderly mother who speaks Gujarati. Live-in position available.',
    requirements: ['Gujarati speaker preferred', 'Patient and kind', 'Live-in preferred'],
    languages: ['Gujarati', 'Hindi'],
  },
];

// ─── Saved Caregivers (Family) ────────────────────────────────────────────────

export interface SavedCaregiver {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviews: number;
  rate: string;
  experience: string;
  languages: string[];
  initials: string;
  color: string;
  savedDate: string;
  availability: string;
}

export const MOCK_SAVED_CAREGIVERS: SavedCaregiver[] = [
  {
    id: 'sc1',
    name: 'Priya Sharma',
    category: 'Nanny',
    location: 'Brampton, ON',
    rating: 4.9,
    reviews: 38,
    rate: '$18/hr',
    experience: '6 yrs exp',
    languages: ['Hindi', 'Punjabi', 'English'],
    initials: 'PS',
    color: 'from-pink-400 to-rose-500',
    savedDate: '2026-05-12',
    availability: 'Available Now',
  },
  {
    id: 'sc2',
    name: 'Meera Krishnan',
    category: 'Cook',
    location: 'Scarborough, ON',
    rating: 5.0,
    reviews: 21,
    rate: '$22/hr',
    experience: '10 yrs exp',
    languages: ['Tamil', 'English'],
    initials: 'MK',
    color: 'from-teal-400 to-emerald-500',
    savedDate: '2026-05-08',
    availability: 'Available Today',
  },
  {
    id: 'sc3',
    name: 'Harjit Kaur',
    category: 'Elder Care',
    location: 'Surrey, BC',
    rating: 4.7,
    reviews: 30,
    rate: '$21/hr',
    experience: '5 yrs exp',
    languages: ['Punjabi', 'Hindi', 'English'],
    initials: 'HK',
    color: 'from-violet-400 to-purple-500',
    savedDate: '2026-04-30',
    availability: 'Available Tomorrow',
  },
];

// ─── Contact Requests ─────────────────────────────────────────────────────────

export interface ContactRequest {
  id: string;
  fromName: string;
  fromRole: 'family' | 'caregiver';
  fromInitials: string;
  fromColor: string;
  category: string;
  location: string;
  message: string;
  date: string;
  status: ContactRequestStatus;
}

export const MOCK_FAMILY_CONTACT_REQUESTS: ContactRequest[] = [
  {
    id: 'cr1',
    fromName: 'Sunita Rathi',
    fromRole: 'caregiver',
    fromInitials: 'SR',
    fromColor: 'from-amber-400 to-orange-500',
    category: 'Cook',
    location: 'Toronto, ON',
    message: 'Hello! I saw your job post for a cook and I would love to help your family. I specialize in authentic Gujarati and Punjabi cuisine.',
    date: '2026-05-20',
    status: 'pending',
  },
  {
    id: 'cr2',
    fromName: 'Anita Desai',
    fromRole: 'caregiver',
    fromInitials: 'AD',
    fromColor: 'from-sky-400 to-blue-500',
    category: 'Nanny',
    location: 'Mississauga, ON',
    message: 'I have 8 years of experience caring for children. I speak Hindi and English fluently and have great references.',
    date: '2026-05-18',
    status: 'accepted',
  },
  {
    id: 'cr3',
    fromName: 'Kavya Nair',
    fromRole: 'caregiver',
    fromInitials: 'KN',
    fromColor: 'from-fuchsia-400 to-pink-500',
    category: 'Housekeeper',
    location: 'Brampton, ON',
    message: 'Very interested in the housekeeper position. Available to start immediately.',
    date: '2026-05-15',
    status: 'declined',
  },
];

export const MOCK_CAREGIVER_CONTACT_REQUESTS: ContactRequest[] = [
  {
    id: 'ccr1',
    fromName: 'Patel Family',
    fromRole: 'family',
    fromInitials: 'PF',
    fromColor: 'from-emerald-400 to-teal-500',
    category: 'Nanny',
    location: 'Brampton, ON',
    message: 'We are looking for a nanny for our 2-year-old. Your profile looks perfect. Would love to chat!',
    date: '2026-05-21',
    status: 'pending',
  },
  {
    id: 'ccr2',
    fromName: 'Singh Family',
    fromRole: 'family',
    fromInitials: 'SF',
    fromColor: 'from-indigo-400 to-blue-500',
    category: 'Elder Care',
    location: 'Mississauga, ON',
    message: 'My mother needs a companion who speaks Punjabi. Are you available on weekdays?',
    date: '2026-05-19',
    status: 'accepted',
  },
];

// ─── Messages ─────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  time: string;
  status: MessageStatus;
}

export interface MessageThread {
  id: string;
  withName: string;
  withInitials: string;
  withColor: string;
  withRole: 'family' | 'caregiver';
  category: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: ChatMessage[];
}

export const MOCK_MESSAGE_THREADS: MessageThread[] = [
  {
    id: 'mt1',
    withName: 'Patel Family',
    withInitials: 'PF',
    withColor: 'from-emerald-400 to-teal-500',
    withRole: 'family',
    category: 'Nanny',
    lastMessage: 'Can you come for a trial next Monday?',
    lastTime: '10:32 AM',
    unread: 2,
    messages: [
      { id: 'm1', senderId: 'them', text: 'Hi! We saw your profile and love your experience.', time: '9:00 AM', status: 'read' },
      { id: 'm2', senderId: 'me', text: 'Thank you! I would love to learn more about your family.', time: '9:15 AM', status: 'read' },
      { id: 'm3', senderId: 'them', text: 'We have two kids, ages 2 and 5. We need care Mon–Fri, 8am–5pm.', time: '9:20 AM', status: 'read' },
      { id: 'm4', senderId: 'me', text: 'That works perfectly for me! I am available those hours.', time: '9:45 AM', status: 'read' },
      { id: 'm5', senderId: 'them', text: 'Can you come for a trial next Monday?', time: '10:32 AM', status: 'delivered' },
    ],
  },
  {
    id: 'mt2',
    withName: 'Singh Family',
    withInitials: 'SF',
    withColor: 'from-indigo-400 to-blue-500',
    withRole: 'family',
    category: 'Elder Care',
    lastMessage: 'We can offer $22/hr. Does that work?',
    lastTime: 'Yesterday',
    unread: 0,
    messages: [
      { id: 'm6', senderId: 'them', text: 'Hello, my mother needs a Punjabi-speaking companion.', time: 'Yesterday 2:00 PM', status: 'read' },
      { id: 'm7', senderId: 'me', text: 'Of course! I speak Punjabi fluently. Tell me more.', time: 'Yesterday 2:30 PM', status: 'read' },
      { id: 'm8', senderId: 'them', text: 'We can offer $22/hr. Does that work?', time: 'Yesterday 3:00 PM', status: 'read' },
    ],
  },
  {
    id: 'mt3',
    withName: 'Sharma Family',
    withInitials: 'SF',
    withColor: 'from-rose-400 to-pink-500',
    withRole: 'family',
    category: 'Nanny',
    lastMessage: 'Thank you for applying! We will review and get back.',
    lastTime: 'Mon',
    unread: 0,
    messages: [
      { id: 'm9', senderId: 'me', text: 'Hello! I applied for your nanny position.', time: 'Mon 11:00 AM', status: 'read' },
      { id: 'm10', senderId: 'them', text: 'Thank you for applying! We will review and get back.', time: 'Mon 3:00 PM', status: 'read' },
    ],
  },
];

// ─── Notifications ────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  action?: string;
}

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'message',
    title: 'New message from Patel Family',
    body: 'Can you come for a trial next Monday?',
    time: '10 min ago',
    read: false,
    action: '/dashboard/messages',
  },
  {
    id: 'n2',
    type: 'contact',
    title: 'New contact request',
    body: 'Sharma Family sent you a contact request for Nanny position in Brampton.',
    time: '2 hours ago',
    read: false,
    action: '/dashboard/contact-requests',
  },
  {
    id: 'n3',
    type: 'match',
    title: 'New job match!',
    body: 'A new Nanny position in Mississauga matches your profile.',
    time: 'Yesterday',
    read: true,
    action: '/dashboard/job-matches',
  },
  {
    id: 'n4',
    type: 'review',
    title: 'Someone left you a review',
    body: 'Singh Family gave you a 5-star review. Check it out!',
    time: '2 days ago',
    read: true,
    action: '/dashboard/reviews',
  },
  {
    id: 'n5',
    type: 'system',
    title: 'Profile tip',
    body: 'Add a profile photo to get 3× more contact requests!',
    time: '3 days ago',
    read: true,
  },
  {
    id: 'n6',
    type: 'system',
    title: 'Subscription renewed',
    body: 'Your Premium plan has been renewed for another 60 days.',
    time: '1 week ago',
    read: true,
  },
];

// ─── Reviews (Caregiver) ──────────────────────────────────────────────────────

export interface Review {
  id: string;
  fromFamily: string;
  fromInitials: string;
  fromColor: string;
  rating: number;
  comment: string;
  date: string;
  category: string;
  reply?: string;
}

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rv1',
    fromFamily: 'Singh Family',
    fromInitials: 'SF',
    fromColor: 'from-indigo-400 to-blue-500',
    rating: 5,
    comment: 'Absolutely wonderful caregiver. She speaks Punjabi fluently and my mother adores her. Very punctual and professional.',
    date: '2026-05-15',
    category: 'Elder Care',
    reply: 'Thank you so much! It was a pleasure caring for your mother. She is a wonderful person.',
  },
  {
    id: 'rv2',
    fromFamily: 'Mehta Family',
    fromInitials: 'MF',
    fromColor: 'from-amber-400 to-orange-500',
    rating: 5,
    comment: 'Our kids love her! She is patient, creative, and always on time. Highly recommend!',
    date: '2026-04-22',
    category: 'Nanny',
  },
  {
    id: 'rv3',
    fromFamily: 'Gupta Family',
    fromInitials: 'GF',
    fromColor: 'from-emerald-400 to-teal-500',
    rating: 4,
    comment: 'Very good experience overall. Great with the kids and spoke Hindi with them. Would hire again.',
    date: '2026-03-10',
    category: 'Nanny',
  },
];

// ─── Photos & Videos (Caregiver) ─────────────────────────────────────────────

export interface MediaItem {
  id: string;
  type: 'photo' | 'video';
  url: string;
  caption: string;
  uploadDate: string;
  thumbnail?: string;
}

export const MOCK_MEDIA: MediaItem[] = [
  {
    id: 'ph1',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
    caption: 'Professional caregiver headshot',
    uploadDate: '2026-04-10',
  },
  {
    id: 'ph2',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1581579439988-1b4de6a6b796?w=400&q=80',
    caption: 'Working with children at the park',
    uploadDate: '2026-03-22',
  },
  {
    id: 'ph3',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1609220136736-443140cfeaa8?w=400&q=80',
    caption: 'First Aid certification training',
    uploadDate: '2026-02-15',
  },
  {
    id: 'ph4',
    type: 'video',
    url: '#',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    caption: 'Introduction video — about me and my experience',
    uploadDate: '2026-01-05',
  },
];

// ─── References (Caregiver) ───────────────────────────────────────────────────

export interface Reference {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  years: number;
  comment: string;
  verified: boolean;
  initials: string;
  color: string;
}

export const MOCK_REFERENCES: Reference[] = [
  {
    id: 'ref1',
    name: 'Meena Patel',
    relationship: 'Former Employer (Family)',
    phone: '+1 (647) 555-0120',
    email: 'meena.patel@email.com',
    years: 3,
    comment: 'Outstanding nanny. My kids still ask about her. Trustworthy and very caring.',
    verified: true,
    initials: 'MP',
    color: 'from-pink-400 to-rose-500',
  },
  {
    id: 'ref2',
    name: 'Rajinder Singh',
    relationship: 'Former Employer (Family)',
    phone: '+1 (416) 555-0187',
    email: 'rsingh@email.com',
    years: 2,
    comment: 'Hired her for elder care for my father. Excellent communicator. Highly recommended.',
    verified: true,
    initials: 'RS',
    color: 'from-violet-400 to-purple-500',
  },
  {
    id: 'ref3',
    name: 'Grace Thompson',
    relationship: 'Professional Colleague',
    phone: '+1 (905) 555-0234',
    email: 'grace.t@email.com',
    years: 4,
    comment: 'We worked together at a daycare for 4 years. She is incredibly reliable and dedicated.',
    verified: false,
    initials: 'GT',
    color: 'from-teal-400 to-emerald-500',
  },
];

// ─── Caregiver Listing ────────────────────────────────────────────────────────

export interface CaregiverListing {
  title: string;
  category: string;
  location: string;
  rate: string;
  availability: AvailabilityType[];
  weeklySchedule: Record<string, string[]>;
  experience: string;
  bio: string;
  languages: string[];
  skills: string[];
  certifications: string[];
  status: 'active' | 'paused';
  views: number;
  contactRequests: number;
  createdDate: string;
}

export const MOCK_CAREGIVER_LISTING: CaregiverListing = {
  title: 'Experienced Nanny & Elder Care Specialist',
  category: 'Nanny',
  location: 'Brampton, ON',
  rate: '$18/hr',
  availability: ['full-time', 'part-time'],
  weeklySchedule: {
    Monday:    ['Morning', 'Afternoon'],
    Tuesday:   ['Morning', 'Afternoon'],
    Wednesday: ['Morning', 'Afternoon', 'Evening'],
    Thursday:  ['Afternoon'],
    Friday:    ['Morning', 'Afternoon'],
    Saturday:  ['Morning'],
  },
  experience: '6 years',
  bio: 'I am a compassionate and experienced caregiver with over 6 years of experience working with children and elders in South Asian families. I speak Hindi, Punjabi, and English fluently and am comfortable with Indian cooking, traditions, and cultural practices.',
  languages: ['Hindi', 'Punjabi', 'English'],
  skills: ['Child Development', 'First Aid & CPR', 'Indian Cooking', 'Elder Companionship', 'Homework Help', 'Medication Reminders'],
  certifications: ['First Aid & CPR Certified', 'Police Background Check', 'Child Safety Training'],
  status: 'active',
  views: 342,
  contactRequests: 18,
  createdDate: '2026-03-01',
};

// ─── Job Matches (Caregiver) ──────────────────────────────────────────────────

export interface JobMatch {
  id: string;
  title: string;
  family: string;
  location: string;
  budget: string;
  postedDate: string;
  matchScore: number;
  languages: string[];
  category: string;
  description: string;
  saved: boolean;
}

export const MOCK_JOB_MATCHES: JobMatch[] = [
  {
    id: 'jm1',
    title: 'Full-time Nanny Needed — Brampton',
    family: 'Sharma Family',
    location: 'Brampton, ON',
    budget: '$18–$22/hr',
    postedDate: '2026-05-20',
    matchScore: 97,
    languages: ['Hindi', 'Punjabi'],
    category: 'Nanny',
    description: 'Looking for an experienced nanny for two children (ages 4 and 7). Must speak Hindi or Punjabi.',
    saved: true,
  },
  {
    id: 'jm2',
    title: 'Elder Care Companion — Mississauga',
    family: 'Kapoor Family',
    location: 'Mississauga, ON',
    budget: '$20–$24/hr',
    postedDate: '2026-05-18',
    matchScore: 91,
    languages: ['Hindi', 'English'],
    category: 'Elder Care',
    description: 'Need a companion for our 78-year-old mother who recently moved from India. Weekdays only.',
    saved: false,
  },
  {
    id: 'jm3',
    title: 'Part-time Nanny — Vaughan',
    family: 'Gupta Family',
    location: 'Vaughan, ON',
    budget: '$17–$20/hr',
    postedDate: '2026-05-15',
    matchScore: 85,
    languages: ['Hindi', 'English'],
    category: 'Nanny',
    description: 'Looking for a part-time nanny 3 days a week for a toddler. Indian cooking a plus.',
    saved: false,
  },
  {
    id: 'jm4',
    title: 'Babysitter — Scarborough Weekends',
    family: 'Nair Family',
    location: 'Scarborough, ON',
    budget: '$16/hr',
    postedDate: '2026-05-12',
    matchScore: 78,
    languages: ['Malayalam', 'English'],
    category: 'Babysitter',
    description: 'Weekend babysitter needed for a 1-year-old. CPR certified preferred.',
    saved: true,
  },
];

// ─── Family Profile ───────────────────────────────────────────────────────────

export interface FamilyProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  languages: string[];
  description: string;
  lookingFor: string[];
  verifiedEmail: boolean;
  verifiedPhone: boolean;
  memberSince: string;
  totalHires: number;
}

export const MOCK_FAMILY_PROFILE: FamilyProfile = {
  name: 'Kanwal Kaur',
  email: 'kanwal@email.com',
  phone: '+1 (416) 555-0188',
  location: 'Brampton, ON',
  languages: ['Punjabi', 'Hindi', 'English'],
  description: 'Desi family looking for trusted caregivers who understand our culture, food, and values. Two kids and an elderly parent at home.',
  lookingFor: ['Nanny', 'Elder Care'],
  verifiedEmail: true,
  verifiedPhone: false,
  memberSince: '2026-03-15',
  totalHires: 2,
};

// ─── Caregiver Profile ────────────────────────────────────────────────────────

export interface CaregiverProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  languages: string[];
  bio: string;
  categories: string[];
  experience: string;
  rate: string;
  certifications: string[];
  skills: string[];
  availability: AvailabilityType[];
  verifiedEmail: boolean;
  verifiedPhone: boolean;
  backgroundCheck: boolean;
  memberSince: string;
  /** URL of uploaded profile photo — undefined means no photo (affects completion score) */
  photoUrl?: string;
}

export const MOCK_CAREGIVER_PROFILE: CaregiverProfile = {
  name: 'Priya Sharma',
  email: 'priya@email.com',
  phone: '+1 (647) 555-0199',
  location: 'Brampton, ON',
  languages: ['Hindi', 'Punjabi', 'English'],
  bio: 'Compassionate caregiver with 6+ years of experience in South Asian households. Expert in child development, elder care, and Indian cooking.',
  categories: ['Nanny', 'Elder Care', 'Babysitter'],
  experience: '6 years',
  rate: '$18/hr',
  certifications: ['First Aid & CPR', 'Police Background Check', 'Child Safety Training'],
  skills: ['Indian Cooking', 'Homework Help', 'Medication Reminders', 'Elder Companionship', 'Creative Play'],
  availability: ['full-time', 'part-time'],
  verifiedEmail: true,
  verifiedPhone: true,
  backgroundCheck: true,
  memberSince: '2026-02-01',
  // photoUrl is intentionally absent → completion score = 88% (photo worth 12 pts)
};

// ─── Subscription Info ────────────────────────────────────────────────────────

export interface SubscriptionInfo {
  plan: string;
  tier: string;
  price: number;
  startDate: string;
  endDate: string;
  daysLeft: number;
  contactsUnlocked: number;
  status: 'active' | 'expired' | 'none';
  features: string[];
}

export const MOCK_SUBSCRIPTION: SubscriptionInfo = {
  plan: '2m',
  tier: 'Standard',
  price: 39,
  startDate: '2026-05-01',
  endDate: '2026-07-01',
  daysLeft: 39,
  contactsUnlocked: 24,
  status: 'active',
  features: [
    'Unlimited contact details',
    'Priority listing visibility',
    'Email & phone access',
    'Save unlimited caregivers',
    '60-day access',
  ],
};
