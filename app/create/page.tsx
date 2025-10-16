'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/features/Header';
import { Calendar, MapPin, Users, Clock, Plus, Share2, CheckCircle, Copy, Image as ImageIcon, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import NotificationModal from '@/components/features/NotificationModal';
import { getCategoryImage } from '@/lib/eventImages';
import { apiClient } from '@/lib/api/client';

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
    maxAttendees: '',
    imageUrl: ''
  });
  const [createdEvent, setCreatedEvent] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
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

  // Update image preview when imageUrl or category changes
  useEffect(() => {
    if (formData.imageUrl) {
      setImagePreview(formData.imageUrl);
    } else if (formData.category) {
      setImagePreview(getCategoryImage(formData.category));
    } else {
      setImagePreview('');
    }
  }, [formData.imageUrl, formData.category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      const payload = {
        title: formData.title,
        description: formData.description || undefined,
        date: new Date(`${formData.date}T${formData.time}:00`).toISOString(),
        location: formData.location,
        category: formData.category || undefined,
      };

      const created = await apiClient.createEvent(payload as any);
      console.log('Event created successfully:', created);
      setCreatedEvent(created);
        setShowSuccess(true);
        // Reset form
        setFormData({
          title: '',
          description: '',
          date: '',
          time: '',
          location: '',
          category: '',
          maxAttendees: '',
          imageUrl: ''
        });
    } catch (error: any) {
      console.error('Error creating event:', error);
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Creation Failed',
        message: 'Failed to create event: ' + (error?.message || 'Unknown error')
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

                {/* Image URL */}
                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium mb-2">
                    Event Image URL (Optional)
                  </label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                      type="url"
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      className="minimal-input pl-10"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave empty to use a predefined image based on category
                  </p>
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Image Preview
                    </label>
                    <div className="relative group">
                      <img
                        src={imagePreview}
                        alt="Event preview"
                        className="w-full h-48 object-cover rounded-lg border border-border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => window.open(imagePreview, '_blank')}
                          className="flex items-center gap-2 text-white bg-white/20 px-3 py-2 rounded-md hover:bg-white/30 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View Full Size
                        </button>
                      </div>
                    </div>
                  </div>
                )}
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