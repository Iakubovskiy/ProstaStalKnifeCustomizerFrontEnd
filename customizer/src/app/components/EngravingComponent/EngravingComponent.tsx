import {useCanvasState} from "@/app/state/canvasState";
import React, {useEffect, useState} from "react";
import Engraving from "@/app/Models/Engraving";

const PositioningControls: React.FC<{ id: number }> = ({ id }) => {
  const customState = useCanvasState();
  const engraving = customState.engravings[id];

  const [controls, setControls] = useState({
    positionX: engraving?.locationX ?? 0,
    positionY: engraving?.locationY ?? 0,
    rotationZ: ((engraving?.rotationZ ?? 0) * 180) / Math.PI,
    scale: engraving?.scaleX ?? 20,
  });

  const handleControlChange = (name: string, value: number) => {
    setControls((prev) => {
      const newControls = { ...prev, [name]: value };

      if (engraving) {
        const updatedEngraving = { ...engraving };

        switch (name) {
          case "positionX":
            updatedEngraving.locationX = value;
            break;
          case "positionY":
            updatedEngraving.locationY = value;
            break;
          case "rotationZ":
            updatedEngraving.rotationZ = (value * Math.PI) / 180;
            break;
          case "scale":
            updatedEngraving.scaleX = value;
            updatedEngraving.scaleY = value;
            updatedEngraving.scaleZ = value;
            break;
        }

        const newEngravings = [...customState.engravings];
        newEngravings[id] = updatedEngraving;
        customState.engravings = newEngravings;
      }

      return newControls;
    });
  };
  useEffect(() => {
    if (engraving) {
      setControls({
        positionX: engraving.locationX,
        positionY: engraving.locationY,
        rotationZ: (engraving.rotationZ * 180) / Math.PI,
        scale: engraving.scaleX,
      });
    }
  }, [engraving]);

  return (
    <div className="mt-4 grid gap-3">
      <div className="border-t border-gray-600 pt-4">
        <h3 className="text-sm font-medium mb-3">
          Налаштування позиціонування
        </h3>

        <div className="grid gap-3">
          <div>
            <label className="block text-sm mb-1">
              Горизонтальне розміщення: {controls.positionX.toFixed(1)}
            </label>
            <input
              type="range"
              min="-5"
              max="40"
              step="0.1"
              value={controls.positionX}
              onChange={(e) =>
                handleControlChange("positionX", parseFloat(e.target.value))
              }
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Вертикальне розміщення: {controls.positionY.toFixed(1)}
            </label>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.1"
              value={controls.positionY}
              onChange={(e) =>
                handleControlChange("positionY", parseFloat(e.target.value))
              }
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Кут повороту: {controls.rotationZ.toFixed(0)}°
            </label>
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={controls.rotationZ}
              onChange={(e) =>
                handleControlChange("rotationZ", parseFloat(e.target.value))
              }
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Розмір: {controls.scale.toFixed(1)}
            </label>
            <input
              type="range"
              min="0.1"
              max="30"
              step="0.1"
              value={controls.scale}
              onChange={(e) =>
                handleControlChange("scale", parseFloat(e.target.value))
              }
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

enum Side {
  Right = 1,
  Left = 2,
  Axillary = 3,
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
    if (customState.engravings && customState.engravings.length > 0) {
      console.log(customState.engravings);
      const initialItems = customState.engravings.map(
        (engraving: Engraving, index: number) => ({
          id: index,
          type: engraving.text === "" ? "file" : ("text" as "text" | "file"),
          selectedSide: engraving.side,
          font: engraving.font || "Montserrat",
          text: engraving.text || "",
          selectedFile: null,
        })
      );
      setItems(initialItems);
    }
  }, [customState.engravings]);
  const [items, setItems] = useState<CardItem[]>([]);

  const removeCard = (id: number) => {
    setItems((prev) => {
      customState.engravings.splice(id, 1);
      const updatedItems = prev.filter((item) => item.id !== id);
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
    const textWidth = text.length * fontSize * 1;
    const textHeight = text.length * fontSize * 1;

    const svg = `
      <svg 
        width="${textWidth}" 
        height="${textHeight}"
        viewBox="0 0 ${textWidth} ${textHeight}"
        xmlns="http://www.w3.org/2000/svg"
        
      >
        <rect 
      width="100%" 
      height="100%" 
      fill="none" 
    />
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

    const blob = new Blob([svg], { type: "image/svg+xml" });
    return URL.createObjectURL(blob);
  }

  const emptyImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/ihGyysAAAAASUVORK5CYII=";

  const handleFontChange = (id: number, value: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, font: value };
          customState.engravings[id].font = value;
          return updatedItem;
        }
        return item;
      })
    );
  };

  const handleSideChange = (id: number, value: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, selectedSide: value };
          customState.engravings[id].side = value;
          if (value === 2) {
            customState.engravings[id].rotationY = 90;
          } else {
            customState.engravings[id].rotationY = 0;
            console.log(customState.engravings[id].rotationY);
          }
          console.log(customState.engravings[id].rotationY);
          return updatedItem;
        }
        return item;
      })
    );
  };

  const handleTypeChange = (id: number, value: "text" | "file") => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, type: value };
          if (value === "file") {
            updatedItem.text = "";
            updatedItem.font = "";
            customState.engravings[id].text = "";
            customState.engravings[id].font = "";
          } else {
            updatedItem.selectedFile = null;
            customState.engravings[id].pictureUrl = emptyImage;
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const handleTextChange = (id: number, value: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, text: value };
          const newUrl = textToSvgUrl(
              value,
              item.font ?? "Montserrat",
              customState.bladeCoatingColor.engravingColorCode || "#000000"
          );
          const engraving = customState.engravings[id];
          if (engraving) {
            engraving.text = value;
            engraving.pictureUrl = newUrl;
            engraving.locationX ??= 0;
            engraving.locationY ??= 0;
            engraving.locationZ ??= 0;
            engraving.rotationX ??= 0;
            engraving.rotationY ??= 0;
            engraving.rotationZ ??= 0;
            engraving.scaleX ??= 20;
            engraving.scaleY ??= 20;
            engraving.scaleZ ??= 20;
          }

          customState.engravings[id].text = value;
          customState.engravings[id].pictureUrl = newUrl;

          return updatedItem;
        }
        return item;
      })
    );
  };

  const handleFileChange = (id: number, file: File | null) => {
    const updatedEngravings = [...customState.engravings];

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, selectedFile: file };

          updatedEngravings[id] = {
            ...updatedEngravings[id],
            pictureUrl: file ? URL.createObjectURL(file) : emptyImage,
            locationX: updatedEngravings[id]?.locationX ?? 0,
            locationY: updatedEngravings[id]?.locationY ?? 0,
            locationZ: updatedEngravings[id]?.locationZ ?? 0,
            rotationX: updatedEngravings[id]?.rotationX ?? 0,
            rotationY: updatedEngravings[id]?.rotationY ?? 0,
            rotationZ: updatedEngravings[id]?.rotationZ ?? 0,
            scaleX: updatedEngravings[id]?.scaleX ?? 20,
            scaleY: updatedEngravings[id]?.scaleY ?? 20,
            scaleZ: updatedEngravings[id]?.scaleZ ?? 20,
          };

          return updatedItem;
        }
        return item;
      })
    );

    customState.engravings = updatedEngravings;
  };

  const addCard = () => {
    const newId = items.length;

    const newEngraving = {
      id: "",
      name: "",
      pictureUrl: emptyImage,
      side: 1,
      text: "",
      font: "Montserrat",
      locationX: 0,
      locationY: 0,
      locationZ: 0,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      scaleX: 20,
      scaleY: 20,
      scaleZ: 20,
    };

    setItems((prev) => [
      ...prev,
      {
        id: newId,
        type: "text",
        selectedSide: 1,
        font: "Montserrat",
        text: "",
      },
    ]);

    customState.engravings = [...customState.engravings, newEngraving];
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
                <div key={item.id}>
                  <label>
                    <span className="block text-sm font-medium">Тип:</span>
                    <select
                        className="rounded p-2 w-full bg-gray-600 text-white"
                        value={item.type || "text"} // Фікс для уникнення undefined
                        onChange={(e) =>
                            handleTypeChange(item.id, e.target.value as "text" | "file")
                        }
                    >
                      <option value="text">Текст</option>
                      <option value="file">Фото</option>
                    </select>
                  </label>
                  <div className="p-5 rounded-lg bg-gray-700 relative hover:shadow-xl transition flex flex-col gap-4">
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
                                value={item.text || ""} // Фікс: гарантує, що value завжди є
                                onChange={(e) =>
                                    handleTextChange(item.id, e.target.value)
                                }
                            />
                          </label>
                          <label>
                            <span className="block text-sm font-medium">Шрифт:</span>
                            <select
                                className="rounded p-2 w-full bg-gray-600 text-white"
                                value={item.font || "Montserrat"} // Фікс
                                onChange={(e) =>
                                    handleFontChange(item.id, e.target.value)
                                }
                            >
                              <option style={{ fontFamily: "Montserrat" }} value="Montserrat">
                                Montserrat
                              </option>
                              <option style={{ fontFamily: "Arial" }} value="Arial">
                                Arial
                              </option>
                              <option style={{ fontFamily: "Open Sans" }} value="Open Sans">
                                Open Sans
                              </option>
                            </select>
                          </label>
                          <label>
                            <span className="block text-sm font-medium">Сторона:</span>
                            <select
                                className="rounded p-2 w-full bg-gray-600 text-white"
                                value={item.selectedSide ?? Side.Right} // Фікс
                                onChange={(e) =>
                                    handleSideChange(item.id, parseInt(e.target.value) as Side)
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
                            <span className="block text-sm font-medium">Завантажити файл:</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="rounded p-2 w-full bg-gray-600 text-white"
                                onChange={(e) =>
                                    handleFileChange(item.id, e.target.files ? e.target.files[0] : null)
                                }
                            />
                          </label>
                          <label>
                            <span className="block text-sm font-medium">Сторона:</span>
                            <select
                                className="rounded p-2 w-full bg-gray-600 text-white"
                                value={item.selectedSide ?? Side.Right} // Фікс
                                onChange={(e) =>
                                    handleSideChange(item.id, parseInt(e.target.value) as Side)
                                }
                            >
                              <option value={Side.Right}>Права</option>
                              <option value={Side.Left}>Ліва</option>
                              <option value={Side.Axillary}>Піхви</option>
                            </select>
                          </label>
                        </div>
                    )}
                  </div>
                  <PositioningControls id={item.id} />
                </div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default EngravingComponent;
