import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isVisible) {
      timer = setTimeout(() => {
        onClose();
      }, 5000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-16 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md max-w-xs flex justify-between items-center transform transition-transform duration-300 ${
        isVisible ? "translate-x-0" : "translate-x-full"
      } z-50`}
    >
      <div className="mr-2">{message}</div>
      <button
        onClick={onClose}
        className="text-green-700 hover:text-green-900 focus:outline-none"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
