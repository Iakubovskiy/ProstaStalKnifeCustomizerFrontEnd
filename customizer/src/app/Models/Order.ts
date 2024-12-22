import Knife from "./Knife";
import DeliveryType from "./DeliveryType";
import OrderStatuses from "./OrderStatuses";

export default interface Order {
  id: number;
  number: string;
  total: number;
  knifes: Knife[];
  delivery: DeliveryType;
  clientFullName: string;
  clientPhoneNumber: string;
  countryForDelivery: string;
  city: string;
  email: string;
  comment: string | null;
  status: OrderStatuses;
}
