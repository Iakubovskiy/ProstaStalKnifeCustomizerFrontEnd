import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  defaultValue?: string;
  debounceMs?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Пошук товарів...",
  onSearch,
  defaultValue = "",
  debounceMs = 300,
}) => {
  const [query, setQuery] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, onSearch, debounceMs]);

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="relative w-full max-w-lg">
      <div
        className={`
          relative flex items-center bg-white border-2 rounded-lg transition-all duration-200
          ${
            isFocused
              ? "border-[#d8a878] shadow-md"
              : "border-gray-200 hover:border-gray-300"
          }
        `}
      >
        <div className="flex items-center pl-3">
          <Search
            className={`w-5 h-5 transition-colors duration-200 ${
              isFocused ? "text-[#d8a878]" : "text-gray-400"
            }`}
          />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full py-3 px-3 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500"
        />

        {query && (
          <button
            onClick={handleClear}
            className="flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search suggestions could be added here */}
      {query && isFocused && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          <div className="p-3 text-sm text-gray-500 border-b">
            Пошук: "{query}"
          </div>
          {/* Add search suggestions here if needed */}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
