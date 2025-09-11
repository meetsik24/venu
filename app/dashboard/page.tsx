'use client';

import { useEffect, useState } from 'react';
import { Calendar, Users, Eye, Share2, Plus, BarChart3, Settings } from 'lucide-react';
import Header from '@/src/components/Header';
import { Footer } from '@/src/components/Footer';
import Link from 'next/link';

export default function DashboardPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalAttendees: 0,
    upcomingEvents: 0
  });

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // Load events
        const eventsResponse = await fetch('/api/events');
        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          setEvents(eventsData.events);
          
          // Calculate stats
          const totalEvents = eventsData.events.length;
          const totalAttendees = eventsData.events.reduce((sum: number, event: any) => 
            sum + (parseInt(event.attendee_count) || 0), 0
          );
          const upcomingEvents = eventsData.events.filter((event: any) => 
            new Date(event.date) > new Date()
          ).length;
          
          setStats({
            totalEvents,
            totalAttendees,
            upcomingEvents
          });
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const copyEventLink = (eventId: string) => {
    const eventUrl = `${window.location.origin}/events/${eventId}`;
    navigator.clipboard.writeText(eventUrl);
    alert('Event link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="minimal-card">
                  <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                  <div className="h-8 bg-muted rounded w-1/3" />
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="minimal-card">
                  <div className="h-6 bg-muted rounded w-1/3 mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Event Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your events and track attendance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="minimal-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{stats.totalEvents}</p>
              </div>
              <Calendar className="w-8 h-8 text-primary" />
            </div>
          </div>
          
          <div className="minimal-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Attendees</p>
                <p className="text-2xl font-bold">{stats.totalAttendees}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </div>
          
          <div className="minimal-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming Events</p>
                <p className="text-2xl font-bold">{stats.upcomingEvents}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link href="/create" className="minimal-button-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create New Event
          </Link>
          <button className="minimal-button-outline flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>

        {/* Events List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Your Events</h2>
          
          {events.length === 0 ? (
            <div className="minimal-card text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No events yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first event to get started
              </p>
              <Link href="/create" className="minimal-button-primary">
                Create Event
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event: any) => (
                <div key={event.id} className="minimal-card">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{event.attendee_count || 0} attendees</span>
                        </div>
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                          {event.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/events/${event.id}`}
                        className="minimal-button-outline flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                      <button
                        onClick={() => copyEventLink(event.id)}
                        className="minimal-button-outline flex items-center gap-2"
                      >
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}