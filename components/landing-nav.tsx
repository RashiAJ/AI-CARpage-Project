'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from './ui/button';
import { guestRegex } from '@/lib/constants';

export function LandingNav() {
  const { data, status } = useSession();
  const isGuest = guestRegex.test(data?.user?.email ?? '');
  const isAuthenticated = status === 'authenticated';

  return (
    <nav className="container flex items-center justify-between py-4">
      <div className="flex items-center">
        <Link href="/" className="text-2xl font-bold text-red-600">
          TOYOTA
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <ul className="flex items-center space-x-4">
          <li>
            <Link href="/survey" className="hover:text-blue-600">
              Survey
            </Link>
          </li>
          {isAuthenticated ? (
            <li>
              <Button asChild>
                <Link href="/chat">Go to Chat</Link>
              </Button>
            </li>
          ) : (
            <>
              <li>
                <Button variant="outline" asChild>
                  <Link href="/api/auth/signin">Login</Link>
                </Button>
              </li>
              <li>
                <Button asChild>
                  <Link href="/api/auth/signin?callbackUrl=%2Fchat&guest=true">Try as Guest</Link>
                </Button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
