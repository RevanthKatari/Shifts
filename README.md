# Shift Tracker

A modern web application for tracking work shifts with analytics and pay calculation.

## Features

- **Separate User Accounts**: Two users with secret codes (2338, 2339)
- **Shift Management**: Track three shift types (Morning, Afternoon, Night)
- **Calendar View**: Interactive calendar with shift visualization
- **Analytics Dashboard**: Track hours, shifts, and trends
- **Pay Calculator**: Automatic pay calculation with weekend multipliers and deductions

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
USER_1_PASSCODE=your_user_1_secret_code
USER_2_PASSCODE=your_user_2_secret_code
```

**Important**: Never commit `.env.local` to git. The passcodes are stored securely in environment variables.

3. Initialize the database:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the SQL from `supabase-init.sql` file

4. Run the development server:
```bash
npm run dev
```

## Deployment

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL)
- Recharts for analytics

