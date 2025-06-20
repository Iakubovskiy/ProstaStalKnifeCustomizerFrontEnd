import { ClientData } from "./../DTOs/ClientData";
import {DeliveryType} from "@/app/Interfaces/DeliveryType";

export interface Order {
  id: string;
  number: number;
  total: number;
  delivery: DeliveryType;
  clientData: ClientData;
  comment: string;
  status: string;
  paymentMethod: PaymentMethod;
  orderItems: OrderItem[];
}
