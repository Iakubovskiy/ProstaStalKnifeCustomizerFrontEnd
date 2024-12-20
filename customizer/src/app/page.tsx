"use client";
import "@/styles/globals.css";
import { useState, useEffect } from "react";
import ColorPicker from "./components/ColorPicker/ColorPicker";

export default function Home() {
  const [color, setColor] = useState<string>("#ff0000"); // Початковий колір
  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    console.log(color);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">
          Color Picker Example
        </h1>
        <ColorPicker value={color} onChange={handleColorChange} />
      </div>
    </div>
  );
}
