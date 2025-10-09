'use client';

import { useState } from 'react';
import { Camera, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface ImageSelectionProps {
  selectedImage: string | null;
  onImageSelect: (image: string) => void;
  selectedTheme: string;
  onThemeSelect: (theme: string) => void;
}

const sampleImages = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1506905925346-14b5e8d7f4b0?w=400&h=300&fit=crop',
    alt: 'Yellow smiley faces pattern'
  },
  {
    id: '2', 
    url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop',
    alt: 'Abstract geometric pattern'
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=300&fit=crop',
    alt: 'Colorful gradient background'
  }
];

const themes = [
  'Minimal',
  'Modern',
  'Classic',
  'Creative',
  'Professional',
  'Vibrant'
];

export function ImageSelection({ 
  selectedImage, 
  onImageSelect, 
  selectedTheme, 
  onThemeSelect 
}: ImageSelectionProps) {
  const [showImageGrid, setShowImageGrid] = useState(false);

  return (
    <div className="w-1/2 p-6">
      <Card className="bg-zinc-800 border-zinc-700">
        <CardContent className="p-0">
          {/* Main Image Display */}
          <div className="relative aspect-video bg-zinc-700 rounded-t-lg overflow-hidden">
            {selectedImage ? (
              <img 
                src={selectedImage} 
                alt="Selected event image"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-600 to-zinc-800">
                <div className="text-center">
                  <Camera className="w-12 h-12 text-zinc-400 mx-auto mb-2" />
                  <p className="text-zinc-400">Select an image</p>
                </div>
              </div>
            )}
            
            {/* Camera Icon Overlay */}
            <Button
              size="icon"
              className="absolute bottom-4 right-4 bg-zinc-900/80 hover:bg-zinc-800/80 text-white"
              onClick={() => setShowImageGrid(!showImageGrid)}
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>

          {/* Theme Selection */}
          <div className="p-4 border-t border-zinc-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-zinc-600 rounded-sm"></div>
                <span className="text-sm font-medium">Theme</span>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-zinc-300 hover:text-white hover:bg-zinc-700"
                  >
                    {selectedTheme}
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
                  {themes.map((theme) => (
                    <DropdownMenuItem
                      key={theme}
                      onClick={() => onThemeSelect(theme)}
                      className="text-zinc-300 hover:text-white hover:bg-zinc-700"
                    >
                      {theme}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-500 hover:text-zinc-300"
                onClick={() => onThemeSelect('Minimal')}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Grid Overlay */}
      {showImageGrid && (
        <div className="absolute inset-0 bg-zinc-900/95 z-50 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Select Image</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowImageGrid(false)}
              className="text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {sampleImages.map((image) => (
              <div
                key={image.id}
                className="relative aspect-video rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500"
                onClick={() => {
                  onImageSelect(image.url);
                  setShowImageGrid(false);
                }}
              >
                <img 
                  src={image.url} 
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
