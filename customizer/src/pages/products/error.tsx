// /app/products/error.tsx
"use client";
import "../../styles/globals.css";
import { useEffect } from "react";
import Link from "next/link";

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  // Безпечне отримання повідомлення про помилку
  const errorMessage = error?.message || "Невідома помилка";

  return (
    <div
      style={{
        background: "linear-gradient(to bottom, #f9f6f2, #f3eadf)",
        color: "#2d3748",
      }}
      className="min-h-screen flex flex-col items-center justify-center text-center px-4"
    >
      <h2 className="text-3xl font-semibold mb-4">Ой, щось пішло не так!</h2>
      <p className="mb-6 text-lg">Не вдалося завантажити сторінку товарів.</p>
      <p className="mb-6 text-sm text-gray-600">Помилка: {errorMessage}</p>
      <div className="flex space-x-4">
        <button
          onClick={() => reset()}
          className="px-6 py-2 rounded-lg font-semibold transition-colors"
          style={{ backgroundColor: "#8b7258", color: "#f9f6f2" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#b8845f")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#8b7258")
          }
        >
          Спробувати ще раз
        </button>
        <Link href="/" passHref legacyBehavior>
          <a
            className="px-6 py-2 rounded-lg font-semibold transition-colors"
            style={{
              backgroundColor: "#FFFFFF",
              color: "#8b7258",
              border: "1px solid #8b7258",
            }}
          >
            На головну
          </a>
        </Link>
      </div>
    </div>
  );
}
