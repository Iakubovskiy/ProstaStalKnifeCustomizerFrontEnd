import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import "../../styles/globals.css";

// --- UI & Іконки ---
import {
  Search,
  ArrowLeft,
  Edit,
  Trash2,
  SortAsc,
  SortDesc,
  ChevronLeft,
  ChevronRight,
  Filter,
  Package, // Іконка для замовлень
} from "lucide-react";
import {
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";

// --- Сервіси та Інтерфейси ---
import OrderService from "@/app/services/OrderService";
import OrderStatusesService from "@/app/services/OrderStatusesService";
import { Order } from "@/app/Interfaces/Order";
import APIService from "@/app/services/ApiService";

// Типи для сортування
type SortField = "number" | "clientFullName" | "total" | "status";
type SortDirection = "asc" | "desc";

const OrderListPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("number");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc"); // За замовчуванням найновіші
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const router = useRouter();
  const apiService = useMemo(() => new APIService(), []);
  const locale = apiService.getCurrentLocale();
  const orderService = useMemo(() => new OrderService(), []);
  const orderStatusesService = useMemo(() => new OrderStatusesService(), []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // Завантажуємо і замовлення, і статуси одночасно
      const [ordersData, statusesData] = await Promise.all([
        orderService.getAll(),
        orderStatusesService.getAll(),
      ]);
      setOrders(ordersData);
      setStatuses(statusesData);
    } catch (error) {
      console.error("Помилка завантаження даних:", error);
      alert("Помилка завантаження даних");
    } finally {
      setLoading(false);
    }
  }, [orderService, orderStatusesService]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const filteredAndSortedData = useMemo(() => {
    let filtered = orders.filter((item) => {
      const searchMatch =
        (item.clientFullName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.number.toString().includes(searchTerm);
      const statusMatch =
        statusFilter === "all" || item.status === statusFilter;
      return searchMatch && statusMatch;
    });

    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "number":
        case "total":
          aValue = a[sortField];
          bValue = b[sortField];
          return (aValue - bValue) * (sortDirection === "asc" ? 1 : -1);
        case "clientFullName":
        case "status":
          aValue = a[sortField] || "";
          bValue = b[sortField] || "";
          return (
            aValue.localeCompare(bValue) * (sortDirection === "asc" ? 1 : -1)
          );
        default:
          return 0;
      }
    });
    return filtered;
  }, [orders, searchTerm, statusFilter, sortField, sortDirection]);

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
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(`Видалити замовлення #${id}?`)) return;
    try {
      await orderService.delete(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      alert("Замовлення видалено.");
    } catch (e) {
      alert("Помилка видалення замовлення.");
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const updatedOrder = await orderService.updateStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? updatedOrder : o))
      );
    } catch (e) {
      alert("Помилка оновлення статусу.");
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

  const getStatusChipColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "new":
        return "primary";
      case "processing":
        return "warning";
      case "completed":
        return "success";
      case "shipped":
        return "secondary";
      case "cancelled":
        return "danger";
      default:
        return "default";
    }
  };

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
                <h1 className="text-2xl font-bold text-[#2d3748]">
                  Замовлення
                </h1>
                <p className="text-[#2d3748]/60">Управління замовленнями</p>
              </div>
            </div>
            {/* Можна додати кнопку створення, якщо потрібно */}
          </div>
        </div>

        {/* Фільтри та пошук */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-[#b8845f]/20 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2d3748]/40 w-5 h-5" />
              <input
                type="text"
                placeholder="Пошук по №, імені клієнта..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#b8845f]/20 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#8b7258]/50"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2d3748]/40 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#b8845f]/20 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#8b7258]/50 appearance-none"
              >
                <option value="all">Всі статуси</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-center lg:justify-end space-x-4 text-sm text-[#2d3748]/60">
              <span>Всього: {filteredAndSortedData.length}</span>
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
                    className="p-4 text-left cursor-pointer"
                    onClick={() => handleSort("number")}
                  >
                    <div className="flex items-center gap-2">
                      № {getSortIcon("number")}
                    </div>
                  </th>
                  <th className="p-4 text-left">Клієнт</th>
                  <th className="p-4 text-left">Телефон</th>
                  <th
                    className="p-4 text-left cursor-pointer"
                    onClick={() => handleSort("total")}
                  >
                    <div className="flex items-center gap-2">
                      Сума {getSortIcon("total")}
                    </div>
                  </th>
                  <th
                    className="p-4 text-center cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Статус {getSortIcon("status")}
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
                    <td className="p-4 font-bold text-[#8b7258]">
                      #{item.number}
                    </td>
                    <td className="p-4">{item.clientFullName}</td>
                    <td className="p-4">{item.clientPhoneNumber}</td>
                    <td className="p-4 font-semibold">
                      ₴{item.total.toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      <Dropdown>
                        <DropdownTrigger>
                          {/* --- ВИПРАВЛЕННЯ: Прибираємо as={Button} --- */}
                          <Chip
                            color={getStatusChipColor(item.status)}
                            variant="flat"
                            className="cursor-pointer" // Залишаємо курсор, щоб показати інтерактивність
                          >
                            {item.status}
                          </Chip>
                        </DropdownTrigger>
                        <DropdownMenu
                          aria-label="Зміна статусу"
                          onAction={(key) =>
                            handleStatusChange(item.id, key as string)
                          }
                        >
                          {statuses.map((s) => (
                            <DropdownItem key={s}>{s}</DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => router.push(`/order/${item.id}`)}
                          className="p-2 rounded-lg text-gray-500 hover:text-gray-800 transition"
                          title="Деталі / Редагувати"
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
          {/* Пагінація */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-[#b8845f]/10 bg-white/30">
              {/* Ваш код пагінації */}
            </div>
          )}
        </div>
        {/* Порожній стан */}
        {paginatedData.length === 0 && !loading && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center border border-[#b8845f]/20 shadow-sm mt-6">
            <div className="text-[#2d3748]/40 mb-4">
              <Package className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-[#2d3748] mb-2">
              Замовлень не знайдено
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

export default OrderListPage;
