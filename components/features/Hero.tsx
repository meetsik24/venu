'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      
      <div className="container relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Events that don't suck.
              <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Period. 🚀
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create, discover, and attend events that people actually want to be at.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Link href="/create" className="minimal-button-primary text-lg px-8 py-4 group">
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
              Create Event
            </Link>
            <Link href="/events" className="minimal-button-outline text-lg px-8 py-4">
              Browse Events
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center group">
              <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">500+</div>
              <div className="text-sm text-muted-foreground">Events Created</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">10K+</div>
              <div className="text-sm text-muted-foreground">Happy Attendees</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">50+</div>
              <div className="text-sm text-muted-foreground">Cities</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}