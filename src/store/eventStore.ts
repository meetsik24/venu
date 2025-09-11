'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  coverImage: string;
  organizerId: string;
  organizer: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  datetime: string;
  endDatetime: string;
  timezone: string;
  location: {
    type: 'venue' | 'online';
    name?: string;
    address?: string;
    coordinates?: { lat: number; lng: number };
    platform?: string;
    url?: string;
  };
  category: string;
  tickets: Ticket[];
  tags: string[];
  status: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  name: string;
  price: number;
  currency: string;
  available: number;
  total: number;
  description: string;
}

export interface Attendee {
  id: string;
  eventId: string;
  name: string;
  email: string;
  ticketId: string;
  ticketCode: string;
  checkedIn: boolean;
  registeredAt: string;
}

export interface TicketPurchase {
  eventId: string;
  ticketId: string;
  quantity: number;
  attendeeInfo: {
    name: string;
    email: string;
    phone?: string;
  };
}

interface EventStore {
  events: Event[];
  attendees: Attendee[];
  cart: TicketPurchase[];
  loading: boolean;
  error: string | null;
  
  // Actions
  setEvents: (events: Event[]) => void;
  setAttendees: (attendees: Attendee[]) => void;
  addToCart: (purchase: TicketPurchase) => void;
  removeFromCart: (eventId: string, ticketId: string) => void;
  clearCart: () => void;
  updateCartQuantity: (eventId: string, ticketId: string, quantity: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Computed
  getEventBySlug: (slug: string) => Event | undefined;
  getEventAttendees: (eventId: string) => Attendee[];
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

export const useEventStore = create<EventStore>()(
  persist(
    (set, get) => ({
      events: [],
      attendees: [],
      cart: [],
      loading: false,
      error: null,

      setEvents: (events) => set({ events }),
      setAttendees: (attendees) => set({ attendees }),
      
      addToCart: (purchase) => set((state) => ({
        cart: [...state.cart.filter(item => !(item.eventId === purchase.eventId && item.ticketId === purchase.ticketId)), purchase]
      })),
      
      removeFromCart: (eventId, ticketId) => set((state) => ({
        cart: state.cart.filter(item => !(item.eventId === eventId && item.ticketId === ticketId))
      })),
      
      clearCart: () => set({ cart: [] }),
      
      updateCartQuantity: (eventId, ticketId, quantity) => set((state) => ({
        cart: state.cart.map(item =>
          item.eventId === eventId && item.ticketId === ticketId
            ? { ...item, quantity }
            : item
        )
      })),
      
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      
      getEventBySlug: (slug) => get().events.find(event => event.slug === slug),
      getEventAttendees: (eventId) => get().attendees.filter(attendee => attendee.eventId === eventId),
      
      getCartTotal: () => {
        const { cart, events } = get();
        return cart.reduce((total, item) => {
          const event = events.find(e => e.id === item.eventId);
          const ticket = event?.tickets.find(t => t.id === item.ticketId);
          return total + (ticket?.price || 0) * item.quantity;
        }, 0);
      },
      
      getCartItemCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'event-store',
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);