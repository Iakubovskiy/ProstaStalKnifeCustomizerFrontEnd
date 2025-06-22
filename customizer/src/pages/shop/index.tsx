"use client";

import Card, { ProductType } from "@/app/components/Shop/Card/Card";
import FilterPanel from "@/app/components/Shop/Filter/FiltersPanel";
import type { FilterItem } from "@/app/components/Shop/Filter/FiltersPanel";
import SearchBar from "@/app/components/Shop/SearchBar.tsx/SearchBar";
import SortDropdown from "@/app/components/Shop/Sort/Sort";
import { Pagination } from "@nextui-org/react";
import { Filter, Grid, List, X, LoaderCircle } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ProductCatalogService from "@/app/services/ProductCatalogService"; // Припускаємо, що сервіс лежить тут
import type { ProductFilters } from "@/app/DTOs/ProductFilters";

// --- НОВІ ІНТЕРФЕЙСИ, ЩО ВІДПОВІДАЮТЬ РЕАЛЬНОМУ API ---

// Описує один продукт з масиву `items`
interface ApiProduct {
  id: string;
  name: string;
  image: {
    id: string;
    fileUrl: string;
  };
  price: number;
  characteristics: {
    totalLength: number;
    bladeLength: number;
    bladeWidth: number;
    bladeWeight: number;
    sharpeningAngle: number;
    rockwellHardnessUnits: number;
  } | null;
  isActive: boolean;
}

