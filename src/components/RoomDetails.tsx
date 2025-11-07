import { useLoaderData, Link } from '@tanstack/react-router';
import { stripHtmlTags } from '@/lib/utils';
import {
  ArrowLeft,
  Users,
  Bed,
  Maximize,
  CheckCircle,
  MapPin,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

const RoomDetails = () => {
  const { hotel, room, hasAvailability } = useLoaderData({
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
          <Link to='/details/$hotelId' params={{ hotelId: hotel.id }}>
            <Button variant='default'>Back to Hotel</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-gray-50 min-h-screen'>
      {/* Back Button */}
      <div className='bg-white shadow-sm'>
        <div className='mx-auto px-4 py-4 max-w-6xl'>
          <Link to='/details/$hotelId' params={{ hotelId: hotel.id }}>
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
            <h1 className='mb-2 font-bold text-gray-900 text-3xl md:text-4xl'>
              {room.roomName}
            </h1>
            <div className='flex items-center gap-2 text-gray-600'>
              <MapPin className='w-5 h-5' />
              <span className='text-lg'>
                {hotel.name} - {hotel.city}, {hotel.country}
              </span>
            </div>
          </div>

          {/* Price Badge */}
          {room.price && (
            <div className='inline-block bg-blue-600 shadow-lg px-6 py-3 rounded-xl'>
              <div className='font-bold text-white text-2xl'>
                {room.currency || hotel.currency} {room.price.toFixed(2)}
              </div>
              <div className='text-blue-100 text-sm'>per night</div>
            </div>
          )}
        </div>

        {/* Room photos */}
        {room.photos && room.photos.length > 0 && (
          <div className='gap-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mb-8'>
            {room.photos.map((photo, index) => (
              <div key={index} className='rounded-xl overflow-hidden'>
                <img
                  src={photo.url}
                  alt={`${room.roomName}  ${index + 1}`}
                  className='w-full h-64 object-cover'
                />
              </div>
            ))}
          </div>
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
                  <p className='text-gray-700 leading-relaxed'>
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
                        <CheckCircle className='w-5 h-5 text-green-600' />
                        <span className='text-gray-700'>{amenity.name}</span>
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
              <CardContent className='space-y-3'>
                {room.maxOccupancy && (
                  <div className='flex justify-between'>
                    <div className='flex items-center gap-2 mb-1'>
                      <Users className='w-4 h-4 text-gray-600' />
                      <p className='font-medium text-gray-900 text-sm'>
                        Maximum Occupancy
                      </p>
                    </div>
                    <p className='text-gray-600 text-sm'>
                      {room.maxOccupancy} guests
                    </p>
                  </div>
                )}

                {room.maxAdults && (
                  <div className='flex justify-between'>
                    <p className='font-medium text-gray-900 text-sm'>
                      Maximum Adults
                    </p>
                    <p className='text-gray-600 text-sm'>
                      {room.maxAdults} adults
                    </p>
                  </div>
                )}

                {room.maxChildren && (
                  <div className='flex justify-between'>
                    <p className='font-medium text-gray-900 text-sm'>
                      Maximum Children
                    </p>
                    <p className='text-gray-600 text-sm'>
                      {room.maxChildren} children
                    </p>
                  </div>
                )}

                {room.bedTypes && room.bedTypes.length > 0 && (
                  <div className='flex justify-between'>
                    <div className='flex items-center gap-2 mb-1'>
                      <Bed className='w-4 h-4 text-gray-600' />
                      <p className='font-medium text-gray-900 text-sm'>
                        Bed Type
                      </p>
                    </div>
                    <p className='text-gray-600 text-sm'>
                      {room.bedTypes[0].bedType}
                    </p>
                  </div>
                )}

                {room.roomSizeSquare && (
                  <div className='flex justify-between'>
                    <div className='flex items-center gap-2 mb-1'>
                      <Maximize className='w-4 h-4 text-gray-600' />
                      <p className='font-medium text-gray-900 text-sm'>
                        Room Size
                      </p>
                    </div>
                    <p className='text-gray-600 text-sm'>
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
                      }}
                    >
                      <Button className='w-full cursor-pointer' size='lg'>
                        Book This Room
                      </Button>
                    </Link>
                    <p className='mt-3 text-gray-500 text-sm text-center'>
                      Best price guarantee
                    </p>
                  </>
                ) : (
                  <>
                    <Button className='w-full' size='lg' disabled>
                      No Availability
                    </Button>
                    <p className='mt-3 text-gray-500 text-sm text-center'>
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
