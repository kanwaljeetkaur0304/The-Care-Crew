# The Care Crew

Caregiver marketplace built with React, Vite, and Tailwind CSS.

## Supabase setup (auth & user profiles)

Registration and sign-in use [Supabase](https://supabase.com). New users appear in your Supabase project under **Authentication** and in the **profiles** table.

### 1. Create a Supabase project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and create a project.
2. Open **Project Settings → API** and copy:
   - **Project URL**
   - **anon public** key

### 2. Configure the app

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Create the database schema

In the Supabase dashboard, open **SQL Editor**, paste the contents of [`supabase/schema.sql`](./supabase/schema.sql), and run it.

This creates a `profiles` table (name + role) and a trigger that fills it when someone registers.

### 4. Run the app

```bash
npm install
npm run dev
```

### Where to see registrations

| Location | What you see |
|----------|----------------|
| **Authentication → Users** | Email, sign-up date, confirmed or not |
| **Table Editor → profiles** | Full name, role (`family` or `caregiver`) |

### Email confirmation (optional)

By default, Supabase may require email confirmation:

- **Authentication → Providers → Email** → toggle **Confirm email**
- If enabled, users must click the link in their inbox before they can sign in; the app shows a “Check your email” message after register.

For local testing, you can turn confirmation off or use **Authentication → Users** to confirm a user manually.

## Development

```bash
npm run dev    # start dev server
npm run build  # production build
npm run lint   # ESLint
```