// Описує блок з пагінацією продуктів
interface PaginatedProducts {
  items: ApiProduct[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Описує один з фільтрів, що приходять з API
interface ApiFilterOption {
  name: string; // Наприклад, 'bladeLength'
  data?: string[]; // Для select/checkbox
  min?: number; // Для range
  max?: number; // Для range
}

// Описує повну відповідь від API
interface ApiCatalogResponse {
  filters: Record<string, ApiFilterOption>;
  products: PaginatedProducts;
}

// Допоміжна функція для перетворення продукту з API у тип, який очікує Card
const mapApiProductToProductType = (product: ApiProduct): ProductType => {
  const isKnife = !!product.characteristics;

  const baseProduct: ProductType = {
    id: product.id,
    name: product.name,
    category: isKnife ? "Ніж" : "Доповнення",
    price: product.price || 0,
    image_url: product.image?.fileUrl || "/fallback-image.png",
    color: "", // В API відповіді немає поля для кольору, залишаємо пустим
    specs: undefined,
  };

  if (isKnife && product.characteristics) {
    baseProduct.specs = {
      bladeLength: product.characteristics.bladeLength,
      bladeWidth: product.characteristics.bladeWidth,
      bladeWeight: product.characteristics.bladeWeight,
      totalLength: product.characteristics.totalLength,
      sharpnessAngle: product.characteristics.sharpeningAngle,
      hardnessRockwell: product.characteristics.rockwellHardnessUnits,
    };
  }

  return baseProduct;
};

// Допоміжна функція для перетворення фільтрів з API у формат для FilterPanel
const transformApiFilters = (
  apiFilters: Record<string, ApiFilterOption>,
  t: (key: string) => string
): FilterItem[] => {
  const filterNameMap: Record<string, string> = {
    style: t("shopPage.filters.style"),
    bladeLength: t("shopPage.filters.bladeLength"),
    totalLength: t("shopPage.filters.totalLength"),
    bladeWidth: t("shopPage.filters.bladeWidth"),
    bladeWeight: t("shopPage.filters.weight"),
    colors: t("shopPage.filters.color"),
    prices: t("shopPage.filters.price"),
  };

  return Object.values(apiFilters)
    .map((filter) => {
      const displayName = filterNameMap[filter.name] || filter.name;
      if (filter.data) {
        // Унікалізуємо дані, бо в прикладі є дублікати
        return { name: displayName, data: [...new Set(filter.data)] };
      }
      if (filter.min !== undefined && filter.max !== undefined) {
        return { name: displayName, min: filter.min, max: filter.max };
      }
      return null;
    })
    .filter((f): f is FilterItem => f !== null);
};

const ShopPage: React.FC = () => {
  const { t } = useTranslation();
  const productCatalogService = useMemo(() => new ProductCatalogService(), []);

  // State
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [availableFilters, setAvailableFilters] = useState<FilterItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name-asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const itemsPerPage = 20;

  // Data fetching effect
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      const apiFilters: ProductFilters = {
        page: currentPage,
        pageSize: itemsPerPage,
        // @ts-ignore
        search: searchQuery || undefined,
      };

      try {
        // Припускаємо, що сервіс тепер повертає повну структуру
        const result = (await productCatalogService.getProducts(
          apiFilters
        )) as unknown as ApiCatalogResponse;

        setProducts(result.products.items || []);
        setTotalItems(result.products.totalItems || 0);
        setTotalPages(result.products.totalPages || 0);

        if (availableFilters.length === 0 && result.filters) {
          setAvailableFilters(
            transformApiFilters(
              result.filters,
              t as unknown as (key: string) => string
            )
          );
        }
      } catch (err) {
        setError(t("shopPage.noResults.title"));
        console.error("Failed to fetch products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilters, searchQuery, currentPage, productCatalogService, t]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilters, searchQuery]);

  // Client-side sorting
  const sortedProducts = useMemo(() => {
    const sortableProducts = [...products];
    switch (sortBy) {
      case "name-asc":
        sortableProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sortableProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        sortableProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sortableProducts.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        // Немає дати, сортуємо по ID як запасний варіант
        sortableProducts.sort((a, b) => b.id.localeCompare(a.id));
        break;
    }
    return sortableProducts;
  }, [products, sortBy]);

  const displayProducts = useMemo(
    () => sortedProducts.map(mapApiProductToProductType),
    [sortedProducts]
  );

  const sortOptions = [
    { value: "name-asc", label: t("shopPage.sort.nameAsc") },
    { value: "name-desc", label: t("shopPage.sort.nameDesc") },
    { value: "price-asc", label: t("shopPage.sort.priceAsc") },
    { value: "price-desc", label: t("shopPage.sort.priceDesc") },
    { value: "newest", label: t("shopPage.sort.newest") },
  ];

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setActiveFilters(newFilters);
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-8xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
              <SearchBar
                placeholder={t("shopPage.search.placeholder")}
                onSearch={setSearchQuery}
                defaultValue={searchQuery}
              />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 lg:hidden"
              >
                <Filter className="w-4 h-4" />
                {t("shopPage.buttons.filters")}
                {Object.keys(activeFilters).length > 0 && (
                  <span className="bg-[#d8a878] text-white text-xs rounded-full px-2 py-0.5 ml-1">
                    {Object.keys(activeFilters).length}
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === "grid"
                      ? "bg-white text-[#d8a878] shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === "list"
                      ? "bg-white text-[#d8a878] shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <SortDropdown
                options={sortOptions}
                currentSort={sortBy}
                onSortChange={setSortBy}
              />
            </div>
          </div>

          {Object.keys(activeFilters).length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-600 font-medium">
                  {t("shopPage.activeFilters.title")}
                </span>
                {Object.entries(activeFilters).map(
                  ([filterName, filterValue]) => (
                    <div key={filterName} className="flex items-center gap-1">
                      {Array.isArray(filterValue) ? (
                        filterValue.map((value) => (
                          <span
                            key={`${filterName}-${value}`}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-[#f5ede2] text-[#816b4b] text-sm rounded-full"
                          >
                            {filterName}: {value}
                            <button
                              onClick={() => {
                                const newValues = filterValue.filter(
                                  (v: any) => v !== value
                                );
                                handleFiltersChange({
                                  ...activeFilters,
                                  [filterName]:
                                    newValues.length > 0
                                      ? newValues
                                      : undefined,
                                });
                              }}
                              className="ml-1 hover:text-[#c4ad8c]"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))
                      ) : filterValue &&
                        typeof filterValue === "object" &&
                        "min" in filterValue ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#f5ede2] text-[#816b4b] text-sm rounded-full">
                          {filterName}: {filterValue.min} - {filterValue.max}
                          <button
                            onClick={() => {
                              const newFilters = { ...activeFilters };
                              delete newFilters[filterName];
                              handleFiltersChange(newFilters);
                            }}
                            className="ml-1 hover:text-[#c4ad8c]"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ) : null}
                    </div>
                  )
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 underline ml-2"
                >
                  {t("shopPage.buttons.clearAll")}
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              {t("shopPage.results.found", { count: totalItems })}{" "}
              {searchQuery && (
                <span>
                  {t("shopPage.results.forQuery")} "
                  <span className="font-medium">{searchQuery}</span>"
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <FilterPanel
                filters={availableFilters}
                activeFilters={activeFilters}
                onFiltersChange={handleFiltersChange}
                onClearAll={clearAllFilters}
              />
            </div>
          </div>

          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={() => setShowFilters(false)}
              />
              <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    {t("shopPage.buttons.filters")}
                  </h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-md"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4">
                  <FilterPanel
                    filters={availableFilters}
                    activeFilters={activeFilters}
                    onFiltersChange={handleFiltersChange}
                    onClearAll={clearAllFilters}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6 min-h-[600px]">
              {isLoading ? (
                <div className="flex justify-center items-center h-full min-h-[500px]">
                  <LoaderCircle className="w-12 h-12 text-[#d8a878] animate-spin" />
                </div>
              ) : error ? (
                <div className="text-center py-12 text-red-500">{error}</div>
              ) : displayProducts.length > 0 ? (
                <>
                  {viewMode === "grid" ? (
                    <div className="flex justify-center">
                      <div className="grid gap-[50px] grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-fit">
                        {displayProducts.map((product) => (
                          <div key={product.id} className="w-full">
                            <Card
                              product={product}
                              viewMode="grid"
                              onAddToCart={() =>
                                console.log("Додано:", product.name)
                              }
                              onBuyNow={() =>
                                console.log("Купити:", product.name)
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {displayProducts.map((product) => (
                        <Card
                          key={product.id}
                          product={product}
                          viewMode="list"
                          onAddToCart={() =>
                            console.log("Додано:", product.name)
                          }
                          onBuyNow={() => console.log("Купити:", product.name)}
                        />
                      ))}
                    </div>
                  )}
                  {totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                      <Pagination
                        total={totalPages}
                        page={currentPage}
                        onChange={setCurrentPage}
                        showControls
                        showShadow
                        color="warning"
                        className="custom-pagination"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {t("shopPage.noResults.title")}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {t("shopPage.noResults.description")}
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-4 py-2 bg-[#d8a878] hover:bg-[#c4a574] text-white font-medium rounded transition-colors"
                  >
                    {t("shopPage.noResults.button")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
