'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';

export function Hero() {
  return (
    <section className="py-20 md:py-32">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Create and discover
            <br />
            <span className="text-muted-foreground">amazing events</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The simplest way to organize events, manage attendees, and build community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create" className="minimal-button-primary">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Link>
            <Link href="/events" className="minimal-button-outline">
              Browse Events
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}