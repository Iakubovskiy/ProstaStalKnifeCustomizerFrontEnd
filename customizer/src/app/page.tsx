"use client";
import "@/styles/globals.css";
import { useState } from "react";
import BladeCoatingColorComponent from "./components/BladeCoatingColorPicker/BladeCoatingColorPicker";

export default function Home() {
  const [bladeCoatingColor, setBladeCoatingColor] = useState<BladeCoatingColor>(
    {
      id: 1,
      color: "Black",
      colorCode: "#000000",
      engravingColorCode: "#ffffff",
    }
  );

  const handleBladeCoatingColorChange = (
    updatedValue: typeof bladeCoatingColor
  ) => {
    console.log("Оновлене значення:", updatedValue);
    setBladeCoatingColor(updatedValue);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Blade Coating Color Manager</h1>
      <BladeCoatingColorComponent
        value={bladeCoatingColor}
        isReadOnly1={false} // Зробіть true, щоб заблокувати інпут
        onChange={handleBladeCoatingColorChange}
      />
      <pre className="mt-4 bg-gray-100 p-4 rounded">
        <strong>Поточний стан:</strong>{" "}
        {JSON.stringify(bladeCoatingColor, null, 2)}
      </pre>
    </div>
  );
}
