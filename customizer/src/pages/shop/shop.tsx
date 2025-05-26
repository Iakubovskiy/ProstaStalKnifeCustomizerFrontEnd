"use client";
import "../../styles/globals.css";

import Card from "@/app/components/Shop/Card/Card";
import FilterPanel from "@/app/components/Shop/Filter/FiltersPanel";
import AdaptiveGrid from "@/app/components/Shop/Grid/AdaptiveGrid";
import SearchBar from "@/app/components/Shop/SearchBar.tsx/SearchBar";
import SortDropdown from "@/app/components/Shop/Sort/Sort";
import ShopTabs from "@/app/components/Shop/Tabs/Tabs";
import { Pagination } from "@nextui-org/react";
import { Filter, Grid, List, X } from "lucide-react";
import { useState, useMemo, useEffect } from "react";

// Main Shop Page Component
const ShopPage: React.FC = () => {
  // Mock data
  const mockProducts = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Товар ${i + 1}`,
    price: Math.floor(Math.random() * 10000) + 100,
    image_url: `https://picsum.photos/300/300?random=${i}`,
    category: ["Електроніка", "Одяг", "Дім", "Спорт"][
      Math.floor(Math.random() * 4)
    ],
    brand: ["Apple", "Samsung", "Nike", "Adidas"][
      Math.floor(Math.random() * 4)
    ],
    specs: {
      Колір: ["Чорний", "Білий", "Сірий"][Math.floor(Math.random() * 3)],
      Розмір: ["S", "M", "L", "XL"][Math.floor(Math.random() * 4)],
    },
  }));

  const tabs = [
    { id: "all", label: "Всі товари", count: mockProducts.length },
    {
      id: "electronics",
      label: "Електроніка",
      count: mockProducts.filter((p) => p.category === "Електроніка").length,
    },
    {
      id: "clothing",
      label: "Одяг",
      count: mockProducts.filter((p) => p.category === "Одяг").length,
    },
    {
      id: "home",
      label: "Дім",
      count: mockProducts.filter((p) => p.category === "Дім").length,
    },
    {
      id: "sport",
      label: "Спорт",
      count: mockProducts.filter((p) => p.category === "Спорт").length,
    },
  ];

  const sortOptions = [
    { value: "name-asc", label: "За назвою (А-Я)" },
    { value: "name-desc", label: "За назвою (Я-А)" },
    { value: "price-asc", label: "За ціною (дешеві спочатку)" },
    { value: "price-desc", label: "За ціною (дорогі спочатку)" },
    { value: "newest", label: "Найновіші" },
  ];

  const mockFilters = [
    { name: "Категорія", data: ["Електроніка", "Одяг", "Дім", "Спорт"] },
    { name: "Бренд", data: ["Apple", "Samsung", "Nike", "Adidas"] },
    { name: "Ціна", min: 100, max: 10000 },
  ];

  // State
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name-asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const itemsPerPage = 20;

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = mockProducts;

    // Filter by tab
    if (activeTab !== "all") {
      const categoryMap: Record<string, string> = {
        electronics: "Електроніка",
        clothing: "Одяг",
        home: "Дім",
        sport: "Спорт",
      };
      filtered = filtered.filter(
        (product) => product.category === categoryMap[activeTab]
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    Object.entries(activeFilters).forEach(([filterName, filterValue]) => {
      if (!filterValue) return;

      if (
        filterName === "Ціна" &&
        filterValue.min !== undefined &&
        filterValue.max !== undefined
      ) {
        filtered = filtered.filter(
          (product) =>
            product.price >= filterValue.min && product.price <= filterValue.max
        );
      } else if (Array.isArray(filterValue) && filterValue.length > 0) {
        if (filterName === "Категорія") {
          filtered = filtered.filter((product) =>
            filterValue.includes(product.category)
          );
        } else if (filterName === "Бренд") {
          filtered = filtered.filter((product) =>
            filterValue.includes(product.brand)
          );
        }
      }
    });

    // Sort products
    switch (sortBy) {
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort((a, b) => b.id - a.id);
        break;
    }

    return filtered;
  }, [activeTab, searchQuery, activeFilters, sortBy]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, activeFilters]);

  const handleFiltersChange = (filters: Record<string, any>) => {
    setActiveFilters(filters);
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setSearchQuery("");
    setActiveTab("all");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Tabs */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <ShopTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search and Controls Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Left side - Search and Filter toggle */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
              <SearchBar
                placeholder="Пошук товарів..."
                onSearch={setSearchQuery}
                defaultValue={searchQuery}
              />

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 lg:hidden"
              >
                <Filter className="w-4 h-4" />
                Фільтри
                {Object.keys(activeFilters).length > 0 && (
                  <span className="bg-[#d8a878] text-white text-xs rounded-full px-2 py-0.5 ml-1">
                    {Object.keys(activeFilters).length}
                  </span>
                )}
              </button>
            </div>

            {/* Right side - Sort, View mode and Results info */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {/* View Mode Toggle */}
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

              {/* Sort Dropdown */}
              <SortDropdown
                options={sortOptions}
                currentSort={sortBy}
                onSortChange={setSortBy}
              />
            </div>
          </div>

          {/* Active Filters Display */}
          {Object.keys(activeFilters).length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-600 font-medium">
                  Активні фільтри:
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
                  Очистити все
                </button>
              </div>
            </div>
          )}

          {/* Results Summary */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Знайдено{" "}
              <span className="font-medium text-gray-900">
                {filteredProducts.length}
              </span>{" "}
              товарів
              {searchQuery && (
                <span>
                  {" "}
                  за запитом "<span className="font-medium">{searchQuery}</span>
                  "
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex gap-6">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <FilterPanel
                filters={mockFilters}
                activeFilters={activeFilters}
                onFiltersChange={handleFiltersChange}
                onClearAll={clearAllFilters}
              />
            </div>
          </div>

          {/* Mobile Filters Overlay */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={() => setShowFilters(false)}
              />
              <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      Фільтри
                    </h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 hover:bg-gray-100 rounded-md"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <FilterPanel
                    filters={mockFilters}
                    activeFilters={activeFilters}
                    onFiltersChange={handleFiltersChange}
                    onClearAll={clearAllFilters}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {paginatedProducts.length > 0 ? (
                <>
                  {viewMode === "grid" ? (
                    <AdaptiveGrid products={paginatedProducts} />
                  ) : (
                    <div className="space-y-4">
                      {paginatedProducts.map((product, index) => (
                        <Card
                          key={product.id || index}
                          product={product}
                          viewMode="list"
                          onAddToCart={() => {}}
                          onBuyNow={() => {}}
                        />
                      ))}
                    </div>
                  )}

                  {/* Pagination */}
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
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Товари не знайдено
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Спробуйте змінити фільтри або пошуковий запит
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-4 py-2 bg-[#d8a878] hover:bg-[#c4a574] text-white font-medium rounded transition-colors"
                  >
                    Очистити всі фільтри
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
