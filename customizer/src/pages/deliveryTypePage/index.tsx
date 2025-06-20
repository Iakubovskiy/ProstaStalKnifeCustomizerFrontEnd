"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import "../../styles/globals.css";
import {
  Search,
  Plus,
  ArrowLeft,
  Filter,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  SortAsc,
  SortDesc,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import DeliveryTypeService from "@/app/services/DeliveryTypeService"; // Перевірте правильність шляху
import { getLocaleFromCookies } from "@/app/config";
type SortField = keyof DeliveryType;
type SortDirection = "asc" | "desc";

const DeliveryTypeList = () => {
  const [deliveryTypes, setDeliveryTypes] = useState<DeliveryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const locale = getLocaleFromCookies();
  const [sortField, setSortField] = useState<SortField>("names");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const router = useRouter();
  const deliveryService = useMemo(() => new DeliveryTypeService(), []);

  const fetchDeliveryTypes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await deliveryService.getAll();
      setDeliveryTypes(data);
    } catch (error) {
      console.error("Помилка при отриманні DeliveryTypes:", error);
      alert("Помилка при завантаженні даних");
    } finally {
      setLoading(false);
    }
  }, [deliveryService]);

  useEffect(() => {
    fetchDeliveryTypes();
  }, [fetchDeliveryTypes]);

  const filteredAndSortedData = useMemo(() => {
    let filtered = deliveryTypes.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.comment ?? "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && item.isActive) ||
        (statusFilter === "inactive" && !item.isActive);
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [deliveryTypes, searchTerm, statusFilter, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: SortField) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const handleToggleActive = async (id: string, currentIsActive: boolean) => {
    try {
      const updatedItem = currentIsActive
        ? await deliveryService.deactivate(id)
        : await deliveryService.activate(id);

      setDeliveryTypes((prev) => {
        const newState = prev.map((item) =>
          item.id === id ? updatedItem : item
        );
        return newState;
      });

      if (updatedItem.isActive === currentIsActive) {
        await fetchDeliveryTypes();
      }
    } catch (error) {
      console.error("Помилка при зміні статусу:", error);
      alert("Помилка при зміні статусу");

      // У випадку помилки перезавантажуємо дані
      await fetchDeliveryTypes();
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "Ви впевнені, що хочете видалити цей елемент? Цю дію неможливо скасувати."
      )
    )
      return;
    try {
      await deliveryService.delete(id);
      // Видаляємо елемент зі стану після успішного видалення на сервері
      setDeliveryTypes((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Помилка при видаленні:", error);
      alert("Помилка при видаленні елемента.");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <SortAsc className="w-4 h-4" />
    ) : (
      <SortDesc className="w-4 h-4" />
    );
  };

  // Функції для пагінації
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Генерація номерів сторінок для відображення
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  // Скидання сторінки при зміні фільтрів
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f4f0] to-[#f0e5d6] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#8b7258] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f4f0] to-[#f0e5d6] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Хедер */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-[#b8845f]/20 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/admin/dashboard")} // Використання роутера
                className="p-2 rounded-xl bg-gradient-to-r from-[#8b7258] to-[#b8845f] text-white hover:shadow-lg transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-[#2d3748]">
                  Види доставки
                </h1>
                <p className="text-[#2d3748]/60">
                  Управління способами доставки
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push("/deliveryTypePage/0")}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#8b7258] to-[#b8845f] text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Створити новий</span>
            </button>
          </div>
        </div>

        {/* Фільтри та пошук */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-[#b8845f]/20 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Пошук */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2d3748]/40 w-5 h-5" />
              <input
                type="text"
                placeholder="Пошук по назві або коментарю..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#b8845f]/20 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#8b7258]/50 focus:border-[#8b7258] transition-all duration-200"
              />
            </div>

            {/* Фільтр статусу */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2d3748]/40 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as "all" | "active" | "inactive"
                  )
                }
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#b8845f]/20 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#8b7258]/50 focus:border-[#8b7258] transition-all duration-200 appearance-none"
              >
                <option value="all">Всі статуси</option>
                <option value="active">Активні</option>
                <option value="inactive">Неактивні</option>
              </select>
            </div>

            {/* Статистика */}
            <div className="flex items-center justify-center lg:justify-end space-x-4 text-sm text-[#2d3748]/60">
              <span>Всього: {filteredAndSortedData.length}</span>
              <span>
                Активних:{" "}
                {filteredAndSortedData.filter((item) => item.isActive).length}
              </span>
            </div>
          </div>
        </div>

        {/* Таблиця */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#b8845f]/20 shadow-sm overflow-hidden">
          {filteredAndSortedData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#2d3748]/60 text-lg">
                Нічого не знайдено за вашими критеріями
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-[#8b7258] to-[#b8845f] text-white">
                    <tr>
                      <th
                        className="text-left p-4 font-semibold cursor-pointer hover:bg-white/10 transition-colors duration-200"
                        onClick={() => handleSort("names")}
                      >
                        <div className="flex items-center space-x-2">
                          <span>Назва</span>
                          {getSortIcon("names")}
                        </div>
                      </th>
                      <th
                        className="text-left p-4 font-semibold cursor-pointer hover:bg-white/10 transition-colors duration-200"
                        onClick={() => handleSort("price")}
                      >
                        <div className="flex items-center space-x-2">
                          <span>Ціна</span>
                          {getSortIcon("price")}
                        </div>
                      </th>
                      <th className="text-left p-4 font-semibold">Коментар</th>
                      <th
                        className="text-center p-4 font-semibold cursor-pointer hover:bg-white/10 transition-colors duration-200"
                        onClick={() => handleSort("isActive")}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <span>Статус</span>
                          {getSortIcon("isActive")}
                        </div>
                      </th>
                      <th className="text-center p-4 font-semibold">Дії</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((item, index) => (
                      <tr
                        key={item.id}
                        className={`border-b border-[#b8845f]/10 hover:bg-[#f0e5d6]/30 transition-colors duration-200 ${
                          index % 2 === 0 ? "bg-white/30" : "bg-white/50"
                        }`}
                      >
                        <td className="p-4 font-medium text-[#2d3748]">
                          {item.name || "—"}
                        </td>
                        <td className="p-4 font-semibold text-[#8b7258]">
                          {item.price === 0 ? "Безкоштовно" : `₴${item.price}`}
                        </td>
                        <td
                          className="p-4 text-[#2d3748]/70 max-w-xs truncate"
                          title={item.comment || "—"}
                        >
                          {item.comment || "—"}
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              item.isActive
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-red-100 text-red-800 border border-red-200"
                            }`}
                          >
                            {item.isActive ? "Активний" : "Неактивний"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() =>
                                handleToggleActive(item.id, item.isActive)
                              }
                              className={`p-2 rounded-lg transition-all duration-200 ${
                                item.isActive
                                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                                  : "bg-green-100 text-green-600 hover:bg-green-200"
                              }`}
                              title={
                                item.isActive ? "Деактивувати" : "Активувати"
                              }
                            >
                              {item.isActive ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() =>
                                router.push(`/deliveryTypePage/${item.id}`)
                              }
                              className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200"
                              title="Редагувати"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-2 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all duration-200"
                              title="Видалити"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Пагінація */}
              {totalPages > 1 && (
                <div className="bg-white/50 border-t border-[#b8845f]/10 px-6 py-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Інформація про сторінки */}
                    <div className="text-sm text-[#2d3748]/60">
                      Показано {(currentPage - 1) * itemsPerPage + 1} -{" "}
                      {Math.min(
                        currentPage * itemsPerPage,
                        filteredAndSortedData.length
                      )}{" "}
                      з {filteredAndSortedData.length} результатів
                    </div>

                    {/* Навігація по сторінках */}
                    <div className="flex items-center space-x-2">
                      {/* Попередня сторінка */}
                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-[#8b7258] hover:bg-[#8b7258] hover:text-white border border-[#b8845f]/20"
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {/* Номери сторінок */}
                      {totalPages <= 7
                        ? // Показати всі сторінки якщо їх мало
                          Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                          ).map((page) => (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                currentPage === page
                                  ? "bg-gradient-to-r from-[#8b7258] to-[#b8845f] text-white"
                                  : "bg-white text-[#8b7258] hover:bg-[#8b7258] hover:text-white border border-[#b8845f]/20"
                              }`}
                            >
                              {page}
                            </button>
                          ))
                        : // Показати скорочену версію з крапками
                          getPageNumbers().map((page, index) => (
                            <React.Fragment key={index}>
                              {page === "..." ? (
                                <span className="px-3 py-2 text-[#2d3748]/60">
                                  ...
                                </span>
                              ) : (
                                <button
                                  onClick={() =>
                                    handlePageChange(page as number)
                                  }
                                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    currentPage === page
                                      ? "bg-gradient-to-r from-[#8b7258] to-[#b8845f] text-white"
                                      : "bg-white text-[#8b7258] hover:bg-[#8b7258] hover:text-white border border-[#b8845f]/20"
                                  }`}
                                >
                                  {page}
                                </button>
                              )}
                            </React.Fragment>
                          ))}

                      {/* Наступна сторінка */}
                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          currentPage === totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-[#8b7258] hover:bg-[#8b7258] hover:text-white border border-[#b8845f]/20"
                        }`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryTypeList;
