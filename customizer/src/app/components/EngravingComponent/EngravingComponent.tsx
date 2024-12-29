import React, { useState } from "react";
import DragNDrop from "../DragNDrop/DragNDrop";

enum Side {
  Front = 1,
  Back = 2,
  Sheath = 3,
}

interface EngravingComponentProps {
  onTextChange: (text: string) => void;
  onFontChange: (font: string) => void;
  onSideChange: (side: Side) => void;
  onFileSelected: (file: File | null) => void;
}

const EngravingComponent: React.FC<EngravingComponentProps> = ({
  onTextChange,
  onFontChange,
  onSideChange,
  onFileSelected,
}) => {
  const [activeTab, setActiveTab] = useState<"text" | "images">("text");
  const [selectedSide, setSelectedSide] = useState<Side>(Side.Front);
  const [text, setText] = useState<string>("");
  const [font, setFont] = useState<string>("");

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setText(newText);
    onTextChange(newText); // Відправляємо текст в батьківський компонент
  };

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFont = e.target.value;
    setFont(newFont);
    onFontChange(newFont); // Відправляємо шрифт в батьківський компонент
  };

  const handleSideChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSide = Number(e.target.value) as Side;
    setSelectedSide(newSide);
    onSideChange(newSide); // Відправляємо сторону в батьківський компонент
  };

  const handleFileSelected = (file: File | null) => {
    onFileSelected(file); // Відправляємо файл в батьківський компонент
  };

  return (
    <div className="tabs-container">
      <div className="tabs">
        <button
          onClick={() => setActiveTab("text")}
          className={activeTab === "text" ? "active" : ""}
        >
          Текст
        </button>
        <button
          onClick={() => setActiveTab("images")}
          className={activeTab === "images" ? "active" : ""}
        >
          Картинки
        </button>
      </div>

      {activeTab === "text" && (
        <div className="text-tab">
          <label>
            Вибір шрифту:
            <select value={font} onChange={handleFontChange}>
              <option value="Arial">Arial</option>
              <option value="Verdana">Verdana</option>
              <option value="Times New Roman">Times New Roman</option>
              {/* Додайте інші шрифти при необхідності */}
            </select>
          </label>

          <label>
            Вибір сторони:
            <select value={selectedSide} onChange={handleSideChange}>
              <option value={Side.Front}>Front</option>
              <option value={Side.Back}>Back</option>
              <option value={Side.Sheath}>Sheath</option>
            </select>
          </label>

          <div>
            <label>Введіть текст:</label>
            <input
              type="text"
              value={text}
              onChange={handleTextChange}
              className="text-input"
            />
          </div>
        </div>
      )}

      {activeTab === "images" && (
        <div className="images-tab">
          <label>
            Вибір сторони:
            <select value={selectedSide} onChange={handleSideChange}>
              <option value={Side.Front}>Front</option>
              <option value={Side.Back}>Back</option>
              <option value={Side.Sheath}>Sheath</option>
            </select>
          </label>

          <div>
            <DragNDrop
              onFileSelected={handleFileSelected}
              validExtensions={[".jpeg", ".png"]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EngravingComponent;
