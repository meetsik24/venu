'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, Calendar, Users, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LumaWordmark } from './LumaLogo';

export default function Hero() {
  const stats = [
    { label: 'Events Created', value: '10K+', icon: Calendar },
    { label: 'Happy Attendees', value: '50K+', icon: Users },
    { label: 'Cities Worldwide', value: '100+', icon: Globe },
  ];

  return (
    <div className="">
      <main className="flex flex-col mt-5 md:flex-row mx-auto max-w-[1280px] lg:flex-row lg:p-5 gap-5 lg:gap-0 md:gap-0 items-center justify-between">
        <div className="flex flex-col items-center md:items-start px-6 lg:items-start gap-4 w-[30rem]">
          <LumaWordmark className="w-[20%] opacity-50" theme="light" />
          <h1 className="w-[90%] font-medium text-center lg:text-left md:text-left text-4xl md:text-6xl lg:text-6xl flex flex-col">
            <span className="w-[100%] lg:w-[70%] text-zinc-800 dark:text-zinc-50 text-wrap">Enchanting Events</span>
            <span className="w-[100%] lg:w-[70%] text-wrap gradient-text">
              Start Here
            </span>
          </h1>
          <p className="text-zinc-400 text-semibold text-center lg:text-left lg:w-[70%] w-[80%] text-xl">
            Create, discover, and join amazing events. Connect with your community and build lasting memories.
          </p>
          <Link 
            href={'/create'} 
            className="mt-5 text-lg font-semibold text-zinc-100 dark:text-zinc-900 bg-zinc-950 dark:bg-zinc-50 rounded-lg px-3 py-2 hover:brightness-75 transition"
          >
            Create Event
          </Link>
        </div>
        <div className="w-[80%] md:w-[37rem] lg:w-[37rem] bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 rounded-2xl p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Calendar className="w-16 h-16 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-2">Event Management</h3>
            <p className="text-zinc-600 dark:text-zinc-400">Create and manage your events with ease</p>
          </div>
        </div>
      </main>
    </div>
  );
}