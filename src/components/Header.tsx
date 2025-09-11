'use client';

import Link from 'next/link';
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
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">V</span>
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