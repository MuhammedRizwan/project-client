import Package from "./package";

export default interface Offer {
    _id: string;
    agent_id?: string;
    offer_name: string;
    description: string;
    image: string|null|File;
    package_id: string[]|Package[];
    percentage: string; 
    max_offer: number;
    is_active: boolean;
    valid_from: Date|string;
    valid_upto: Date|string;
}