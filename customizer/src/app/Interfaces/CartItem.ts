import { KnifeDTO } from "../DTOs/KnifeDTO";

export interface ExistingProductCartItem {
  type: "existing_product";
  productId: string;
  quantity: number;
  name: string;
  price: number;
}

export interface CustomKnifeCartItem {
  type: "custom_knife";
  productData: KnifeDTO;
  quantity: number;
  price: number;
}

export type CartItem = ExistingProductCartItem | CustomKnifeCartItem;
