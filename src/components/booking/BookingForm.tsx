import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader } from 'lucide-react';

const bookingFormSchema = z.object({
  guestName: z.string().min(2, 'Name must be at least 2 characters'),
  guestEmail: z.email('Invalid email address'),
  guestPhone: z.string().optional(),
  specialRequests: z.string().optional(),
});

interface BookingFormProps {
  hotelId: string;
  hotelName: string;
  roomId: number;
  roomName: string;
  checkinDate: string;
  checkoutDate: string;
  adults: number;
  totalPrice: string;
  currency: string;
  onSuccess: (bookingId: number) => void;
  onCancel: () => void;
}

export const BookingForm = ({
  hotelId,
  hotelName,
  roomId,
  roomName,
  checkinDate,
  checkoutDate,
  adults,
  totalPrice,
  currency,
  onSuccess,
  onCancel,
}: BookingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextAvailableDate, setNextAvailableDate] = useState<string | null>(
    null
  );

  const form = useForm({
    defaultValues: {
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      specialRequests: '',
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      setError(null);
      setNextAvailableDate(null);

      try {
        // First, check availability
        const availabilityResponse = await fetch(
          'http://localhost:3001/api/bookings/check-availability',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              hotelId,
              roomId,
              checkinDate,
              checkoutDate,
            }),
          }
        );

        const availabilityData = await availabilityResponse.json();

        if (!availabilityData.available) {
          setNextAvailableDate(availabilityData.nextAvailableDate);
          throw new Error(
            `This room is already booked for the selected dates. ${
              availabilityData.nextAvailableDate
                ? `Next available date: ${new Date(
                    availabilityData.nextAvailableDate
                  ).toLocaleDateString()}`
                : ''
            }`
          );
        }

        // If available, proceed with booking
        const response = await fetch('http://localhost:3001/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            hotelId,
            hotelName,
            roomId,
            roomName,
            guestName: value.guestName,
            guestEmail: value.guestEmail,
            guestPhone: value.guestPhone || null,
            checkinDate,
            checkoutDate,
            adults,
            children: 0,
            totalPrice,
            currency,
            specialRequests: value.specialRequests || null,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();

          // Handle booking conflict error
          if (response.status === 409) {
            setNextAvailableDate(errorData.nextAvailableDate);
            throw new Error(
              `This room is already booked for the selected dates. ${
                errorData.nextAvailableDate
                  ? `Next available date: ${new Date(
                      errorData.nextAvailableDate
                    ).toLocaleDateString()}`
                  : ''
              }`
            );
          }

          throw new Error(errorData.error || 'Failed to create booking');
        }

        const data = await response.json();
        onSuccess(data.booking.id);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to create booking'
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Booking</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className='space-y-4'
        >
          {/* Booking Summary */}
          <div className='space-y-2 bg-muted/50 p-4 rounded-lg'>
            <h3 className='font-semibold text-foreground'>Booking Summary</h3>
            <div className='space-y-1 text-muted-foreground text-sm'>
              <p>
                <span className='font-medium'>Hotel:</span> {hotelName}
              </p>
              <p>
                <span className='font-medium'>Room:</span> {roomName}
              </p>
              <p>
                <span className='font-medium'>Check-in:</span>{' '}
                {new Date(checkinDate).toLocaleDateString()}
              </p>
              <p>
                <span className='font-medium'>Check-out:</span>{' '}
                {new Date(checkoutDate).toLocaleDateString()}
              </p>
              <p>
                <span className='font-medium'>Guests:</span> {adults} adult(s)
              </p>
              <p className='pt-2 font-bold text-accent text-lg'>
                Total: {currency} {totalPrice}
              </p>
            </div>
          </div>

          {/* Guest Name */}
          <form.Field
            name='guestName'
            validators={{
              onChange: ({ value }) => {
                const result =
                  bookingFormSchema.shape.guestName.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0].message;
              },
            }}
          >
            {(field) => (
              <div>
                <Label htmlFor='guestName' className='dark:text-gray-300'>
                  Full Name *
                </Label>
                <Input
                  id='guestName'
                  name='guestName'
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='John Doe'
                  className='mt-1'
                />
                {field.state.meta.errors.length > 0 && (
                  <p className='mt-1 text-red-600 dark:text-red-400 text-sm'>
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Guest Email */}
          <form.Field
            name='guestEmail'
            validators={{
              onChange: ({ value }) => {
                const result =
                  bookingFormSchema.shape.guestEmail.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0].message;
              },
            }}
          >
            {(field) => (
              <div>
                <Label htmlFor='guestEmail' className='dark:text-gray-300'>
                  Email Address *
                </Label>
                <Input
                  id='guestEmail'
                  name='guestEmail'
                  type='email'
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='john@example.com'
                  className='mt-1'
                />
                {field.state.meta.errors.length > 0 && (
                  <p className='mt-1 text-red-600 dark:text-red-400 text-sm'>
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Guest Phone */}
          <form.Field name='guestPhone'>
            {(field) => (
              <div>
                <Label htmlFor='guestPhone' className='dark:text-gray-300'>
                  Phone Number (Optional)
                </Label>
                <Input
                  id='guestPhone'
                  name='guestPhone'
                  type='tel'
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='+1 (555) 123-4567'
                  className='mt-1'
                />
              </div>
            )}
          </form.Field>

          {/* Special Requests */}
          <form.Field name='specialRequests'>
            {(field) => (
              <div>
                <Label htmlFor='specialRequests' className='dark:text-gray-300'>
                  Special Requests (Optional)
                </Label>
                <textarea
                  id='specialRequests'
                  name='specialRequests'
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='Any special requests or requirements...'
                  className='flex bg-background disabled:opacity-50 m-h-[80px] mt-1 px-3 py-2 border border-input rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-background focus-visible:ring-offset-2 w-full placeholder:text-muted-foreground md:text-sm text-base disabled:cursor-not-allowed'
                  rows={3}
                />
              </div>
            )}
          </form.Field>

          {/* Error Message */}
          {error && (
            <div className='space-y-2'>
              <div className='bg-red-50 dark:bg-red-900/20 p-3 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 text-sm'>
                {error}
              </div>
              {nextAvailableDate && (
                <div className='bg-blue-50 dark:bg-blue-900/20 p-3 border border-blue-200 dark:border-blue-800 rounded-md text-blue-700 dark:text-blue-300 text-sm'>
                  <p className='mb-1 font-semibold'>
                    Alternative Dates Available
                  </p>
                  <p>
                    This room is available starting from{' '}
                    <span className='font-semibold'>
                      {new Date(nextAvailableDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className='flex gap-3 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={onCancel}
              disabled={isSubmitting}
              className='flex-1'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isSubmitting}
              className='flex-1 gap-2'
            >
              {isSubmitting && <Loader className='w-4 h-4 animate-spin' />}
              {isSubmitting ? 'Processing...' : 'Confirm Booking'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
