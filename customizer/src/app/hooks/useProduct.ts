import { createContext, useContext } from "react";
import type { Product } from "@/app/types/Product";

export interface ProductContextType {
  product: Product | null;
  isReviewAllowed: boolean;
  handleReviewSubmitted?: () => void;
}

export const ProductContext = createContext<ProductContextType | undefined>(
  undefined
);

export const useProduct = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
};
