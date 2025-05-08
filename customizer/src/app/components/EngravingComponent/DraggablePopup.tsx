import React, { useRef, useState } from "react";

export const DraggablePopup = ({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) => {
  const [isDetached, setIsDetached] = useState(true);
  const [position, setPosition] = useState({ x: 200, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const popupRef = useRef<HTMLDivElement | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!popupRef.current) return;
    const rect = popupRef.current.getBoundingClientRect();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    e.stopPropagation();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
      e.preventDefault();
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return isDetached ? (
    <div
      ref={popupRef}
      className="fixed z-50 w-96 rounded-2xl shadow-2xl border border-gray-300 bg-[#f4e7d8]"
      style={{ left: position.x, top: position.y }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        className="bg-[#f4e7d8] text-gray-900 rounded-t-2xl p-3 flex justify-between items-center cursor-move border-b border-gray-300"
        onMouseDown={handleMouseDown}
      >
        <span className="font-semibold">{title}</span>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 text-xl"
        >
          ×
        </button>
      </div>
      <div className="p-4">{children}</div>
    </div>
  ) : null;
};
