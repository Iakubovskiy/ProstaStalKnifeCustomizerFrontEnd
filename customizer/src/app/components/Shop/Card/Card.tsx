import { useState } from "react";
import { Minus, Plus } from "lucide-react";

interface ProductSpecs {
  Колір: string;
  Розмір: string;
}

interface ProductType {
  id: number;
  name: string;
  price: number;
  image_url: string;
  category: string;
  brand: string;
  specs: ProductSpecs;
}

interface ProductCardProps {
  product: ProductType;
  viewMode: string;
  onAddToCart?: (product: ProductType, quantity: number) => void;
  onBuyNow?: (product: ProductType, quantity: number) => void;
}

export default function ProductCard({
  product,
  viewMode,
  onAddToCart,
  onBuyNow,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("uk-UA").format(price);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleBuyNow = () => {
    onBuyNow?.(product, quantity);
  };

  const handleAddToCart = () => {
    onAddToCart?.(product, quantity);
  };

  return (
    <div
      className="relative w-64"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative bg-white rounded-lg shadow-md transition-transform duration-300 ${
          isHovered ? "scale-105 z-10 shadow-xl" : ""
        }`}
        style={{ transformOrigin: "center center" }}
      >
        {/* Основна частина картки */}
        <div>
          <div className="h-48 overflow-hidden rounded-t-lg">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "/fallback-image.jpg";
              }}
            />
          </div>

          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 truncate">
              {product.name}
            </h3>
            <p className="mt-1 text-xl font-bold text-gray-900">
              {formatPrice(product.price)} грн
            </p>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center border border-gray-300 rounded">
                  <button
                    onClick={decreaseQuantity}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-3 py-1 text-center min-w-8">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {onAddToCart && (
                <button
                  onClick={handleAddToCart}
                  className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded transition-colors"
                >
                  Додати до кошика
                </button>
              )}

              {onBuyNow && (
                <button
                  onClick={handleBuyNow}
                  className="w-full py-2 px-4 bg-orange-400 hover:bg-orange-500 text-white font-medium rounded transition-colors"
                >
                  Купити зараз
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Характеристики */}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <div
            className={`absolute left-0 top-full w-full bg-white border-t border-gray-200 transition-all duration-300 ease-in-out overflow-hidden rounded-b-lg shadow-md ${
              isHovered ? "opacity-100 max-h-72" : "opacity-0 max-h-0"
            }`}
          >
            <div className="p-4">
              <h4 className="text-lg font-medium mb-3 text-center text-gray-800 border-b border-gray-200 pb-2">
                Характеристики
              </h4>
              <div className="space-y-2">
                {Object.entries(product.specs).map(([key, value]) =>
                  value !== null && value !== undefined ? (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-gray-600">{key}:</span>
                      <span className="font-medium text-gray-800">{value}</span>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
