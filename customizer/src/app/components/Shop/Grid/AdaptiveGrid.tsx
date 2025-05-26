import { useState, useEffect } from "react";
import ProductCard from "../Card/Card";

// Визначення типів для TypeScript
type ProductSpecs = Record<string, any>;

interface ProductType {
  id?: number | string;
  image_url: string;
  name: string;
  price: number;
  specs?: ProductSpecs;
}

interface AdaptiveGridProps {
  products: ProductType[];
  title?: string;
}

export default function AdaptiveGrid({
  products = [],
  title = "Наші товари",
}: AdaptiveGridProps) {
  // Визначаємо поточний розмір екрану
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  // Стежимо за зміною розміру вікна
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Додаємо слухач подій
    window.addEventListener("resize", handleResize);

    // Викликаємо один раз при монтуванні, щоб встановити початкове значення
    handleResize();

    // Очищаємо слухач при демонтажі компонента
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Обробники подій для карток
  const handleAddToCart = (product: ProductType, quantity: number) => {
    console.log("Added to cart:", product, "Quantity:", quantity);
    // Логіка додавання до кошика
  };

  const handleBuyNow = (product: ProductType, quantity: number) => {
    console.log("Buy now:", product, "Quantity:", quantity);
    // Логіка швидкої покупки
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Заголовок секції */}
      {title && (
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {title}
        </h2>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6 justify-items-center">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div
              key={product.id || index}
              className="w-full flex justify-center"
            >
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            Товари не знайдено
          </div>
        )}
      </div>
    </div>
  );
}
