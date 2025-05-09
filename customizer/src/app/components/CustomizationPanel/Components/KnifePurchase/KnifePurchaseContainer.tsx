import React, { useState, useEffect } from "react";
import { useCanvasState } from "@/app/state/canvasState";
import { PriceCalculator } from "./PriceCalculator";
import { OrderButton } from "./OrderButton";
import EngravingPriceService from "@/app/services/EngravingPriceService";
import { useSnapshot } from "valtio";
import Engraving from "@/app/Models/Engraving";
import Knife from "@/app/Models/Knife";
import Product from "@/app/Models/Product";
import InitialDataService from "@/app/services/InitialDataService";
import Toast from "../../../Toast/Toast";

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
  const initialDataService = new InitialDataService();
  const [showToast, setShowToast] = useState(false);

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

  const handleCloseToast = () => {
    setShowToast(false);
  };

  const resetToDefaultSettings = async () => {
    try {
      const initialData = await initialDataService.getData();
      // Reset to default settings
      state.bladeShape = {
        ...state.bladeShape,
        id: initialData.bladeShape.id,
        name: initialData.bladeShape.name,
        price: initialData.bladeShape.price,
        totalLength: initialData.bladeShape.totalLength,
        bladeLength: initialData.bladeShape.bladeLength,
        bladeWidth: initialData.bladeShape.bladeWidth,
        bladeWeight: initialData.bladeShape.bladeWeight,
        sharpeningAngle: initialData.bladeShape.sharpeningAngle,
        rockwellHardnessUnits: initialData.bladeShape.rockwellHardnessUnits,
        bladeShapeModelUrl: initialData.bladeShape.bladeShapeModelUrl,
        sheathModelUrl: initialData.bladeShape.sheathModelUrl,
      };
      state.bladeCoatingColor = initialData.bladeCoatingColor;
      state.handleColor = initialData.handleColor;
      state.sheathColor = initialData.sheathColor;

      // Clear engravings
      state.engravings = [];
    } catch (error) {
      console.error("Error resetting to default settings:", error);
    }
  };

  const handleAddToCart = async () => {
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
      console.log("Product in order:", product);
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

    // Показуємо toast-сповіщення
    setShowToast(true);

    await resetToDefaultSettings();
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

      {/* Toast component */}
      <Toast
        message="Ніж додано до кошика!"
        isVisible={showToast}
        onClose={handleCloseToast}
      />
    </div>
  );
};
