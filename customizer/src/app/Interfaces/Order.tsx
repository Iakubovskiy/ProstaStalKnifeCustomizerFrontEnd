import {DeliveryType} from "@/app/Interfaces/DeliveryType";
import {PaymentMethod} from "@/app/Interfaces/PaymentMethod";
import {OrderItem} from "@/app/Interfaces/OrderItem";

export interface Order {
  id: string;
  number: number;
  total: number;
  delivery: DeliveryType;
  clientFullName: string;
  clientPhoneNumber: string;
  countryForDelivery: string;
  city: string;
  address: string;
  zipCode: string | null;
  email: string;
  comment: string;
  status: string;
  paymentMethod: PaymentMethod;
  orderItems: OrderItem[];
}
