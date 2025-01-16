import Product from "./Product";
import DeliveryType from "./DeliveryType";

export default interface Order {
  id: string;
  number: string;
  total: number;
  products: Product[];
  deliveryType: DeliveryType;
  clientFullName: string;
  clientPhoneNumber: string;
  countryForDelivery: string;
  city: string;
  email: string;
  comment: string | null;
  status: string;
}
