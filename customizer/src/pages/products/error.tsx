// /app/products/[productId]/error.tsx
"use client"; // Error components must be Client Components
import "../../styles/globals.css";
import { useEffect } from "react";
import Link from "next/link";

export default function ErrorProductDetail({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        background: "linear-gradient(to bottom, #f9f6f2, #f3eadf)",
        color: "#2d3748",
      }}
      className="min-h-screen flex flex-col items-center justify-center text-center px-4"
    >
      <h2 className="text-3xl font-semibold mb-4">Ой, щось пішло не так!</h2>
      <p className="mb-6 text-lg">Не вдалося завантажити деталі товару.</p>
      <p className="mb-6 text-sm text-gray-600">Помилка: {error.message}</p>
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
        <Link href="/products" passHref legacyBehavior>
          <a
            className="px-6 py-2 rounded-lg font-semibold transition-colors"
            style={{
              backgroundColor: "#FFFFFF",
              color: "#8b7258",
              border: "1px solid #8b7258",
            }}
          >
            До всіх товарів
          </a>
        </Link>
      </div>
    </div>
  );
}
