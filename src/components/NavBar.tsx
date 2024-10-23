'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Clock, FolderKanban, Users } from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Time Entries', icon: Clock },
    { href: '/projects', label: 'Projects', icon: FolderKanban },
    { href: '/clients', label: 'Clients', icon: Users },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            href="/" 
            className="text-xl font-bold text-blue-600"
          >
            TimeTracker
          </Link>
          <div className="flex space-x-4">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === href
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
