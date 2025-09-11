'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Filter, Grid3X3, List } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import EventGrid from '../../src/components/EventGrid';
import EventCard from '../../src/components/EventCard';
import { useEventStore } from '../../src/store/eventStore';

export default function EventsPage() {
  const { events, loading, setEvents, setAttendees, setLoading } = useEventStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const response = await fetch('/api/events');
        const data = await response.json();
        setEvents(data.events);
        setAttendees(data.attendees);
      } catch (error) {
        console.error('Failed to load events:', error);
      }
      setLoading(false);
    }
    
    if (events.length === 0) {
      loadData();
    }
  }, [events.length, setEvents, setAttendees, setLoading]);

  // Get unique categories and locations for filters
  const categories = useMemo(() => {
    const cats = ['All', ...new Set(events.map(event => event.category))];
    return cats;
  }, [events]);

  const locations = useMemo(() => {
    const locs = ['All', 'Online', ...new Set(events
      .filter(event => event.location.type === 'venue')
      .map(event => event.location.name || 'Unknown'))];
    return locs;
  }, [events]);

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let filtered = events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
      
      const matchesLocation = selectedLocation === 'All' || 
                             (selectedLocation === 'Online' && event.location.type === 'online') ||
                             event.location.name === selectedLocation;
      
      const matchesPrice = selectedPrice === 'All' || 
                          (selectedPrice === 'Free' && Math.min(...event.tickets.map(t => t.price)) === 0) ||
                          (selectedPrice === 'Paid' && Math.min(...event.tickets.map(t => t.price)) > 0);

      return matchesSearch && matchesCategory && matchesLocation && matchesPrice;
    });

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
        case 'popularity':
          // Mock popularity based on ticket sales
          const aAttendees = a.tickets.reduce((sum, t) => sum + (t.total - t.available), 0);
          const bAttendees = b.tickets.reduce((sum, t) => sum + (t.total - t.available), 0);
          return bAttendees - aAttendees;
        case 'price':
          const aPrice = Math.min(...a.tickets.map(t => t.price));
          const bPrice = Math.min(...b.tickets.map(t => t.price));
          return aPrice - bPrice;
        default:
          return 0;
      }
    });

    return filtered;
  }, [events, searchQuery, selectedCategory, selectedLocation, selectedPrice, sortBy]);

  return (
    <main className="min-h-screen bg-muted/50">
      <Header />
      
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Discover Events</h1>
          <p className="text-muted-foreground">Find amazing events happening in your area and around the world</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Category Filter */}
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location Filter */}
              <div>
                <Label htmlFor="location">Location</Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Filter */}
              <div>
                <Label htmlFor="price">Price</Label>
                <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Free">Free</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div>
                <Label htmlFor="sort">Sort by</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* View Toggle and Results Count */}
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="w-5 h-5" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events */}
        {viewMode === 'grid' ? (
          <EventGrid events={filteredEvents} loading={loading} />
        ) : (
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <Card key={index} className="p-6">
                  <div className="flex space-x-4">
                    <Skeleton className="w-32 h-24 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                </Card>
              ))
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-1">No events found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters to find events.</p>
              </div>
            ) : (
              filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </main>
  );
}