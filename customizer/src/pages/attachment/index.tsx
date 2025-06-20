// /pages/attachment/index.tsx

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
import AttachmentService from "@/app/services/AttachmentService";
import APIService from "@/app/services/ApiService";
import { Attachment } from "@/app/Interfaces/Attachment";
import { Image, Chip } from "@nextui-org/react";

type SortField = "name" | "type" | "price" | "isActive";
type SortDirection = "asc" | "desc";

const AttachmentListPage = () => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
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
  const attachmentService = useMemo(() => new AttachmentService(), []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await attachmentService.getAll();
      setAttachments(data);
    } catch (error) {
      console.error("Помилка:", error);
    } finally {
      setLoading(false);
    }
  }, [attachmentService]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredAndSortedData = useMemo(() => {
    let filtered = attachments.filter((item) => {
      const searchMatch =
        (item.names?.[locale] || item.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (item.type?.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const statusMatch =
        statusFilter === "all" ||
        (statusFilter === "active" && item.isActive) ||
        (statusFilter === "inactive" && !item.isActive);
      return searchMatch && statusMatch;
    });

    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === "name") aValue = a.names?.[locale] || a.name;
      if (sortField === "name") bValue = b.names?.[locale] || b.name;
      if (sortField === "type") aValue = a.type?.name;
      if (sortField === "type") bValue = b.type?.name;

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
  }, [attachments, searchTerm, statusFilter, sortField, sortDirection, locale]);

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
    if (!window.confirm("Видалити додаток?")) return;
    await attachmentService
      .delete(id)
      .then(() => setAttachments((p) => p.filter((i) => i.id !== id)))
      .catch((e) => alert("Помилка видалення"));
  };

  const handleToggleActive = async (item: Attachment) => {
    const action = item.isActive
      ? attachmentService.deactivate(item.id)
      : attachmentService.activate(item.id);
    await action
      .then(() =>
        setAttachments((p) =>
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
        {/* Header and Filters as in previous examples... */}

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
                    Назва {getSortIcon("name")}
                  </th>
                  <th
                    className="p-4 text-left cursor-pointer"
                    onClick={() => handleSort("type")}
                  >
                    Тип {getSortIcon("type")}
                  </th>
                  <th
                    className="p-4 text-left cursor-pointer"
                    onClick={() => handleSort("price")}
                  >
                    Ціна {getSortIcon("price")}
                  </th>
                  <th
                    className="p-4 text-center cursor-pointer"
                    onClick={() => handleSort("isActive")}
                  >
                    Статус {getSortIcon("isActive")}
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
                        src={item.image?.fileUrl}
                        width={50}
                        height={50}
                        alt={item.name}
                        className="rounded-md"
                      />
                    </td>
                    <td className="p-4 font-medium">
                      {item.names?.[locale] || item.name}
                    </td>
                    <td className="p-4">{item.type?.name}</td>
                    <td className="p-4 font-semibold">₴{item.price}</td>
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
                          onClick={() => router.push(`/attachment/${item.id}`)}
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
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-[#b8845f]/10 bg-white/30">
              <div className="flex items-center justify-between">
                <div className="text-sm">
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

export default AttachmentListPage;
