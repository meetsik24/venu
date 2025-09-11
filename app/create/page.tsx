'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/src/components/Header';
import { Calendar, MapPin, Users, Clock, Plus, Share2, CheckCircle, Copy } from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext';
import NotificationModal from '@/src/components/NotificationModal';

export default function CreateEventPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    maxAttendees: ''
  });
  const [createdEvent, setCreatedEvent] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          creatorId: user.id,
          maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : null,
          isOnline: formData.location.toLowerCase() === 'online',
          isPublic: true,
          requiresApproval: false,
          price: 0,
          currency: 'USD'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Event created successfully:', result);
        setCreatedEvent(result.event);
        setShowSuccess(true);
        // Reset form
        setFormData({
          title: '',
          description: '',
          date: '',
          time: '',
          location: '',
          category: '',
          maxAttendees: ''
        });
             } else {
               const error = await response.json();
               console.error('Error creating event:', error);
               setNotification({
                 isOpen: true,
                 type: 'error',
                 title: 'Creation Failed',
                 message: 'Failed to create event: ' + error.error
               });
             }
           } catch (error) {
             console.error('Error creating event:', error);
             setNotification({
               isOpen: true,
               type: 'error',
               title: 'Creation Failed',
               message: 'Failed to create event. Please try again.'
             });
           }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
    [e.target.name]: e.target.value
  });
};

  const copyEventLink = () => {
    if (createdEvent) {
      const eventUrl = `${window.location.origin}/events/${createdEvent.id}`;
      navigator.clipboard.writeText(eventUrl);
      setNotification({
        isOpen: true,
        type: 'success',
        title: 'Link Copied',
        message: 'Event link has been copied to your clipboard!'
      });
    }
  };

const createAnotherEvent = () => {
  setShowSuccess(false);
  setCreatedEvent(null);
};

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8" />
            <div className="max-w-2xl mx-auto">
              <div className="h-64 bg-muted rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to signin
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-12">
        <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold mb-2">Create Event</h1>
                  <p className="text-muted-foreground">
                    Fill in the details below to create your event.
                  </p>
                </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="minimal-card">
              <div className="space-y-6">
                {/* Event Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-2">
                    Event Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="minimal-input"
                    placeholder="Enter event title"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="minimal-input min-h-[100px] resize-none"
                    placeholder="Describe your event"
                    required
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="minimal-input"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="minimal-input"
                      required
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="minimal-input"
                    placeholder="Enter location or 'Online'"
                    required
                  />
                </div>

                {/* Category and Capacity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium mb-2">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="minimal-input"
                      required
                    >
                      <option value="">Select category</option>
                      <option value="Technology">Technology</option>
                      <option value="Design">Design</option>
                      <option value="Business">Business</option>
                      <option value="Education">Education</option>
                      <option value="Health">Health</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="maxAttendees" className="block text-sm font-medium mb-2">
                      Max Attendees
                    </label>
                    <input
                      type="number"
                      id="maxAttendees"
                      name="maxAttendees"
                      value={formData.maxAttendees}
                      onChange={handleChange}
                      className="minimal-input"
                      placeholder="Leave empty for unlimited"
                      min="1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
                <button type="submit" className="minimal-button-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </button>
            </div>
          </form>
        </div>
      </main>

      {/* Success Modal */}
      {showSuccess && createdEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Event Created Successfully!</h2>
                <p className="text-muted-foreground">
                  Your event "{createdEvent.title}" is now live and ready for RSVPs.
                </p>
              </div>

              <div className="space-y-4">
                <div className="minimal-card">
                  <h3 className="font-semibold mb-2">Share Your Event</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={`${window.location.origin}/events/${createdEvent.id}`}
                      readOnly
                      className="minimal-input flex-1 text-sm"
                    />
                    <button
                      onClick={copyEventLink}
                      className="minimal-button-outline flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={createAnotherEvent}
                    className="minimal-button-outline flex-1"
                  >
                    Create Another Event
                  </button>
                  <button
                    onClick={() => window.location.href = `/events/${createdEvent.id}`}
                    className="minimal-button-primary flex-1 flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    View Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
             )}

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