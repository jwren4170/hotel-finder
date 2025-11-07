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

import App from './App.tsx';
import Header from './components/Header.tsx';
import HotelDetail from './components/HotelDetail.tsx';
import RoomDetails from './components/RoomDetails.tsx';
import {
  getHotelsByCity,
  getHotelDetails,
  getRoomRates,
} from './services/hotelService.ts';
import RoomRates from './components/RoomRates.tsx';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
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
});

const detailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/details/$hotelId',
  loader: ({ params }) => getHotelDetails(params.hotelId),
  component: HotelDetail,
});

const roomDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/details/$hotelId/room/$roomId',
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
});

const roomRatesSearchSchema = z.object({
  checkinDate: z.string().optional().default('2025-11-10'),
  checkoutDate: z.string().optional().default('2025-11-15'),
  adults: z.number().optional().default(2),
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
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  detailsRoute,
  roomDetailsRoute,
  roomRatesRoom,
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
