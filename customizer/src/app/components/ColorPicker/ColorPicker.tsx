"use client";
import React from "react";
import { Input } from "@nextui-org/react"; // Імпорт Input з NextUI для покращеного вигляду

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
    <div className="p-3 bg-white shadow-lg rounded-lg">
      <div className="mb-3">
        <h3 className="text-lg font-semibold"></h3>
      </div>
      <Input
        type="color"
        value={value}
        onChange={handleColorChange}
        aria-label="Color Picker"
        style={{
          padding: "10px 50px 10px 50px ",
          backgroundColor: "transparent",
          height: "6rem",
        }}
      />
    </div>
  );
};

export default ColorPicker;
