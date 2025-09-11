'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  EyeIcon, 
  PencilIcon, 
  TrashIcon, 
  UsersIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';
import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import { useEventStore } from '../../src/store/eventStore';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { events, attendees, setEvents, setAttendees } = useEventStore();
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    }
    
    loadData();
  }, [events.length, setEvents, setAttendees]);

  const mockLogin = () => {
    setIsAuthenticated(true);
  };

  const exportAttendees = (eventId: string) => {
    const eventAttendees = attendees.filter(a => a.eventId === eventId);
    const csvContent = [
      ['Name', 'Email', 'Ticket Type', 'Registration Date', 'Checked In'],
      ...eventAttendees.map(attendee => [
        attendee.name,
        attendee.email,
        attendee.ticketId,
        format(new Date(attendee.registeredAt), 'PP'),
        attendee.checkedIn ? 'Yes' : 'No'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendees-${eventId}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="container py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UsersIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Organizer Dashboard</h1>
              <p className="text-gray-600 mb-6">Access your event management dashboard</p>
              <button
                onClick={mockLogin}
                className="w-full btn-primary"
              >
                Sign In as Organizer
              </button>
              <p className="text-xs text-gray-500 mt-4">
                Demo mode - No real authentication required
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const selectedEventData = selectedEvent ? events.find(e => e.id === selectedEvent) : null;
  const selectedEventAttendees = selectedEvent ? attendees.filter(a => a.eventId === selectedEvent) : [];
  
  const stats = {
    totalEvents: events.length,
    totalAttendees: attendees.length,
    totalRevenue: attendees.reduce((sum, attendee) => {
      const event = events.find(e => e.id === attendee.eventId);
      const ticket = event?.tickets.find(t => t.id === attendee.ticketId);
      return sum + (ticket?.price || 0);
    }, 0),
    checkedIn: attendees.filter(a => a.checkedIn).length,
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Event Dashboard</h1>
            <p className="text-gray-600">Manage your events and attendees</p>
          </div>
          <button className="btn-primary flex items-center space-x-2">
            <PlusIcon className="w-5 h-5" />
            <span>Create Event</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <CalendarIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Attendees</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAttendees}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <UsersIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <CurrencyDollarIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Checked In</p>
                <p className="text-2xl font-bold text-gray-900">{stats.checkedIn}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Events List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Your Events</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {events.map((event) => {
                  const eventAttendees = attendees.filter(a => a.eventId === event.id);
                  const revenue = eventAttendees.reduce((sum, attendee) => {
                    const ticket = event.tickets.find(t => t.id === attendee.ticketId);
                    return sum + (ticket?.price || 0);
                  }, 0);

                  return (
                    <div key={event.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {format(new Date(event.datetime), 'PPp')}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{eventAttendees.length} attendees</span>
                            <span>${revenue} revenue</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              event.status === 'published' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {event.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Event Details / Attendees */}
          <div className="lg:col-span-1">
            {selectedEventData ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Attendees</h2>
                    <button
                      onClick={() => exportAttendees(selectedEvent!)}
                      className="btn-ghost btn-sm"
                    >
                      Export CSV
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">{selectedEventData.title}</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {selectedEventAttendees.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No attendees yet</p>
                    ) : (
                      selectedEventAttendees.map((attendee) => (
                        <div key={attendee.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{attendee.name}</p>
                            <p className="text-sm text-gray-600">{attendee.email}</p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block w-3 h-3 rounded-full ${
                              attendee.checkedIn ? 'bg-green-500' : 'bg-gray-300'
                            }`} />
                            <p className="text-xs text-gray-500 mt-1">
                              {attendee.checkedIn ? 'Checked in' : 'Not checked in'}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="text-center py-12">
                  <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Event</h3>
                  <p className="text-gray-500">Choose an event to view attendee details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}