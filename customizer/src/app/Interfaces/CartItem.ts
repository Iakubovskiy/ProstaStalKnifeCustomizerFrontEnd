import { KnifeDTO } from "../DTOs/KnifeDTO";

export interface ExistingProductCartItem {
  type: "existing_product";
  productId: string;
  quantity: number;
}

export interface CustomKnifeCartItem {
  type: "custom_knife";
  productData: KnifeDTO;
  quantity: number;
}

export type CartItem = ExistingProductCartItem | CustomKnifeCartItem;
