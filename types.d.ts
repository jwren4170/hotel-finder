declare interface RoomPhotos {
  failoverPhoto: string;
  hd_url: string;
  url: string;
}

declare interface RoomAmenity {
  amenitiesId: number;
  name: string;
  sort: number;
}

declare interface BedType {
  id: number;
  bedSize: string;
  bedType: string;
  quantity: number;
}

declare interface Room {
  id: number;
  bedTypes: BedType[];
  roomName: string;
  description?: string;
  maxOccupancy?: number;
  maxAdults?: number;
  maxChildren?: number;
  photos?: RoomPhotos[];
  roomAmenities?: RoomAmenity[];
  roomSizeSquare?: string;
  price?: number;
  currency?: string;
}

declare interface Hotel {
  address: string;
  chain: string;
  city: string;
  country: string;
  currency: string;
  deletedAt: null;
  facilityIds: number[];
  hotelDescription: string;
  hotelTypeId: number;
  id: string;
  latitude: number;
  longitude: number;
  main_photo: string;
  name: string;
  primaryHotelId: null;
  rating: number;
  reviewCount: number;
  rooms: Room[];
  stars: number;
  starRating: number;
  thumbnail: string;
  zip: string;
}

declare interface Price {
  amount: number;
  currency: string;
  source: string;
}

declare interface Rate {
  rateId: string;
  available: number;
  boardName: string;
  cancellationPolicies: any[];
  paymentMethods: any[];
}

declare interface RoomType {
  name: string;
  mappedRoomId?: number;
  rates: Rate[];
  suggestedSellingPrice: Price;
}

declare interface RatesData {
  hotelId: string;
  roomTypes: RoomType[];
}

declare interface RatesResponse {
  data: RatesData[];
}
