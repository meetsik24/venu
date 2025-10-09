'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Users, Mail, Phone, Calendar, Download } from 'lucide-react';
import Header from '@/components/features/Header';
import { Footer } from '@/components/features/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

interface Attendee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  ticket_count: number;
  status: string;
  created_at: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  attendee_count: number;
  max_attendees?: number;
}

export default function EventAttendeesPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const eventId = params.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
      return;
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    async function loadEventAndAttendees() {
      try {
        const token = localStorage.getItem('auth_token');
        
        // Load event details
        const eventResponse = await fetch(`/api/events/${eventId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (eventResponse.ok) {
          const eventData = await eventResponse.json();
          setEvent(eventData.event);
        }

        // Load attendees
        const attendeesResponse = await fetch(`/api/events/${eventId}/rsvp`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (attendeesResponse.ok) {
          const attendeesData = await attendeesResponse.json();
          setAttendees(attendeesData.rsvps || []);
        } else {
          setError('Failed to load attendees');
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load event data');
      } finally {
        setLoading(false);
      }
    }

    loadEventAndAttendees();
  }, [eventId, user]);

  const exportAttendees = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Tickets', 'Status', 'RSVP Date'].join(','),
      ...attendees.map(attendee => [
        attendee.name,
        attendee.email,
        attendee.phone || '',
        attendee.ticket_count,
        attendee.status,
        new Date(attendee.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event?.title || 'event'}-attendees.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-muted rounded-lg" />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to signin
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
            <p className="text-muted-foreground mb-8">
              {error || "The event you're looking for doesn't exist or you don't have permission to view it."}
            </p>
            <Button onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
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
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Event Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{event.title} - Attendees</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
            </div>
            <Badge variant="secondary">{event.category}</Badge>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{attendees.length} attendees</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Attendee List</h2>
            <p className="text-muted-foreground">
              {attendees.length} people have RSVP'd for this event
            </p>
          </div>
          <Button onClick={exportAttendees} disabled={attendees.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Attendees List */}
        {attendees.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No attendees yet</h3>
              <p className="text-muted-foreground text-center">
                Share your event to start getting RSVPs
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {attendees.map((attendee) => (
              <Card key={attendee.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{attendee.name}</h3>
                        <Badge 
                          variant={attendee.status === 'confirmed' ? 'default' : 'secondary'}
                        >
                          {attendee.status}
                        </Badge>
                        <Badge variant="outline">
                          {attendee.ticket_count} ticket{attendee.ticket_count > 1 ? 's' : ''}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{attendee.email}</span>
                        </div>
                        
                        {attendee.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{attendee.phone}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>RSVP'd on {new Date(attendee.created_at).toLocaleDateString()}</span>
                        </div>
                        
                        {attendee.notes && (
                          <div className="mt-3 p-3 bg-muted rounded-md">
                            <p className="text-sm">
                              <strong>Notes:</strong> {attendee.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
