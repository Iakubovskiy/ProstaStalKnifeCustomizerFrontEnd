import React, { useState, useMemo, useEffect } from "react";
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
import DeliveryTypeService from "@/app/services/DeliveryTypeService";
import DeliveryType from "@/app/Models/DeliveryType";

// Імітація DeliveryType та DeliveryTypeService

type SortField = keyof DeliveryType;
type SortDirection = "asc" | "desc";

const DeliveryTypeList = () => {
  const [deliveryTypes, setDeliveryTypes] = useState<DeliveryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const deliveryService = new DeliveryTypeService();

  useEffect(() => {
    const fetchDeliveryTypes = async () => {
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
    };

    fetchDeliveryTypes();
  }, []);

  // Фільтрація та сортування
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

    // Сортування
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortDirection === "asc" ? 1 : -1;
      if (bValue == null) return sortDirection === "asc" ? -1 : 1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = (aValue ?? "").toLowerCase();
        bValue = (bValue ?? "").toLowerCase();
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [deliveryTypes, searchTerm, statusFilter, sortField, sortDirection]);

  // Пагінація
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Активація/деактивація як в оригіналі
  const deliveryActivate = async (id: string, isActive?: boolean) => {
    try {
      const updated = isActive
        ? await deliveryService.deactivate(id)
        : await deliveryService.activate(id);

      if (updated) {
        setDeliveryTypes((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, isActive: !isActive } : item
          )
        );
      } else {
        alert(`Failed to ${isActive ? "deactivate" : "activate"} the record.`);
      }
    } catch (error) {
      console.error("Помилка при зміні статусу:", error);
      alert("Помилка при зміні статусу");
    }
  };

  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <SortAsc className="w-4 h-4" />
    ) : (
      <SortDesc className="w-4 h-4" />
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f4f0] to-[#f0e5d6] flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-[#b8845f]/20 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 border-4 border-[#8b7258] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[#2d3748] font-medium">Завантаження...</span>
          </div>
        </div>
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
                onClick={() => handleNavigation("/admin/dashboard")}
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
              onClick={() => handleNavigation("/deliveryTypePage/0")}
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#8b7258] to-[#b8845f] text-white">
                <tr>
                  <th
                    className="text-left p-4 font-semibold cursor-pointer hover:bg-white/10 transition-colors duration-200"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Назва</span>
                      {getSortIcon("name")}
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
                    <td className="p-4">
                      <div className="font-medium text-[#2d3748]">
                        {item.name}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-[#8b7258]">
                        {item.price === 0 ? "Безкоштовно" : `₴${item.price}`}
                      </div>
                    </td>
                    <td className="p-4">
                      <div
                        className="text-[#2d3748]/70 max-w-xs truncate"
                        title={item.comment || "Немає коментаря"}
                      >
                        {item.comment}
                      </div>
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
                            deliveryActivate(item.id, item.isActive)
                          }
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            item.isActive
                              ? "bg-red-100 text-red-600 hover:bg-red-200"
                              : "bg-green-100 text-green-600 hover:bg-green-200"
                          }`}
                          title={item.isActive ? "Деактивувати" : "Активувати"}
                        >
                          {item.isActive ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() =>
                            handleNavigation(`/deliveryTypePage/${item.id}`)
                          }
                          className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200"
                          title="Редагувати"
                        >
                          <Edit className="w-4 h-4" />
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
            <div className="p-4 border-t border-[#b8845f]/10 bg-white/30">
              <div className="flex items-center justify-between">
                <div className="text-sm text-[#2d3748]/60">
                  Показано {(currentPage - 1) * itemsPerPage + 1} -{" "}
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredAndSortedData.length
                  )}{" "}
                  з {filteredAndSortedData.length}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-white/50 border border-[#b8845f]/20 text-[#2d3748] hover:bg-[#f0e5d6]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                          currentPage === page
                            ? "bg-gradient-to-r from-[#8b7258] to-[#b8845f] text-white"
                            : "bg-white/50 border border-[#b8845f]/20 text-[#2d3748] hover:bg-[#f0e5d6]/50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-white/50 border border-[#b8845f]/20 text-[#2d3748] hover:bg-[#f0e5d6]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Пуста таблиця */}
        {filteredAndSortedData.length === 0 && !loading && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center border border-[#b8845f]/20 shadow-sm">
            <div className="text-[#2d3748]/40 mb-4">
              <Filter className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-[#2d3748] mb-2">
              Нічого не знайдено
            </h3>
            <p className="text-[#2d3748]/60">
              Спробуйте змінити параметри пошуку або фільтрації
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryTypeList;
