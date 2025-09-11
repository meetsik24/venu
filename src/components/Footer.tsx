import Link from 'next/link';
import { Calendar, Mail, Apple, Twitter, Instagram } from 'lucide-react';
import { LumaWordmark } from './LumaLogo';

export default function Footer() {
  return (
    <footer className="mx-auto fixed-bottom flex flex-col mt-10 border-t-[.075rem] border-zinc-300 dark:border-zinc-800 w-[90%] max-w-[1280px] py-4">
      <div className="flex justify-between">
        <div className="flex flex-row gap-5 flex-wrap items-center text-sm text-zinc-800 dark:text-zinc-200">
          <LumaWordmark className="opacity-[75%] lg:w-[3.5rem] lg:h-[1.3rem] md:w-[3.5rem] md:h-[1.3rem] w-[2rem] h-[.75rem]" theme="light" />
          <Link href="/releases">New</Link>
          <Link href="/discover">Discover</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/help">Help</Link>
        </div>
        <div className="flex gap-4 text-zinc-800 dark:text-zinc-50">
          <Link href={"mailto:support@eventflow.com"}>
            <Mail size={15} />
          </Link>
          <Link href={"https://apps.apple.com"}>
            <Apple size={15} />
          </Link>
          <Link href={"https://x.com/EventFlow"}>
            <Twitter size={15} />
          </Link>
          <Link href={"https://instagram.com/eventflow"}>
            <Instagram size={15} />
          </Link>
        </div>
      </div>
      <div className="flex mt-4 justify-between">
        <div className="flex gap-5 flex-wrap text-zinc-600 font-semibold text-sm">
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/security">Security</Link>
        </div>
        <span className="text-xs font-medium text-zinc-500">
          Clone by{" "}
          <Link href={"https://github.com"}>EventFlow Team</Link>
        </span>
      </div>
    </footer>
  );
}