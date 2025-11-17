import { useLoaderData, Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Users,
  DollarSign,
  MapPin,
  CheckCircle,
  Home,
} from 'lucide-react';

interface Booking {
  id: number;
  hotelId: string;
  hotelName: string;
  roomId: number;
  roomName: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string | null;
  checkinDate: string;
  checkoutDate: string;
  adults: number;
  children: number;
  totalPrice: string;
  currency: string;
  bookingStatus: string;
  specialRequests: string | null;
  createdAt: string;
}

const MyBookings = () => {
  const bookings = useLoaderData({ from: '/bookings' }) as Booking[];

  if (!bookings || bookings.length === 0) {
    return (
      <div className='bg-background min-h-screen'>
        <div className='mx-auto px-4 py-8 max-w-6xl'>
          <h1 className='mb-6 font-bold text-foreground text-3xl'>
            My Bookings
          </h1>
          <Card>
            <CardContent className='p-12 text-center'>
              <div className='space-y-4'>
                <Home className='mx-auto w-16 h-16 text-muted-foreground' />
                <h2 className='font-semibold text-foreground text-xl'>
                  No Bookings Yet
                </h2>
                <p className='text-muted-foreground'>
                  You haven't made any bookings yet. Start exploring hotels!
                </p>
                <Link
                  to='/'
                  search={{ country: 'US', city: 'New York', page: 1 }}
                >
                  <Button className='mt-4'>Search Hotels</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-background min-h-screen'>
      <div className='mx-auto px-4 py-8 max-w-6xl'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='font-bold text-foreground text-3xl'>My Bookings</h1>
          <Link to='/' search={{ country: 'US', city: 'New York', page: 1 }}>
            <Button variant='outline'>Search More Hotels</Button>
          </Link>
        </div>

        <div className='space-y-3'>
          {bookings.map((booking) => (
            <Card
              key={booking.id}
              className='hover:shadow-lg transition-shadow'
            >
              <CardContent className='p-4'>
                <div className='items-center gap-4 grid grid-cols-1 md:grid-cols-12'>
                  {/* Hotel & Room - 3 cols */}
                  <div className='md:col-span-3'>
                    <div className='flex items-center gap-2 mb-1'>
                      <CheckCircle className='w-3.5 h-3.5 text-green-600 dark:text-green-400 shrink-0' />
                      <span className='font-medium text-foreground text-sm'>
                        {booking.hotelName}
                      </span>
                    </div>
                    <div className='flex items-center gap-1.5 ml-5'>
                      <MapPin className='w-3.5 h-3.5 text-muted-foreground shrink-0' />
                      <p className='text-muted-foreground text-xs'>
                        {booking.roomName}
                      </p>
                    </div>
                  </div>

                  {/* Dates - 3 cols */}
                  <div className='md:col-span-3'>
                    <div className='flex items-center gap-2'>
                      <Calendar className='w-3.5 h-3.5 text-muted-foreground shrink-0' />
                      <div className='text-xs'>
                        <span className='font-medium text-foreground'>
                          {new Date(booking.checkinDate).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                            }
                          )}
                        </span>
                        <span className='mx-1 text-muted-foreground'>→</span>
                        <span className='font-medium text-foreground'>
                          {new Date(booking.checkoutDate).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Guest Info - 3 cols */}
                  <div className='md:col-span-3'>
                    <div className='space-y-0.5 text-xs'>
                      <div className='flex items-center gap-1.5'>
                        <Users className='w-3.5 h-3.5 text-muted-foreground shrink-0' />
                        <span className='text-muted-foreground'>
                          {booking.adults}{' '}
                          {booking.adults === 1 ? 'Adult' : 'Adults'}
                        </span>
                      </div>
                      <p className='ml-5 font-medium text-foreground truncate'>
                        {booking.guestName}
                      </p>
                    </div>
                  </div>

                  {/* Price & Action - 3 cols */}
                  <div className='flex justify-between items-center gap-3 md:col-span-3'>
                    <div className='flex items-center gap-1.5'>
                      <DollarSign className='w-4 h-4 text-accent shrink-0' />
                      <span className='font-bold text-accent text-base'>
                        {booking.currency} {booking.totalPrice}
                      </span>
                    </div>
                    <Link
                      to='/details/$hotelId'
                      params={{ hotelId: booking.hotelId }}
                      search={{
                        country: 'US',
                        city: 'New York',
                        page: 1,
                        from: 'bookings',
                      }}
                    >
                      <Button
                        variant='outline'
                        size='sm'
                        className='h-8 text-xs'
                      >
                        View
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Special Requests - Full width if exists */}
                {booking.specialRequests && (
                  <div className='bg-muted/30 mt-3 p-2 pt-3 border-border border-t rounded text-xs'>
                    <span className='font-semibold text-foreground'>
                      Note:{' '}
                    </span>
                    <span className='text-muted-foreground'>
                      {booking.specialRequests}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
