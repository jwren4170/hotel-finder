import { Router } from 'express';
import type { Request, Response } from 'express';
import { db } from '@/server/db/index';
import { bookingsTable } from '@/server/db/schema';
import { eq, and, gte } from 'drizzle-orm';

const bookingRoutes = Router();

// Helper function to check if dates overlap
const datesOverlap = (
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean => {
  const s1 = new Date(start1);
  const e1 = new Date(end1);
  const s2 = new Date(start2);
  const e2 = new Date(end2);

  // Check if the date ranges overlap
  return s1 < e2 && s2 < e1;
};

// Helper function to find next available date for a room
const findNextAvailableDate = async (
  hotelId: string,
  roomId: number,
  requestedCheckin: string
): Promise<string | null> => {
  // Get all future bookings for this room, sorted by checkin date
  const futureBookings = await db
    .select()
    .from(bookingsTable)
    .where(
      and(
        eq(bookingsTable.hotelId, hotelId),
        eq(bookingsTable.roomId, roomId),
        gte(bookingsTable.checkoutDate, requestedCheckin)
      )
    )
    .orderBy(bookingsTable.checkinDate);

  if (futureBookings.length === 0) {
    return requestedCheckin; // Room is available from requested date
  }

  // Find the first gap in bookings
  let currentDate = new Date(requestedCheckin);

  for (const booking of futureBookings) {
    const bookingStart = new Date(booking.checkinDate);
    const bookingEnd = new Date(booking.checkoutDate);

    // If there's a gap before this booking, return the current date
    if (currentDate < bookingStart) {
      return currentDate.toISOString().split('T')[0];
    }

    // Move to the day after this booking ends
    currentDate = new Date(bookingEnd);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Return the date after the last booking
  return currentDate.toISOString().split('T')[0];
};

// Create a new booking
bookingRoutes.post('/', async (req: Request, res: Response) => {
  try {
    const bookingData = req.body;

    // Validate required fields
    const requiredFields = [
      'hotelId',
      'hotelName',
      'roomId',
      'roomName',
      'guestName',
      'guestEmail',
      'checkinDate',
      'checkoutDate',
      'adults',
      'totalPrice',
      'currency',
    ];

    for (const field of requiredFields) {
      if (!bookingData[field]) {
        return res.status(400).json({
          error: `Missing required field: ${field}`,
        });
      }
    }

    // Check for existing bookings that conflict with the requested dates
    const existingBookings = await db
      .select()
      .from(bookingsTable)
      .where(
        and(
          eq(bookingsTable.hotelId, bookingData.hotelId),
          eq(bookingsTable.roomId, bookingData.roomId)
        )
      );

    // Check if any existing booking overlaps with the requested dates
    const hasConflict = existingBookings.some((booking) =>
      datesOverlap(
        bookingData.checkinDate,
        bookingData.checkoutDate,
        booking.checkinDate,
        booking.checkoutDate
      )
    );

    if (hasConflict) {
      // Find the next available date
      const nextAvailable = await findNextAvailableDate(
        bookingData.hotelId,
        bookingData.roomId,
        bookingData.checkinDate
      );

      return res.status(409).json({
        error: 'Room is already booked for the selected dates',
        conflictingBookings: existingBookings.filter((booking) =>
          datesOverlap(
            bookingData.checkinDate,
            bookingData.checkoutDate,
            booking.checkinDate,
            booking.checkoutDate
          )
        ),
        nextAvailableDate: nextAvailable,
      });
    }

    // Insert booking into database
    const [newBooking] = await db
      .insert(bookingsTable)
      .values({
        hotelId: bookingData.hotelId,
        hotelName: bookingData.hotelName,
        roomId: bookingData.roomId,
        roomName: bookingData.roomName,
        guestName: bookingData.guestName,
        guestEmail: bookingData.guestEmail,
        guestPhone: bookingData.guestPhone || null,
        checkinDate: bookingData.checkinDate,
        checkoutDate: bookingData.checkoutDate,
        adults: bookingData.adults,
        children: bookingData.children || 0,
        totalPrice: bookingData.totalPrice,
        currency: bookingData.currency,
        bookingStatus: 'confirmed',
        specialRequests: bookingData.specialRequests || null,
      })
      .returning();

    res.status(201).json({
      success: true,
      booking: newBooking,
      message: 'Booking created successfully',
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      error: 'Failed to create booking',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get all bookings
bookingRoutes.get('/', async (_req: Request, res: Response) => {
  try {
    const bookings = await db.select().from(bookingsTable);

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      error: 'Failed to fetch bookings',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get a single booking by ID
bookingRoutes.get('/:id', async (req: Request, res: Response) => {
  try {
    const bookingId = parseInt(req.params.id);

    if (isNaN(bookingId)) {
      return res.status(400).json({
        error: 'Invalid booking ID',
      });
    }

    const [booking] = await db
      .select()
      .from(bookingsTable)
      .where(eq(bookingsTable.id, bookingId));

    if (!booking) {
      return res.status(404).json({
        error: 'Booking not found',
      });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      error: 'Failed to fetch booking',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Check availability for a specific room and date range
bookingRoutes.post(
  '/check-availability',
  async (req: Request, res: Response) => {
    try {
      const { hotelId, roomId, checkinDate, checkoutDate } = req.body;

      // Validate required fields
      if (!hotelId || !roomId || !checkinDate || !checkoutDate) {
        return res.status(400).json({
          error:
            'Missing required fields: hotelId, roomId, checkinDate, checkoutDate',
        });
      }

      // Get all bookings for this room
      const existingBookings = await db
        .select()
        .from(bookingsTable)
        .where(
          and(
            eq(bookingsTable.hotelId, hotelId),
            eq(bookingsTable.roomId, parseInt(roomId))
          )
        );

      // Check if any existing booking overlaps with the requested dates
      const conflictingBookings = existingBookings.filter((booking) =>
        datesOverlap(
          checkinDate,
          checkoutDate,
          booking.checkinDate,
          booking.checkoutDate
        )
      );

      const isAvailable = conflictingBookings.length === 0;

      if (!isAvailable) {
        // Find the next available date
        const nextAvailable = await findNextAvailableDate(
          hotelId,
          parseInt(roomId),
          checkinDate
        );

        return res.json({
          success: true,
          available: false,
          conflictingBookings,
          nextAvailableDate: nextAvailable,
        });
      }

      res.json({
        success: true,
        available: true,
        message: 'Room is available for the selected dates',
      });
    } catch (error) {
      console.error('Error checking availability:', error);
      res.status(500).json({
        error: 'Failed to check availability',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);

export default bookingRoutes;
