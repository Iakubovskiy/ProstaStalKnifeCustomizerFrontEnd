import React, { useState } from "react";
import { Trash2, Plus, Globe } from "lucide-react";

// Пропси компонента
interface LocalizedContentEditorProps {
  label: string; // Назва групи полів, наприклад "Назви" або "Коментарі"
  content: LocalizedContent | null | undefined; // Поточний об'єкт з локалізованими даними
  onContentChange: (newContent: LocalizedContent) => void; // Функція для оновлення стану батьківського компонента
}

interface LocalizedContent {
  [key: string]: string;
}

const LocalizedContentEditor: React.FC<LocalizedContentEditorProps> = ({
  label,
  content,
  onContentChange,
}) => {
  // Стан для нового ключа локалі (напр., 'en', 'pl')
  const [newLocaleKey, setNewLocaleKey] = useState("");
  const [error, setError] = useState("");

  // Перетворюємо об'єкт в масив для зручного рендерингу
  const contentArray = content ? Object.entries(content) : [];

  // Обробник зміни значення існуючого поля
  const handleValueChange = (locale: string, value: string) => {
    const newContent = { ...(content || {}), [locale]: value };
    onContentChange(newContent);
  };

  // Обробник видалення поля
  const handleDeleteLocale = (localeToDelete: string) => {
    const { [localeToDelete]: _, ...remainingContent } = content || {};
    onContentChange(remainingContent);
  };

  // Обробник додавання нового поля
  const handleAddLocale = () => {
    setError("");

    // Перевіряємо, що ключ не порожній і ще не існує
    if (!newLocaleKey.trim()) {
      setError("Код мови не може бути порожнім");
      return;
    }

    if (content && newLocaleKey in content) {
      setError("Цей код мови вже існує");
      return;
    }

    const newContent = { ...(content || {}), [newLocaleKey]: "" };
    onContentChange(newContent);
    setNewLocaleKey(""); // Очищуємо поле вводу
  };

  return (
    <div
      className="relative overflow-hidden rounded-xl shadow-lg"
      style={{
        background: "linear-gradient(135deg, #f8f4f0 0%, #f0e5d6 100%)",
      }}
    >
      {/* Декоративний елемент */}
      <div
        className="absolute top-0 right-0 w-32 h-32 opacity-10 transform rotate-12 translate-x-8 -translate-y-8"
        style={{ backgroundColor: "#8b7258" }}
      />

      <div className="relative p-6 space-y-6">
        {/* Заголовок */}
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: "#8b7258" }}
          >
            <Globe className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold" style={{ color: "#2d3748" }}>
            {label}
          </h3>
        </div>

        {/* Існуючі поля */}
        <div className="space-y-4">
          {contentArray.map(([locale, value]) => (
            <div
              key={locale}
              className="flex items-center gap-3 p-4 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
            >
              <div className="flex-shrink-0">
                <input
                  type="text"
                  value={locale}
                  readOnly
                  className="w-20 px-3 py-2 text-sm font-mono rounded-lg border-2 text-center font-medium"
                  style={{
                    borderColor: "#b8845f",
                    backgroundColor: "#f8f4f0",
                    color: "#2d3748",
                  }}
                />
              </div>

              <div className="flex-1">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleValueChange(locale, e.target.value)}
                  placeholder="Введіть значення..."
                  className="w-full px-4 py-2 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2"
                  style={{
                    borderColor: "#b8845f",
                    backgroundColor: "white",
                    color: "#2d3748",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#8b7258";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(139, 114, 88, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#b8845f";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <button
                onClick={() => handleDeleteLocale(locale)}
                className="flex-shrink-0 p-2 rounded-lg transition-all duration-200 hover:scale-105 group"
                style={{ backgroundColor: "#fee2e2" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#fecaca";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#fee2e2";
                }}
              >
                <Trash2 className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform duration-200" />
              </button>
            </div>
          ))}
        </div>

        {/* Додавання нового поля */}
        <div
          className="p-4 rounded-lg border-2 border-dashed transition-all duration-200"
          style={{
            borderColor: "#b8845f",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
          }}
        >
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={newLocaleKey}
              onChange={(e) => setNewLocaleKey(e.target.value.toLowerCase())}
              placeholder="напр., en, uk, pl"
              className="w-32 px-3 py-2 text-sm font-mono rounded-lg border-2 transition-all duration-200 focus:outline-none"
              style={{
                borderColor: "#b8845f",
                backgroundColor: "white",
                color: "#2d3748",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#8b7258";
                e.target.style.boxShadow = "0 0 0 3px rgba(139, 114, 88, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#b8845f";
                e.target.style.boxShadow = "none";
              }}
            />

            <button
              onClick={handleAddLocale}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-md text-white"
              style={{ backgroundColor: "#8b7258" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#6d5a47";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#8b7258";
              }}
            >
              <Plus className="w-4 h-4" />
              Додати поле
            </button>
          </div>

          {error && (
            <div className="mt-2 text-sm text-red-600 font-medium">{error}</div>
          )}
        </div>

        {/* Індикатор кількості полів */}
        {contentArray.length > 0 && (
          <div className="flex justify-center">
            <div
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: "rgba(139, 114, 88, 0.1)",
                color: "#8b7258",
              }}
            >
              {contentArray.length}{" "}
              {contentArray.length === 1
                ? "мова"
                : contentArray.length < 5
                ? "мови"
                : "мов"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocalizedContentEditor;
