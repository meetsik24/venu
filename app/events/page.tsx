'use client';

import { useState } from 'react';
import Header from '@/src/components/Header';
import { EventGrid } from '@/src/components/EventGrid';
import { Footer } from '@/src/components/Footer';
import { Search, Filter } from 'lucide-react';

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
  },
  {
    id: '4',
    title: 'Cooking Class',
    description: 'Learn to cook authentic Italian cuisine with a professional chef.',
    date: 'March 28, 2024',
    time: '4:00 PM',
    location: 'Chicago, IL',
    attendees: 12,
    maxAttendees: 20,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    category: 'Education'
  },
  {
    id: '5',
    title: 'Yoga Session',
    description: 'Relax and rejuvenate with a guided yoga session in the park.',
    date: 'March 30, 2024',
    time: '8:00 AM',
    location: 'Los Angeles, CA',
    attendees: 35,
    maxAttendees: 50,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
    category: 'Health'
  },
  {
    id: '6',
    title: 'Music Concert',
    description: 'Enjoy an evening of live music from local artists.',
    date: 'April 2, 2024',
    time: '8:00 PM',
    location: 'Austin, TX',
    attendees: 120,
    maxAttendees: 200,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    category: 'Entertainment'
  }
];

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = ['All', 'Technology', 'Design', 'Business', 'Education', 'Health', 'Entertainment'];

  const filteredEvents = sampleEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Events</h1>
            <p className="text-muted-foreground">
              Discover amazing events happening around you.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="minimal-card mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="minimal-input pl-10"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="minimal-input w-40"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Events Grid */}
          <EventGrid events={filteredEvents} loading={loading} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}