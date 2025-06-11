// /app/products/[productId]/loading.tsx
import "../../styles/globals.css";

export default function LoadingProductDetail() {
  return (
    <div
      style={{
        background: "linear-gradient(to bottom, #f9f6f2, #f3eadf)",
        color: "#2d3748",
      }}
      className="min-h-screen animate-pulse"
    >
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="flex flex-col md:flex-row -mx-4">
          {/* Image Placeholder */}
          <div className="w-full md:w-1/2 lg:w-2/5 p-4">
            <div className="aspect-square bg-gray-300 rounded-lg"></div>
          </div>
          {/* Info Placeholder */}
          <div className="md:w-1/2 lg:w-3/5 p-4 flex flex-col">
            <div className="h-10 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-6 bg-gray-300 rounded w-5/6 mb-2"></div>
            <div className="h-6 bg-gray-300 rounded w-full mb-4"></div>
            <div className="h-12 bg-gray-400 rounded w-1/3 mb-6"></div>
            <div className="h-12 bg-gray-400 rounded w-full md:w-auto px-8 py-3"></div>
          </div>
        </div>
        {/* Specs Placeholder */}
        <div className="w-full mt-8 p-6 rounded-lg bg-white">
          <div className="h-8 bg-gray-300 rounded w-1/2 mb-6"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-5 bg-gray-300 rounded w-1/3"></div>
                <div className="h-5 bg-gray-300 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
