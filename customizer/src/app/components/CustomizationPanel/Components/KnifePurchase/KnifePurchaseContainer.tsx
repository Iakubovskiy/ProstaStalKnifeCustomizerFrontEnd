import React, { useState, useEffect } from "react";
import { useCanvasState } from "@/app/state/canvasState";
import { PriceCalculator } from "./PriceCalculator";
import { OrderButton } from "./OrderButton";
import EngravingPriceService from "@/app/services/EngravingPriceService";
import { useSnapshot } from "valtio";
import Fastening from "@/app/Models/Fastening";
import Engraving from "@/app/Models/Engraving";

export const KnifePurchaseContainer: React.FC = () => {
  const [quantity, setQuantity] = useState(1);
  const state = useCanvasState();
  const snap = useSnapshot(state);
  const [totalPrice, setTotalPrice] = useState(0);

  const calculatePrice = async () => {
    let price = snap.bladeShape.price + (snap.sheathColor?.price || 0);

    if (snap.fastening) {
      price += snap.fastening.price;
    }

    if (snap.engravings && snap.engravings.length > 0) {
      const engravingService = new EngravingPriceService();
      const prices = await engravingService.getAll();
      if (prices.length > 0) {
        const uniqueSides = new Set(snap.engravings.map((eng) => eng.side))
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
    const knife = {
      id: 0,
      shape: snap.bladeShape,
      bladeCoatingColor: snap.bladeCoatingColor,
      handleColor: snap.handleColor,
      sheathColor: snap.sheathColor,
      fastening: snap.fastening,
      engravings: snap.engravings,
      quantity: quantity,
    };

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    console.log("existingCart = ", existingCart);
    localStorage.setItem("cart", JSON.stringify([...existingCart, knife]));
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
      {/* <OrderButton
        currentKnife={{
          id: "0",
          shape: snap.bladeShape,
          bladeCoatingColor: snap.bladeCoatingColor,
          handleColor: snap.handleColor,
          sheathColor: snap.sheathColor,
          engravings: snap.engravings as Engraving[],
        }} 
      /> */}
    </div>
  );
};
