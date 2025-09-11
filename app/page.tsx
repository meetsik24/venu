'use client';

import { useEffect, useState } from 'react';
import Header from '@/src/components/Header';
import { Hero } from '@/src/components/Hero';
import { EventGrid } from '@/src/components/EventGrid';
import { Footer } from '@/src/components/Footer';

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/api/events');
        if (response.ok) {
          const data = await response.json();
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
            time: event.time,
            location: event.location,
            attendees: parseInt(event.attendee_count) || 0,
            maxAttendees: event.max_attendees,
            image: event.image || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop',
            category: event.category
          }));
          setEvents(transformedEvents);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

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
            <EventGrid events={events} loading={loading} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}