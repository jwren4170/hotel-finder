const apiKey = import.meta.env.VITE_API_KEY;

export async function getHotelsList(
  country: string,
  city: string
): Promise<Hotel[]> {
  // URL-encode the id name to handle spaces and special characters

  const response = await fetch(
    `${
      import.meta.env.VITE_API_BASE_URL
    }/hotels?countryCode=${country}&cityName=${city}`,
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
export async function getHotelsDetails(id: string): Promise<Hotel> {
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
