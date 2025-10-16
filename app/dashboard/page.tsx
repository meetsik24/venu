'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Users, Eye, Share2, Plus, BarChart3, Settings, Edit, Trash2, UserCheck, DollarSign, ArrowRight } from 'lucide-react';
import Header from '@/components/features/Header';
import { Footer } from '@/components/features/Footer';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { generateEventThumbnail } from '@/lib/eventImages';
import EditEventModal from '@/components/features/EditEventModal';
import NotificationModal from '@/components/features/NotificationModal';
import { apiClient } from '@/lib/api/client';

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

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalAttendees: 0,
    totalRevenue: 0,
    upcomingEvents: 0
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    action?: { label: string; onClick: () => void };
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
      return;
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    async function fetchUserEvents() {
      try {
        const userEvents = await apiClient.getUserEvents();
        
        // Transform the data to match the expected format
        const transformedEvents = userEvents.map((event: any) => ({
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
        
        // Calculate stats
        const totalEvents = transformedEvents.length;
        const totalAttendees = transformedEvents.reduce((sum: number, event: Event) => sum + (event.attendee_count || 0), 0);
        const totalRevenue = transformedEvents.reduce((sum: number, event: Event) => sum + (event.price * (event.attendee_count || 0)), 0);
        const upcomingEvents = transformedEvents.filter((event: Event) => new Date(event.date) > new Date()).length;
        
        setStats({
          totalEvents,
          totalAttendees,
          totalRevenue,
          upcomingEvents
        });
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserEvents();
  }, [user]);

  const handleDeleteEvent = async (eventId: string) => {
    const eventToDelete = events.find(e => e.id === eventId);
    
    setNotification({
      isOpen: true,
      type: 'warning',
      title: 'Delete Event',
      message: `Are you sure you want to delete "${eventToDelete?.title}"? This action cannot be undone.`,
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            await apiClient.deleteEvent(eventId);
              setEvents(events.filter(event => event.id !== eventId));
              setStats(prev => ({
                ...prev,
                totalEvents: prev.totalEvents - 1
              }));
              setNotification({
                isOpen: true,
                type: 'success',
                title: 'Event Deleted',
                message: 'The event has been successfully deleted.'
              });
          } catch (error) {
            console.error('Error deleting event:', error);
            setNotification({
              isOpen: true,
              type: 'error',
              title: 'Delete Failed',
              message: 'Failed to delete the event. Please try again.'
            });
          }
        }
      }
    });
  };

  const handleViewEvent = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  const handleEditEvent = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setEditModalOpen(true);
    }
  };

  const handleSaveEvent = async (updatedEvent: Partial<Event>) => {
    if (!selectedEvent) return;

    try {
      const updated = await apiClient.updateEvent(selectedEvent.id, updatedEvent);
      setEvents(events.map(event => 
        event.id === selectedEvent.id ? { ...event, ...updated } : event
      ));
      setNotification({
        isOpen: true,
        type: 'success',
        title: 'Event Updated',
        message: 'The event has been successfully updated.'
      });
    } catch (error) {
      console.error('Error updating event:', error);
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update the event. Please try again.'
      });
    }
  };

  const handleViewAttendees = (eventId: string) => {
    router.push(`/events/${eventId}/attendees`);
  };

  const copyEventLink = (eventId: string) => {
    const eventUrl = `${window.location.origin}/events/${eventId}`;
    navigator.clipboard.writeText(eventUrl);
    setNotification({
      isOpen: true,
      type: 'success',
      title: 'Link Copied',
      message: 'Event link has been copied to your clipboard!'
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-lg" />
              ))}
              </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded-lg" />
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your events and track your performance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
              <p className="text-xs text-muted-foreground">
                All time events created
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAttendees}</div>
              <p className="text-xs text-muted-foreground">
                People who attended your events
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Revenue from paid events
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
              <p className="text-xs text-muted-foreground">
                Events scheduled for the future
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Events Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Events</h2>
            <Button asChild>
              <Link href="/create">
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Link>
            </Button>
              </div>

          {events.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No events yet</h3>
                <p className="text-muted-foreground text-center mb-6">
                  Create your first event to start building your community
                </p>
                <Button asChild>
                  <Link href="/create">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Event
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={event.image || generateEventThumbnail(event.title, event.category)}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                          </div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary">{event.category}</Badge>
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewEvent(event.id)}
                          title="View Event"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditEvent(event.id)}
                          title="Edit Event"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewAttendees(event.id)}
                          title="View Attendees"
                        >
                          <UserCheck className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteEvent(event.id)}
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {event.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                        <span>{event.time}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 flex items-center justify-center">
                          <div className={`w-2 h-2 rounded-full ${event.is_online ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                        </span>
                        <span className="line-clamp-1">
                          {event.is_online ? 'Online Event' : event.location}
                        </span>
              </div>
                      
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>
                          {event.attendee_count || 0}
                          {event.max_attendees && ` / ${event.max_attendees}`} attendees
                        </span>
            </div>
          </div>

                    <div className="mt-4 pt-4 border-t border-border">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleViewAttendees(event.id)}
                      >
                        View Attendees
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                  </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Edit Event Modal */}
      <EditEventModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onSave={handleSaveEvent}
      />

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        action={notification.action}
      />
    </div>
  );
}