import Knife from "@/app/Models/Knife";
import {DataType} from "csstype";
import Attachment = DataType.Attachment;
import {CompletedSheath} from "@/app/Interfaces/CompletedSheath";

interface OrderItem {
  productId: string;
  orderId: number;
  quantity: number;
  product: Knife | Attachment | CompletedSheath;
}
