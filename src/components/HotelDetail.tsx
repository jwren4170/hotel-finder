import { useLoaderData } from '@tanstack/react-router';

const HotelDetail = () => {
  // const hotelId = useParams({ from: '/details/$hotelId' });
  const hotel = useLoaderData({ from: '/details/$hotelId' });

  if (!hotel) {
    return <div className='p-4'>Hotel not found.</div>;
  }

  return (
    <div className='p-4'>
      <h1 className='mb-4 font-bold text-2xl'>{hotel.name}</h1>
      <img src={hotel.thumbnail} alt={hotel.name} className='mb-4 rounded-lg' />
      <p>
        <strong>ID:</strong> {hotel.id}
      </p>
    </div>
  );
};

export default HotelDetail;
