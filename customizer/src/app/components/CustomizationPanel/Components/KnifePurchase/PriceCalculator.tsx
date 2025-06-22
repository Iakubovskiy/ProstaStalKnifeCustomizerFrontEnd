import React from "react";
import {useTranslation} from "react-i18next";

interface Props {
  price: number;
  quantity: number;
  onQuantityChange: (value: number) => void;
  onClearCart: () => void;
  onAddToCart: () => void;
}

export const PriceCalculator: React.FC<Props> = ({
  price,
  quantity,
  onQuantityChange,
  onClearCart,
  onAddToCart,
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex gap-4 items-center">
      <div className="flex items-center gap-2">
        <span className="text-xl text-black">{price} ₴</span>
        <div className="flex items-center   rounded">
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) =>
              onQuantityChange(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="w-10 text-center text-black rounded"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onAddToCart}
          className="px-4 py-2 bg-warning text-white rounded"
        >
          {t("priceCalculator.add")}
        </button>
        <button
          onClick={onClearCart}
          className="px-4 py-2 bg-gray-700 rounded  text-white"
        >
          {t("priceCalculator.clearCart")}
        </button>
      </div>
    </div>
  );
};
