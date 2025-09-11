'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar, MapPin, Clock, User, ArrowLeft, Share2, Users } from 'lucide-react';
import Header from '@/src/components/Header';
import { Footer } from '@/src/components/Footer';
import RSVPModal from '@/src/components/RSVPModal';

export default function EventDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false);
  const [eventUrl, setEventUrl] = useState('');

  useEffect(() => {
    async function loadEvent() {
      try {
        // Always try to get from the events list API first
        const eventsResponse = await fetch('/api/events');
        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          const foundEvent = eventsData.events.find((e: any) => e.id === id);
          if (foundEvent) {
            setEvent(foundEvent);
            setLoading(false);
            return;
          }
        }
        
        // If not found, show error
        setError('Event not found');
      } catch (error) {
        console.error('Failed to load event:', error);
        setError('Failed to load event');
      } finally {
        setLoading(false);
      }
    }
    
    loadEvent();
  }, [id]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setEventUrl(`${window.location.origin}/events/${id}`);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <div className="animate-pulse">
            <div className="h-64 md:h-96 bg-muted rounded-xl mb-8" />
            <div className="max-w-4xl mx-auto">
              <div className="h-8 bg-muted rounded w-3/4 mb-4" />
              <div className="h-4 bg-muted rounded w-1/2 mb-8" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
                <div className="h-64 bg-muted rounded-lg" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
            <p className="text-muted-foreground mb-8">
              {error || "The event you're looking for doesn't exist or has been removed."}
            </p>
            <Link href="/events" className="minimal-button-primary">
              Browse Other Events
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const isOnline = event.isOnline;
  const isFree = event.price === 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Back Button */}
      <div className="container py-4">
        <Link 
          href="/events" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to events
        </Link>
      </div>

      {/* Event Image */}
      {event.image && (
        <div className="relative h-64 md:h-96 overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      )}

      {/* Content */}
      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Event Header */}
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                  {event.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>
                <p className="text-muted-foreground text-lg">{event.description}</p>
              </div>

              {/* Event Details */}
              <div className="minimal-card mb-8">
                <h3 className="font-semibold mb-4">Event Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">
                        {eventDate.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {event.time}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    {isOnline ? (
                      <>
                        <div className="w-5 h-5 mt-0.5 flex items-center justify-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <div>
                          <p className="font-medium">Online Event</p>
                          <p className="text-sm text-muted-foreground">
                            Link will be provided after registration
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">{event.location}</p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Organizer</p>
                      <p className="text-sm text-muted-foreground">
                        {event.creator?.name || 'Event Organizer'}
                      </p>
                    </div>
                  </div>

                  {event.max_attendees && (
                    <div className="flex items-start space-x-3">
                      <Users className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Attendees</p>
                        <p className="text-sm text-muted-foreground">
                          {event.attendee_count || 0} of {event.max_attendees} spots taken
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="minimal-card sticky top-24">
                <h3 className="text-xl font-bold mb-4">
                  {isFree ? 'Free Event' : 'Get Tickets'}
                </h3>
                
                <div className="space-y-4">
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">General Admission</h4>
                      <div className="text-right">
                        {isFree ? (
                          <span className="text-green-600 font-bold">Free</span>
                        ) : (
                          <span className="font-bold">
                            ${(event.price / 100).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Join us for this amazing event
                    </p>
                    {event.maxAttendees && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {event.attendeeCount || 0} of {event.maxAttendees} spots taken
                      </p>
                    )}
                    <button
                      onClick={() => setIsRSVPModalOpen(true)}
                      className="w-full minimal-button-primary mb-3"
                      disabled={event.maxAttendees && (event.attendee_count || 0) >= event.maxAttendees}
                    >
                      {event.maxAttendees && (event.attendee_count || 0) >= event.maxAttendees 
                        ? 'Sold Out' 
                        : isFree 
                          ? 'RSVP Now' 
                          : 'Get Ticket'
                      }
                    </button>
                    
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(eventUrl);
                        alert('Event link copied to clipboard!');
                      }}
                      className="w-full minimal-button-outline flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      Share Event
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
      
      {/* RSVP Modal */}
      <RSVPModal
        isOpen={isRSVPModalOpen}
        onClose={() => setIsRSVPModalOpen(false)}
        event={event}
        eventUrl={eventUrl}
      />
    </div>
  );
}