'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Menu, X, Calendar, ShoppingCart, TicketIcon, Compass, ArrowUpRight, Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { LumaLogoSVG } from './LumaLogo';
import { UserDropdown } from './UserDropdown';
import { UserClock } from './UserClock';
import { useEventStore } from '../store/eventStore';

interface HeaderProps {
  logoStyle?: "icon" | "wordmark";
  isSignedIn?: boolean;
}

export default function Header({ 
  logoStyle = "icon", 
  isSignedIn = false 
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const getCartItemCount = useEventStore(state => state.getCartItemCount);
  
  const cartItemCount = getCartItemCount();

  const navigation = [
    { name: 'Events', href: '/events', icon: TicketIcon },
    { name: 'Calendars', href: '/calendars', icon: Calendar },
    { name: 'Discover', href: '/discover', icon: Compass },
  ];

  return (
    <header className="fixed-top flex flex-row w-full justify-between items-center py-3 px-4 bg-background/80 backdrop-blur-md">
      <div className="flex flex-row items-center gap-3">
        <Link
          href={isSignedIn ? "/home" : "/"}
          className="hover:brightness-200 transition 2s hover:cursor-pointer"
        >
          {logoStyle === "icon" ? (
            <LumaLogoSVG />
          ) : (
            <span className="text-xl font-bold gradient-text">EventFlow</span>
          )}
        </Link>
        {isSignedIn ? (
          <>
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} className="flex flex-row items-center gap-1 group">
                <item.icon size={18} className="block sm:hidden md:block lg:block transition
                text-zinc-600 group-hover:text-zinc-950
                dark:text-zinc-500 dark:group-hover:text-zinc-50" />
                <span className="hidden sm:block md:block lg:block text-sm font-semibold transition
                text-zinc-600 group-hover:text-zinc-950
                dark:text-zinc-500 dark:group-hover:text-zinc-50">{item.name}</span>
              </Link>
            ))}
          </>
        ) : ''}
      </div>
      <div className="flex flex-row gap-3 items-center">
        <UserClock className="text-zinc-400 text-sm hidden sm:block md:block lg:block" />
        {isSignedIn ? (
          <>
            <Link href={"/create"} className="text-zinc-400 hover:text-zinc-50 text-sm font-medium transition">
              Create Event
            </Link>
            <Search size={18} className="text-zinc-500" />
            
            {/* Calendar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-zinc-400 hover:text-zinc-50 text-sm font-medium">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  Personal Calendar
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
                <DropdownMenuItem className="text-zinc-300 hover:text-white hover:bg-zinc-700">
                  Personal Calendar
                </DropdownMenuItem>
                <DropdownMenuItem className="text-zinc-300 hover:text-white hover:bg-zinc-700">
                  Work Calendar
                </DropdownMenuItem>
                <DropdownMenuItem className="text-zinc-300 hover:text-white hover:bg-zinc-700">
                  Create New Calendar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Public Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-zinc-400 hover:text-zinc-50 text-sm font-medium">
                  <Globe className="w-4 h-4 mr-1" />
                  Public
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
                <DropdownMenuItem className="text-zinc-300 hover:text-white hover:bg-zinc-700">
                  Public
                </DropdownMenuItem>
                <DropdownMenuItem className="text-zinc-300 hover:text-white hover:bg-zinc-700">
                  Private
                </DropdownMenuItem>
                <DropdownMenuItem className="text-zinc-300 hover:text-white hover:bg-zinc-700">
                  Unlisted
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" asChild>
              <Link href="/cart" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1"
                  >
                    <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {cartItemCount}
                    </Badge>
                  </motion.div>
                )}
              </Link>
            </Button>
            <UserDropdown />
          </>
        ) : (
          <>
            <Link href={'/explore'} className="hover:text-zinc-50 transition text-zinc-500 font-medium flex flex-row gap-1 items-center">
              Explore <ArrowUpRight size={15} />
            </Link>
            <Link
              href={"/signin"}
              className="font-semibold opacity-[.7] transition text-sm px-3 py-1 rounded-full
              bg-zinc-300 hover:text-zinc-300 hover:bg-zinc-950 text-zinc-950 
              dark:bg-zinc-700 dark:hover:text-zinc-700 dark:hover:bg-zinc-50 dark:text-zinc-50"
            >
              Sign In
            </Link>
          </>
        )}
      </div>

    </header>
  );
}