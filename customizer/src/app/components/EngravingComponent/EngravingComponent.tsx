import { useCanvasState } from "@/app/state/canvasState";
import React, { useEffect, useState } from "react";

enum Side {
  Right = 1,
  Left = 2,
  Axillary = 3, // "Піхви"
}
const EngravingComponent: React.FC = () => {
  interface CardItem {
    id: number;
    type: "text" | "file";
    selectedSide: number;
    font?: string;
    text?: string;
    selectedFile?: File | null;
  }

  const customState = useCanvasState();
  useEffect(() => {
    if (customState.engraving && customState.engraving.length > 0) {
      console.log(customState.engraving);
      const initialItems = customState.engraving.map(
        (engraving: any, index: number) => ({
          id: index,
          type: engraving.text === "" ? "file" : ("text" as "text" | "file"), // Додаємо тип
          selectedSide: engraving.side,
          font: engraving.font || "Montserrat",
          text: engraving.text || "",
          selectedFile: null,
        })
      );
      setItems(initialItems);
    }
  }, [customState.engraving]);
  const [items, setItems] = useState<CardItem[]>([]);

  const addCard = () => {
    setItems((prev) => [
      ...prev,
      {
        id: prev.length,
        type: "text",
        selectedSide: 1,
        font: "Montserrat",
        text: "",
      },
    ]);
    const newEngraving = {
      id: 1,
      name: "",
      pictureUrl: emptyImage,
      side: 1,
      text: "0",
      font: "",
      locationX: 0,
      locationY: 0,
      locationZ: 0,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,
    };
    customState.engraving = [...(customState.engraving || []), newEngraving];
    console.log("Added new card");
  };

  const removeCard = (id: number) => {
    setItems((prev) => {
      customState.engraving.splice(id, 1);
      const updatedItems = prev.filter((item) => item.id !== id);
      // Перенумеровуємо id
      return updatedItems.map((item, index) => ({ ...item, id: index }));
    });
    console.log(`Removed card with id: ${id}`);
  };
  function textToSvgUrl(
    text: string,
    fontFamily: string,
    color: string,
    fontSize: number = 100
  ): string {
    // Приблизна ширина тексту
    const textWidth = text.length * fontSize * 1;
    const textHeight = text.length * fontSize * 1;

    // Створюємо SVG
    const svg = `
      <svg 
        width="${textWidth}" 
        height="${textHeight}"
        viewBox="0 0 ${textWidth} ${textHeight}"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          x="50%"
          y="50%"
          dominant-baseline="middle"
          text-anchor="middle"
          font-family="${fontFamily}"
          font-size="${fontSize}"
          fill="${color}"
        >
          ${text}
        </text>
      </svg>
    `;

    // Конвертуємо в URL
    const blob = new Blob([svg], { type: "image/svg+xml" });
    return URL.createObjectURL(blob);
  }
  const handleTextChange = (id: number, value: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, text: value };
          customState.engraving[id].pictureUrl = textToSvgUrl(
            value,
            item.font ? item.font : "Montserrat",
            customState.bladeCoatingColor.engravingColorCode
              ? customState.bladeCoatingColor.engravingColorCode
              : "#000000"
          );
          customState.engraving[id].text = value;

          return updatedItem;
        }
        return item;
      })
    );
  };
  const emptyImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/ihGyysAAAAASUVORK5CYII=";

  // Функція для оновлення шрифту
  const handleFontChange = (id: number, value: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, font: value };
          customState.engraving[id].font = value;
          return updatedItem;
        }
        return item;
      })
    );
  };

  // Функція для оновлення сторони
  const handleSideChange = (id: number, value: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, selectedSide: value };
          customState.engraving[id].side = value;
          if (value === 2) {
            customState.engraving[id].rotationY = 90;
          } else {
            customState.engraving[id].rotationY = 0;
            console.log("000");
            console.log(customState.engraving[id].rotationY);
            console.log("000");
          }
          console.log(customState.engraving[id].rotationY);
          return updatedItem;
        }
        return item;
      })
    );
  };

  // Функція для обробки типу
  const handleTypeChange = (id: number, value: "text" | "file") => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, type: value };
          if (value === "file") {
            updatedItem.text = "";
            updatedItem.font = "";
            customState.engraving[id].text = "";
            customState.engraving[id].font = "";
          } else {
            updatedItem.selectedFile = null;
            customState.engraving[id].pictureUrl = emptyImage;
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  // Функція для обробки завантаження файлу
  const handleFileChange = (id: number, file: File | null) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, selectedFile: file };
          customState.engraving[id].pictureUrl = file
            ? URL.createObjectURL(file)
            : "";
          return updatedItem;
        }
        return item;
      })
    );
  };

  return (
    <div className="flex bg-gray-800 text-white min-h-screen">
      <div className="p-6 w-full max-w-4xl mx-auto">
        <button
          className="p-3 w-full bg-blue-900 rounded hover:bg-blue-600 transition text-white font-medium"
          onClick={addCard}
        >
          Додати гравіювання
        </button>

        <div className="mt-6 grid gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-lg bg-gray-700 relative hover:shadow-xl transition flex flex-col gap-4"
            >
              <button
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition"
                onClick={() => removeCard(item.id)}
              >
                &#x2716;
              </button>

              {item.type === "text" ? (
                <div className="flex flex-col gap-3">
                  <label>
                    <span className="block text-sm font-medium">Текст:</span>
                    <input
                      type="text"
                      className="rounded p-2 w-full bg-gray-600 text-white"
                      value={item.text || ""}
                      onChange={(e) =>
                        handleTextChange(item.id, e.target.value)
                      }
                    />
                  </label>
                  <label>
                    <span className="block text-sm font-medium">Шрифт:</span>
                    <select
                      className="rounded p-2 w-full bg-gray-600 text-white"
                      value={item.font || "Montserrat"}
                      onChange={(e) =>
                        handleFontChange(item.id, e.target.value)
                      }
                    >
                      <option
                        style={{ fontFamily: "Montserrat" }}
                        value="Montserrat"
                      >
                        Montserrat
                      </option>
                      <option style={{ fontFamily: "Arial" }} value="Arial">
                        Arial
                      </option>
                      <option
                        style={{ fontFamily: "Open Sans" }}
                        value="Open Sans"
                      >
                        Open Sans
                      </option>
                    </select>
                  </label>
                  <label>
                    <span className="block text-sm font-medium">Сторона:</span>
                    <select
                      className="rounded p-2 w-full bg-gray-600 text-white"
                      value={item.selectedSide}
                      onChange={(e) =>
                        handleSideChange(
                          item.id,
                          parseInt(e.target.value) as Side
                        )
                      }
                    >
                      <option value={Side.Right}>Права</option>
                      <option value={Side.Left}>Ліва</option>
                      <option value={Side.Axillary}>Піхви</option>
                    </select>
                  </label>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <label>
                    <span className="block text-sm font-medium">
                      Завантажити файл:
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="rounded p-2 w-full bg-gray-600 text-white"
                      onChange={(e) =>
                        handleFileChange(
                          item.id,
                          e.target.files ? e.target.files[0] : null
                        )
                      }
                    />
                  </label>
                  <label>
                    <span className="block text-sm font-medium">Сторона:</span>
                    <select
                      className="rounded p-2 w-full bg-gray-600 text-white"
                      value={item.selectedSide}
                      onChange={(e) =>
                        handleSideChange(
                          item.id,
                          parseInt(e.target.value) as Side
                        )
                      }
                    >
                      <option value={Side.Right}>Права</option>
                      <option value={Side.Left}>Ліва</option>
                      <option value={Side.Axillary}>Піхви</option>
                    </select>
                  </label>
                </div>
              )}

              <label>
                <span className="block text-sm font-medium">Тип:</span>
                <select
                  className="rounded p-2 w-full bg-gray-600 text-white"
                  value={item.type}
                  onChange={(e) =>
                    handleTypeChange(item.id, e.target.value as "text" | "file")
                  }
                >
                  <option value="text">Текст</option>
                  <option value="file">Фото</option>
                </select>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EngravingComponent;
