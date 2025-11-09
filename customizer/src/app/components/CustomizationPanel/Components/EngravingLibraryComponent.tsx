import React, { useState, useEffect, useMemo } from "react";
import { Search, Plus, Loader, AlertTriangle, Inbox } from "lucide-react";
import { Engraving } from "@/app/Interfaces/Engraving";
import EngravingService from "@/app/services/EngravingService";

interface EngravingLibraryProps {
    onSelect: (engraving: Engraving) => void;
}

const EngravingCard: React.FC<{ engraving: Engraving; onSelect: (engraving: Engraving) => void; }> = ({ engraving, onSelect }) => {
    return (
        <div className="group relative flex flex-col rounded-lg bg-gradient-to-r from-[#8b7258] to-[#b8845f]
                       overflow-hidden transition-all duration-300 ease-in-out
                       hover:shadow-xl hover:scale-[1.03] hover:brightness-105">

            <div className="aspect-w-1 aspect-h-1 bg-white/80 backdrop-blur-sm border-b border-[#b8845f]/20 shadow-sm rounded-t-lg">
                {engraving.picture?.fileUrl ? (
                    <img
                        src={engraving.picture.fileUrl}
                        alt={engraving.name}
                        className="w-full h-full object-contain p-2"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                        <Inbox size={32} />
                    </div>
                )}
            </div>
            <div className="p-3 flex-1 flex flex-col justify-between">
                <h3 className="text-sm font-medium text-white truncate" title={engraving.name}>
                    {engraving.name}
                </h3>
                <button
                    onClick={() => onSelect(engraving)}
                    className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold rounded-md text-white hover:bg-a08a73"
                    style={{ backgroundColor: '#8f5830' }}
                >
                    <Plus size={16} />
                    Додати
                </button>
            </div>
        </div>
    );
};

const EngravingLibraryComponent: React.FC<EngravingLibraryProps> = ({ onSelect }) => {
    const [engravings, setEngravings] = useState<Engraving[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTag, setSelectedTag] = useState<string>("all");

    useEffect(() => {
        const fetchEngravings = async () => {
            try {
                const data = await new EngravingService().getAllActive();
                setEngravings(data);
            } catch (err) {
                console.error("Failed to load engraving library:", err);
                setError("Не вдалося завантажити бібліотеку гравіювань. Спробуйте пізніше.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchEngravings();
    }, []);

    const uniqueTags = useMemo(() => {
        const allTags = engravings.flatMap(e => e.tags?.map(t => t.name) || []);
        return ['all', ...Array.from(new Set(allTags))];
    }, [engravings]);

    const filteredEngravings = useMemo(() => {
        let result = engravings;

        if (selectedTag !== 'all') {
            result = result.filter(e => e.tags?.some(t => t.name === selectedTag));
        }

        if (searchQuery.trim() !== '') {
            result = result.filter(e =>
                e.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return result;
    }, [engravings, searchQuery, selectedTag]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Loader className="animate-spin mb-2" size={32} />
                <p>Завантаження бібліотеки...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-red-600 bg-red-50 p-4 rounded-md">
                <AlertTriangle className="mb-2" size={32} />
                <p className="text-center font-medium">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="space-y-4 p-1 mb-4">
                <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </span>
                    <input
                        type="text"
                        placeholder="Пошук за назвою..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-xl border border-[#b8845f]/20 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#8b7258]/50 text-black"
                    />
                </div>

                {uniqueTags.length > 1 && (
                    <div>
                        <span className="text-sm font-medium text-gray-700 mr-3">Стиль:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {uniqueTags.map(tag => {
                                const isSelected = selectedTag === tag;
                                return (
                                    <button
                                        key={tag}
                                        onClick={() => setSelectedTag(tag)}
                                        className={`
                            px-4 py-1.5 text-sm font-medium rounded-full 
                            transition-all duration-200 ease-in-out 
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8f5830]
                            ${isSelected
                                            ? 'bg-[#8f5830] text-white shadow-inner scale-105'
                                            : 'bg-gradient-to-r from-[#8b7258] to-[#b8845f] text-white/80 hover:text-white hover:brightness-110'
                                        }
                        `}
                                    >
                                        {tag === 'all' ? 'Всі' : tag}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                {filteredEngravings.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                        {filteredEngravings.map(engraving => (
                            <EngravingCard key={engraving.id} engraving={engraving} onSelect={onSelect} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
                        <Inbox size={40} className="mb-2" />
                        <p className="font-semibold">Нічого не знайдено</p>
                        <p className="text-sm">Спробуйте змінити фільтри або пошуковий запит.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EngravingLibraryComponent;