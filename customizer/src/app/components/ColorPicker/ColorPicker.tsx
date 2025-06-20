// /components/ColorPicker/ColorPicker.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Popover, PopoverTrigger, PopoverContent, Button } from '@nextui-org/react';
import { SketchPicker, ColorResult } from 'react-color';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleColorChange = (colorResult: ColorResult) => {
    onChange(colorResult.hex);
  };

  return (
    <Popover placement="bottom" isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Button
          variant="bordered"
          className="w-full justify-start"
          startContent={
            <div
              className="w-6 h-6 rounded-md border"
              style={{ backgroundColor: color }}
            />
          }
        >
          {color}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <SketchPicker
          color={color}
          onChangeComplete={handleColorChange}
          disableAlpha // Вимикаємо прозорість, якщо вона не потрібна
        />
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;