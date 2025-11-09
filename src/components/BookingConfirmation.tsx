import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface BookingConfirmationProps {
  bookingId: number;
}

export const BookingConfirmation = ({ bookingId }: BookingConfirmationProps) => {
  return (
    <Card className='max-w-2xl mx-auto'>
      <CardHeader>
        <div className='flex flex-col items-center gap-4'>
          <div className='bg-green-100 dark:bg-green-900/20 p-4 rounded-full'>
            <CheckCircle className='w-16 h-16 text-green-600 dark:text-green-400' />
          </div>
          <CardTitle className='text-2xl text-center'>
            Booking Confirmed!
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='text-center space-y-2'>
          <p className='text-muted-foreground'>
            Your booking has been successfully confirmed.
          </p>
          <p className='text-lg font-semibold text-foreground'>
            Booking ID: #{bookingId}
          </p>
          <p className='text-sm text-muted-foreground'>
            A confirmation email has been sent to your email address.
          </p>
        </div>

        <div className='flex flex-col sm:flex-row gap-3 pt-4'>
          <Link to='/bookings' className='flex-1'>
            <Button variant='outline' className='w-full'>
              View My Bookings
            </Button>
          </Link>
          <Link to='/' search={{ country: 'US', city: 'New York', page: 1 }} className='flex-1'>
            <Button className='w-full'>
              Search More Hotels
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingConfirmation;

