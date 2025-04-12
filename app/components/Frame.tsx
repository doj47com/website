import React, { useState } from 'react';

export default function Frame({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold tracking-tight"><a href="/" className="text-zinc-900">DOJ 47</a></div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-6 text-sm font-medium">
              <a href="/cases" className="text-gray-700">Cases</a>
              <a href="/firms" className="text-gray-700">Firms</a>
              <a href="/lawyers" className="text-gray-700">Lawyers</a>
            </nav>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden text-gray-700 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Nav */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-2 space-y-1 text-sm font-medium bg-white border-t border-gray-100 py-2">
              <a href="#cases" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Cases</a>
              <a href="#firms" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Firms</a>
              <a href="#lawyers" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Lawyers</a>
            </nav>
          )}
        </div>
      </header>

      {/* Page Content */}
      <main className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

