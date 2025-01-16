import Product from "../Models/Product";

export default interface CreateOrderDTO {
    number: string;
    total: number;
    products: Product[];
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