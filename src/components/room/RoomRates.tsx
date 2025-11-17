import { useState } from 'react';
import { useLoaderData, Link, useSearch } from '@tanstack/react-router';
import {
  ArrowLeft,
  Calendar,
  Users,
  DollarSign,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { stripHtmlTags } from '@/lib/utils';
import BookingForm from '@/components/booking/BookingForm';
import BookingConfirmation from '@/components/booking/BookingConfirmation';

const RoomRates = () => {
  const { hotel, room, rates } = useLoaderData({
    from: '/details/$hotelId/room/$roomId/rates',
  });
  const { checkinDate, checkoutDate, adults, country, city, page } = useSearch({
    from: '/details/$hotelId/room/$roomId/rates',
  });

  // Debug: Log the rates structure
  // console.log('Rates data structure:', rates);
  // console.log(
  //   'Rates keys:',
  //   rates ? Object.keys(rates) : 'rates is null/undefined'
  // );

  const [expandedRooms, setExpandedRooms] = useState<Set<number>>(new Set());
  const [selectedRoomType, setSelectedRoomType] = useState<any | null>(null);
  const [bookingId, setBookingId] = useState<number | null>(null);

  const toggleRoom = (index: number) => {
    const newExpanded = new Set(expandedRooms);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRooms(newExpanded);
  };

  const handleSelectRoom = (roomType: any) => {
    setSelectedRoomType(roomType);
  };

  const handleBookingSuccess = (id: number) => {
    setBookingId(id);
    setSelectedRoomType(null);
  };

  const handleCancelBooking = () => {
    setSelectedRoomType(null);
  };

  if (!room) {
    return (
      <div className='flex justify-center items-center p-8'>
        <div className='text-center'>
          <h2 className='mb-2 font-bold text-gray-800 dark:text-gray-200 text-2xl'>
            Room not found
          </h2>
          <p className='mb-4 text-gray-600 dark:text-gray-300'>
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

  // Helper function to find room details by mappedRoomId
  const getRoomDetails = (mappedRoomId: number) => {
    return hotel.rooms?.find((r: Room) => r.id === mappedRoomId);
  };

  // Get the room types from the nested data structure
  const allRoomTypes = rates?.data?.[0]?.roomTypes || [];

  // Deduplicate room types - keep only the first occurrence of each unique room
  // (which should have the offerInitialPrice)
  const roomTypes = allRoomTypes.reduce((unique: any[], roomType: any) => {
    const mappedRoomId = roomType.mappedRoomId;
    const roomName = roomType.name;

    // Check if we already have this room (by mappedRoomId or name)
    const alreadyExists = unique.some(
      (r) => r.mappedRoomId === mappedRoomId || r.name === roomName
    );

    if (!alreadyExists) {
      unique.push(roomType);
    }

    return unique;
  }, []);

  console.log('All room types:', allRoomTypes.length);
  console.log('Unique room types:', roomTypes.length);
  console.log('First room type:', roomTypes[0]);

  // Check if there's an error in the rates response
  const hasError = rates?.error;
  const errorMessage = rates?.error?.message;

  return (
    <div className='bg-background min-h-screen'>
      {/* Back Button */}
      <div className='bg-card shadow-sm border-border border-b'>
        <div className='mx-auto px-4 py-4 max-w-6xl'>
          <Link
            to='/details/$hotelId/room/$roomId'
            params={{ hotelId: hotel.id, roomId: String(room.id) }}
            search={{ country, city, page }}
          >
            <Button variant='ghost' className='gap-2'>
              <ArrowLeft className='w-4 h-4' />
              Back to Room Details
            </Button>
          </Link>
        </div>
      </div>

      <div className='mx-auto px-4 py-8 max-w-6xl'>
        {/* Header Section */}
        <div className='mb-6'>
          <div className='mb-3'>
            <h1 className='mb-2 font-bold text-foreground text-3xl md:text-4xl'>
              Available Rates for {room.roomName}
            </h1>
            <div className='flex items-center gap-2 text-muted-foreground'>
              <MapPin className='w-5 h-5' />
              <span className='text-lg'>
                {hotel.name} - {hotel.city}, {hotel.country}
              </span>
            </div>
          </div>
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
                <p className='font-medium text-gray-700 dark:text-gray-300 text-sm'>
                  Check-in
                </p>
                <p className='text-gray-900 dark:text-gray-200 text-lg'>
                  {new Date(checkinDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className='font-medium text-gray-700 dark:text-gray-300 text-sm'>
                  Check-out
                </p>
                <p className='text-gray-900 dark:text-gray-200 text-lg'>
                  {new Date(checkoutDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className='font-medium text-gray-700 dark:text-gray-300 text-sm'>
                  Guests
                </p>
                <p className='flex items-center gap-1 text-gray-900 dark:text-gray-200 text-lg'>
                  <Users className='w-5 h-5' />
                  {adults} {adults === 1 ? 'Adult' : 'Adults'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Confirmation */}
        {bookingId && (
          <div className='mb-6'>
            <BookingConfirmation bookingId={bookingId} />
          </div>
        )}

        {/* Booking Form */}
        {selectedRoomType && !bookingId && (
          <div className='mb-6'>
            <BookingForm
              hotelId={hotel.id}
              hotelName={hotel.name}
              roomId={room.id}
              roomName={
                room.roomName || selectedRoomType.name || 'Standard Room'
              }
              checkinDate={checkinDate}
              checkoutDate={checkoutDate}
              adults={adults}
              totalPrice={selectedRoomType.offerInitialPrice?.amount || '0'}
              currency={selectedRoomType.offerInitialPrice?.currency || 'USD'}
              onSuccess={handleBookingSuccess}
              onCancel={handleCancelBooking}
            />
          </div>
        )}

        {/* Rates List */}
        <div className='space-y-4'>
          <h2 className='font-semibold text-foreground text-xl'>
            Available Room Types & Rates
          </h2>

          {roomTypes && roomTypes.length > 0 ? (
            roomTypes.map((roomType: any, index: number) => {
              // Get the mapped room details if available
              roomType.mappedRoomId
                ? getRoomDetails(roomType.mappedRoomId)
                : null;
              const isExpanded = expandedRooms.has(index);

              return (
                <Card key={index} className='hover:shadow-md transition-shadow'>
                  {/* Collapsed Header - Always Visible */}
                  <div
                    className='flex justify-between items-center gap-4 hover:bg-accent/5 p-4 transition-colors cursor-pointer'
                    onClick={() => toggleRoom(index)}
                  >
                    <div className='flex flex-1 items-center gap-4'>
                      <h3 className='font-semibold text-foreground text-base'>
                        {room.roomName || roomType.name || 'Standard Room'}
                      </h3>
                      {room.maxOccupancy && (
                        <span className='flex items-center gap-1 text-muted-foreground text-sm'>
                          <Users className='w-4 h-4' />
                          {room.maxOccupancy}
                        </span>
                      )}
                      {room.bedTypes && room.bedTypes.length > 0 && (
                        <span className='text-muted-foreground text-sm'>
                          {room.bedTypes[0].quantity} {room.bedTypes[0].bedType}
                        </span>
                      )}
                    </div>
                    <div className='flex items-center gap-4'>
                      <div className='flex items-center gap-1 font-bold text-accent text-xl'>
                        <DollarSign className='w-5 h-5' />
                        {roomType.suggestedSellingPrice?.amount || 'N/A'}
                      </div>
                      <button className='text-muted-foreground hover:text-foreground transition-colors'>
                        {isExpanded ? (
                          <ChevronUp className='w-5 h-5' />
                        ) : (
                          <ChevronDown className='w-5 h-5' />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <CardContent className='bg-muted/20 px-4 pt-3 pb-4 border-border border-t'>
                      <div className='gap-4 grid grid-cols-1 lg:grid-cols-[1fr_auto]'>
                        {/* Room Details - Compact Layout */}
                        <div className='space-y-3'>
                          {/* Room Description */}
                          {room.description && (
                            <p className='text-muted-foreground text-sm leading-relaxed'>
                              {stripHtmlTags(room.description).substring(
                                0,
                                200
                              )}
                              {stripHtmlTags(room.description).length > 200 &&
                                '...'}
                            </p>
                          )}

                          {/* Amenities - Compact Grid */}
                          {(room.roomAmenities &&
                            room.roomAmenities.length > 0) ||
                          room.roomAmenities ? (
                            <div className='gap-x-4 gap-y-1 grid grid-cols-2 md:grid-cols-3'>
                              {(room.roomAmenities || room.roomAmenities!)
                                .slice(0, 6)
                                .map((amenity: any, i: number) => (
                                  <div
                                    key={i}
                                    className='flex items-center gap-1.5 text-muted-foreground text-xs'
                                  >
                                    <CheckCircle className='w-3.5 h-3.5 text-green-600 dark:text-green-400 shrink-0' />
                                    <span className='truncate'>
                                      {amenity.name}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          ) : null}
                        </div>

                        {/* Book Button */}
                        <div className='flex items-center'>
                          <Button
                            className='whitespace-nowrap cursor-pointer'
                            size='default'
                            onClick={() => handleSelectRoom(roomType)}
                          >
                            Select Room
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className='p-8 text-center'>
                <div className='space-y-4'>
                  <p className='font-semibold text-foreground text-lg'>
                    {hasError ? 'No Availability Found' : 'No Rates Available'}
                  </p>
                  <p className='text-muted-foreground'>
                    {errorMessage ||
                      'No rates available for the selected dates.'}
                  </p>
                  <p className='text-muted-foreground text-sm'>
                    Try selecting different dates or check back later.
                  </p>
                  <div className='bg-primary/10 mt-4 p-4 rounded-lg'>
                    <p className='font-medium text-foreground text-sm'>
                      Current Search:
                    </p>
                    <p className='text-muted-foreground text-sm'>
                      {new Date(checkinDate).toLocaleDateString()} -{' '}
                      {new Date(checkoutDate).toLocaleDateString()}
                    </p>
                    <p className='text-muted-foreground text-sm'>
                      {adults} {adults === 1 ? 'Adult' : 'Adults'}
                    </p>
                  </div>
                  <Link
                    to='/details/$hotelId/room/$roomId'
                    params={{ hotelId: hotel.id, roomId: String(room.id) }}
                    search={{ country, city, page }}
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
