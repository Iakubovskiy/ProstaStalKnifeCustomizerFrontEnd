// /pages/order-status/index.tsx

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import "../../styles/globals.css";

import { Search, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import OrderStatusesService from "@/app/services/OrderStatusesService";

const OrderStatusListPage = () => {
  const [statuses, setStatuses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const router = useRouter();
  const orderStatusesService = useMemo(() => new OrderStatusesService(), []);

  const fetchStatuses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await orderStatusesService.getAll();
      setStatuses(data);
    } catch (error) {
      console.error("Помилка при отриманні статусів замовлень:", error);
      alert("Помилка при завантаженні даних");
    } finally {
      setLoading(false);
    }
  }, [orderStatusesService]);

  useEffect(() => {
    fetchStatuses();
  }, [fetchStatuses]);

  // Фільтрація
  const filteredData = useMemo(() => {
    return statuses.filter((status) =>
      status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [statuses, searchTerm]);

  // Пагінація
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    return filteredData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredData, currentPage, itemsPerPage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#8b7258] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f4f0] to-[#f0e5d6] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Хедер */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-[#b8845f]/20 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/admin/dashboard")}
                className="p-2 rounded-xl bg-gradient-to-r from-[#8b7258] to-[#b8845f] text-white hover:shadow-lg transition-all"
              >
                <ArrowLeft />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-[#2d3748]">
                  Статуси замовлень
                </h1>
                <p className="text-[#2d3748]/60">
                  Перелік можливих статусів для замовлень
                </p>
              </div>
            </div>
            {/* Кнопка "Створити" відсутня, оскільки список фіксований */}
          </div>
        </div>

        {/* Пошук */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-[#b8845f]/20 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2d3748]/40 w-5 h-5" />
              <input
                type="text"
                placeholder="Пошук по назві статусу..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#b8845f]/20 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#8b7258]/50"
              />
            </div>
            <div className="flex items-center justify-center lg:justify-end text-sm text-[#2d3748]/60">
              <span>Всього: {filteredData.length}</span>
            </div>
          </div>
        </div>

        {/* Таблиця */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#b8845f]/20 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#8b7258] to-[#b8845f] text-white">
                <tr>
                  <th className="text-left p-4 font-semibold">Назва статусу</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((status, index) => (
                  <tr
                    key={index}
                    className="border-b border-[#b8845f]/10 hover:bg-[#f0e5d6]/30 transition-colors"
                  >
                    <td className="p-4 font-medium text-[#2d3748]">{status}</td>
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
                  {Math.min(currentPage * itemsPerPage, filteredData.length)} з{" "}
                  {filteredData.length}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-white/50 border border-[#b8845f]/20 text-[#2d3748] hover:bg-[#f0e5d6]/50 disabled:opacity-50"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-lg ${
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
                    className="p-2 rounded-lg bg-white/50 border border-[#b8845f]/20 text-[#2d3748] hover:bg-[#f0e5d6]/50 disabled:opacity-50"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Повідомлення, якщо нічого не знайдено */}
        {paginatedData.length === 0 && !loading && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center border border-[#b8845f]/20 shadow-sm mt-6">
            <div className="text-[#2d3748]/40 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-[#2d3748] mb-2">
              Нічого не знайдено
            </h3>
            <p className="text-[#2d3748]/60">
              Спробуйте змінити параметри пошуку.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderStatusListPage;
