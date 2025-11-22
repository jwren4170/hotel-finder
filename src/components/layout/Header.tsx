import { Link } from '@tanstack/react-router';

import { Calendar, LogOut, LogIn } from 'lucide-react';
import ThemeToggle from '@/components/common/ThemeToggle';
import { useSession, signOut } from '@/lib/auth-client';

export default function Header() {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <header className='flex justify-between items-center bg-primary shadow-lg px-6 py-4 text-primary-foreground'>
      {/* Left side - Logo */}
      <div className='flex items-center'>
        <Link
          to='/'
          search={{ country: 'US', city: 'New York', page: 1 }}
          className='hover:opacity-80 font-bold text-xl transition-opacity'
        >
          Hotel Finder
        </Link>
      </div>

      {/* Right side - Navigation */}
      <nav className='flex items-center gap-6'>
        {/* My Bookings Link */}
        <Link
          to='/bookings'
          className='flex items-center gap-2 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors'
          activeProps={{
            className:
              'flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg font-semibold transition-colors',
          }}
        >
          <Calendar size={18} />
          <span className='font-medium'>My Bookings</span>
        </Link>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Auth Section */}
        {session?.user ? (
          <div className='flex items-center gap-4'>
            <span className='font-medium text-sm'>
              Welcome, {session.user.name}!
            </span>
            <button
              onClick={handleLogout}
              className='flex items-center gap-2 hover:bg-white/20 px-3 py-2 rounded-lg font-medium transition-all cursor-pointer'
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        ) : (
          <Link
            to='/login'
            className='flex items-center gap-2 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors'
          >
            <LogIn size={18} />
            <span className='font-medium'>Login</span>
          </Link>
        )}
      </nav>
    </header>
  );
}
