import React, { useState, useEffect } from "react";
import { useCanvasState } from "@/app/state/canvasState";
import { PriceCalculator } from "./PriceCalculator";
import { OrderButton } from "./OrderButton";
import EngravingPriceService from "@/app/services/EngravingPriceService";
import { useSnapshot } from "valtio";
import Engraving from "@/app/Models/Engraving";
import Knife from "@/app/Models/Knife";
import Product from "@/app/Models/Product";

interface Props {
  productId?: string | null;
}

interface ProductInOrder {
  product: Product;
  quantity: number;
}

export const KnifePurchaseContainer: React.FC<Props> = ({ productId }) => {
  const [quantity, setQuantity] = useState(1);
  const state = useCanvasState();
  const snap = useSnapshot(state);
  const [totalPrice, setTotalPrice] = useState(0);

  const calculatePrice = async () => {
    let price = snap.bladeShape.price + (snap.sheathColor?.price || 0);

    if (snap.fastening) {
      price += snap.fastening.price;
    }
    if (state.engravings && state.engravings.length > 0) {
      const engravingService = new EngravingPriceService();
      const prices = await engravingService.getAll();
      if (prices.length > 0) {
        const uniqueSides = new Set(state.engravings.map((eng) => eng.side))
          .size;
        price += uniqueSides * prices[0].price;
      }
    }

    setTotalPrice(price * quantity);
  };

  useEffect(() => {
    calculatePrice();
  }, [snap, quantity]);

  const handleClearCart = () => {
    localStorage.removeItem("cart");
  };

  const handleAddToCart = () => {
    let productInOrder: ProductInOrder;
    if (productId != null) {
      const product: Product = {
        id: productId,
        isActive: true,
      };
      productInOrder = {
        product,
        quantity,
      };
    } else {
      const product: Knife = {
        id: "0",
        shape: snap.bladeShape,
        bladeCoatingColor: snap.bladeCoatingColor,
        handleColor: snap.handleColor,
        sheathColor: snap.sheathColor,
        fastening: snap.fastening,
        engravings: state.engravings as Engraving[],
        isActive: false,
      };
      productInOrder = {
        product,
        quantity,
      };
    }

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    localStorage.setItem(
      "cart",
      JSON.stringify([...existingCart, productInOrder])
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <PriceCalculator
        price={totalPrice}
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClearCart={handleClearCart}
        onAddToCart={handleAddToCart}
      />
      <OrderButton />
    </div>
  );
};
