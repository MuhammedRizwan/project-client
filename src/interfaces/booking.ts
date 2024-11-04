import Agent from "./agent";
import Package from "./package";
import User from "./user";

export default interface Booking {
  _id: string;
  user_id: string | User;
  travel_agent_id: string | Agent;
  package_id: string | Package;
  bill_details: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
  };
  members: { name: string; age: number }[];
  payment_amount: number;
  payment_status: "pending" | "paid" | "refunded";
  booking_status: "pending" | "confirmed" | "canceled" | "completed";
  travel_status: "pending" | "on-going" | "completed" | "canceled";
  start_date: string; // Use ISO string for date handling
  booking_date: string; // ISO string for booking timestamp
}


export interface BookingPaload {
  bill_details: {
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      address: string;
  };
  members: {
      name: string;
      age: string;
  }[];
  package_id: string;
  user_id: string | undefined;
  coupon_id: string | undefined;
  start_date: Date;
  payment_status: string;
}