'use client';

import { useState } from 'react';
import { Calendar, MapPin, FileText, Link, Globe, Users, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface EventFormProps {
  eventData: any;
  onEventDataChange: (data: any) => void;
  selectedImage: string | null;
  selectedTheme: string;
}

export function EventForm({ 
  eventData, 
  onEventDataChange, 
  selectedImage, 
  selectedTheme 
}: EventFormProps) {
  const [currentDate] = useState(new Date());
  const [currentTime] = useState('03:30');

  const handleInputChange = (field: string, value: any) => {
    onEventDataChange({
      ...eventData,
      [field]: value
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="w-1/2 p-6">
      <Card className="bg-zinc-800 border-zinc-700 h-full">
        <CardContent className="p-6 h-full flex flex-col">
          {/* Event Name */}
          <div className="mb-6">
            <Input
              placeholder="Event Name"
              value={eventData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="text-2xl font-semibold bg-transparent border-none text-white placeholder:text-zinc-400 focus:ring-0 p-0"
            />
          </div>

          {/* Date and Time */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Start</label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-zinc-400" />
                  <span className="text-white">{formatDate(currentDate)}</span>
                  <Input
                    type="time"
                    value={eventData.startTime || currentTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    className="w-20 bg-transparent border-zinc-600 text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">End</label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-zinc-400" />
                  <span className="text-white">{formatDate(currentDate)}</span>
                  <Input
                    type="time"
                    value={eventData.endTime || '04:30'}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    className="w-20 bg-transparent border-zinc-600 text-white"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-2 text-sm text-zinc-400">
              <Globe className="w-4 h-4" />
              <span>{eventData.timezone}</span>
              <span>•</span>
              <span>Dar es Salaam</span>
            </div>
          </div>

          {/* Location */}
          <div className="mb-6">
            <Button
              variant="ghost"
              className="w-full justify-start p-0 h-auto text-zinc-400 hover:text-white hover:bg-transparent"
              onClick={() => handleInputChange('location', 'New Location')}
            >
              <MapPin className="w-4 h-4 mr-2" />
              <div className="text-left">
                <div className="font-medium">Add Event Location</div>
                <div className="text-sm text-zinc-500">Offline location or virtual link</div>
              </div>
            </Button>
          </div>

          {/* Description */}
          <div className="mb-6">
            <Button
              variant="ghost"
              className="w-full justify-start p-0 h-auto text-zinc-400 hover:text-white hover:bg-transparent"
              onClick={() => handleInputChange('description', 'Event description')}
            >
              <FileText className="w-4 h-4 mr-2" />
              <div className="text-left">
                <div className="font-medium">Add Description</div>
              </div>
            </Button>
          </div>

          {/* Event Options */}
          <div className="space-y-4 mb-8">
            {/* Tickets */}
            <div className="flex items-center justify-between">
              <span className="text-zinc-300">Tickets</span>
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">{eventData.tickets}</span>
                <Link className="w-4 h-4 text-zinc-500" />
              </div>
            </div>

            {/* Require Approval */}
            <div className="flex items-center justify-between">
              <span className="text-zinc-300">Require Approval</span>
              <Switch
                checked={eventData.requireApproval}
                onCheckedChange={(checked) => handleInputChange('requireApproval', checked)}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>

            {/* Capacity */}
            <div className="flex items-center justify-between">
              <span className="text-zinc-300">Capacity</span>
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">{eventData.capacity}</span>
                <Link className="w-4 h-4 text-zinc-500" />
              </div>
            </div>
          </div>

          {/* Create Event Button */}
          <div className="mt-auto">
            <Button 
              className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-3"
              onClick={() => console.log('Creating event...', eventData)}
            >
              Create Event
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
