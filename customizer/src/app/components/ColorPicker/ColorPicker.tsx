"use client";
import React from "react";
import { Input } from "@nextui-org/react";
import "./style.css";

const ColorPicker = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) => {
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition duration-200">
      <div className="mb-2">
        <h3 className="text-md font-medium text-black"></h3>
      </div>
      <Input
        type="color"
        value={value}
        onChange={handleColorChange}
        aria-label="Color Picker"
        style={{
          width: "100%",
          padding: "0.5rem",
          backgroundColor: "#f9f9f9",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          height: "8rem",
          cursor: "pointer",
        }}
        className="focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
};

export default ColorPicker;
