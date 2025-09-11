import Header from '@/src/components/Header';
import { Hero } from '@/src/components/Hero';
import { EventGrid } from '@/src/components/EventGrid';
import { Footer } from '@/src/components/Footer';

// Sample events data
const sampleEvents = [
  {
    id: '1',
    title: 'Tech Meetup 2024',
    description: 'Join us for an evening of networking and tech discussions with industry leaders.',
    date: 'March 15, 2024',
    time: '6:00 PM',
    location: 'San Francisco, CA',
    attendees: 45,
    maxAttendees: 100,
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop',
    category: 'Technology'
  },
  {
    id: '2',
    title: 'Design Workshop',
    description: 'Learn the fundamentals of modern UI/UX design with hands-on exercises.',
    date: 'March 20, 2024',
    time: '2:00 PM',
    location: 'Online',
    attendees: 23,
    maxAttendees: 50,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    category: 'Design'
  },
  {
    id: '3',
    title: 'Startup Pitch Night',
    description: 'Watch innovative startups pitch their ideas to investors and get feedback.',
    date: 'March 25, 2024',
    time: '7:00 PM',
    location: 'New York, NY',
    attendees: 78,
    maxAttendees: 150,
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop',
    category: 'Business'
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Hero />
        
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Upcoming Events</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover amazing events happening in your area and around the world.
              </p>
            </div>
            
            <EventGrid events={sampleEvents} />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}