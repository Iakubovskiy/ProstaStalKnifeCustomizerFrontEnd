import React from "react";

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
          Додати
        </button>
        <button
          onClick={onClearCart}
          className="px-4 py-2 bg-gray-700 rounded  text-white"
        >
          Очистити кошик
        </button>
      </div>
    </div>
  );
};
