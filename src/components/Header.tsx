import { Link } from '@tanstack/react-router';

import { useState } from 'react';
import { Home, Menu, X, Calendar } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className='flex justify-between items-center bg-primary shadow-lg p-4 text-primary-foreground'>
        <div className='flex items-center'>
          <button
            onClick={() => setIsOpen(true)}
            className='hover:bg-primary/80 p-2 rounded-lg transition-colors'
            aria-label='Open menu'
          >
            <Menu size={24} />
          </button>
          <h1 className='ml-4 font-semibold text-xl'>
            <Link to='/' search={{ country: 'US', city: 'New York', page: 1 }}>
              <h1>Hotel Finder</h1>
            </Link>
          </h1>
        </div>
        <ThemeToggle />
      </header>

      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-card text-card-foreground shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='flex justify-between items-center p-4 border-border border-b'>
          <h2 className='font-bold text-xl'>Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className='hover:bg-muted p-2 rounded-lg transition-colors'
            aria-label='Close menu'
          >
            <X size={24} />
          </button>
        </div>

        <nav className='flex-1 p-4 overflow-y-auto'>
          <Link
            to='/'
            search={{ country: 'US', city: 'New York', page: 1 }}
            onClick={() => setIsOpen(false)}
            className='flex items-center gap-3 hover:bg-muted mb-2 p-3 rounded-lg transition-colors'
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors mb-2',
            }}
          >
            <Home size={20} />
            <span className='font-medium'>Home</span>
          </Link>

          <Link
            to='/bookings'
            onClick={() => setIsOpen(false)}
            className='flex items-center gap-3 hover:bg-muted mb-2 p-3 rounded-lg transition-colors'
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors mb-2',
            }}
          >
            <Calendar size={20} />
            <span className='font-medium'>My Bookings</span>
          </Link>

          {/* Demo Links Start */}

          {/* Demo Links End */}
        </nav>
      </aside>
    </>
  );
}
