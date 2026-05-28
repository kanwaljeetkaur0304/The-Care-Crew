export type UserRole = 'family' | 'caregiver';

export type SubscriptionStatus = 'pending' | 'active' | 'canceled' | 'past_due';

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          role: UserRole;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          role: UserRole;
          created_at?: string;
        };
        Update: {
          full_name?: string;
          role?: UserRole;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string;
          status: SubscriptionStatus;
          stripe_customer_id: string | null;
          stripe_payment_intent_id: string | null;
          stripe_subscription_id: string | null;
          amount: number;
          currency: string;
          purchased_at: string;
          expires_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_id: string;
          status?: SubscriptionStatus;
          stripe_customer_id?: string | null;
          stripe_payment_intent_id?: string | null;
          stripe_subscription_id?: string | null;
          amount: number;
          currency?: string;
          purchased_at?: string;
          expires_at: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          plan_id?: string;
          status?: SubscriptionStatus;
          stripe_customer_id?: string | null;
          stripe_payment_intent_id?: string | null;
          stripe_subscription_id?: string | null;
          amount?: number;
          currency?: string;
          purchased_at?: string;
          expires_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profile_views: {
        Row: {
          id: string;
          caregiver_id: string;
          viewed_at: string;
        };
        Insert: {
          id?: string;
          caregiver_id: string;
          viewed_at?: string;
        };
        Update: {
          caregiver_id?: string;
          viewed_at?: string;
        };
        Relationships: [];
      };
      contact_requests: {
        Row: {
          id: string;
          from_id: string | null;
          from_name: string;
          from_role: string;
          to_id: string;
          to_role: string;
          category: string | null;
          location: string | null;
          message: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          from_id?: string | null;
          from_name: string;
          from_role?: string;
          to_id: string;
          to_role?: string;
          category?: string | null;
          location?: string | null;
          message: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          status?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          caregiver_id: string;
          from_family_name: string;
          rating: number;
          comment: string | null;
          category: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          caregiver_id: string;
          from_family_name: string;
          rating: number;
          comment?: string | null;
          category?: string | null;
          created_at?: string;
        };
        Update: {
          rating?: number;
          comment?: string | null;
        };
        Relationships: [];
      };
      caregiver_profiles: {
        Row: {
          id: string;
          bio: string;
          location: string;
          phone: string;
          languages: string[];
          categories: string[];
          rate: string;
          experience: string;
          availability: string[];
          certifications: string[];
          skills: string[];
          photo_url: string | null;
          background_check: boolean;
          listing_status: string;
          listing_title: string;
          weekly_schedule: Record<string, string[]>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          bio?: string;
          location?: string;
          phone?: string;
          languages?: string[];
          categories?: string[];
          rate?: string;
          experience?: string;
          availability?: string[];
          certifications?: string[];
          skills?: string[];
          photo_url?: string | null;
          background_check?: boolean;
          listing_status?: string;
          listing_title?: string;
          weekly_schedule?: Record<string, string[]>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          bio?: string;
          location?: string;
          phone?: string;
          languages?: string[];
          categories?: string[];
          rate?: string;
          experience?: string;
          availability?: string[];
          certifications?: string[];
          skills?: string[];
          photo_url?: string | null;
          background_check?: boolean;
          listing_status?: string;
          listing_title?: string;
          weekly_schedule?: Record<string, string[]>;
          updated_at?: string;
        };
        Relationships: [];
      };
      family_profiles: {
        Row: {
          id: string;
          description: string;
          location: string;
          phone: string;
          languages: string[];
          looking_for: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          description?: string;
          location?: string;
          phone?: string;
          languages?: string[];
          looking_for?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          description?: string;
          location?: string;
          phone?: string;
          languages?: string[];
          looking_for?: string[];
          updated_at?: string;
        };
        Relationships: [];
      };
      job_posts: {
        Row: {
          id: string;
          family_id: string;
          family_name: string;
          title: string;
          category: string;
          location: string;
          salary: string;
          schedule: string;
          description: string;
          requirements: string[];
          languages: string[];
          status: string;
          created_at: string;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          family_id: string;
          family_name: string;
          title: string;
          category: string;
          location: string;
          salary: string;
          schedule?: string;
          description?: string;
          requirements?: string[];
          languages?: string[];
          status?: string;
          created_at?: string;
          expires_at?: string | null;
        };
        Update: {
          title?: string;
          category?: string;
          location?: string;
          salary?: string;
          schedule?: string;
          description?: string;
          requirements?: string[];
          languages?: string[];
          status?: string;
          expires_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
