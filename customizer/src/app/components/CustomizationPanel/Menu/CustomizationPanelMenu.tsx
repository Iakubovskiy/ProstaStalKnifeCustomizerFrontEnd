import React from "react";
import MenuCard from "./MenuCard";

interface CustomizationPanelMenuProps {
    setSelectedOption: (option: string | null) => void;
}

const CustomizationPanelMenu: React.FC<CustomizationPanelMenuProps> = ({ setSelectedOption }) => {


    const menuOptions = [
        { id: "bladeShape", icon: "/icons/blade-shape.svg", tooltip: "Форми клинка" },
        { id: "bladeCoating", icon: "/icons/blade-coating.jpeg", tooltip: "Покриття клинка" },
        { id: "handleColor", icon: "/icons/handle.png", tooltip: "Колір руків'я" },
        { id: "scabbardColor", icon: "/icons/sheath.png", tooltip: "Колір піхв" },
        { id: "attachments", icon: "/icons/fastening.png", tooltip: "Кріплення" },
        { id: "engraving", icon: "/icons/laser-pen.svg", tooltip: "Гравіювання" },
    ];

    return (
        <div className="customization-menu grid grid-cols-2 gap-4 p-4 bg-gray-800 text-white">
            <div className="menu flex space-x-4 mb-4">
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
}

export default CustomizationPanelMenu;