import React, { useState, useEffect } from "react";
import { useCanvasState } from "@/app/state/canvasState";
import { PriceCalculator } from "./PriceCalculator";
import { OrderButton } from "./OrderButton";
import EngravingPriceService from "@/app/services/EngravingPriceService";
import { useSnapshot } from "valtio";
import InitialDataService from "@/app/services/InitialDataService";
import Toast from "../../../Toast/Toast";
import { SheathColorPriceByType } from "@/app/Interfaces/SheathColorPriceByType";
import { KnifeDTO } from "@/app/DTOs/KnifeDTO";
import { EngravingDTO } from "@/app/DTOs/EngravingDTO";
import { AttachmentDTO } from "@/app/DTOs/AttachmentDTO";
import {
  CartItem,
  CustomKnifeCartItem,
  ExistingProductCartItem,
} from "@/app/Interfaces/CartItem";

interface Props {
  productId?: string | null; // ID для існуючого продукту
}

export const KnifePurchaseContainer: React.FC<Props> = ({ productId }) => {
  const [quantity, setQuantity] = useState(1);
  const state = useCanvasState();
  const snap = useSnapshot(state);
  const [totalPrice, setTotalPrice] = useState(0);
  const initialDataService = new InitialDataService();
  const [showToast, setShowToast] = useState(false);

  // Функція розрахунку ціни залишається майже без змін, бо вона працює зі станом
  const calculatePrice = async () => {
    let price = 0;

    // Ціна залежить від типу клинка
    const sheathPriceInfo = (
      snap.sheathColor?.prices as SheathColorPriceByType[]
    )?.find(
      (priceItem) =>
        priceItem.bladeShapeType?.id === snap.bladeShape.shapeType.id
    );
    if (sheathPriceInfo) {
      price += sheathPriceInfo.price;
    }
    if (snap.bladeShape) {
      price += snap.bladeShape.price;
    }
    if (snap.bladeCoatingColor) {
      price += snap.bladeCoatingColor.price;
    }
    if (snap.handleColor) {
      price += snap.handleColor.price;
    }

    if (snap.attachment) {
      price += snap.attachment.price;
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
    // Можливо, тут також треба показати сповіщення
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  const resetToDefaultSettings = async () => {
    try {
      const initialData = await initialDataService.getData();
      state.bladeShape = initialData.bladeShape;
      state.bladeCoatingColor = initialData.bladeCoatingColor;
      state.handleColor = initialData.handleColor;
      state.sheathColor = initialData.sheathColor;
      state.attachment = initialData.attachment;
      state.engravings = [];
    } catch (error) {
      console.error("Error resetting to default settings:", error);
    }
  };

  const handleAddToCart = async () => {
    let cartItem: CartItem;

    if (productId) {
      cartItem = {
        type: "existing_product",
        productId: productId,
        quantity: quantity,
      } as ExistingProductCartItem;
    } else {
      const knifeToCreate: KnifeDTO = {
        isActive: true,
        imageFileId: snap.bladeShape.bladeShapeImage.fileUrl,
        names: {
          ua: "Кастомний ніж",
          en: "Custom Knife",
        },
        titles: {},
        descriptions: {},
        metaTitles: {},
        metaDescriptions: {},
        tagsIds: [],
        shapeId: snap.bladeShape.id,
        bladeCoatingColorId: snap.bladeCoatingColor.id,
        handleId: snap.handleColor?.id ?? null,
        sheathId: snap.bladeShape.sheathModel?.id ?? null,
        sheathColorId: snap.sheathColor?.id ?? null,
        existingEngravingIds: [],
        newEngravings: snap.engravings
          ? ([...snap.engravings] as EngravingDTO[])
          : [],
        existingAttachmentIds: [],
        newAttachments: snap.attachment
          ? [
              {
                id: snap.attachment.id,
                name: snap.attachment.name,
                price: snap.attachment.price,
                isActive: true,
                imageFileId: snap.attachment.image?.fileUrl,
                modelFileId: snap.attachment.model?.fileUrl,
                typeId: snap.attachment.typeId,
              } as AttachmentDTO,
            ]
          : [],
      };

      cartItem = {
        type: "custom_knife",
        productData: knifeToCreate,
        quantity: quantity,
      } as CustomKnifeCartItem;
    }

    const existingCart: CartItem[] = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );
    localStorage.setItem("cart", JSON.stringify([...existingCart, cartItem]));

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

      <Toast
        message="Товар додано до кошика!"
        isVisible={showToast}
        onClose={handleCloseToast}
      />
    </div>
  );
};
