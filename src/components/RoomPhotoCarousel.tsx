import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Photo {
  url: string;
}

interface RoomPhotoCarouselProps {
  photos: Photo[];
  roomName: string;
}

export default function RoomPhotoCarousel({
  photos,
  roomName,
}: RoomPhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!photos || photos.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className='relative mb-8'>
      {/* Main Image */}
      <div className='relative bg-gray-200 rounded-xl overflow-hidden'>
        <img
          src={photos[currentIndex].url}
          alt={`${roomName} - Photo ${currentIndex + 1}`}
          className='w-full h-[400px] md:h-[500px] object-cover'
        />

        {/* Navigation Arrows - Only show if more than 1 photo */}
        {photos.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className='top-1/2 left-4 absolute flex justify-center items-center bg-primary/90 hover:bg-primary/70 shadow-lg rounded-full w-10 h-10 text-primary-foreground transition-colors -translate-y-1/2'
              aria-label='Previous photo'
            >
              <ChevronLeft className='w-6 h-6' />
            </button>

            <button
              onClick={goToNext}
              className='top-1/2 right-4 absolute flex justify-center items-center bg-primary/90 hover:bg-primary/70 shadow-lg rounded-full w-10 h-10 text-primary-foreground transition-colors -translate-y-1/2'
              aria-label='Next photo'
            >
              <ChevronRight className='w-6 h-6' />
            </button>

            {/* Photo Counter */}
            <div className='right-4 bottom-4 absolute bg-black/70 px-3 py-1 rounded-full text-white text-sm'>
              {currentIndex + 1} / {photos.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail Navigation - Only show if more than 1 photo */}
      {photos.length > 1 && (
        <div className='gap-2 grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 mt-4'>
          {photos.map((photo, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-blue-600 ring-2 ring-blue-600 ring-offset-2'
                  : 'border-transparent hover:border-gray-300'
              }`}
              aria-label={`Go to photo ${index + 1}`}
            >
              <img
                src={photo.url}
                alt={`${roomName} thumbnail ${index + 1}`}
                className='w-full h-16 md:h-20 object-cover'
              />
            </button>
          ))}
        </div>
      )}

      {/* Dot Indicators - Alternative for mobile */}
      {photos.length > 1 && photos.length <= 5 && (
        <div className='md:hidden flex justify-center items-center gap-2 mt-4'>
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-blue-600 w-6'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to photo ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
