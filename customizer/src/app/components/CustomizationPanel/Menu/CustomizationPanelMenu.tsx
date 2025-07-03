import React, { useState, useEffect } from "react";
import MenuCard from "./MenuCard";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const [screenWidth, setScreenWidth] = useState<number>(0);

  const menuOptions = [
    {
      id: "bladeShape",
      nameKey: "customizationPanel.menu.bladeShape.name",
      tooltipKey: "customizationPanel.menu.bladeShape.tooltip",
      icon: "/icons/blade-shape.svg",
    },
    {
      id: "bladeCoating",
      nameKey: "customizationPanel.menu.bladeCoating.name",
      tooltipKey: "customizationPanel.menu.bladeCoating.tooltip",
      icon: "/icons/blade-coating.svg",
    },
    {
      id: "handleColor",
      nameKey: "customizationPanel.menu.handleColor.name",
      tooltipKey: "customizationPanel.menu.handleColor.tooltip",
      icon: "/icons/handle.svg",
    },
    {
      id: "scabbardColor",
      nameKey: "customizationPanel.menu.scabbardColor.name",
      tooltipKey: "customizationPanel.menu.scabbardColor.tooltip",
      icon: "/icons/sheath.svg",
    },
    {
      id: "attachments",
      nameKey: "customizationPanel.menu.attachments.name",
      tooltipKey: "customizationPanel.menu.attachments.tooltip",
      icon: "/icons/fastening.svg",
    },
    {
      id: "engraving",
      nameKey: "customizationPanel.menu.engraving.name",
      tooltipKey: "customizationPanel.menu.engraving.tooltip",
      icon: "/icons/laser-pen.svg",
    },
    {
      id: "engravingLibrary",
      nameKey: "customizationPanel.menu.engravingLibrary.name",
      tooltipKey: "customizationPanel.menu.engravingLibrary.tooltip",
      icon: "/icons/engravingLibrary.svg",
    },
  ] as const;

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

    setScreenWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
                    : "flex flex-col"
            }`}
        >
          {currentOptions.map((option) => (
              <div key={option.id} className="w-full">
                <MenuCard
                    icon={option.icon}
                    name={t(option.nameKey)}
                    tooltipText={t(option.tooltipKey)}
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