import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";

// Типовий продукт для демонстрації
const sampleProduct = {
  image_url: "/api/placeholder/300/200",
  name: "Професійний ніж шеф-кухаря",
  price: 1299,
  specs: {
    "Shoe thickness, mm": 2.5,
    "Blade length, mm": 210,
    "Blade width, mm": 45,
    "Total length, mm": 350,
    "Blade weight, gr.": 180,
    "Sharpening angle": "15°",
    "Rockwell hardness, units.": 58,
  },
};

export default function ProductCard({
  product = sampleProduct,
  onAddToCart = () => {},
  onBuyNow = () => {},
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Відображення ціни у форматі з пробілами (1 299 грн)
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleBuyNow = () => {
    // onBuyNow(product, quantity);
  };

  return (
    <div
      className={`w-64 bg-white rounded-lg shadow-md transition-all duration-300 ${
        isHovered ? "shadow-xl transform scale-105" : ""
      }`}
      style={{ maxHeight: isHovered ? "600px" : "430px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Основна частина картки */}
      <div>
        <div className="h-48 overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 truncate">
            {product.name}
          </h3>
          <p className="mt-1 text-xl font-bold text-gray-900">
            {formatPrice(product.price)} грн
          </p>

          {/* Кількість та кнопка купівлі */}
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

            <button
              onClick={handleBuyNow}
              className="w-full py-2 px-4 bg-orange-400 hover:bg-orange-500 text-white font-medium rounded transition-colors"
            >
              Buy now
            </button>
          </div>
        </div>
      </div>

      {/* Характеристики, що з'являються при наведенні */}
      <div
        className={`bg-white border-t border-gray-200 transition-all duration-300 ease-in-out overflow-hidden ${
          isHovered ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {product.specs && (
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
        )}
      </div>
    </div>
  );
}
