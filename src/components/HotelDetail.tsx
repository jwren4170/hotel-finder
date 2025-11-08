import { useLoaderData, Link } from '@tanstack/react-router';
import { stripHtmlTags } from '@/lib/utils';
import {
  MapPin,
  Star,
  Users,
  ArrowLeft,
  Bed,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const HotelDetail = () => {
  const hotel = useLoaderData({ from: '/details/$hotelId' });

  if (!hotel) {
    return (
      <div className='flex justify-center items-center p-8'>
        <div className='text-center'>
          <h2 className='mb-2 font-bold text-gray-800 text-2xl'>
            Hotel not found
          </h2>
          <p className='mb-4 text-gray-600'>
            The hotel you're looking for doesn't exist.
          </p>
          <Link to='/' search={{ country: 'US', city: 'New York', page: 1 }}>
            <Button variant='default'>Back to Search</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-background min-h-screen'>
      {/* Back Button */}
      <div className='bg-card shadow-sm border-border border-b'>
        <div className='mx-auto px-4 py-4 max-w-6xl'>
          <Link to='/' search={{ country: 'US', city: 'New York', page: 1 }}>
            <Button variant='ghost' className='gap-2'>
              <ArrowLeft className='w-4 h-4' />
              Back to Results
            </Button>
          </Link>
        </div>
      </div>

      <div className='mx-auto px-4 py-8 max-w-6xl'>
        {/* Header Section */}
        <div className='mb-6'>
          <div className='flex md:flex-row flex-col justify-between items-start gap-4 mb-3'>
            <div>
              <h1 className='mb-2 font-bold text-foreground text-3xl md:text-4xl'>
                {hotel.name}
              </h1>
              <div className='flex items-center gap-2 text-muted-foreground'>
                <MapPin className='w-5 h-5' />
                <span className='text-lg'>
                  {hotel.city}, {hotel.country}
                </span>
              </div>
            </div>

            {/* Rating Badge */}
            {hotel.stars > 0 && (
              <div className='flex items-center gap-3'>
                <div className='text-right'>
                  <div className='font-semibold text-foreground text-lg'>
                    {hotel.rating >= 8
                      ? 'Excellent'
                      : hotel.rating >= 7
                      ? 'Very Good'
                      : hotel.rating >= 6
                      ? 'Good'
                      : 'Pleasant'}
                  </div>
                  {hotel.reviewCount > 0 && (
                    <div className='flex items-center gap-1 text-muted-foreground text-sm'>
                      <Users className='w-4 h-4' />
                      {hotel.reviewCount.toLocaleString()} reviews
                    </div>
                  )}
                </div>
                <div className='bg-primary shadow-lg px-4 py-3 rounded-xl font-bold text-primary-foreground text-2xl'>
                  {hotel.rating.toFixed(1)}
                </div>
              </div>
            )}
          </div>

          {/* Stars */}
          {(hotel.starRating > 0 || hotel.stars > 0) && (
            <div className='flex items-center gap-2'>
              <Star className='fill-amber-400 w-5 h-5 text-amber-400' />
              <span className='font-semibold text-gray-700 dark:text-gray-300 text-sm'>
                {hotel.starRating || hotel.stars}{' '}
                {(hotel.starRating || hotel.stars) === 1 ? 'Star' : 'Stars'}
              </span>
            </div>
          )}
        </div>

        {/* Main Image */}
        <div className='mb-8 rounded-xl overflow-hidden'>
          {hotel.main_photo ? (
            <img
              src={hotel.main_photo}
              alt={hotel.name}
              className='w-full max-h-[500px] object-cover'
            />
          ) : (
            <div className='flex justify-center items-center bg-gray-200 dark:bg-gray-700 w-full h-[400px]'>
              <span className='font-medium text-gray-500 dark:text-gray-400 text-lg'>
                Image not available
              </span>
            </div>
          )}
        </div>

        <div className='gap-6 grid grid-cols-1 lg:grid-cols-3'>
          {/* Main Content */}
          <div className='space-y-6 lg:col-span-2'>
            {/* Description Card */}
            {hotel.hotelDescription && (
              <Card>
                <CardHeader>
                  <CardTitle>About This Hotel</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
                    {stripHtmlTags(hotel.hotelDescription)}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Location Card */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <MapPin className='w-5 h-5' />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <p className='mb-2 font-medium text-gray-900 dark:text-gray-200 text-sm'>
                    Address
                  </p>
                  <p className='text-gray-600 dark:text-gray-300 text-sm leading-relaxed'>
                    {stripHtmlTags(hotel.address)}
                  </p>
                </div>
                <div className='flex justify-between'>
                  <p className='font-medium text-gray-900 dark:text-gray-200 text-sm'>
                    City
                  </p>
                  <p className='text-gray-600 dark:text-gray-300 text-sm'>
                    {hotel.city}, {hotel.country}
                  </p>
                </div>
                {hotel.zip && (
                  <div className='flex justify-between'>
                    <p className='font-medium text-gray-900 dark:text-gray-200 text-sm'>
                      Postal Code
                    </p>
                    <p className='text-gray-600 dark:text-gray-300 text-sm'>
                      {hotel.zip}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Hotel Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Hotel Information</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                {hotel.chain && (
                  <div className='flex justify-between'>
                    <p className='font-medium text-gray-900 dark:text-gray-200 text-sm'>
                      Chain
                    </p>
                    <p className='text-gray-600 dark:text-gray-300 text-sm'>
                      {hotel.chain}
                    </p>
                  </div>
                )}
                {hotel.currency && (
                  <div>
                    <p className='font-medium text-gray-900 dark:text-gray-200 text-sm'>
                      Currency
                    </p>
                    <p className='text-gray-600 dark:text-gray-300 text-sm'>
                      {hotel.currency}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Available Rooms Section - Full Width */}
        {hotel.rooms && hotel.rooms.length > 0 && (
          <div className='mt-8'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Bed className='w-5 h-5' />
                  Available Room Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                  {hotel.rooms.map((room) => (
                    <Link
                      key={room.id}
                      to='/details/$hotelId/room/$roomId'
                      params={{ hotelId: hotel.id, roomId: String(room.id) }}
                      className='block'
                    >
                      <div className='group hover:shadow-md p-4 border border-border hover:border-primary rounded-lg transition-all duration-200'>
                        <div className='flex justify-between items-center'>
                          <div className='flex-1'>
                            <h3 className='font-semibold text-foreground group-hover:text-primary transition-colors'>
                              {room.roomName}
                            </h3>
                            {room.maxOccupancy && (
                              <div className='flex items-center gap-1 mt-1 text-muted-foreground text-sm'>
                                <Users className='w-4 h-4' />
                                <span>Up to {room.maxOccupancy} guests</span>
                              </div>
                            )}
                            {room.price && (
                              <p className='mt-2 font-semibold text-accent text-lg'>
                                {room.currency || hotel.currency}{' '}
                                {room.price.toFixed(2)}
                              </p>
                            )}
                          </div>
                          <ChevronRight className='w-5 h-5 text-muted-foreground transition-transform group-hover:translate-x-1' />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelDetail;
