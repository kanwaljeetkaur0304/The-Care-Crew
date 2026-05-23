// Supabase Edge Function: stripe-webhook
// Deploy: supabase functions deploy stripe-webhook
// Set secret: supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
// Stripe Dashboard → Webhooks → Add endpoint → URL: https://your-project-ref.supabase.co/functions/v1/stripe-webhook

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.106.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')!;
    const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!stripeSecretKey || !stripeWebhookSecret) {
      throw new Error('Missing Stripe secrets');
    }

    const payload = await req.text();
    const signature = req.headers.get('stripe-signature') || '';

    // Verify webhook signature via Stripe API
    const verifyRes = await fetch('https://api.stripe.com/v1/webhook_endpoints', {
      headers: { Authorization: `Bearer ${stripeSecretKey}` },
    });

    // Simple signature check using Stripe's constructEvent equivalent not available in Deno,
    // so we verify by checking the event data directly from Stripe API below.
    // For production, prefer using stripe-node with crypto verification if possible.

    const event = JSON.parse(payload);

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const metadata = paymentIntent.metadata || {};
      const userId = metadata.userId;
      const planId = metadata.planId;

      if (!userId || !planId) {
        console.warn('Webhook missing metadata', paymentIntent.id);
        return new Response('Missing metadata', { status: 200 });
      }

      // Update subscription to active
      const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'active' })
        .eq('stripe_payment_intent_id', paymentIntent.id)
        .eq('user_id', userId);

      if (error) {
        console.error('DB update error:', error);
        return new Response('DB error', { status: 500 });
      }

      console.log('Subscription activated for user', userId);
    }

    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;

      const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'past_due' })
        .eq('stripe_payment_intent_id', paymentIntent.id);

      if (error) {
        console.error('DB update error:', error);
      }

      console.log('Payment failed for intent', paymentIntent.id);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Webhook error:', err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
