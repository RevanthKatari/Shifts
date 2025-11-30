# Deployment Guide

## Prerequisites

1. GitHub account
2. Vercel account (free tier)
3. Supabase project (already set up)

## Step-by-Step Deployment

### 1. Initialize Database

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase-init.sql`
4. Click **Run** to execute the SQL

### 2. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Shift Tracker app"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 3. Deploy to Vercel

1. Go to https://vercel.com
2. Click **New Project**
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://awrufthqhdhpruzjigoj.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3cnVmdGhxaGRocHJ1emppZ29qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NjE5ODAsImV4cCI6MjA4MDAzNzk4MH0.llGXRF96PA7d0egdgpOa9Rcoz04hsc61qlBJrpjTqW8`
   - `USER_1_PASSCODE` = `2338` (keep this secret!)
   - `USER_2_PASSCODE` = `2339` (keep this secret!)
5. Click **Deploy**

### 4. Access Your App

Once deployed, Vercel will provide you with a URL. Access the app and login with:
- Secret code: `2338` (User 1)
- Secret code: `2339` (User 2)

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```
NEXT_PUBLIC_SUPABASE_URL=https://awrufthqhdhpruzjigoj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3cnVmdGhxaGRocHJ1emppZ29qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NjE5ODAsImV4cCI6MjA4MDAzNzk4MH0.llGXRF96PA7d0egdgpOa9Rcoz04hsc61qlBJrpjTqW8
USER_1_PASSCODE=2338
USER_2_PASSCODE=2339
```

**Note**: The `.env.local` file is automatically ignored by git and will not be committed.

3. Run development server:
```bash
npm run dev
```

4. Open http://localhost:3000

## Features

- **Calendar View**: Visual calendar showing all shifts
- **Shift Management**: Add, edit, delete shifts
- **Analytics**: Track hours, shifts by type, weekly/monthly trends
- **Pay Calculator**: Automatic calculation with:
  - Base rate: $23.28/hour
  - Saturday: 1.5x rate
  - Sunday: 2x rate
  - Automatic deductions (CPP/QPP, EI, Building Fund)

