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
} from "lucide-react";
import CurrencyService from "@/app/services/CurrencyService";
import { Currency } from "@/app/Interfaces/Currency";

type SortField = "name" | "exchangeRate";
type SortDirection = "asc" | "desc";

const CurrencyListPage = () => {
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState<SortField>("name");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const router = useRouter();
    const currencyService = useMemo(() => new CurrencyService(), []);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await currencyService.getAll();
            setCurrencies(data);
        } catch (error) {
            console.error("Помилка при отриманні валют:", error);
            alert("Помилка при завантаженні даних");
        } finally {
            setLoading(false);
        }
    }, [currencyService]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredAndSortedData = useMemo(() => {
        let filtered = currencies.filter((item) =>
            (item.name || "").toLowerCase().includes(searchTerm.toLowerCase())
        );

        filtered.sort((a, b) => {
            let aValue: any = a[sortField];
            let bValue: any = b[sortField];

            if (typeof aValue === "string" && typeof bValue === "string") {
                return (
                    aValue.localeCompare(bValue) * (sortDirection === "asc" ? 1 : -1)
                );
            }
            if (typeof aValue === "number" && typeof bValue === "number") {
                return (aValue - bValue) * (sortDirection === "asc" ? 1 : -1);
            }
            return 0;
        });

        return filtered;
    }, [currencies, searchTerm, sortField, sortDirection]);

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

    const handleDelete = async (id: string) => {
        if (!window.confirm("Ви впевнені, що хочете видалити цю валюту?")) return;
        try {
            await currencyService.delete(id);
            setCurrencies((prev) => prev.filter((item) => item.id !== id));
        } catch (error) {
            console.error("Помилка при видаленні валюти:", error);
            alert("Помилка при видаленні валюти.");
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
                                className="p-2 rounded-xl bg-gradient-to-r from-[#8b7258] to-[#b8845f] text-white hover:shadow-lg transition-all"
                            >
                                <ArrowLeft />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-[#2d3748]">Валюти</h1>
                                <p className="text-[#2d3748]/60">Управління валютами</p>
                            </div>
                        </div>
                        <button
                            onClick={() => router.push("/currencies/0")}
                            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#8b7258] to-[#b8845f] text-white rounded-xl hover:shadow-lg transition-all font-medium"
                        >
                            <Plus />
                            <span>Створити нову</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-[#b8845f]/20 shadow-sm">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2d3748]/40 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Пошук по назві..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#b8845f]/20 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#8b7258]/50"
                        />
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#b8845f]/20 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-[#8b7258] to-[#b8845f] text-white">
                            <tr>
                                <th
                                    className="text-left p-4 font-semibold cursor-pointer hover:bg-white/10"
                                    onClick={() => handleSort("name")}
                                >
                                    <div className="flex items-center space-x-2">
                                        <span>Назва</span>
                                        {getSortIcon("name")}
                                    </div>
                                </th>
                                <th
                                    className="text-left p-4 font-semibold cursor-pointer hover:bg-white/10"
                                    onClick={() => handleSort("exchangeRate")}
                                >
                                    <div className="flex items-center space-x-2">
                                        <span>Обмінний курс</span>
                                        {getSortIcon("exchangeRate")}
                                    </div>
                                </th>
                                <th className="text-center p-4 font-semibold">Дії</th>
                            </tr>
                            </thead>
                            <tbody>
                            {paginatedData.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-b border-[#b8845f]/10 hover:bg-[#f0e5d6]/30 transition-colors"
                                >
                                    <td className="p-4 font-medium text-[#2d3748]">
                                        {item.name || "(не вказано)"}
                                    </td>
                                    <td className="p-4 font-medium text-[#2d3748]">
                                        {item.exchangeRate}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-center space-x-2">
                                            <button
                                                onClick={() => router.push(`/currencies/${item.id}`)}
                                                className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
                                                title="Редагувати"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
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
            </div>
        </div>
    );
};

export default CurrencyListPage;