'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, User, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Event } from '../store/eventStore';

interface EventCardProps {
  event: Event;
  index?: number;
}

export default function EventCard({ event, index = 0 }: EventCardProps) {
  const eventDate = new Date(event.datetime);
  const isOnline = event.location.type === 'online';
  const lowestPrice = Math.min(...event.tickets.map(t => t.price));
  const isFree = lowestPrice === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <Card className="group overflow-hidden transition-all duration-200 hover:shadow-md">
        <Link href={`/events/${event.slug}`} className="block">
          {/* Image */}
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute top-4 right-4">
              <Badge variant={isFree ? "secondary" : "default"} className="text-xs font-medium">
                {isFree ? 'Free' : `From $${lowestPrice}`}
              </Badge>
            </div>
          </div>

          <CardContent className="p-6">
            {/* Category */}
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="text-xs font-medium uppercase tracking-wide">
                {event.category}
              </Badge>
              {event.organizer.verified && (
                <CheckCircle className="w-4 h-4 text-primary" />
              )}
            </div>

            {/* Title */}
            <h3 className="font-semibold text-card-foreground text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {event.title}
            </h3>

            {/* Description */}
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {event.shortDescription}
            </p>

            {/* Meta info */}
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{format(eventDate, 'MMM d, yyyy')} at {format(eventDate, 'h:mm a')}</span>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                {isOnline ? (
                  <>
                    <div className="w-4 h-4 mr-2 flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
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

              <div className="flex items-center text-sm text-muted-foreground">
                <User className="w-4 h-4 mr-2" />
                <span>by {event.organizer.name}</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-0 px-6 pb-6">
            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {event.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs"
                >
                  #{tag}
                </Badge>
              ))}
              {event.tags.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{event.tags.length - 3} more
                </span>
              )}
            </div>
          </CardFooter>
        </Link>
      </Card>
    </motion.div>
  );
}