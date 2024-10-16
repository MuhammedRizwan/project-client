import  Agent  from "./agent";
import Package from "./package";
import  User  from "./user";

  
export default interface Booking {
    _id: string;
    user_id: string|User;
    travel_agent_id: string|Agent;
    package_id: string|Package;
    bill_details: {
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        address: string;
      };
    members: { name: string,age: number}[];
    payment_amount: number;
    payment_status: "pending" | "completed";
    booking_status: "pending" | "confirmed" | "cancelled";
    travel_status: "pending" | "in-progress" | "completed";
    start_date: string; // Use ISO string for date handling
    booking_date: string; // ISO string for booking timestamp
  }
  