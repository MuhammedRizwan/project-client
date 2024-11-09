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
  booking_status:  "pending" | "confirmed" | "canceled";
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

export interface BookingData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  members: { name: string; age: number }[];
  discountCode: string;
  start_date: Date;
  payment_status: "pending"|"paid";
}
export interface RazorpayOptions {
  key: string;
  amount?: number;
  currency?: string;
  name?: string;
  description?: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}