import {
  integer,
  pgTable,
  varchar,
  decimal,
  timestamp,
  date,
  boolean,
} from 'drizzle-orm/pg-core';

// Better Auth tables - required for authentication
export const user = pgTable('users', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: boolean('email_verified').default(false),
  password: varchar('password'),
  image: varchar('image', { length: 255 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const session = pgTable('sessions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull(),
  ipAddress: varchar('ip_address', { length: 255 }),
  userAgent: varchar('user_agent', { length: 500 }),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const account = pgTable('accounts', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  accountId: varchar('accountId').notNull(),
  providerId: varchar('providerId').notNull(),
  accessToken: varchar('accessToken'),
  refreshToken: varchar('refreshToken'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: varchar('scope'),
  idToken: varchar('idToken'),
  password: varchar('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const verification = pgTable('verifications', {
  id: varchar('id', { length: 255 }).primaryKey(),
  identifier: varchar('identifier', { length: 255 }).notNull(),
  value: varchar('value', { length: 255 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

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
