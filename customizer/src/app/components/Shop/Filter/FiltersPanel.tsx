import React, { useState, useEffect } from "react";
import FilterSelect from "./FilterSelect";
import RangeFilter from "./RangeFilter";

type FilterItem =
  | {
      name: string;
      data: string[];
    }
  | {
      name: string;
      min: number;
      max: number;
    };

interface FilterPanelProps {
  filters: FilterItem[];
  activeFilters: Record<string, any>;
  onFiltersChange: (activeFilters: Record<string, any>) => void;
  onClearAll: () => void;
  storageKey?: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  activeFilters,
  onFiltersChange,
  onClearAll, // New prop
  storageKey = "filter-state",
}) => {
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
      } catch (error) {
        console.error("Не вдалося розпарсити фільтри з localStorage:", error);
      }
    }
  }, [storageKey, onFiltersChange]);

  // ⚙️ Зміна будь-якого фільтра
  const handleFilterChange = (name: string, value: any) => {
    const updated = {
      ...activeFilters,
      [name]: value,
    };

    if (value === undefined || (Array.isArray(value) && value.length === 0)) {
      delete updated[name];
    }

    onFiltersChange(updated);
  };

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      {filters.map((filter) => {
        if ("data" in filter) {
          return (
            <FilterSelect
              key={filter.name}
              title={filter.name}
              name={filter.name}
              data={filter.data}
              onFilterChange={handleFilterChange}
              defaultValue={activeFilters[filter.name] || []}
            />
          );
        } else if ("min" in filter && "max" in filter) {
          {
            console.log("getRangeDefaultValue", activeFilters[filter.name]);
          }
          return (
            <RangeFilter
              key={filter.name}
              name={filter.name}
              min={filter.min}
              max={filter.max}
              onFilterChange={handleFilterChange}
              defaultValue={activeFilters[filter.name]}
              title={filter.name || "Діапазон"}
            />
          );
        }
        return null;
      })}
    </div>
  );
};

export default FilterPanel;
