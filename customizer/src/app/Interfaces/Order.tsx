// /app/Interfaces/Order.ts

import { DeliveryType } from "@/app/Interfaces/DeliveryType";
import { PaymentMethod } from "@/app/Interfaces/PaymentMethod";
// Припускаємо, що ці інтерфейси існують
import { Knife } from "@/app/Interfaces/Knife/Knife";
import { Attachment } from "@/app/Interfaces/Attachment";
import { CompletedSheath } from "@/app/Interfaces/CompletedSheath";
import { OrderItem } from "./OrderItem";

export interface BaseProduct {
  id: string;
  name: string;
  price: number;
  productType: "Knife" | "Attachment" | "CompletedSheath";
}

export type OrderItemProduct = (Knife | Attachment | CompletedSheath) &
  BaseProduct;

export interface Order {
  id: string;
  number: number;
  total: number;
  deliveryType: DeliveryType;
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
