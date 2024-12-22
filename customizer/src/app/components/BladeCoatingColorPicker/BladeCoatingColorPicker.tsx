"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@nextui-org/react";
import ColorPicker from "@/app/components/ColorPicker/ColorPicker";

interface BladeCoatingColor {
  id: number;
  color: string;
  colorCode: string;
  engravingColorCode: string;
}

const BladeCoatingColorComponent = ({
  value,
  isReadOnly1,
  onChange,
}: {
  value: BladeCoatingColor;
  isReadOnly1: boolean;
  onChange: (updatedValue: BladeCoatingColor) => void;
}) => {
  const [bladeCoatingColor, setBladeCoatingColor] =
    useState<BladeCoatingColor>(value);

  useEffect(() => {
    // Оновлення стану при зміні вхідного значення
    setBladeCoatingColor(value);
  }, [value]);

  const handleInputChange = (
    key: keyof BladeCoatingColor,
    newValue: string
  ) => {
    const updatedColor = { ...bladeCoatingColor, [key]: newValue };
    setBladeCoatingColor(updatedColor);
    onChange(updatedColor);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-md mx-auto">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Назва кольору
        </label>
        <Input
          defaultValue={bladeCoatingColor.color}
          onChange={(e) => handleInputChange("color", e.target.value)}
          placeholder="Введіть назву кольору"
          aria-label="Color Name"
          size="lg"
          {...(isReadOnly1 ? { isReadOnly: true } : {})}
          style={{ width: "100%" }}
        />
      </div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex-1 mr-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Колір
          </label>
          <ColorPicker
            value={bladeCoatingColor.colorCode}
            onChange={(value) => handleInputChange("colorCode", value)}
            {...(isReadOnly1 ? { isReadOnly: true } : {})}
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Колір гравіювання
          </label>
          <ColorPicker
            value={bladeCoatingColor.engravingColorCode}
            onChange={(value) => handleInputChange("engravingColorCode", value)}
            {...(isReadOnly1 ? { isReadOnly: true } : {})}
          />
        </div>
      </div>
      <style jsx>{`
        input[type="color"] {
          width: 3rem;
          height: 3rem;
          border-radius: 0;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default BladeCoatingColorComponent;
