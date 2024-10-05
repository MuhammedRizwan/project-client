
export interface Itinerary {
    day: number;
    activity: string;
  }
  
  export interface PackageData {
    _id?: string;
    package_name: string;
    category_id?: string;  
    destinations: string[];
    original_price: number;
    offer_price: number;
    max_person: number;
    no_of_day: number;
    no_of_night: number;
    itineraries: Itinerary[];  
    is_block?: boolean;
  }
  
  export interface Package extends Document  {
    travel_agent_id?: string; 
    package_data: PackageData[];
  }
  