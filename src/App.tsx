import { Link, useLoaderData } from '@tanstack/react-router';

const App = () => {
  const hotels = useLoaderData({ from: '/' });

  return (
    <div>
      <ul className='gap-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-4'>
        {hotels.map((hotel) => (
          <li key={hotel.id}>
            <Link to='/details/$hotelId' params={{ hotelId: hotel.id }}>
              <img src={`${hotel.thumbnail}`} alt='Hotel' />
              {hotel.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
