import { Canvas } from "@react-three/fiber"; // Import Canvas from React Three Fiber
import CustomCanvas from "@/app/components/CustomCanvas/CustomCanvas";
import DragNDrop from "@/app/components/DragNDrop/DragNDrop";
import { useCanvasState } from "@/app/state/canvasState";
import EngravingConfigurator from "@/app/components/EngravingConfigurator/EngravingConfigurator";
import React, { useState } from "react";
import "../../styles/globals.css";
import EngravingComponent from "@/app/components/EngravingComponent/EngravingComponent";

const CustomizeEngraving: React.FC = () => {
  interface CardItem {
    id: number;
    type: "text" | "file";
    selectedSide: number;
    font?: string;
    text?: string;
    selectedFile?: File | null;
  }

  const [items, setItems] = useState<CardItem[]>([]);

  const addCard = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now(), type: "text", selectedSide: 1, font: "", text: "" },
    ]);
    console.log("Added new card");
  };

  const removeCard = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    console.log(`Removed card with id: ${id}`);
  };

  const handleInputChange = (id: number, field: keyof CardItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item };

          if (field === "type" && value === "file") {
            updatedItem.text = "";
            updatedItem.font = "";
          } else if (field === "type" && value === "text") {
            updatedItem.selectedFile = null;
          }

          updatedItem[field] = value;
          console.log(`Updated card ${id} field ${field} to`, value);
          return updatedItem;
        }
        return item;
      })
    );
  };

  return (
    <div className="flex h-screen">
      {/* Custom Canvas Section */}
      <div className="w-3/5 flex items-center justify-center">
        <CustomCanvas />
      </div>

      {/* Card Section */}
      <div className="w-2/5 p-4 flex flex-col gap-4">
        <button
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={addCard}
        >
          Add Card
        </button>

        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 border rounded shadow-md bg-white relative hover:shadow-lg transition"
          >
            <button
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition"
              onClick={() => removeCard(item.id)}
            >
              &#x2716;
            </button>
            <div className="flex flex-col gap-3">
              <label>
                <span className="block text-sm font-medium">Type:</span>
                <select
                  className="border rounded p-1 w-full"
                  value={item.type}
                  onChange={(e) =>
                    handleInputChange(item.id, "type", e.target.value)
                  }
                >
                  <option value="text">Text</option>
                  <option value="file">File</option>
                </select>
              </label>

              <label>
                <span className="block text-sm font-medium">Side:</span>
                <input
                  type="number"
                  className="border rounded p-1 w-full"
                  value={item.selectedSide}
                  onChange={(e) =>
                    handleInputChange(
                      item.id,
                      "selectedSide",
                      parseInt(e.target.value)
                    )
                  }
                />
              </label>

              {item.type === "text" && (
                <>
                  <label>
                    <span className="block text-sm font-medium">Text:</span>
                    <input
                      type="text"
                      className="border rounded p-1 w-full"
                      value={item.text}
                      onChange={(e) =>
                        handleInputChange(item.id, "text", e.target.value)
                      }
                    />
                  </label>
                  <label>
                    <span className="block text-sm font-medium">Font:</span>
                    <input
                      type="text"
                      className="border rounded p-1 w-full"
                      value={item.font}
                      onChange={(e) =>
                        handleInputChange(item.id, "font", e.target.value)
                      }
                    />
                  </label>
                </>
              )}

              {item.type === "file" && (
                <label>
                  <span className="block text-sm font-medium">File:</span>
                  <input
                    type="file"
                    className="border rounded p-1 w-full"
                    onChange={(e) =>
                      handleInputChange(
                        item.id,
                        "selectedFile",
                        e.target.files ? e.target.files[0] : null
                      )
                    }
                  />
                </label>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomizeEngraving;
