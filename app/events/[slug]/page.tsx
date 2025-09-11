'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { format } from 'date-fns';
import { CalendarIcon, MapPinIcon, UserIcon, ClockIcon, CheckCircleIcon, ShareIcon, HeartIcon } from '@heroicons/react/24/outline';
import Header from '../../../src/components/Header';
import Footer from '../../../src/components/Footer';
import RSVPModal from '../../../src/components/RSVPModal';
import { useEventStore, type Event } from '../../../src/store/eventStore';

export default function EventDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { events, setEvents, setAttendees, getEventBySlug } = useEventStore();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string>('');

  useEffect(() => {
    async function loadData() {
      if (events.length === 0) {
        try {
          const response = await fetch('/api/events');
          const data = await response.json();
          setEvents(data.events);
          setAttendees(data.attendees);
        } catch (error) {
          console.error('Failed to load events:', error);
        }
      }
      setLoading(false);
    }
    
    loadData();
  }, [events.length, setEvents, setAttendees]);

  useEffect(() => {
    if (events.length > 0) {
      const foundEvent = getEventBySlug(slug);
      setEvent(foundEvent || null);
    }
  }, [slug, events, getEventBySlug]);

  const handleRSVP = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setIsRSVPModalOpen(true);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="container py-8">
          <div className="animate-pulse">
            <div className="h-64 md:h-96 bg-gray-200 rounded-xl mb-8" />
            <div className="max-w-4xl mx-auto">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
                <div className="h-64 bg-gray-200 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="container py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
            <p className="text-gray-600 mb-8">The event you're looking for doesn't exist or has been removed.</p>
            <a href="/events" className="btn-primary">
              Browse Other Events
            </a>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const eventDate = new Date(event.datetime);
  const endDate = new Date(event.endDatetime);
  const isOnline = event.location.type === 'online';
  const lowestPrice = Math.min(...event.tickets.map(t => t.price));
  const isFree = lowestPrice === 0;

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Image */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <Image
          src={event.coverImage}
          alt={event.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between text-white"
            >
              <div>
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-2">
                  {event.category}
                </span>
                <h1 className="text-2xl md:text-4xl font-bold mb-2">{event.title}</h1>
                <div className="flex items-center space-x-4 text-sm opacity-90">
                  <span className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    {format(eventDate, 'MMM d, yyyy')}
                  </span>
                  <span className="flex items-center">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    {format(eventDate, 'h:mm a')}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                  <ShareIcon className="w-5 h-5" />
                </button>
                <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                  <HeartIcon className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Organizer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-3 mb-6"
              >
                <Image
                  src={event.organizer.avatar}
                  alt={event.organizer.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{event.organizer.name}</h3>
                    {event.organizer.verified && (
                      <CheckCircleIcon className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Event Organizer</p>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About this event</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </motion.div>

              {/* Event Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-50 rounded-lg p-6 mb-8"
              >
                <h3 className="font-semibold text-gray-900 mb-4">Event Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CalendarIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {format(eventDate, 'EEEE, MMMM d, yyyy')}
                      </p>
                      <p className="text-sm text-gray-600">
                        {format(eventDate, 'h:mm a')} - {format(endDate, 'h:mm a')} ({event.timezone})
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
                          <p className="font-medium text-gray-900">Online Event</p>
                          <p className="text-sm text-gray-600">
                            Link will be provided after registration
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">{event.location.name}</p>
                          <p className="text-sm text-gray-600">{event.location.address}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Tags */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="sticky top-24"
              >
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {isFree ? 'Free Event' : 'Get Tickets'}
                  </h3>
                  
                  <div className="space-y-4">
                    {event.tickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{ticket.name}</h4>
                          <div className="text-right">
                            {ticket.price === 0 ? (
                              <span className="text-green-600 font-bold">Free</span>
                            ) : (
                              <span className="text-gray-900 font-bold">
                                ${ticket.price}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{ticket.description}</p>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm text-gray-500">
                            {ticket.available} of {ticket.total} available
                          </span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${((ticket.total - ticket.available) / ticket.total) * 100}%`
                              }}
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => handleRSVP(ticket.id)}
                          className="w-full btn-primary"
                          disabled={ticket.available === 0}
                        >
                          {ticket.available === 0 ? 'Sold Out' : ticket.price === 0 ? 'Reserve Spot' : 'Get Ticket'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* RSVP Modal */}
      <RSVPModal
        isOpen={isRSVPModalOpen}
        onClose={() => setIsRSVPModalOpen(false)}
        event={event}
        ticketId={selectedTicketId}
      />
      
      <Footer />
    </main>
  );
}