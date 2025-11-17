import { useLoaderData, Link, useSearch } from '@tanstack/react-router';
import { stripHtmlTags } from '@/lib/utils';
import {
  ArrowLeft,
  Users,
  Bed,
  Maximize,
  CheckCircle,
  MapPin,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RoomPhotoCarousel from '@/components/room/RoomPhotoCarousel';

const RoomDetails = () => {
  const { hotel, room, hasAvailability } = useLoaderData({
    from: '/details/$hotelId/room/$roomId',
  });
  const { country, city, page } = useSearch({
    from: '/details/$hotelId/room/$roomId',
  });

  // console.log('hasAvailability:', hasAvailability);

  if (!room) {
    return (
      <div className='flex justify-center items-center p-8'>
        <div className='text-center'>
          <h2 className='mb-2 font-bold text-gray-800 text-2xl'>
            Room not found
          </h2>
          <p className='mb-4 text-gray-600'>
            The room you're looking for doesn't exist.
          </p>
          <Link
            to='/details/$hotelId'
            params={{ hotelId: hotel.id }}
            search={{ country, city, page }}
          >
            <Button variant='default'>Back to Hotel</Button>
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
          <Link
            to='/details/$hotelId'
            params={{ hotelId: hotel.id }}
            search={{ country, city, page }}
          >
            <Button variant='ghost' className='gap-2'>
              <ArrowLeft className='w-4 h-4' />
              Back to Hotel
            </Button>
          </Link>
        </div>
      </div>

      <div className='mx-auto px-4 py-8 max-w-6xl'>
        {/* Header Section */}
        <div className='mb-6'>
          <div className='mb-3'>
            <h1 className='mb-2 font-bold text-foreground text-3xl md:text-4xl'>
              {room.roomName}
            </h1>
            <div className='flex items-center gap-2 text-muted-foreground'>
              <MapPin className='w-5 h-5' />
              <span className='text-lg'>
                {hotel.name} - {hotel.city}, {hotel.country}
              </span>
            </div>
          </div>

          {/* Price Badge */}
          {room.price && (
            <div className='inline-block bg-accent shadow-lg px-6 py-3 rounded-xl'>
              <div className='font-bold text-2xl text-accent-foreground'>
                {room.currency || hotel.currency} {room.price.toFixed(2)}
              </div>
              <div className='text-sm text-accent-foreground/80'>per night</div>
            </div>
          )}
        </div>

        {/* Room photos carousel */}
        {room.photos && room.photos.length > 0 && (
          <RoomPhotoCarousel photos={room.photos} roomName={room.roomName} />
        )}

        <div className='gap-6 grid grid-cols-1 lg:grid-cols-3'>
          {/* Main Content */}
          <div className='space-y-6 lg:col-span-2'>
            {/* Description Card */}
            {room.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Room Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
                    {stripHtmlTags(room.description)}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Room Amenities Card */}
            {room.roomAmenities && room.roomAmenities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Room Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='gap-3 grid grid-cols-2 md:grid-cols-3'>
                    {room.roomAmenities.map((amenity, index) => (
                      <div key={index} className='flex items-center gap-2'>
                        <CheckCircle className='w-5 h-5 text-green-600 dark:text-green-400' />
                        <span className='text-gray-700 dark:text-gray-300'>
                          {amenity.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Room Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>Room Details</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {room.maxOccupancy && (
                  <div className='flex justify-between'>
                    <div className='flex items-center gap-2 mb-1'>
                      <Users className='w-4 h-4 text-gray-600 dark:text-gray-400' />
                      <p className='font-medium text-gray-900 dark:text-gray-200 text-sm'>
                        Maximum Occupancy
                      </p>
                    </div>
                    <p className='text-gray-600 dark:text-gray-300 text-sm'>
                      {room.maxOccupancy} guests
                    </p>
                  </div>
                )}

                {room.maxAdults && (
                  <div className='flex justify-between'>
                    <p className='font-medium text-gray-900 dark:text-gray-200 text-sm'>
                      Maximum Adults
                    </p>
                    <p className='text-gray-600 dark:text-gray-300 text-sm'>
                      {room.maxAdults} adults
                    </p>
                  </div>
                )}

                {room.maxChildren && (
                  <div className='flex justify-between'>
                    <p className='font-medium text-gray-900 dark:text-gray-200 text-sm'>
                      Maximum Children
                    </p>
                    <p className='text-gray-600 dark:text-gray-300 text-sm'>
                      {room.maxChildren} children
                    </p>
                  </div>
                )}

                {room.bedTypes && room.bedTypes.length > 0 && (
                  <div>
                    <div className='flex items-center gap-2 mb-2'>
                      <Bed className='w-4 h-4 text-gray-600 dark:text-gray-400' />
                      <p className='font-medium text-gray-900 dark:text-gray-200 text-sm'>
                        Bed Type
                      </p>
                    </div>
                    <p className='text-gray-600 dark:text-gray-300 text-sm leading-relaxed'>
                      {room.bedTypes[0].bedType}
                    </p>
                  </div>
                )}

                {room.roomSizeSquare && (
                  <div className='flex justify-between'>
                    <div className='flex items-center gap-2 mb-1'>
                      <Maximize className='w-4 h-4 text-gray-600 dark:text-gray-400' />
                      <p className='font-medium text-gray-900 dark:text-gray-200 text-sm'>
                        Room Size
                      </p>
                    </div>
                    <p className='text-gray-600 dark:text-gray-300 text-sm'>
                      {room.roomSizeSquare} sqft
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Booking Card */}
            <Card>
              <CardHeader>
                <CardTitle>Ready to Book?</CardTitle>
              </CardHeader>
              <CardContent>
                {hasAvailability ? (
                  <>
                    <Link
                      to='/details/$hotelId/room/$roomId/rates'
                      params={{ hotelId: hotel.id, roomId: String(room.id) }}
                      search={{
                        checkinDate: '2025-11-10',
                        checkoutDate: '2025-11-15',
                        adults: 2,
                        country,
                        city,
                        page,
                      }}
                    >
                      <Button className='w-full cursor-pointer' size='lg'>
                        Book This Room
                      </Button>
                    </Link>
                    <p className='mt-3 text-gray-500 dark:text-gray-400 text-sm text-center'>
                      Best price guarantee
                    </p>
                  </>
                ) : (
                  <>
                    <Button className='w-full' size='lg' disabled>
                      No Availability
                    </Button>
                    <p className='mt-3 text-gray-500 dark:text-gray-400 text-sm text-center'>
                      This room is not available for the selected dates
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
