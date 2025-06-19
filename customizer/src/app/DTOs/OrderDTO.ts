import { ClientData } from "./ClientData";
import { OrderItemDTO } from "./OrderItemDTO";

export interface OrderDTO {
  id?: string;
  orderItems?: OrderItemDTO[] | null;
  total: number;
  deliveryTypeId: string;
  clientData: ClientData;
  comment?: string | null;
  status?: string | null;
  paymentMethodId: string;
}
