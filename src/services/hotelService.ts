const apiKey = import.meta.env.VITE_API_KEY;

export async function getHotelsByCity(
  country: string,
  city: string
): Promise<Hotel[]> {
  // URL-encode the city name to handle spaces and special characters
  const encodedCity = encodeURIComponent(city);

  const response = await fetch(
    `${
      import.meta.env.VITE_API_BASE_URL
    }/hotels?countryCode=${country}&cityName=${encodedCity}`,
    {
      method: 'GET',
      headers: {
        'X-API-Key': apiKey,
      },
    }
  );

  if (!response.ok) {
    // Try to parse the error response from the API for a better message
    const errorData = await response.json().catch(() => null);
    const errorMessage =
      errorData?.error?.message || `HTTP error! Status: ${response.status}`;
    throw new Error(errorMessage);
  }
  // 1. Await the promise from response.json()
  const result = await response.json();
  console.log(result.data);
  // 2. Return the details of single hotel
  return result.data || [];
}

// Get/id
export async function getHotelDetails(id: string): Promise<Hotel> {
  // URL-encode the city name to handle spaces and special characters
  const encodedId = encodeURIComponent(id);

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/hotel?hotelId=${encodedId}`,
    {
      method: 'GET',
      headers: {
        'X-API-Key': apiKey,
      },
    }
  );

  if (!response.ok) {
    // Try to parse the error response from the API for a better message
    const errorData = await response.json().catch(() => null);
    const errorMessage =
      errorData?.error?.message || `HTTP error! Status: ${response.status}`;
    throw new Error(errorMessage);
  }
  // 1. Await the promise from response.json()
  const result = await response.json();
  console.log(result.data);
  // 2. Return the nested single hotels
  return result.data || '';
}

export async function getRoomRates(
  hotelId: string,
  checkinDate: string,
  checkoutDate: string,
  occupancies: { adults: number; childrenAges: number[] }[] | undefined
) {
  const response = await fetch(`https://api.liteapi.travel/v3.0/hotels/rates`, {
    method: 'POST',
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      hotelIds: [hotelId],
      checkin: checkinDate,
      checkout: checkoutDate,
      occupancies: occupancies,
      currency: 'USD',
      guestNationality: 'US',
      mappedRoomId: true, // Enable room mapping to get detailed room information
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage =
      errorData?.error?.message || `HTTP error! Status: ${response.status}`;
    throw new Error(errorMessage);
  }

  const data = await response.json();

  // Return the full data object which contains both rates and room details
  return data;
}
