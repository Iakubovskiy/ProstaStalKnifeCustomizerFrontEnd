import React, { useState, useEffect } from "react";
import MenuCard from "./MenuCard";

interface CustomizationPanelMenuProps {
  setSelectedOption: (option: string | null) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const CustomizationPanelMenu: React.FC<CustomizationPanelMenuProps> = ({
  setSelectedOption,
  currentPage,
  setCurrentPage,
}) => {
  const [screenWidth, setScreenWidth] = useState<number>(0);

  const menuOptions = [
    {
      id: "bladeShape",
      name: "Форма клинка",
      icon: "/icons/blade-shape.svg",
      tooltip: "Форми клинка",
    },
    {
      id: "bladeCoating",
      name: "Покриття клинка",
      icon: "/icons/blade-coating.svg",
      tooltip: "Покриття клинка",
    },
    {
      id: "handleColor",
      name: "Колір руків'я",
      icon: "/icons/handle.svg",
      tooltip: "Колір руків'я",
    },
    {
      id: "scabbardColor",
      name: "Колір піхв",
      icon: "/icons/sheath.svg",
      tooltip: "Колір піхв",
    },
    {
      id: "attachments",
      name: "Кріплення",
      icon: "/icons/fastening.svg",
      tooltip: "Кріплення",
    },
    {
      id: "engraving",
      name: "Гравіювання",
      icon: "/icons/laser-pen.svg",
      tooltip: "Гравіювання",
    },
  ];

  const getCardsPerPage = (width: number): number => {
    if (width >= 480) return 2;
    return 1;
  };

  const cardsPerPage = getCardsPerPage(screenWidth);
  const totalPages = Math.ceil(menuOptions.length / cardsPerPage);

  const safePage = Math.min(currentPage, totalPages - 1);
  const startIndex = safePage * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentOptions = menuOptions.slice(startIndex, endIndex);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Set initial width
    setScreenWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset page when cards per page changes
  useEffect(() => {
    const newTotalPages = Math.ceil(menuOptions.length / cardsPerPage);
    if (currentPage >= newTotalPages && newTotalPages > 0) {
      setCurrentPage(0);
    }
  }, [cardsPerPage, currentPage, setCurrentPage, menuOptions.length]);

  const isVerySmallScreen = screenWidth > 0 && screenWidth < 320;

  return (
    <div className="customization-menu w-full">
      <div
        className={`menu-container w-full ${
          cardsPerPage === 2
            ? "grid grid-cols-2 gap-1 sm:gap-2"
            : cardsPerPage === 3
            ? "grid grid-cols-3 gap-1 sm:gap-2"
            : "flex flex-col"
        }`}
      >
        {currentOptions.map((option) => (
          <div key={option.id} className="w-full">
            <MenuCard
              icon={option.icon}
              name={option.name}
              tooltipText={option.tooltip}
              onClick={() => setSelectedOption(option.id)}
              isCompact={isVerySmallScreen}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomizationPanelMenu;
