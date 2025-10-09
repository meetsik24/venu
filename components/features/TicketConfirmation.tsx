'use client';

import { motion } from 'framer-motion';
import QRCode from 'react-qr-code';
import { CheckCircle, Calendar, MapPin, Download, Share } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Event, Ticket } from '@/store/eventStore';

interface TicketConfirmationProps {
  event: Event;
  ticket: Ticket;
  attendeeName: string;
  attendeeEmail: string;
  quantity: number;
  ticketCode: string;
  onClose: () => void;
}

export default function TicketConfirmation({
  event,
  ticket,
  attendeeName,
  attendeeEmail,
  quantity,
  ticketCode,
  onClose
}: TicketConfirmationProps) {
  const eventDate = new Date(event.datetime);
  const isOnline = event.location.type === 'online';

  const generateCalendarLink = () => {
    const startDate = format(eventDate, "yyyyMMdd'T'HHmmss");
    const endDate = format(new Date(event.endDatetime), "yyyyMMdd'T'HHmmss");
    const details = encodeURIComponent(event.description);
    const location = isOnline ? 'Online Event' : event.location.address || '';
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate}/${endDate}&details=${details}&location=${encodeURIComponent(location)}`;
  };

  const downloadTicket = () => {
    // In a real app, this would generate and download a PDF ticket
    const ticketData = {
      event: event.title,
      attendee: attendeeName,
      email: attendeeEmail,
      ticket: ticket.name,
      quantity,
      code: ticketCode,
      date: format(eventDate, 'PPpp'),
      location: isOnline ? 'Online Event' : event.location.name,
    };
    
    const dataStr = JSON.stringify(ticketData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ticket-${ticketCode}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const shareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `I'm attending ${event.title}!`,
        url: window.location.href.replace(/\/rsvp.*/, ''),
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href.replace(/\/rsvp.*/, ''));
      // In a real app, you'd show a toast notification here
    }
  };

  return (
    <div className="p-6">
      {/* Success Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-6"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">You're all set!</h2>
        <p className="text-muted-foreground">Your {ticket.price === 0 ? 'spot is reserved' : 'ticket has been purchased'}</p>
      </motion.div>

      {/* Ticket */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-primary to-purple-600 rounded-xl p-6 text-primary-foreground mb-6"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg mb-1">{event.title}</h3>
            <p className="text-primary-foreground/80 text-sm">{ticket.name}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">#{ticketCode}</div>
            <div className="text-primary-foreground/80 text-sm">{quantity} ticket{quantity !== 1 ? 's' : ''}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 mb-4">
          <div className="flex items-center text-sm">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{format(eventDate, 'PPp')}</span>
          </div>
          <div className="flex items-center text-sm">
            {isOnline ? (
              <>
                <div className="w-4 h-4 mr-2 flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                </div>
                <span>Online Event</span>
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4 mr-2" />
                <span>{event.location.name}</span>
              </>
            )}
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-4">
          <div className="flex justify-between items-center text-sm">
            <span>Attendee: {attendeeName}</span>
            <span>Email: {attendeeEmail}</span>
          </div>
        </div>
      </motion.div>

      {/* QR Code */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-6"
      >
        <Card className="inline-block p-4">
          <QRCode
            value={`${event.id}-${ticketCode}-${attendeeEmail}`}
            size={120}
          />
        </Card>
        <p className="text-sm text-muted-foreground mt-2">
          Show this QR code at the event entrance
        </p>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 gap-3 mb-6"
      >
        <Button
          onClick={downloadTicket}
          variant="secondary"
          className="flex items-center space-x-2"
        >
          <Download className="w-5 h-5" />
          <span>Download</span>
        </Button>
        
        <Button
          asChild
          variant="secondary"
          className="flex items-center space-x-2"
        >
          <a
            href={generateCalendarLink()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Calendar className="w-5 h-5" />
            <span>Add to Calendar</span>
          </a>
        </Button>
      </motion.div>

      {/* Email Notice */}
      <Alert className="mb-6">
        <AlertDescription>
          📧 A confirmation email with your ticket details has been sent to <strong>{attendeeEmail}</strong>
        </AlertDescription>
      </Alert>

      {/* Close Button */}
      <Button
        onClick={onClose}
        className="w-full"
      >
        Done
      </Button>
    </div>
  );
}