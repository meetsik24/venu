'use client';

import { useState } from 'react';
import { X, Calendar, MapPin, Users, Clock } from 'lucide-react';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
  eventUrl: string;
}

export default function RSVPModal({ isOpen, onClose, event, eventUrl }: RSVPModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
    ticketCount: 1
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/events/${event.id}/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setFormData({
            name: '',
            email: '',
            phone: '',
            notes: '',
            ticketCount: 1
          });
        }, 2000);
      } else {
        const error = await response.json();
        alert('Failed to RSVP: ' + error.error);
      }
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      alert('Failed to RSVP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const copyEventLink = () => {
    navigator.clipboard.writeText(eventUrl);
    alert('Event link copied to clipboard!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-background rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold">RSVP for Event</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Event Info */}
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
              {event.max_attendees && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{event.attendee_count || 0} / {event.max_attendees} attendees</span>
                </div>
              )}
            </div>
          </div>

          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-900/20 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">RSVP Confirmed!</h3>
              <p className="text-muted-foreground mb-4">You're all set for this event.</p>
              <button
                onClick={copyEventLink}
                className="minimal-button-outline"
              >
                Share Event Link
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="minimal-input"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="minimal-input"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="minimal-input"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label htmlFor="ticketCount" className="block text-sm font-medium mb-2">
                  Number of Tickets
                </label>
                <select
                  id="ticketCount"
                  name="ticketCount"
                  value={formData.ticketCount}
                  onChange={handleChange}
                  className="minimal-input"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium mb-2">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="minimal-input min-h-[80px] resize-none"
                  placeholder="Any special requirements or notes..."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="minimal-button-outline w-full sm:flex-1 order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="minimal-button-primary w-full sm:flex-1 order-1 sm:order-2"
                >
                  {loading ? 'RSVPing...' : 'Confirm RSVP'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}