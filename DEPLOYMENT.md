# Mosaic Deployment Guide

## Prerequisites
1. Supabase CLI installed (`brew install supabase/tap/supabase`)
2. Node.js and npm installed
3. Access to your Supabase project

## Database Setup

### 1. Initialize Supabase Project
```bash
# Login to Supabase CLI
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Push the database schema
supabase db push
```

### 2. Environment Variables
Create a `.env` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Development Deployment

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Project
```bash
npm run build
```

### 3. Preview the Build
```bash
npm run preview
```

### 4. Development Server
```bash
npm run dev
```

## Production Deployment

### Option 1: Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel's dashboard
4. Deploy

### Option 2: Manual Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` directory to your hosting provider

## Post-Deployment Checklist

1. [ ] Verify database migrations ran successfully
2. [ ] Check environment variables are set correctly
3. [ ] Test user authentication flow
4. [ ] Verify exercise library loads correctly
5. [ ] Test routine creation and saving
6. [ ] Check video playback functionality
7. [ ] Verify offline capabilities work
8. [ ] Test iOS-specific features

## Monitoring and Maintenance

### Database Backups
Supabase automatically handles backups, but you can manually create them:
```bash
supabase db dump -f backup.sql
```

### Performance Monitoring
1. Use the Supabase dashboard to monitor:
   - Database performance
   - API usage
   - Storage usage
   - Authentication metrics

2. Set up error tracking (recommended):
   - Sentry
   - LogRocket
   - Browser DevTools

## Troubleshooting

### Common Issues

1. Database Connection Issues
```bash
# Check database status
supabase status

# View database logs
supabase logs
```

2. Build Issues
```bash
# Clear build cache
npm run clean

# Rebuild
npm run build
```

3. Environment Variables
- Verify all required environment variables are set
- Check for typos in variable names
- Ensure variables are properly exposed to the client

### Support Resources
- Supabase Documentation: https://supabase.com/docs
- Vite Documentation: https://vitejs.dev/guide/
- React Documentation: https://react.dev/
