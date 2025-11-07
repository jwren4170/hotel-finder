import { useLoaderData, Link, useSearch } from '@tanstack/react-router';
import {
  ArrowLeft,
  Calendar,
  Users,
  DollarSign,
  CheckCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

const RoomRates = () => {
  const { hotel, room, rates } = useLoaderData({
    from: '/details/$hotelId/room/$roomId/rates',
  });
  const { checkinDate, checkoutDate, adults } = useSearch({
    from: '/details/$hotelId/room/$roomId/rates',
  });

  // Debug: Log the rates structure
  // console.log('Rates data structure:', rates);
  // console.log(
  //   'Rates keys:',
  //   rates ? Object.keys(rates) : 'rates is null/undefined'
  // );

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

  // Helper function to find room details by mappedRoomId
  const getRoomDetails = (mappedRoomId: number) => {
    return hotel.rooms?.find((r: Room) => r.id === mappedRoomId);
  };

  // Get the room types from the nested data structure
  const roomTypes = rates?.data?.[0]?.roomTypes || [];

  console.log('Room types:', roomTypes);
  console.log('First room type:', roomTypes[0]);

  // Check if there's an error in the rates response
  const hasError = rates?.error;
  const errorMessage = rates?.error?.message;

  return (
    <div className='bg-gray-50 py-8 min-h-screen'>
      <div className='mx-auto px-4 max-w-6xl'>
        {/* Back Button */}
        <Link
          to='/details/$hotelId/room/$roomId'
          params={{ hotelId: hotel.id, roomId: String(room.id) }}
          className='inline-flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-800'
        >
          <ArrowLeft className='w-4 h-4' />
          Back to Room Details
        </Link>

        {/* Header */}
        <div className='mb-6'>
          <h1 className='mb-2 font-bold text-gray-900 text-3xl'>
            Available Rates for {room.roomName}
          </h1>
          <p className='text-gray-600 text-lg'>{hotel.name}</p>
        </div>

        {/* Booking Details Card */}
        <Card className='mb-6'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Calendar className='w-5 h-5' />
              Booking Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='gap-6 grid grid-cols-1 md:grid-cols-3'>
              <div>
                <p className='font-medium text-gray-700 text-sm'>Check-in</p>
                <p className='text-gray-900 text-lg'>
                  {new Date(checkinDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className='font-medium text-gray-700 text-sm'>Check-out</p>
                <p className='text-gray-900 text-lg'>
                  {new Date(checkoutDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className='font-medium text-gray-700 text-sm'>Guests</p>
                <p className='flex items-center gap-1 text-gray-900 text-lg'>
                  <Users className='w-5 h-5' />
                  {adults} {adults === 1 ? 'Adult' : 'Adults'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rates List */}
        <div className='space-y-4'>
          <h2 className='font-semibold text-gray-900 text-xl'>
            Available Room Types & Rates
          </h2>

          {roomTypes && roomTypes.length > 0 ? (
            roomTypes.map((roomType: any, index: number) => {
              // Get the mapped room details if available
              const mappedRoom = roomType.mappedRoomId
                ? getRoomDetails(roomType.mappedRoomId)
                : null;

              return (
                <Card key={index} className='hover:shadow-lg transition-shadow'>
                  <CardContent className='p-6'>
                    <div className='gap-6 grid grid-cols-1 lg:grid-cols-[2fr_1fr]'>
                      {/* Room Type Info */}
                      <div>
                        <h3 className='mb-2 font-semibold text-gray-900 text-lg'>
                          {mappedRoom?.roomName ||
                            roomType.name ||
                            'Standard Room'}
                        </h3>

                        {/* Room Photos */}
                        {mappedRoom?.photos && mappedRoom.photos.length > 0 && (
                          <div className='gap-2 grid grid-cols-2 mb-3'>
                            {mappedRoom.photos
                              .slice(0, 2)
                              .map((photo: any, i: number) => (
                                <img
                                  key={i}
                                  src={photo.url || photo.failoverPhoto}
                                  alt={mappedRoom.roomName}
                                  className='rounded-lg w-full h-32 object-cover'
                                />
                              ))}
                          </div>
                        )}

                        {/* Room Description */}
                        {mappedRoom?.description && (
                          <p className='mb-3 text-gray-600 text-sm'>
                            {mappedRoom.description}
                          </p>
                        )}

                        {/* Room Details */}
                        {mappedRoom && (
                          <div className='space-y-2 mb-3'>
                            {mappedRoom.maxOccupancy && (
                              <div className='flex items-center gap-2 text-gray-700 text-sm'>
                                <Users className='w-4 h-4' />
                                Max {mappedRoom.maxOccupancy} guests
                              </div>
                            )}
                            {mappedRoom.bedTypes &&
                              mappedRoom.bedTypes.length > 0 && (
                                <div className='text-gray-700 text-sm'>
                                  {mappedRoom.bedTypes.map(
                                    (bed: any, i: number) => (
                                      <div
                                        key={i}
                                        className='flex items-center gap-2'
                                      >
                                        <CheckCircle className='w-4 h-4 text-green-600' />
                                        {bed.quantity} {bed.bedType}
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                          </div>
                        )}

                        {/* Room Amenities */}
                        {mappedRoom?.roomAmenities &&
                        mappedRoom.roomAmenities.length > 0 ? (
                          <div className='space-y-1'>
                            <p className='font-medium text-gray-900 text-sm'>
                              Room Amenities:
                            </p>
                            {mappedRoom.roomAmenities
                              .slice(0, 5)
                              .map((amenity: any, i: number) => (
                                <div
                                  key={i}
                                  className='flex items-center gap-2 text-gray-700 text-sm'
                                >
                                  <CheckCircle className='w-4 h-4 text-green-600' />
                                  {amenity.name}
                                </div>
                              ))}
                          </div>
                        ) : (
                          <div className='space-y-1'>
                            <p className='font-medium text-gray-900 text-sm'>
                              Room Amenities:
                            </p>
                            {room
                              .roomAmenities!.slice(0, 5)
                              .map((amenity: any, i: number) => (
                                <div
                                  key={i}
                                  className='flex items-center gap-2 text-gray-700 text-sm'
                                >
                                  <CheckCircle className='w-4 h-4 text-green-600' />
                                  {amenity.name}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>

                      {/* Price & Book Button */}
                      <div className='flex flex-col justify-between'>
                        <div className='text-right'>
                          <p className='text-gray-600 text-sm'>Total Price</p>
                          <div className='flex justify-end items-center gap-1 font-bold text-blue-600 text-3xl'>
                            <DollarSign className='w-6 h-6' />
                            {roomType.suggestedSellingPrice?.amount || 'N/A'}
                          </div>
                          <p className='text-gray-500 text-xs'>
                            {roomType.suggestedSellingPrice?.currency || 'USD'}
                          </p>
                        </div>
                        <Button
                          className='mt-4 w-full cursor-pointer'
                          size='lg'
                        >
                          Select Room
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className='p-8 text-center'>
                <div className='space-y-4'>
                  <p className='font-semibold text-gray-900 text-lg'>
                    {hasError ? 'No Availability Found' : 'No Rates Available'}
                  </p>
                  <p className='text-gray-600'>
                    {errorMessage ||
                      'No rates available for the selected dates.'}
                  </p>
                  <p className='text-gray-500 text-sm'>
                    Try selecting different dates or check back later.
                  </p>
                  <div className='bg-blue-50 mt-4 p-4 rounded-lg'>
                    <p className='font-medium text-blue-900 text-sm'>
                      Current Search:
                    </p>
                    <p className='text-blue-700 text-sm'>
                      {new Date(checkinDate).toLocaleDateString()} -{' '}
                      {new Date(checkoutDate).toLocaleDateString()}
                    </p>
                    <p className='text-blue-700 text-sm'>
                      {adults} {adults === 1 ? 'Adult' : 'Adults'}
                    </p>
                  </div>
                  <Link
                    to='/details/$hotelId/room/$roomId'
                    params={{ hotelId: hotel.id, roomId: String(room.id) }}
                  >
                    <Button variant='outline' className='mt-4'>
                      Back to Room Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomRates;
