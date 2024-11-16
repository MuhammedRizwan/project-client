import Package from "./package";
import User from "./user";

export default interface Review {
  _id: string;
  user_id: string|User;
  package_id: string|Package;
  rating: number;
  feedback: string;
}
