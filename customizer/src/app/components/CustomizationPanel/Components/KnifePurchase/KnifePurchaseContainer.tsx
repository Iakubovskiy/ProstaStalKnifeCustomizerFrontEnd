import React, { useState, useEffect, useCallback } from "react";
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
import FileService from "@/app/services/FileService";
import { AppFile } from "@/app/Interfaces/File";
import { Attachment } from "./../../../../Interfaces/Attachment";

interface Props {
  productId?: string | null;
}

export const KnifePurchaseContainer: React.FC<Props> = ({ productId }) => {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const state = useCanvasState();
  const snap = useSnapshot(state);
  const fileService = new FileService();

  const [totalPrice, setTotalPrice] = useState(0);
  const initialDataService = new InitialDataService();
  const [showToast, setShowToast] = useState(false);
  const {
    sheathColor,
    bladeShape,
    bladeCoatingColor,
    handleColor,
    attachment,
    engravings,
  } = snap;
  const calculateSingleItemPrice = useCallback(async (): Promise<number> => {
    let price = 0;

    price += snap.bladeShape?.price || 0;
    price += snap.bladeCoatingColor?.price || 0;
    price += snap.handleColor?.price || 0;
    price += snap.attachment?.price || 0;

    const sheathPriceInfo = (
      snap.sheathColor?.prices as SheathColorPriceByType[]
    )?.find(
      (priceItem) =>
        priceItem.bladeShapeType?.id === snap.bladeShape.shapeType.id
    );
    price += sheathPriceInfo?.price || 0;

    if (engravings && engravings.length > 0) {
      const engravingService = new EngravingPriceService();
      try {
        const engravingPriceData = await engravingService.get();

        if (
          engravingPriceData &&
          typeof engravingPriceData.price === "number"
        ) {
          const uniqueSides = new Set(engravings.map((eng) => eng.side)).size;
          price += uniqueSides * engravingPriceData.price;
        }
      } catch (e) {
        console.error("Could not get engraving price", e);
      }
    }

    return price;
  }, [
    sheathColor,
    bladeShape,
    bladeCoatingColor,
    handleColor,
    attachment,
    engravings,
  ]);

  const updateDisplayPrice = useCallback(async () => {
    const singlePrice = await calculateSingleItemPrice();
    setTotalPrice(singlePrice * quantity);
  }, [quantity, calculateSingleItemPrice]);

  useEffect(() => {
    updateDisplayPrice();
  }, [updateDisplayPrice]); // useEffect тепер залежить від useCallback-функції

  const handleClearCart = () => {
    localStorage.removeItem("cart");
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };
  const resetToDefaultSettings = async () => {
    try {
      const initialData = await initialDataService.getData();
      state.attachment = initialData.knifeForCanvas.attachments || null;
      state.bladeShape = initialData.knifeForCanvas.bladeShape;
      state.bladeCoatingColor = initialData.knifeForCanvas.bladeCoatingColor;
      state.handleColor = initialData.knifeForCanvas.handleColor;
      state.sheathColor = initialData.knifeForCanvas.sheathColor;
      state.engravings = [];
    } catch (error) {
      console.error("Error resetting to default settings:", error);
    }
  };

  const handleAddToCart = async () => {
    if (isLoading) return;
    setIsLoading(true);
    console.log(snap);
    try {
      let cartItem: CartItem;

      // Визначаємо ціну за ОДНУ одиницю товару
      const pricePerUnit = await calculateSingleItemPrice();
      if (productId) {
        cartItem = {
          type: "existing_product",
          name: state.bladeShape.name,
          price: pricePerUnit,
          productId: productId,
          quantity: quantity,
        };
      } else {
        const processedEngravings: EngravingDTO[] = [];
        const engravingsToProcess = [...snap.engravings];

        for (const engraving of engravingsToProcess) {
          let pictureId: string | null = null;

          const uploadable = engraving.fileObject;
          if (uploadable) {
            try {
              console.log("Engraving file to upload:", uploadable);
              const uploadedFile: AppFile = await fileService.upload(
                uploadable
              );
              console.log("Uploaded engraving file:", uploadedFile);
              pictureId = uploadedFile.id;
            } catch (error) {
              console.error("Failed to upload engraving file:", error);
              alert(
                "Не вдалося завантажити файл гравіювання. Спробуйте ще раз."
              );
              throw error;
            }
          }

          processedEngravings.push({
            pictureId: pictureId,
            side: engraving.side,
            text: engraving.text,
            font: engraving.font,
            locationX: engraving.locationX,
            locationY: engraving.locationY,
            locationZ: engraving.locationZ,
            rotationX: engraving.rotationX,
            rotationY: engraving.rotationY,
            rotationZ: engraving.rotationZ,
            scaleX: engraving.scaleX,
            scaleY: engraving.scaleY,
            scaleZ: engraving.scaleZ,
          });
        }

        let processedAttachments: string[] = [];
        if (snap.attachment) {
          processedAttachments.push(snap.attachment.id);
        }

        const knifeToCreate: KnifeDTO = {
          isActive: true,
          imageFileId: state.bladeShape.bladeShapeImage?.id || "",
          names: { ua: "Кастомний ніж", en: "Custom Knife" },
          shapeId: state.bladeShape.id,
          bladeCoatingColorId: state.bladeCoatingColor.id,
          handleId: state.handleColor?.id ?? null,
          sheathId: state.bladeShape.sheathId,
          sheathColorId: state.sheathColor?.id ?? null,
          newEngravings: processedEngravings,
          titles: {},
          descriptions: {},
          metaTitles: {},
          metaDescriptions: {},
          tagsIds: [],
          existingEngravingIds: [],
          existingAttachmentIds: processedAttachments,
        };
        cartItem = {
          type: "custom_knife",
          price: pricePerUnit,
          productData: knifeToCreate,
          quantity: quantity,
        };
      }

      const existingCart: CartItem[] = JSON.parse(
        localStorage.getItem("cart") || "[]"
      );
      localStorage.setItem("cart", JSON.stringify([...existingCart, cartItem]));

      setShowToast(true);
      await resetToDefaultSettings();
    } catch (error) {
      console.error("Could not add item to cart:", error);
    } finally {
      setIsLoading(false);
    }
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
