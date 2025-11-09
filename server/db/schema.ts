import {
  integer,
  pgTable,
  varchar,
  decimal,
  timestamp,
  date,
  serial,
} from 'drizzle-orm/pg-core';

// Keep the users table for testing (can remove later)
export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

// Bookings table for hotel reservations
export const bookingsTable = pgTable('bookings', {
  id: serial('id').primaryKey(),
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
