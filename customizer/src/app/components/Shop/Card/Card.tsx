import { useState } from "react";
import { Minus, Plus } from "lucide-react";

export interface ProductSpecs {
  bladeLength: number;
  bladeWidth: number;
  bladeWeight: number;
  totalLength: number;
  sharpnessAngle: number;
  hardnessRockwell: number;
}

export interface ProductType {
  id: number;
  name: string;
  category: string;
  price: number;
  color: string;
  image_url: string;
  specs?: ProductSpecs;
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

  // Функція для перекладу характеристик
  const translateSpec = (key: string) => {
    const translations: Record<string, string> = {
      bladeLength: "Довжина леза",
      bladeWidth: "Ширина леза",
      bladeWeight: "Вага",
      totalLength: "Загальна довжина",
      sharpnessAngle: "Кут заточки",
      hardnessRockwell: "Твердість HRC",
    };
    return translations[key] || key;
  };

  // Функція для форматування значень
  const formatSpecValue = (key: string, value: number) => {
    const units: Record<string, string> = {
      bladeLength: "см",
      bladeWidth: "см",
      bladeWeight: "г",
      totalLength: "см",
      sharpnessAngle: "°",
      hardnessRockwell: "HRC",
    };
    return `${value}${units[key] || ""}`;
  };

  return (
    <div
      className="relative w-56"
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
          <div className="h-40 overflow-hidden rounded-t-lg">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "/fallback-image.png";
              }}
            />
          </div>

          <div className="p-3">
            {/* Назва з tooltip */}
            <div className="relative group">
              <h3
                className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight cursor-help"
                title={product.name}
              >
                {product.name}
              </h3>

              {/* Tooltip для повної назви */}
              {product.name.length > 30 && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 whitespace-nowrap max-w-xs">
                  {product.name}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                </div>
              )}
            </div>

            <p className="mt-2 text-lg font-bold text-gray-900">
              {formatPrice(product.price)} грн
            </p>

            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center border border-gray-300 rounded text-sm">
                  <button
                    onClick={decreaseQuantity}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-2 py-1 text-center min-w-6">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {onAddToCart && (
                <button
                  onClick={handleAddToCart}
                  className="w-full py-2 px-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded transition-colors text-sm"
                >
                  Додати до кошика
                </button>
              )}

              {onBuyNow && (
                <button
                  onClick={handleBuyNow}
                  className="w-full py-2 px-3 bg-orange-400 hover:bg-orange-500 text-white font-medium rounded transition-colors text-sm"
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
            <div className="p-3">
              <h4 className="text-sm font-medium mb-2 text-center text-gray-800 border-b border-gray-200 pb-1">
                Характеристики
              </h4>
              <div className="space-y-1">
                {Object.entries(product.specs).map(([key, value]) =>
                  value !== null && value !== undefined ? (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-gray-600">
                        {translateSpec(key)}:
                      </span>
                      <span className="font-medium text-gray-800">
                        {formatSpecValue(key, value)}
                      </span>
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
