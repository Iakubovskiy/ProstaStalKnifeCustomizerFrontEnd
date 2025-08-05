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
} from "lucide-react";
import BladeShapeService from "@/app/services/BladeShapeService";
import BladeShapeTypeService from "@/app/services/BladeShapeTypeService";
import APIService from "@/app/services/ApiService";
import { BladeShape } from "@/app/Interfaces/BladeShape";
import { Image, Chip } from "@nextui-org/react";

type SortField = "name" | "type" | "price" | "isActive";
type SortDirection = "asc" | "desc";

const BladeShapeListPage = () => {
  const [bladeShapes, setBladeShapes] = useState<BladeShape[]>([]);
  const [bladeShapeTypes, setBladeShapeTypes] = useState<BladeShapeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const router = useRouter();
  const apiService = useMemo(() => new APIService(), []);
  const locale = apiService.getCurrentLocale();
  const bladeShapeService = useMemo(() => new BladeShapeService(), []);
  const bladeShapeTypeService = useMemo(() => new BladeShapeTypeService(), []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [shapesData, typesData] = await Promise.all([
        bladeShapeService.getAll(),
        bladeShapeTypeService.getAll(),
      ]);
      setBladeShapes(shapesData);
      setBladeShapeTypes(typesData);
    } catch (error) {
      console.error("Помилка:", error);
      alert("Помилка завантаження даних");
    } finally {
      setLoading(false);
    }
  }, [bladeShapeService, bladeShapeTypeService]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredAndSortedData = useMemo(() => {
    const filtered = bladeShapes.filter((item) => {
      const searchMatch = (item.names?.[locale] || item.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const statusMatch =
        statusFilter === "all" ||
        (statusFilter === "active" && item.isActive) ||
        (statusFilter === "inactive" && !item.isActive);
      const typeMatch =
        typeFilter === "all" || item.shapeType.id === typeFilter;
      return searchMatch && statusMatch && typeMatch;
    });

    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "name":
          aValue = a.names?.[locale] || a.name;
          bValue = b.names?.[locale] || b.name;
          break;
        case "type":
          aValue = a.shapeType.name;
          bValue = b.shapeType.name;
          break;
        default:
          aValue = a[sortField];
          bValue = b[sortField];
      }

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
      if (typeof aValue === "number" && typeof bValue === "number") {
        return (aValue - bValue) * (sortDirection === "asc" ? 1 : -1);
      }
      return 0;
    });
    return filtered;
  }, [
    bladeShapes,
    searchTerm,
    statusFilter,
    typeFilter,
    sortField,
    sortDirection,
    locale,
  ]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = useMemo(
    () =>
      filteredAndSortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [filteredAndSortedData, currentPage, itemsPerPage]
  );

  const handleSort = (field: SortField) => {
    setSortDirection(
      sortField === field && sortDirection === "asc" ? "desc" : "asc"
    );
    setSortField(field);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Видалити форму леза?")) return;
    try {
      await bladeShapeService.delete(id);
      setBladeShapes((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Помилка видалення:", error);
      alert("Не вдалося видалити форму леза.");
    }
  };

  const handleToggleActive = async (shape: BladeShape) => {
    try {
      if (shape.isActive) {
        await bladeShapeService.deactivate(shape.id);
      } else {
        await bladeShapeService.activate(shape.id);
      }
      setBladeShapes((prev) =>
        prev.map((s) =>
          s.id === shape.id ? { ...s, isActive: !s.isActive } : s
        )
      );
    } catch (error) {
      console.error("Помилка зміни статусу:", error);
      alert("Не вдалося змінити статус.");
    }
  };

  const getSortIcon = (field: SortField) =>
    sortField === field ? (
      sortDirection === "asc" ? (
        <SortAsc className="w-4 h-4" />
      ) : (
        <SortDesc className="w-4 h-4" />
      )
    ) : null;

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
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-[#b8845f]/20 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/admin/dashboard")}
                className="p-2 rounded-xl bg-gradient-to-r from-[#8b7258] to-[#b8845f] text-white hover:shadow-lg"
              >
                <ArrowLeft />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-[#2d3748]">
                  Форми леза
                </h1>
                <p className="text-[#2d3748]/60">Управління формами леза</p>
              </div>
            </div>
            <button
              onClick={() => router.push("/blade-shape/0")}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#8b7258] to-[#b8845f] text-white rounded-xl hover:shadow-lg font-medium"
            >
              <Plus />
              <span>Створити нову</span>
            </button>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-[#b8845f]/20 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2d3748]/40 w-5 h-5" />
              <input
                type="text"
                placeholder="Пошук по назві..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#b8845f]/20 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#8b7258]/50"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-3 rounded-xl border border-[#b8845f]/20 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#8b7258]/50"
            >
              <option value="all">Всі статуси</option>
              <option value="active">Активні</option>
              <option value="inactive">Неактивні</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-3 rounded-xl border border-[#b8845f]/20 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#8b7258]/50"
            >
              <option value="all">Всі типи</option>
              {bladeShapeTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#b8845f]/20 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#8b7258] to-[#b8845f] text-white">
                <tr>
                  <th className="p-4 text-left font-semibold">Фото</th>
                  <th
                    className="p-4 text-left font-semibold cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-2">
                      Назва {getSortIcon("name")}
                    </div>
                  </th>
                  <th
                    className="p-4 text-left font-semibold cursor-pointer"
                    onClick={() => handleSort("type")}
                  >
                    <div className="flex items-center gap-2">
                      Тип {getSortIcon("type")}
                    </div>
                  </th>
                  <th
                    className="p-4 text-left font-semibold cursor-pointer"
                    onClick={() => handleSort("price")}
                  >
                    <div className="flex items-center gap-2">
                      Ціна {getSortIcon("price")}
                    </div>
                  </th>
                  <th
                    className="p-4 text-center font-semibold cursor-pointer"
                    onClick={() => handleSort("isActive")}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Статус {getSortIcon("isActive")}
                    </div>
                  </th>
                  <th className="p-4 text-center font-semibold">Дії</th>
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
                        src={item.bladeShapePhoto?.fileUrl}
                        width={50}
                        height={50}
                        alt={item.name}
                      />
                    </td>
                    <td className="p-4 font-medium text-[#2d3748]">
                      {item.names?.[locale] || item.name}
                    </td>
                    <td className="p-4">{item.shapeType.name}</td>
                    <td className="p-4 font-semibold">₴{item.price}</td>
                    <td className="p-4 text-center">
                      <Chip
                        color={item.isActive ? "success" : "danger"}
                        variant="flat"
                      >
                        {item.isActive ? "Активна" : "Неактивна"}
                      </Chip>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleToggleActive(item)}
                          className="p-2 rounded-lg"
                          title={item.isActive ? "Деактивувати" : "Активувати"}
                        >
                          {item.isActive ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                        <button
                          onClick={() => router.push(`/blade-shape/${item.id}`)}
                          className="p-2 rounded-lg"
                          title="Редагувати"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 rounded-lg"
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
                    onClick={() => setCurrentPage((c) => c - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-white/50 border border-[#b8845f]/20 disabled:opacity-50"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span>
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((c) => c + 1)}
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
      </div>
    </div>
  );
};

export default BladeShapeListPage;
