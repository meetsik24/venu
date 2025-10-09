'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Settings, LogOut, User } from 'lucide-react';

interface UserDropdownProps {
  user?: {
    name?: string;
    email?: string;
    image?: string;
  };
}

export function UserDropdown({ user }: UserDropdownProps) {
  const [imagePreview, setImagePreview] = useState<{ image: string; name: string } | null>(null);

  // Mock user data for now
  const userData = user || {
    name: 'John Doe',
    email: 'john@example.com',
    image: null
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logging out...');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {userData.image ? (
          <Image
            className="h-8 w-8 hover:brightness-125 transition cursor-pointer rounded-full aspect-square object-cover"
            src={userData.image}
            width={32}
            height={32}
            alt={userData.name || 'User'}
          />
        ) : (
          <div className="text-zinc-300 rounded-full h-8 w-8 hover:brightness-125 transition cursor-pointer aspect-square bg-gradient-to-tl from-[#F66371] to-[#C0CEF6] flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-zinc-900 text-zinc-300 mt-2 mr-2 rounded-xl w-68 border-none drop-shadow-md">
        <Link
          href="/profile"
          className="flex flex-row gap-3 p-3 hover:bg-zinc-800 transition rounded-lg cursor-pointer"
        >
          {userData.image ? (
            <Image
              className="h-10 w-10 rounded-full aspect-square object-cover"
              src={userData.image}
              width={40}
              height={40}
              alt={userData.name || 'User'}
            />
          ) : (
            <div className="text-zinc-300 rounded-full h-10 w-10 aspect-square bg-gradient-to-tl from-[#F66371] to-[#C0CEF6] flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
          )}
          <div className="flex flex-col gap-1 w-[75%]">
            <span className="font-semibold">{userData.name || 'You'}</span>
            <span className="text-sm text-zinc-500 overflow-hidden text-ellipsis">
              {userData.email || 'example@mail.com'}
            </span>
          </div>
        </Link>
        <DropdownMenuSeparator className="w-full border-zinc-700" />
        <div className="flex flex-col gap-2 p-3">
          <Link
            href="/profile"
            className="hover:text-zinc-50 transition flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            See Profile
          </Link>
          <Link
            href="/settings"
            className="hover:text-zinc-50 transition flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="justify-start p-0 h-auto hover:text-zinc-50 transition text-left"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
