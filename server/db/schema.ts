import {
  integer,
  pgTable,
  varchar,
  decimal,
  timestamp,
  date,
} from 'drizzle-orm/pg-core';

// Better Auth will create its own tables (user, session, account, verification)
// We just need to define our custom tables here

// Bookings table for hotel reservations
export const bookingsTable = pgTable('bookings', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  hotelId: varchar('hotel_id', { length: 255 }).notNull(),
  hotelName: varchar('hotel_name', { length: 255 }).notNull(),
  roomId: integer('room_id').notNull(),
  roomName: varchar('room_name', { length: 255 }).notNull(),
  guestName: varchar('guest_name', { length: 255 }).notNull(),
  guestEmail: varchar('guest_email', { length: 255 }).notNull(),
  guestPhone: varchar('guest_phone', { length: 50 }),
  checkinDate: date('checkin_date').notNull(),
  checkoutDate: date('checkout_date').notNull(),
  adults: integer('adults').notNull(),
  children: integer('children').default(0),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).notNull(),
  bookingStatus: varchar('booking_status', { length: 50 })
    .notNull()
    .default('confirmed'),
  specialRequests: varchar('special_requests', { length: 1000 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
