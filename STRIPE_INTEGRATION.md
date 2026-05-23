# Stripe Payment Integration - Complete Guide

## Overview

Your TheCareCrew payment system now uses **Stripe** for secure, PCI-compliant payment processing. Card data never touches your servers, and all security liability is handled by Stripe.

## What Changed

### New Components
- **`src/components/StripePaymentForm.tsx`** - Secure payment form using Stripe Elements
- **`src/config/stripe.ts`** - Stripe initialization and configuration

### Updated Components
- **`src/components/SubscriptionModal.tsx`** - Fetches PaymentIntent from backend before showing Stripe form
- **`src/context/SubscriptionContext.tsx`** - Enhanced to track Stripe payment intent IDs

### Backend (Supabase Edge Functions)
- **`supabase/functions/create-payment-intent/index.ts`** - Creates Stripe PaymentIntent + pending subscription record
- **`supabase/functions/stripe-webhook/index.ts`** - Handles Stripe webhook events

### Database
- **`supabase/schema.sql`** - Added `subscriptions` table with RLS policies

### Configuration
- **`.env.local`** - Environment variables for Stripe keys
- **`.env.example`** - Documented Stripe setup

## Quick Start

### 1. Create Stripe Account
```bash
# Go to stripe.com and create a free account
# Navigate to: Developers → API Keys
```

### 2. Get Your Keys
```
Stripe Dashboard → Developers → API Keys
- Publishable Key (pk_test_...)  →  VITE_STRIPE_PUBLIC_KEY in .env.local
- Secret Key (sk_test_...)        →  Supabase secret (see step 4)
```

### 3. Update Frontend Environment
```bash
# In .env.local, replace the placeholder:
VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_ACTUAL_KEY
```

### 4. Deploy Backend

#### A. Install Supabase CLI (if not already)
```bash
npm install -g supabase
```

#### B. Link your project
```bash
supabase login
supabase link --project-ref your-project-ref
```

#### C. Run the new schema
Open `supabase/schema.sql` in Supabase Dashboard → SQL Editor and run it (or apply via migrations).

#### D. Set secrets
```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
```

#### E. Deploy Edge Functions
```bash
supabase functions deploy create-payment-intent
supabase functions deploy stripe-webhook
```

#### F. Configure webhook in Stripe Dashboard
```
Stripe Dashboard → Developers → Webhooks → Add endpoint
Endpoint URL: https://your-project-ref.supabase.co/functions/v1/stripe-webhook
Events to listen to:
  - payment_intent.succeeded
  - payment_intent.payment_failed
```
Copy the webhook signing secret and set it as `STRIPE_WEBHOOK_SECRET` above.

### 5. Test Payment
```bash
# Run the app
npm run dev

# Test with Stripe's test card:
Card: 4242 4242 4242 4242
Exp:  12/30
CVC:  123
```

## Architecture

### Full Flow
```
User selects plan
    ↓
Frontend calls POST /functions/v1/create-payment-intent
    ↓
Edge Function:
    ├─ Verifies user auth
    ├─ Creates Stripe PaymentIntent
    ├─ Inserts pending subscription into DB
    └─ Returns clientSecret
    ↓
Frontend mounts Stripe Elements with clientSecret
    ↓
User enters card → stripe.confirmPayment()
    ↓
Stripe processes payment
    ↓
Stripe sends webhook → /functions/v1/stripe-webhook
    ↓
Edge Function updates subscription status → active
    ↓
Frontend shows success screen
```

### Security Model

**Before (Risky)**
```
User's Card → Your Form → Your Server → Your Database ❌
Risk: PCI compliance ($100K), breach liability, complex encryption
```

**After (Safe)**
```
User's Card → Stripe Form → Stripe Servers → Your App gets Token Only ✅
Risk: None on you, Stripe handles PCI compliance and security
```

## API Reference

### `POST /functions/v1/create-payment-intent`

**Headers**
```
Authorization: Bearer <supabase-access-token>
Content-Type: application/json
```

**Body**
```json
{
  "planId": "2m"
}
```

**Response**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

### `POST /functions/v1/stripe-webhook`

Called by Stripe. No frontend usage.

## Payment Form Component

### `StripePaymentForm.tsx`

```typescript
interface StripePaymentFormProps {
  amount: number;              // Plan price
  planLabel: string;          // "Standard - 2 Months"
  onSuccess: () => void;      // Called when payment succeeds
  onError: (error: string) => void;  // Called on failure
  isLoading: boolean;         // Loading state
}
```

Features:
- ✅ Secure card input (Stripe Elements)
- ✅ Automatic card validation
- ✅ Real-time error messages
- ✅ Dark/light mode support
- ✅ Responsive design
- ✅ Loading states

## Configuration

### Environment Variables

