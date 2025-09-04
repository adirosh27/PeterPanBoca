'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SiteHeader() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl">✨</div>
            <span className="text-xl font-display font-semibold text-primary-800">
              Peter Pan Boca
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`font-medium transition-colors ${
                isActive('/') 
                  ? 'text-primary-600' 
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/galleries" 
              className={`font-medium transition-colors ${
                isActive('/galleries') 
                  ? 'text-primary-600' 
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Galleries
            </Link>
            <Link 
              href="/about" 
              className={`font-medium transition-colors ${
                isActive('/about') 
                  ? 'text-primary-600' 
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              About
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-primary-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}