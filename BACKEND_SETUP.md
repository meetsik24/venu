# Backend Setup Guide

This guide will help you set up the backend for the Venu project using Drizzle ORM and Neon database.

## Prerequisites

1. **Neon Database Account**: Sign up at [neon.tech](https://neon.tech)
2. **Node.js**: Version 18 or higher
3. **npm**: Package manager

## Database Setup

### 1. Create Neon Database

1. Go to [neon.tech](https://neon.tech) and sign up
2. Create a new project
3. Copy the connection string from your dashboard

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@hostname:port/database?sslmode=require"

# JWT Secret for session management
JWT_SECRET="your-jwt-secret-here"

# Next.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

Replace the `DATABASE_URL` with your actual Neon connection string.

## Database Schema

The database includes the following tables:

- **users**: User accounts and profiles
- **events**: Event information and details
- **rsvps**: Event attendance and RSVP status
- **categories**: Event categories
- **sessions**: User authentication sessions

## Available Scripts

### Database Management

```bash
# Generate migration files
npm run db:generate

# Run migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed

# Open Drizzle Studio (database GUI)
npm run db:studio
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Sign in user

### Events

- `GET /api/events` - Get all public events
- `POST /api/events` - Create new event
- `GET /api/events/[id]` - Get specific event
- `PUT /api/events/[id]` - Update event
- `DELETE /api/events/[id]` - Delete event

### RSVPs

- `POST /api/events/[id]/rsvp` - Create/update RSVP
- `GET /api/events/[id]/rsvp` - Get event RSVPs

## Database Schema Details

### Users Table
- `id`: UUID primary key
- `email`: Unique email address
- `name`: User's full name
- `password`: Hashed password
- `avatar`: Profile picture URL
- `bio`: User biography
- `location`: User location
- `website`: Personal website
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

### Events Table
- `id`: UUID primary key
- `title`: Event title
- `description`: Event description
- `date`: Event date
- `time`: Event time
- `location`: Event location
- `category`: Event category
- `image`: Event image URL
- `maxAttendees`: Maximum number of attendees
- `isOnline`: Whether event is online
- `isPublic`: Whether event is public
- `requiresApproval`: Whether RSVPs require approval
- `price`: Event price in cents
- `currency`: Price currency
- `metadata`: Additional event data (JSON)
- `creatorId`: ID of event creator
- `createdAt`: Event creation timestamp
- `updatedAt`: Last update timestamp

### RSVPs Table
- `id`: UUID primary key
- `eventId`: Reference to event
- `userId`: Reference to user
- `status`: RSVP status (pending, confirmed, cancelled)
- `notes`: Additional notes
- `createdAt`: RSVP creation timestamp
- `updatedAt`: Last update timestamp

## Getting Started

1. **Set up environment variables** as described above
2. **Generate and run migrations**:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```
3. **Seed the database** with sample data:
   ```bash
   npm run db:seed
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```

## Testing the API

You can test the API endpoints using tools like Postman, Insomnia, or curl:

### Create a User
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Sign In
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Events
```bash
curl http://localhost:3000/api/events
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**: Check your `DATABASE_URL` in `.env.local`
2. **Migration Errors**: Ensure your database is accessible and the connection string is correct
3. **TypeScript Errors**: Run `npm run build` to check for type errors

### Getting Help

- Check the [Drizzle ORM documentation](https://orm.drizzle.team/)
- Check the [Neon documentation](https://neon.tech/docs)
- Review the API route files in `app/api/` for implementation details
