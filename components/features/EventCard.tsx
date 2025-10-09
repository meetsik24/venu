'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { generateEventThumbnail } from '@/lib/eventImages';
import { Event } from '@/types';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/events/${event.id}`}>
      <div 
        className="minimal-card group cursor-pointer transition-all duration-200 hover:shadow-md"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Event Image */}
        <div className="aspect-video w-full overflow-hidden rounded-md mb-4">
          <img 
            src={event.image || generateEventThumbnail(event.title, event.category || 'general')} 
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        </div>
        
        {/* Event Content */}
        <div className="space-y-3">
          {/* Category */}
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {event.category}
          </span>
          
          {/* Title */}
          <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          
          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {event.description}
          </p>
          
          {/* Event Details */}
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{event.date}</span>
              <Clock className="w-4 h-4 ml-2" />
              <span>{event.time}</span>
            </div>
            
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>
                {event.attendees}
                {event.maxAttendees && ` / ${event.maxAttendees}`} attendees
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}