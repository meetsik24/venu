'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  isSignedIn?: boolean;
}

export default function Header({ isSignedIn = false }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 relative">
            <Image
              src="/venu.png"
              alt="Venu Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="font-semibold text-lg">Venu</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/events" className="text-muted-foreground hover:text-foreground transition-colors">
            Events
          </Link>
          <Link href="/create" className="text-muted-foreground hover:text-foreground transition-colors">
            Create
          </Link>
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
            Dashboard
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <button className="minimal-button-ghost p-2">
            <Search className="w-4 h-4" />
          </button>
          
          <ThemeToggle />
          
          {isSignedIn ? (
            <button className="minimal-button-ghost p-2">
              <User className="w-4 h-4" />
            </button>
          ) : (
            <Link href="/signin" className="minimal-button-outline">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}