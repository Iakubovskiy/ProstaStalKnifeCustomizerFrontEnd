import React from 'react';

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
                                                     onAddToCart
                                                 }) => {
    return (
        <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
                <span className="text-xl">{price} ₴</span>
                <div className="flex items-center border rounded">
                    <button
                        onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                        className="px-3 py-1 border-r hover:bg-gray-100"
                    >
                        -
                    </button>
                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => onQuantityChange(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 text-center text-black"
                    />
                    <button
                        onClick={() => onQuantityChange(quantity + 1)}
                        className="px-3 py-1 border-l hover:bg-gray-100"
                    >
                        +
                    </button>
                </div>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={onAddToCart}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Додати
                </button>
                <button
                    onClick={onClearCart}
                    className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-black"
                >
                    Очистити кошик
                </button>
            </div>
        </div>
    );
};