'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from "@/components/ui/button";

export function NavBar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Time Tracker
        </Link>
        <div className="space-x-4">
          {session ? (
            <>
              <Link href="/dashboard" className="hover:text-gray-300">
                Dashboard
              </Link>
              <Link href="/projects" className="hover:text-gray-300">
                Projects
              </Link>
              <Link href="/time-entry" className="hover:text-gray-300">
                Add Time Entry
              </Link>
              <Button onClick={() => signOut()} variant="ghost">
                Sign Out
              </Button>
            </>
          ) : (
            <Link href="/login" className="hover:text-gray-300">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
