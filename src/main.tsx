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
import About from './components/About.tsx';
import HotelDetail from './components/HotelDetail.tsx';
import { getHotelsByCity, getHotelsDetails } from './services/hotelService.ts';

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

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: About,
});

const detailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/details/$hotelId',
  loader: ({ params }) => getHotelsDetails(params.hotelId),
  component: HotelDetail,
});

const routeTree = rootRoute.addChildren([indexRoute, detailsRoute, aboutRoute]);

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
