'use client';

import { useState } from 'react';
import Header from '@/src/components/Header';
import { ImageSelection } from '@/src/components/CreateEvent/ImageSelection';
import { EventForm } from '@/src/components/CreateEvent/EventForm';

export default function CreateEventPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string>('Minimal');
  const [eventData, setEventData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    timezone: 'GMT+03:00',
    location: '',
    description: '',
    tickets: 'Free',
    requireApproval: false,
    capacity: 'Unlimited'
  });

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <Header isSignedIn={true} />
      
      <main className="pt-16">
        <div className="flex flex-row gap-2 justify-center w-full min-h-screen">
          <ImageSelection 
            selectedImage={selectedImage}
            onImageSelect={setSelectedImage}
            selectedTheme={selectedTheme}
            onThemeSelect={setSelectedTheme}
          />
          <EventForm 
            eventData={eventData}
            onEventDataChange={setEventData}
            selectedImage={selectedImage}
            selectedTheme={selectedTheme}
          />
        </div>
      </main>
    </div>
  );
}
