'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { UserRole } from '@/types/user';
import UserManagementDropdown from './UserManagementDropdown';
import { usePathname } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Access denied. Please log in.</p>
      </div>
    );
  }

  // Function to handle sign out with proper redirect URL
  const handleSignOut = () => {
    // Use the current origin for the callback URL
    const callbackUrl = `${window.location.origin}/login`;
    signOut({ callbackUrl });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <nav className="bg-white border-b border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
              Asomdwoe Hene Pharmacy System
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                Welcome, {session?.user?.name || session?.user?.email}
              </span>
              <UserManagementDropdown />
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 rounded-md hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}