# EventFlow - Event Management Web App

A beautiful, responsive event management web application built with Next.js, TypeScript, and Tailwind CSS. Inspired by Luma's clean design philosophy, EventFlow provides a comprehensive platform for event discovery, ticket purchasing, and organizer management.

## 🚀 Features

### Core Functionality
- **Event Discovery**: Browse and search events with advanced filtering
- **Event Details**: Rich event pages with organizer info, location, and ticket options  
- **RSVP/Ticketing**: Multi-step ticket purchasing flow with QR code generation
- **Organizer Dashboard**: Comprehensive event and attendee management
- **Responsive Design**: Optimized for mobile, tablet, and desktop experiences

### Technical Highlights
- **Modern Stack**: Next.js 13+ with App Router, TypeScript, Tailwind CSS
- **State Management**: Zustand for global state with persistence
- **Animations**: Framer Motion for smooth transitions and micro-interactions
- **Design System**: Comprehensive design tokens with CSS variables
- **Mock Backend**: Local JSON data with Next.js API routes

## 🛠 Tech Stack

- **Framework**: Next.js 13+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **State**: Zustand with persistence
- **Animations**: Framer Motion
- **Icons**: Heroicons
- **QR Codes**: react-qr-code
- **Date Handling**: date-fns
- **Charts**: Recharts (for dashboard analytics)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd eventflow
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm run start
```

### Static Export

```bash
npm run build
npm run export
```

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (mock backend)
│   ├── events/            # Event pages
│   └── dashboard/         # Organizer dashboard
├── src/
│   ├── components/        # Reusable React components
│   ├── store/            # Zustand state management
│   └── styles/           # Design tokens and CSS
├── data/                 # Mock data (JSON files)
└── public/              # Static assets
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

- `GET /api/events` - List all events
- `GET /api/events/[slug]` - Get event by slug  
- `POST /api/rsvp` - Create RSVP (mock)

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
```bash
npm run build
# Deploy to Vercel
```

### Static Export
```bash
npm run build
npm run export
# Deploy static files from `out/` directory
```

## 🔮 Production Roadmap

### Backend Integration
- [ ] Replace JSON files with real database (PostgreSQL/MySQL)
- [ ] Implement proper authentication (NextAuth.js/Auth0)
- [ ] Add server-side validation and security
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