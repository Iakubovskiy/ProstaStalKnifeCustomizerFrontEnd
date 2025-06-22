import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import "../../styles/globals.css";

import {
  Search,
  Plus,
  ArrowLeft,
  Edit,
  Trash2,
  SortAsc,
  SortDesc,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Filter,
} from "lucide-react";
import KnifeService from "@/app/services/KnifeService";
import APIService from "@/app/services/ApiService";
import { Knife } from "@/app/Interfaces/Knife/Knife";
import { Image, Chip } from "@nextui-org/react";

type SortField = "name" | "bladeShape" | "bladeCoatingColor" | "isActive";
type SortDirection = "asc" | "desc";

const KnifeListPage = () => {
  const [knives, setKnives] = useState<Knife[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const router = useRouter();
  const apiService = useMemo(() => new APIService(), []);
  const locale = apiService.getCurrentLocale();
  const knifeService = useMemo(() => new KnifeService(), []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await knifeService.getAll();
      setKnives(data);
    } catch (error) {
      console.error("Помилка:", error);
      alert("Помилка завантаження даних");
    } finally {
      setLoading(false);
    }
  }, [knifeService]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const filteredAndSortedData = useMemo(() => {
    let filtered = knives.filter((item) => {
      const searchMatch =
        (item.names?.[locale] || item.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (item.knifeForCanvas?.bladeShape?.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const statusMatch =
        statusFilter === "all" ||
        (statusFilter === "active" && item.isActive) ||
        (statusFilter === "inactive" && !item.isActive);
      return searchMatch && statusMatch;
    });

    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "name":
          aValue = a.names?.[locale] || a.name;
          bValue = b.names?.[locale] || b.name;
          break;
        case "bladeShape":
          aValue = a.knifeForCanvas?.bladeShape?.name;
          bValue = b.knifeForCanvas?.bladeShape?.name;
          break;
        case "bladeCoatingColor":
          aValue = a.bladeCoatingColor;
          bValue = b.bladeCoatingColor;
          break;
        case "isActive":
          aValue = a.isActive;
          bValue = b.isActive;
          break;
        default:
          return 0;
      }

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return (
          aValue.localeCompare(bValue) * (sortDirection === "asc" ? 1 : -1)
        );
      }
      if (typeof aValue === "boolean" && typeof bValue === "boolean") {
        return (
          (aValue === bValue ? 0 : aValue ? -1 : 1) *
          (sortDirection === "asc" ? 1 : -1)
        );
      }
      return 0;
    });
    return filtered;
  }, [knives, searchTerm, statusFilter, sortField, sortDirection, locale]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = useMemo(
    () =>
      filteredAndSortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [filteredAndSortedData, currentPage]
  );

  const handleSort = (field: SortField) => {
    setSortDirection(
      sortField === field && sortDirection === "asc" ? "desc" : "asc"
    );
    setSortField(field);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Видалити ніж?")) return;
    await knifeService
      .delete(id)
      .then(() => setKnives((p) => p.filter((i) => i.id !== id)))
      .catch((e) => alert("Помилка видалення"));
  };

  const handleToggleActive = async (item: Knife) => {
    const action = item.isActive
      ? knifeService.deactivate(item.id)
      : knifeService.activate(item.id);
    await action
      .then(() =>
        setKnives((p) =>
          p.map((i) => (i.id === item.id ? { ...i, isActive: !i.isActive } : i))
        )
      )
      .catch((e) => alert("Помилка зміни статусу"));
  };

  const getSortIcon = (field: SortField) =>
    sortField === field ? (
      sortDirection === "asc" ? (
        <SortAsc className="w-4 h-4" />
      ) : (
        <SortDesc className="w-4 h-4" />
      )
    ) : null;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#8b7258] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f4f0] to-[#f0e5d6] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Хедер */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-[#b8845f]/20 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="p-2 rounded-xl bg-gradient-to-r from-[#8b7258] to-[#b8845f] text-white hover:shadow-lg transition-all"
              >
                <ArrowLeft />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-[#2d3748]">Ножі</h1>
                <p className="text-[#2d3748]/60">Управління ножами</p>
              </div>
            </div>
            <button
              onClick={() => router.push("/knife/0")}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#8b7258] to-[#b8845f] text-white rounded-xl hover:shadow-lg transition-all font-medium"
            >
              <Plus />
              <span>Створити новий</span>
            </button>
          </div>
        </div>

        {/* Фільтри та пошук */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-[#b8845f]/20 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2d3748]/40 w-5 h-5" />
              <input
                type="text"
                placeholder="Пошук по назві або формі леза..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#b8845f]/20 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#8b7258]/50"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2d3748]/40 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#b8845f]/20 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#8b7258]/50 appearance-none"
              >
                <option value="all">Всі статуси</option>
                <option value="active">Активні</option>
                <option value="inactive">Неактивні</option>
              </select>
            </div>
            <div className="flex items-center justify-center lg:justify-end space-x-4 text-sm text-[#2d3748]/60">
              <span>Всього: {filteredAndSortedData.length}</span>
              <span>
                Активних:{" "}
                {filteredAndSortedData.filter((item) => item.isActive).length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#b8845f]/20 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#8b7258] to-[#b8845f] text-white">
                <tr>
                  <th className="p-4 text-left">Зображення</th>
                  <th
                    className="p-4 text-left cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-2">
                      Назва {getSortIcon("name")}
                    </div>
                  </th>
                  <th
                    className="p-4 text-left cursor-pointer"
                    onClick={() => handleSort("bladeShape")}
                  >
                    <div className="flex items-center gap-2">
                      Форма леза {getSortIcon("bladeShape")}
                    </div>
                  </th>
                  <th
                    className="p-4 text-left cursor-pointer"
                    onClick={() => handleSort("bladeCoatingColor")}
                  >
                    <div className="flex items-center gap-2">
                      Покриття {getSortIcon("bladeCoatingColor")}
                    </div>
                  </th>
                  <th
                    className="p-4 text-center cursor-pointer"
                    onClick={() => handleSort("isActive")}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Статус {getSortIcon("isActive")}
                    </div>
                  </th>
                  <th className="p-4 text-center">Дії</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[#b8845f]/10 hover:bg-[#f0e5d6]/30"
                  >
                    <td className="p-2">
                      <Image
                        src={item.imageUrl?.fileUrl}
                        width={50}
                        height={50}
                        alt={item.name}
                        className="rounded-md object-cover"
                      />
                    </td>
                    <td className="p-4 font-medium">
                      {item.names?.[locale] || item.name}
                    </td>
                    <td className="p-4">
                      {item.knifeForCanvas?.bladeShape?.name || "N/A"}
                    </td>
                    <td className="p-4">{item.bladeCoatingColor || "N/A"}</td>
                    <td className="p-4 text-center">
                      <Chip
                        color={item.isActive ? "success" : "danger"}
                        variant="flat"
                      >
                        {item.isActive ? "Активний" : "Неактивний"}
                      </Chip>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleToggleActive(item)}
                          className="p-2 rounded-lg text-gray-500 hover:text-gray-800 transition"
                          title={item.isActive ? "Деактивувати" : "Активувати"}
                        >
                          {item.isActive ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                        <button
                          onClick={() => router.push(`/knife/${item.id}`)}
                          className="p-2 rounded-lg text-gray-500 hover:text-gray-800 transition"
                          title="Редагувати"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 rounded-lg text-red-500 hover:text-red-700 transition"
                          title="Видалити"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="p-4 border-t border-[#b8845f]/10 bg-white/30">
              <div className="flex items-center justify-between">
                <div className="text-sm text-[#2d3748]/60">
                  Показано {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredAndSortedData.length
                  )}{" "}
                  з {filteredAndSortedData.length}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-white/50 border border-[#b8845f]/20 disabled:opacity-50"
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
                      setCurrentPage((c) => Math.min(totalPages, c + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-white/50 border border-[#b8845f]/20 disabled:opacity-50"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {paginatedData.length === 0 && !loading && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center border border-[#b8845f]/20 shadow-sm mt-6">
            <div className="text-[#2d3748]/40 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-[#2d3748] mb-2">
              Нічого не знайдено
            </h3>
            <p className="text-[#2d3748]/60">
              Спробуйте змінити параметри пошуку або фільтрації.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnifeListPage;
