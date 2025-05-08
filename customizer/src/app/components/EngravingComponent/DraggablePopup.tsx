import React, { useRef, useState, useEffect } from "react";

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

  // Обробник натиснення миші
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

  // Обробник руху миші
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

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!popupRef.current || e.touches.length !== 1) return;

    const touch = e.touches[0];
    const rect = popupRef.current.getBoundingClientRect();

    setIsDragging(true);
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    });
    e.stopPropagation();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      const touch = e.touches[0];

      setPosition({
        x: touch.clientX - dragOffset.x,
        y: touch.clientY - dragOffset.y,
      });
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const cleanup = () => {
      setIsDragging(false);
    };

    window.addEventListener("mouseup", cleanup);
    window.addEventListener("touchend", cleanup);

    return () => {
      window.removeEventListener("mouseup", cleanup);
      window.removeEventListener("touchend", cleanup);
    };
  }, []);

  return isDetached ? (
    <div
      ref={popupRef}
      className="fixed z-50 w-96 rounded-2xl shadow-2xl border border-gray-300 bg-[#f4e7d8]"
      style={{ left: position.x, top: position.y }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="bg-[#f4e7d8] text-gray-900 rounded-t-2xl p-3 flex justify-between items-center cursor-move border-b border-gray-300"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
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
