'use client';

import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 relative">
              <Image
                src="/venu.svg"
                alt="Venu Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-medium">Venu</span>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
          
          <div className="text-center">
            
            <p className="text-xs text-muted-foreground">
              Made with <span className="text-red-500">❤️</span> by{' '}
              <a 
                href="https://briq.tz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                briq
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}