**Frontend (`.env.local`)**
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY
```

**Backend (Supabase Secrets - NEVER commit)**
```env
STRIPE_SECRET_KEY=sk_test_YOUR_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET
```

## Stripe Test Cards

Use these in development (only work with test keys):

| Card | Number | Exp | CVC | Result |
|---|---|---|---|---|
| Visa | `4242 4242 4242 4242` | Any future | Any | ✅ Success |
| Visa | `4000 0000 0000 0002` | Any future | Any | ❌ Declined |
| Visa | `4000 0025 0000 3155` | Any future | Any | 🔐 3D Secure required |
| AmEx | `3782 822463 10005` | Any future | Any | ✅ Success |

## Subscription Management

### Database Schema
```sql
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  plan_id text not null,
  status text not null default 'pending',
  stripe_customer_id text,
  stripe_payment_intent_id text,
  stripe_subscription_id text,
  amount integer not null,
  currency text not null default 'usd',
  purchased_at timestamptz not null default now(),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### Flow
1. User selects plan → frontend calls `create-payment-intent`
2. Edge Function creates Stripe PaymentIntent + inserts `pending` subscription
3. User pays via Stripe Elements
4. Stripe webhook updates subscription to `active`
5. Frontend still keeps a local copy in `localStorage` for instant UI feedback

## Plans & Pricing

### Basic - $29 (1 Month)
- 5 job listings
- Phone numbers unlocked
- Email addresses unlocked

### Standard - $49 (2 Months) ⭐
- 15 job listings
- All Basic features
- Contact export
- Advanced filters
- Saved searches

### Premium - $69 (3 Months)
- 50 job listings
- All Standard features
- Priority support
- Unlimited saved searches
- Candidate profiles view

## Security Checklist

- ✅ Card data never stored on your servers
- ✅ PCI DSS compliance handled by Stripe
- ✅ SSL/TLS encryption in transit
- ✅ HTTPS only in production
- ✅ Environment variables for API keys
- ✅ Public key in frontend, secret key on backend only
- ✅ Webhook events update database securely
- ✅ RLS policies protect subscription data

## Production Checklist

- [ ] Replace test keys with live keys (`pk_live_`, `sk_live_`)
- [ ] Enable webhook in Stripe dashboard with live endpoint
- [ ] Test with real card (use small amount, refund after)
- [ ] Monitor Stripe dashboard for live status
- [ ] Set up error alerting (e.g., Sentry)
- [ ] Document payment failure handling for support
- [ ] Set up subscription renewal/cancellation logic
- [ ] Add email receipts (Stripe can do this automatically)

## Testing Checklist

- [ ] Test successful payment (4242 4242 4242 4242)
- [ ] Test declined card (4000 0000 0000 0002)
- [ ] Test 3D Secure (4000 0025 0000 3155)
- [ ] Test form validation errors
- [ ] Test network error handling
- [ ] Test dark/light mode appearance
- [ ] Test on mobile devices
- [ ] Test with different browsers
- [ ] Verify webhook updates database correctly
- [ ] Verify subscription appears in Supabase table

## Troubleshooting

### "Missing VITE_STRIPE_PUBLIC_KEY"
- Ensure `.env.local` has the correct key
- Key should start with `pk_test_` or `pk_live_`
- Restart dev server after updating env vars

### "Failed to initialize payment"
- Check that user is logged in (auth required)
- Verify Edge Function is deployed: `supabase functions list`
- Check Edge Function logs in Supabase Dashboard

### Payment Form Not Appearing
- Check browser console for errors
- Verify Stripe key is valid
- Ensure `clientSecret` was fetched successfully
- Ensure `<Elements>` provider wraps the form with `options={{ clientSecret }}`

### Test Card Declined
- Use the correct test card number
- Date must be in future (e.g., 12/30)
- CVC can be any 3-4 digits

### Subscription Not Activating
- Check Supabase `subscriptions` table for the record
- Verify webhook is configured and delivering events
- Check Edge Function logs for webhook errors
- Check browser localStorage as fallback

## Resources

- [Stripe React Documentation](https://stripe.com/docs/stripe-js/react)
- [Payment Element Guide](https://stripe.com/docs/payments/payment-element)
- [Test Cards](https://stripe.com/docs/testing)
- [API Keys](https://dashboard.stripe.com/apikeys)
- [Webhook Events](https://stripe.com/docs/webhooks)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

## Cost Breakdown

For 100 active subscribers at $49/month:

```
Total Monthly Revenue:    $4,900
Stripe Fee (2.9% + $0.30): $141.70 per month
Your Profit:              $4,758.30
Effective Fee:            2.89%
```

**Worth it for:**
- Peace of mind (security, compliance)
- Automatic fraud protection
- Professional payment experience
- Zero liability
- Automatic retry logic
- Dispute management

## Support

For Stripe-specific issues:
- [Stripe Status Page](https://status.stripe.com)
- [Stripe Support](https://support.stripe.com)
- [Stripe Docs](https://stripe.com/docs)

For application issues:
- Check `.env.local` configuration
- Review browser console for errors
- Check Stripe dashboard for payment events
- Check Supabase Edge Function logs
- Verify plan configuration in SubscriptionContext

---

**Status**: ✅ Frontend + Backend Implementation Complete  
**Next**: Production keys, live webhook, and monitoring
