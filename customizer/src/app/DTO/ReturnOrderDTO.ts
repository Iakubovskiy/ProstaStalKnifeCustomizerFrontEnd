import ProductsInOrderDTO from "./ReturnProductsInOrderDTO";
import DeliveryType from "../Models/DeliveryType";

export default interface ReturnOrderDTO{
    id: string;
    number: string;
    total: number;
    products: ProductsInOrderDTO[];
    deliveryType: DeliveryType;
    clientFullName: string;
    clientPhoneNumber: string;
    countryForDelivery: string;
    city: string;
    email: string;
    comment: string | null;
    status: string;
}