# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Neon Database**: Set up a database at [neon.tech](https://neon.tech)
3. **GitHub Repository**: Push your code to GitHub

## Environment Variables

Set these environment variables in your Vercel dashboard:

### Required Variables

```bash
# Database
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secure-jwt-secret-here

# Next.js
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-here
```

### How to Get DATABASE_URL

1. Go to your Neon dashboard
2. Select your project
3. Go to "Connection Details"
4. Copy the connection string
5. Make sure it includes `?sslmode=require`

## Database Setup

1. **Create Tables**: Run this SQL in your Neon SQL editor:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location VARCHAR(500) NOT NULL,
  category VARCHAR(100) NOT NULL,
  image TEXT,
  max_attendees INTEGER,
  is_online BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT TRUE,
  requires_approval BOOLEAN DEFAULT FALSE,
  price DECIMAL(10,2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  metadata JSONB,
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- RSVPs table
CREATE TABLE rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  notes TEXT,
  ticket_count INTEGER DEFAULT 1,
  status VARCHAR(20) DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, email)
);

-- Sessions table (for JWT token management)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO categories (name, description) VALUES
('Technology', 'Tech meetups, conferences, and workshops'),
('Design', 'Design events, UX/UI workshops, and creative sessions'),
('Business', 'Business networking, entrepreneurship, and professional development'),
('Education', 'Educational workshops, courses, and learning sessions'),
('Health', 'Health and wellness events, fitness classes, and medical conferences'),
('Entertainment', 'Entertainment events, concerts, shows, and social gatherings'),
('Other', 'Other types of events and gatherings');
```

2. **Verify Tables**: Check that all tables were created successfully

## Deployment Steps

### Option 1: Deploy from GitHub (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Set Environment Variables**:
   - In Vercel dashboard, go to your project
   - Go to "Settings" → "Environment Variables"
   - Add all required variables (see above)

4. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete

### Option 2: Deploy with Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set Environment Variables**:
   ```bash
   vercel env add DATABASE_URL
   vercel env add JWT_SECRET
   vercel env add NEXTAUTH_URL
   vercel env add NEXTAUTH_SECRET
   ```

## Post-Deployment

1. **Test Your App**:
   - Visit your Vercel URL
   - Test user registration
   - Test event creation
   - Test RSVP functionality

2. **Monitor Logs**:
   - Check Vercel function logs for any errors
   - Monitor database connections

3. **Custom Domain** (Optional):
   - Add your custom domain in Vercel settings
   - Update NEXTAUTH_URL to match your domain

## Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   - Verify DATABASE_URL is correct
   - Check if database is accessible from Vercel
   - Ensure SSL is enabled

2. **Build Errors**:
   - Check TypeScript errors
   - Verify all dependencies are installed
   - Check for missing environment variables

3. **Runtime Errors**:
   - Check Vercel function logs
   - Verify API routes are working
   - Test database queries

### Support

- Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
- Check Neon documentation: [neon.tech/docs](https://neon.tech/docs)
- Check Next.js documentation: [nextjs.org/docs](https://nextjs.org/docs)

## Security Notes

1. **JWT Secret**: Use a strong, random JWT secret
2. **Database**: Keep your database credentials secure
3. **Environment Variables**: Never commit sensitive data to Git
4. **HTTPS**: Vercel automatically provides HTTPS

## Performance Optimization

1. **Database Indexing**: Add indexes for frequently queried columns
2. **Caching**: Consider implementing Redis for session caching
3. **CDN**: Vercel automatically provides global CDN
4. **Image Optimization**: Next.js Image component is already optimized

## Monitoring

1. **Vercel Analytics**: Enable in Vercel dashboard
2. **Error Tracking**: Consider adding Sentry or similar
3. **Database Monitoring**: Monitor Neon database usage
4. **Performance**: Use Vercel Speed Insights
