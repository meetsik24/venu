# Venu - Event Management Platform

A modern, responsive event management platform built with Next.js, TypeScript, and Tailwind CSS. Venu provides a comprehensive solution for event discovery, creation, RSVP management, and organizer dashboards with full database integration.

## 🚀 Features

### Core Functionality
- **Event Discovery**: Browse and search events with advanced filtering
- **Event Creation**: Create and manage events with dynamic thumbnails
- **User Authentication**: Secure sign-up, sign-in, and session management
- **RSVP System**: Complete RSVP flow with attendee management
- **Organizer Dashboard**: Comprehensive event and attendee management
- **Responsive Design**: Optimized for mobile, tablet, and desktop experiences
- **Dark Mode**: Full dark/light theme support

### Technical Highlights
- **Modern Stack**: Next.js 13+ with App Router, TypeScript, Tailwind CSS
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based authentication with secure sessions
- **Dynamic Images**: SVG-based thumbnail generation for events
- **Real-time Data**: Live database integration with proper error handling
- **Mobile-First**: Fully responsive design with mobile-optimized modals

## 🛠 Tech Stack

- **Framework**: Next.js 13+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Authentication**: JWT with bcryptjs for password hashing
- **Icons**: Lucide React
- **Themes**: next-themes for dark/light mode
- **State**: React Context API for authentication
- **Date Handling**: Native JavaScript Date API
- **Charts**: Recharts (for dashboard analytics)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Neon PostgreSQL database (free tier available)

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd venu
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your database credentials
   ```

3. **Set up database**
   - Create a Neon database at [neon.tech](https://neon.tech)
   - Run the SQL schema from `DEPLOYMENT.md`
   - Update `DATABASE_URL` in `.env.local`

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm run start
```

### Deploy to Vercel

See `DEPLOYMENT.md` for detailed deployment instructions.

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (database backend)
│   │   ├── auth/          # Authentication endpoints
│   │   └── events/        # Event management endpoints
│   ├── events/            # Event pages
│   ├── dashboard/         # Organizer dashboard
│   ├── signin/            # Authentication pages
│   └── signup/            # User registration
├── src/
│   ├── components/        # Reusable React components
│   │   ├── ui/           # shadcn/ui components
│   │   └── modals/       # Custom modal components
│   ├── contexts/         # React Context providers
│   └── lib/              # Utility functions and database
├── lib/
│   ├── db/               # Database schema and connection
│   └── eventImages.ts    # Dynamic thumbnail generation
└── public/               # Static assets
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue scale (50-950)
- **Accent**: Purple/Pink scale
- **Success**: Green scale  
- **Warning**: Yellow scale
- **Error**: Red scale
- **Neutral**: Gray scale

### Typography
- **Font**: Inter (Google Fonts)
- **Scales**: xs (12px) to 6xl (60px)
- **Weights**: Light (300) to Extrabold (800)

### Spacing
- **System**: 8px base unit
- **Scale**: 0.25rem to 6rem

## 🧩 Components

### Core Components
- **Header**: Navigation with search and cart
- **Footer**: Links and branding
- **EventCard**: Event preview with image and details
- **EventGrid**: Responsive event layout
- **Hero**: Landing page hero section

### Interactive Components  
- **RSVPModal**: Multi-step ticket purchasing
- **TicketConfirmation**: QR code and confirmation
- **Dashboard**: Organizer event management

## 📊 Mock Data Structure

### Events
```json
{
  "id": "event-id",
  "slug": "event-slug", 
  "title": "Event Title",
  "description": "Full description",
  "shortDescription": "Brief summary",
  "coverImage": "image-url",
  "datetime": "ISO date",
  "location": {
    "type": "venue|online",
    "name": "Location name",
    "address": "Full address"
  },
  "tickets": [
    {
      "id": "ticket-id",
      "name": "Ticket name", 
      "price": 0,
      "available": 100,
      "total": 100
    }
  ]
}
```

### Attendees
```json
{
  "id": "attendee-id",
  "eventId": "event-id",
  "name": "Full Name", 
  "email": "email@example.com",
  "ticketId": "ticket-id",
  "ticketCode": "UNIQUE-CODE",
  "checkedIn": false
}
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - List all public events
- `POST /api/events` - Create new event (authenticated)
- `GET /api/events/[id]` - Get event by ID
- `PUT /api/events/[id]` - Update event (authenticated)
- `DELETE /api/events/[id]` - Delete event (authenticated)
- `GET /api/events/user` - Get user's events (authenticated)

### RSVPs
- `POST /api/events/[id]/rsvp` - Create RSVP for event
- `GET /api/events/[id]/rsvp` - Get RSVPs for event

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels and attributes  
- Keyboard navigation support
- Focus management
- Color contrast compliance
- Screen reader compatibility

## 📈 Performance

- Image optimization with Next.js Image
- Route-based code splitting
- Lazy loading for components
- Optimized bundle size
- Static generation where possible

## 🧪 Testing

Basic test structure included for:
- Component rendering
- User interactions
- API endpoints
- Accessibility compliance

Run tests:
```bash
npm run test
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

See `DEPLOYMENT.md` for detailed instructions.

### Environment Variables Required
- `DATABASE_URL` - Neon PostgreSQL connection string
- `JWT_SECRET` - Secure random string for JWT signing
- `NEXTAUTH_URL` - Your production domain
- `NEXTAUTH_SECRET` - NextAuth secret key

## 🔮 Production Roadmap

### Backend Integration
- [x] Replace JSON files with real database (Neon PostgreSQL)
- [x] Implement proper authentication (JWT-based)
- [x] Add server-side validation and security
- [ ] Set up email notifications (SendGrid/Mailgun)

### Payment Processing
- [ ] Integrate Stripe for real payments
- [ ] Add webhook handling for payment confirmations
- [ ] Implement refund and cancellation logic
- [ ] Add tax calculation and invoicing

### Enhanced Features
- [ ] Real-time chat for events
- [ ] Event check-in with camera QR scanning
- [ ] Social sharing and event promotion tools
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Mobile app (React Native)

### Performance & Scaling
- [ ] Add Redis for caching
- [ ] Implement CDN for image optimization
- [ ] Add monitoring and error tracking
- [ ] Set up automated testing pipeline
- [ ] Add performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Design inspiration from Luma
- Icons by Heroicons
- Images from Pexels (placeholder)
- Built with amazing open source tools

---

**Note**: This is a frontend-only demonstration. All payment processing, email delivery, and backend functionality is simulated for demo purposes.