export default interface CreateOrderDTO {
    number: string;
    total: number;
    products: string[];
    productQuantities: number[];
    deliveryTypeId: string;
    clientFullName: string;
    clientPhoneNumber: string;
    countryForDelivery: string;
    city: string;
    email: string;
    comment: string | null;
    status: string;
}