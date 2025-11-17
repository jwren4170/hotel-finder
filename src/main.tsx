import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import z, { _ZodString } from 'zod';

import './styles.css';

import App from '@/App.tsx';
import Header from '@/components/layout/Header.tsx';
import HotelDetail from '@/components/hotel/HotelDetail.tsx';
import RoomDetails from '@/components/room/RoomDetails.tsx';
import MyBookings from '@/components/booking/MyBookings.tsx';
import ErrorComponent from '@/components/common/ErrorComponent';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import LoginPage from '@/components/pages/Login';
import {
  getHotelsByCity,
  getHotelDetails,
  getRoomRates,
} from '@/services/hotelService';
import RoomRates from '@/components/room/RoomRates.tsx';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
  errorComponent: ErrorComponent,
});

const searchSchema = z.object({
  country: z.string().optional().default('US'),
  city: z.string().optional().default('New York'),
  page: z.number().optional().default(1),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  validateSearch: searchSchema.parse,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ deps }) => {
    return getHotelsByCity(deps.search.country, deps.search.city);
  },
  component: App,
  pendingComponent: () => (
    <LoadingSpinner fullScreen text='Searching for hotels...' />
  ),
});

const detailsSearchSchema = z.object({
  country: z.string().optional().default('US'),
  city: z.string().optional().default('New York'),
  page: z.number().optional().default(1),
  from: z.string().optional(), // Track where user came from: 'bookings' or undefined
});

const detailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/details/$hotelId',
  validateSearch: detailsSearchSchema.parse,
  loader: ({ params }) => getHotelDetails(params.hotelId),
  component: HotelDetail,
  pendingComponent: () => (
    <LoadingSpinner fullScreen text='Loading hotel details...' />
  ),
});

const roomDetailsSearchSchema = z.object({
  country: z.string().optional().default('US'),
  city: z.string().optional().default('New York'),
  page: z.number().optional().default(1),
});

const roomDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/details/$hotelId/room/$roomId',
  validateSearch: roomDetailsSearchSchema.parse,
  loader: async ({ params }) => {
    // Get the hotel details which includes rooms
    const hotel = await getHotelDetails(params.hotelId);
    // Find the specific room - convert roomId from string to number
    const room = hotel.rooms?.find((r) => r.id === Number(params.roomId));

    // Check availability for default dates
    const defaultCheckin = '2025-11-10';
    const defaultCheckout = '2025-11-15';
    const defaultOccupancies = [{ adults: 2, childrenAges: [] }];

    let hasAvailability = false;
    try {
      const availabilityCheck = await getRoomRates(
        params.hotelId,
        defaultCheckin,
        defaultCheckout,
        defaultOccupancies
      );
      // console.log('Availability check response:', availabilityCheck);
      // console.log('Has error?', availabilityCheck?.error);
      // console.log('Room types:', availabilityCheck?.data?.[0]?.roomTypes);

      // Check if there's data and no error
      hasAvailability =
        !availabilityCheck?.error &&
        availabilityCheck?.data?.[0]?.roomTypes?.length > 0;

      // console.log('Final hasAvailability:', hasAvailability);
    } catch (error) {
      console.error('Error checking availability:', error);
      hasAvailability = false;
    }

    // console.log(room);
    return { hotel, room, hasAvailability };
  },
  component: RoomDetails,
  pendingComponent: () => (
    <LoadingSpinner fullScreen text='Loading room details...' />
  ),
});

const roomRatesSearchSchema = z.object({
  checkinDate: z.string().optional().default('2025-11-10'),
  checkoutDate: z.string().optional().default('2025-11-15'),
  adults: z.number().optional().default(2),
  country: z.string().optional().default('US'),
  city: z.string().optional().default('New York'),
  page: z.number().optional().default(1),
});

const roomRatesRoom = createRoute({
  getParentRoute: () => rootRoute,
  path: '/details/$hotelId/room/$roomId/rates',
  validateSearch: roomRatesSearchSchema.parse,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ params, deps }) => {
    // Prepare occupancies array
    const occupancies = [{ adults: deps.search.adults, childrenAges: [] }];

    // Get the hotel rates
    const rates = await getRoomRates(
      params.hotelId,
      deps.search.checkinDate,
      deps.search.checkoutDate,
      occupancies
    );

    // Get hotel details to access room information
    const hotel = await getHotelDetails(params.hotelId);

    // Find the specific room - convert roomId from string to number
    const room = hotel.rooms?.find((r) => r.id === Number(params.roomId));

    // console.log(room);
    return { hotel, room, rates };
  },
  component: RoomRates,
  pendingComponent: () => (
    <LoadingSpinner fullScreen text='Loading available rates...' />
  ),
});

const bookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bookings',
  loader: async () => {
    const response = await fetch('http://localhost:3001/api/bookings');
    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }
    const data = await response.json();
    return data.bookings || [];
  },
  component: MyBookings,
  pendingComponent: () => (
    <LoadingSpinner fullScreen text='Loading your bookings...' />
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  detailsRoute,
  roomDetailsRoute,
  roomRatesRoom,
  bookingsRoute,
  loginRoute,
]);

const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('app');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
