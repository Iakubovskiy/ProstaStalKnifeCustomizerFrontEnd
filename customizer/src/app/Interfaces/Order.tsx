import { ClientData } from "./../DTOs/ClientData";
interface Order {
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
