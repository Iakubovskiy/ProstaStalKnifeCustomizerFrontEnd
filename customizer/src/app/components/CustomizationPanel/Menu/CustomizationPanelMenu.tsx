import React from "react";
import MenuCard from "./MenuCard";

interface CustomizationPanelMenuProps {
  setSelectedOption: (option: string | null) => void;
}

const CustomizationPanelMenu: React.FC<CustomizationPanelMenuProps> = ({
  setSelectedOption,
}) => {
  const menuOptions = [
    {
      id: "bladeShape",
      icon: "/icons/blade-shape.svg",
      tooltip: "Форми клинка",
    },
    {
      id: "bladeCoating",
      icon: "/icons/blade-coating.svg",
      tooltip: "Покриття клинка",
    },
    { id: "handleColor", icon: "/icons/handle.svg", tooltip: "Колір руків'я" },
    { id: "scabbardColor", icon: "/icons/sheath.svg", tooltip: "Колір піхв" },
    { id: "attachments", icon: "/icons/fastening.svg", tooltip: "Кріплення" },
    { id: "engraving", icon: "/icons/laser-pen.svg", tooltip: "Гравіювання" },
  ];

  return (
    <div className="customization-menu bg-white text-white">
      <div
        id="scrollContainer"
        className="menu flex space-x-4 overflow-x-auto   scrollbar-hide"
      >
        {menuOptions.map((option) => (
          <MenuCard
            key={option.id}
            icon={option.icon}
            tooltipText={option.tooltip}
            onClick={() => setSelectedOption(option.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default CustomizationPanelMenu;
