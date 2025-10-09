'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/features/Header';
import { EventGrid } from '@/components/features/EventGrid';
import { Footer } from '@/components/features/Footer';
import { Search, Filter } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { generateEventThumbnail } from '@/lib/eventImages';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  attendee_count: number;
  max_attendees?: number;
  image?: string;
  price: number;
  currency: string;
  is_online: boolean;
  is_public: boolean;
  requires_approval: boolean;
  created_at: string;
  updated_at: string;
  creator_id: string;
}

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);

  const categories = ['All', 'Technology', 'Design', 'Business', 'Education', 'Health', 'Entertainment'];

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await apiClient.getEvents({
          category: selectedCategory === 'All' ? undefined : selectedCategory,
          search: searchTerm || undefined
        });
        
        // Transform the data to match the expected format
        const transformedEvents = data.events.map((event: any) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          date: new Date(event.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          time: new Date(event.date).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          location: event.location,
          category: event.category,
          attendee_count: event.rsvp_count,
          max_attendees: 100,
          image: generateEventThumbnail(event.title, event.category),
          price: 0,
          currency: 'USD',
          is_online: false,
          is_public: true,
          requires_approval: false,
          created_at: event.created_at,
          updated_at: event.updated_at,
          creator_id: event.creator_id
        }));
        
        setEvents(transformedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [searchTerm, selectedCategory]);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).map(event => ({
    id: event.id,
    title: event.title,
    description: event.description,
    date: new Date(event.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    time: event.time,
    location: event.location,
    attendees: event.attendee_count || 0,
    maxAttendees: event.max_attendees,
    image: event.image,
    category: event.category
  }));

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