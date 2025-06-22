import { useState, useRef, useEffect } from "react";
import {useTranslation} from "react-i18next";

interface RangeFilterProps {
  title: string;
  name: string;
  min: number;
  max: number;
  step?: number;
  onFilterChange: (
    name: string,
    values: { min: number; max: number } | null
  ) => void;
  defaultValue?: { min: number; max: number };
}

const RangeFilter: React.FC<RangeFilterProps> = ({
  title,
  name,
  min,
  max,
  step = 1,
  onFilterChange,
  defaultValue,
}) => {
  const [range, setRange] = useState<[number, number]>(
    defaultValue ? [defaultValue.min, defaultValue.max] : [min, max]
  );
  const [isActive, setIsActive] = useState<boolean>(defaultValue !== undefined);
  const [isDragging, setIsDragging] = useState<"min" | "max" | null>(null);

  const sliderRef = useRef<HTMLDivElement>(null);
  const minThumbRef = useRef<HTMLDivElement>(null);
  const maxThumbRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    console.log("default1111", defaultValue);

    if (defaultValue) {
      onFilterChange(name, { min: defaultValue.min, max: defaultValue.max });
      console.log("default", defaultValue);
    }
  }, []);

  const updateFilter = (newRange: [number, number]) => {
    if (isActive) {
      onFilterChange(name, { min: newRange[0], max: newRange[1] });
    }
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newMin = Number(e.target.value);
    newMin = Math.max(min, Math.min(newMin, range[1])); // Restrict within [min, range[1]]

    const newRange: [number, number] = [newMin, range[1]];
    setRange(newRange);
    updateFilter(newRange);
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newMax = Number(e.target.value);
    newMax = Math.min(max, Math.max(newMax, range[0])); // Restrict within [range[0], max]

    const newRange: [number, number] = [range[0], newMax];
    setRange(newRange);
    updateFilter(newRange);
  };

  const handleToggleActive = () => {
    const newIsActive = !isActive;
    setIsActive(newIsActive);
    if (newIsActive) {
      onFilterChange(name, { min: range[0], max: range[1] });
    } else {
      onFilterChange(name, null);
    }
  };

  const handleReset = () => {
    const newRange: [number, number] = [min, max];
    setRange(newRange);
    if (isActive) {
      onFilterChange(name, { min, max });
    }
  };

  // Slider drag handlers
  const handleMouseDown = (which: "min" | "max") => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(which);
  };

  // Handle touch events for mobile
  const handleTouchStart = (which: "min" | "max") => (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(which);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !sliderRef.current) return;

      const slider = sliderRef.current;
      const rect = slider.getBoundingClientRect();
      const percentage = Math.min(
        Math.max(0, (e.clientX - rect.left) / rect.width),
        1
      );
      const value = Math.round((percentage * (max - min) + min) / step) * step;
      const clampedValue = Math.min(Math.max(value, min), max);

      if (isDragging === "min" && clampedValue <= range[1]) {
        const newRange: [number, number] = [clampedValue, range[1]];
        setRange(newRange);
        updateFilter(newRange);
      } else if (isDragging === "max" && clampedValue >= range[0]) {
        const newRange: [number, number] = [range[0], clampedValue];
        setRange(newRange);
        updateFilter(newRange);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !sliderRef.current) return;

      const slider = sliderRef.current;
      const rect = slider.getBoundingClientRect();
      const touch = e.touches[0];
      const percentage = Math.min(
        Math.max(0, (touch.clientX - rect.left) / rect.width),
        1
      );
      const value = Math.round((percentage * (max - min) + min) / step) * step;

      if (isDragging === "min" && value <= range[1]) {
        const newRange: [number, number] = [value, range[1]];
        setRange(newRange);
        updateFilter(newRange);
      } else if (isDragging === "max" && value >= range[0]) {
        const newRange: [number, number] = [range[0], value];
        setRange(newRange);
        updateFilter(newRange);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(null);
    };

    const handleTouchEnd = () => {
      setIsDragging(null);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, range, min, max, step, updateFilter]);

  // Calculate positions for thumbs and track
  const minPosition = ((range[0] - min) / (max - min)) * 100;
  const maxPosition = ((range[1] - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">{title}</label>
        <div className="flex gap-2 items-center">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-[#d8a878] hover:text-[#816b4b]"
          >
            Скинути
          </button>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={handleToggleActive}
              className="sr-only peer"
            />
            <div className="relative w-9 h-5 bg-[#faf6f1] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f5ede2] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#d8a878]"></div>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-2">
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            {t("rangeFilter.min_text")} {range[0]}
          </label>
          <input
            type="number"
            min={min}
            max={range[1]}
            value={range[0]}
            onChange={handleMinInputChange}
            className={`w-full p-1 text-sm border ${
              isActive ? "border-[#e5d8c5]" : "border-gray-200"
            } rounded`}
            disabled={!isActive}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            {t("rangeFilter.max_text")} {range[1]}
          </label>
          <input
            type="number"
            min={range[0]}
            max={max}
            value={range[1]}
            onChange={handleMaxInputChange}
            className={`w-full p-1 text-sm border ${
              isActive ? "border-[#e5d8c5]" : "border-gray-200"
            } rounded`}
            disabled={!isActive}
          />
        </div>
      </div>

      {/* Modern Range Slider */}
      <div className="relative h-6 mt-2" ref={sliderRef}>
        {/* Base track */}
        <div className="absolute w-full h-1 bg-[#faf6f1] rounded-full top-1/2 transform -translate-y-1/2" />

        {/* Active track */}
        <div
          className={`absolute h-1 ${
            isActive ? "bg-[#d8a878]" : "bg-gray-300"
          } rounded-full top-1/2 transform -translate-y-1/2`}
          style={{
            left: `${minPosition}%`,
            width: `${maxPosition - minPosition}%`,
          }}
        />

        {/* Min thumb */}
        <div
          ref={minThumbRef}
          className={`absolute w-4 h-4 ${
            isActive ? "bg-[#d8a878]" : "bg-gray-400"
          } rounded-full top-1/2 transform -translate-y-1/2 -ml-2 ${
            isActive ? "cursor-pointer" : "cursor-not-allowed"
          } ${isDragging === "min" ? "ring-2 ring-[#f5ede2]" : ""}`}
          style={{ left: `${minPosition}%` }}
          onMouseDown={isActive ? handleMouseDown("min") : undefined}
          onTouchStart={isActive ? handleTouchStart("min") : undefined}
        />

        {/* Max thumb */}
        <div
          ref={maxThumbRef}
          className={`absolute w-4 h-4 ${
            isActive ? "bg-[#d8a878]" : "bg-gray-400"
          } rounded-full top-1/2 transform -translate-y-1/2 -ml-2 ${
            isActive ? "cursor-pointer" : "cursor-not-allowed"
          } ${isDragging === "max" ? "ring-2 ring-[#f5ede2]" : ""}`}
          style={{ left: `${maxPosition}%` }}
          onMouseDown={isActive ? handleMouseDown("max") : undefined}
          onTouchStart={isActive ? handleTouchStart("max") : undefined}
        />

        {/* Invisible input range for accessibility */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={range[0]}
          onChange={handleMinInputChange}
          className="sr-only"
          aria-label={`${title} minimum value`}
          disabled={!isActive}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={range[1]}
          onChange={handleMaxInputChange}
          className="sr-only"
          aria-label={`${title} maximum value`}
          disabled={!isActive}
        />
      </div>

      {/* Always show the range values but style differently based on active state */}
      <div className="mt-2">
        <span
          className={`${
            isActive
              ? "bg-[#f5ede2] text-[#816b4b]"
              : "bg-gray-100 text-gray-500"
          } text-xs font-medium px-2.5 py-0.5 rounded inline-flex items-center`}
        >
          {range[0]} - {range[1]}
          {isActive && (
            <button
              type="button"
              onClick={handleToggleActive}
              className="ml-1 hover:text-[#c4ad8c]"
            >
              ×
            </button>
          )}
        </span>
      </div>
    </div>
  );
};

export default RangeFilter;
