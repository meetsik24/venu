'use client';

import { useEffect } from 'react';
import Hero from '../src/components/Hero';
import EventGrid from '../src/components/EventGrid';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import { useEventStore } from '../src/store/eventStore';

export default function HomePage() {
  const { events, loading, setEvents, setAttendees, setLoading } = useEventStore();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const response = await fetch('/api/events');
        const data = await response.json();
        setEvents(data.events);
        setAttendees(data.attendees);
      } catch (error) {
        console.error('Failed to load events:', error);
      }
      setLoading(false);
    }
    
    loadData();
  }, [setEvents, setAttendees, setLoading]);

  // Show featured events (first 6)
  const featuredEvents = events.slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      
      <section className="container py-16">
        <EventGrid
          events={featuredEvents}
          loading={loading}
          title="Featured Events"
          subtitle="Discover the most popular events happening around you"
        />
      </section>
      
      <Footer />
    </div>
  );
}