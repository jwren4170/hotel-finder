import {
  Link,
  useLoaderData,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './components/ui/card';
import { stripHtmlTags, truncateText } from './lib/utils';
import SearchForm from './components/SearchHotels';
import { MapPin, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './components/ui/button';

const ITEMS_PER_PAGE = 5;

const App = () => {
  const hotels = useLoaderData({ from: '/' });
  const navigate = useNavigate({ from: '/' });
  const { page, country, city } = useSearch({ from: '/' });

  // Calculate pagination
  const totalPages = Math.ceil(hotels.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedHotels = hotels.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    navigate({
      to: '/',
      search: { country, city, page: newPage },
    });
  };

  return (
    <>
      <SearchForm />
      <div className='gap-6 grid grid-cols-1 mx-auto p-6 max-w-7xl'>
        {paginatedHotels.map((hotel) => (
          <Card
            key={hotel.id}
            className='group hover:shadow-xl overflow-hidden transition-all duration-300'
          >
            <Link
              to='/details/$hotelId'
              params={{ hotelId: hotel.id }}
              className='block'
            >
              <div className='md:flex'>
                {/* Image Section */}
                <div className='relative md:w-80 overflow-hidden shrink-0'>
                  {hotel.thumbnail ? (
                    <img
                      src={hotel.thumbnail}
                      alt={hotel.name}
                      className='w-full h-56 md:h-56 object-cover group-hover:scale-105 transition-transform duration-300'
                    />
                  ) : (
                    <div className='flex justify-center items-center bg-gray-200 w-full h-56 md:h-56'>
                      <span className='font-medium text-gray-500 text-sm'>
                        Image not available
                      </span>
                    </div>
                  )}
                  {hotel.stars > 0 && (
                    <div className='top-3 left-3 absolute bg-white shadow-md px-2 py-1 rounded-md'>
                      <div className='flex items-center gap-1 text-amber-500 text-xs'>
                        <Star className='fill-current w-3 h-3' />
                        <span className='font-semibold'>{hotel.stars}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className='flex flex-col flex-1'>
                  <CardHeader className='pb-3'>
                    <div className='flex justify-between items-start gap-4'>
                      <div className='flex-1'>
                        <CardTitle className='mb-2 font-bold group-hover:text-blue-600 text-xl line-clamp-2 transition-colors'>
                          {hotel.name}
                        </CardTitle>
                        <div className='flex items-center gap-1.5 text-gray-600 text-sm'>
                          <MapPin className='w-4 h-4' />
                          <span>
                            {hotel.city}, {hotel.country}
                          </span>
                        </div>
                      </div>

                      {/* Rating Badge */}
                      {hotel.rating > 0 && (
                        <div className='flex flex-col items-end shrink-0'>
                          <div className='flex items-center gap-2'>
                            <div className='text-right'>
                              <div className='font-semibold text-gray-700 text-sm'>
                                {hotel.rating >= 8
                                  ? 'Excellent'
                                  : hotel.rating >= 7
                                  ? 'Very Good'
                                  : hotel.rating >= 6
                                  ? 'Good'
                                  : 'Pleasant'}
                              </div>
                              {hotel.reviewCount > 0 && (
                                <div className='text-gray-500 text-xs'>
                                  {hotel.reviewCount.toLocaleString()} reviews
                                </div>
                              )}
                            </div>
                            <div className='bg-blue-600 shadow-md px-3 py-2 rounded-lg font-bold text-white text-xl'>
                              {hotel.rating.toFixed(1)}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className='flex-1'>
                    <CardDescription className='text-gray-700 text-sm line-clamp-3 leading-relaxed'>
                      {stripHtmlTags(truncateText(hotel.hotelDescription, 300))}
                    </CardDescription>
                  </CardContent>

                  <CardContent className='pt-0'>
                    <div className='flex justify-between items-center'>
                      <span className='font-medium text-blue-600 text-sm hover:underline'>
                        View details →
                      </span>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Link>
          </Card>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className='flex justify-center items-center gap-6 mx-auto pb-8 max-w-7xl'>
          <Button
            variant='outline'
            size='default'
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className='gap-2'
          >
            <ChevronLeft className='w-4 h-4' />
            Previous
          </Button>

          <div className='flex items-center gap-2 text-sm'>
            <span className='text-gray-700'>
              Page <span className='font-semibold'>{page}</span> of{' '}
              <span className='font-semibold'>{totalPages}</span>
            </span>
          </div>

          <Button
            variant='outline'
            size='default'
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className='gap-2'
          >
            Next
            <ChevronRight className='w-4 h-4' />
          </Button>
        </div>
      )}
    </>
  );
};

export default App;
