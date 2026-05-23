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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
