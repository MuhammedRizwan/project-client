
export interface Activity {
  time: string;
  activity: string;
}

export interface Itinerary {
  day: number;
  activities: Activity[];
}


export default interface Package  {
  _id?: string;
  travel_agent_id?: string;
  package_name: string;
  category_id?: string;
  destinations: string[];
  original_price: number;
  offer_price: number;
  max_person: number;
  no_of_days: number;
  no_of_nights: number;
  itineraries: Itinerary[];
  is_block?: boolean;
  images: string[];
  includedItems: string[];
  excludedItems: string[];
  description: string;
  departure_place:string
}



export interface PackageFormValues {
  package_name: string;
  category_id: string;
  max_person: number;
  no_of_days: number;
  no_of_nights: number;
  destinations: string[];
  original_price: number;
  itineraries: {
    day: number;
    activities: { time: string; activity: string }[];
  }[];
  includedItems: string[];
  excludedItems: string[];
  description: string;
  departure_place: string;
  images: File[];
}


