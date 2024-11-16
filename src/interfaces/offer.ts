export default interface Offer {
    _id: string;
    package_id: string;
    description: string;
    percentage: string;
    min_amount: string;
    max_amount: string;
    valid_upto: Date;
    is_active: boolean;
}