// Supabase Edge Function: create-payment-intent
// Deploy: supabase functions deploy create-payment-intent
// Set secret: supabase secrets set STRIPE_SECRET_KEY=sk_test_...

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.106.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PLANS: Record<string, { price: number; durationDays: number }> = {
  '1m': { price: 2900, durationDays: 30 },
  '2m': { price: 4900, durationDays: 60 },
  '3m': { price: 6900, durationDays: 90 },
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')!;

    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify user
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const token = authHeader.replace('Bearer ', '');
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json().catch(() => ({}));
    const { planId } = body;

    if (!planId || !PLANS[planId]) {
      return new Response(JSON.stringify({ error: 'Invalid planId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const plan = PLANS[planId];

    // Create Stripe PaymentIntent
    const stripeRes = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: String(plan.price),
        currency: 'usd',
        'automatic_payment_methods[enabled]': 'true',
        'metadata[userId]': user.id,
        'metadata[planId]': planId,
      }),
    });

    const stripeData = await stripeRes.json();

    if (!stripeRes.ok) {
      console.error('Stripe error:', stripeData);
      return new Response(JSON.stringify({ error: stripeData.error?.message || 'Stripe error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Insert pending subscription record
    const now = new Date();
    const expires = new Date(now);
    expires.setDate(expires.getDate() + plan.durationDays);

    const { error: insertError } = await supabase.from('subscriptions').insert({
      user_id: user.id,
      plan_id: planId,
      status: 'pending',
      stripe_payment_intent_id: stripeData.id,
      amount: plan.price,
      currency: 'usd',
      purchased_at: now.toISOString(),
      expires_at: expires.toISOString(),
    });

    if (insertError) {
      console.error('DB insert error:', insertError);
    }

    return new Response(
      JSON.stringify({
        clientSecret: stripeData.client_secret,
        paymentIntentId: stripeData.id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Edge function error:', err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
