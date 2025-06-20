import Knife from "@/app/Models/Knife";
import {DataType} from "csstype";
import Attachment = DataType.Attachment;
import {CompletedSheath} from "@/app/Interfaces/CompletedSheath";

export interface OrderItem {
  productId: string;
  orderId: string;
  quantity: number;
  product: Knife | Attachment | CompletedSheath;
}
