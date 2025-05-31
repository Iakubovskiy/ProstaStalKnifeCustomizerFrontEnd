"use client";
import React, { useEffect, useState } from "react";
import CustomizationPanelMenu from "./Menu/CustomizationPanelMenu";
import BladeShapeCustomizationComponent from "./Components/BladeShapeCustomizationComponent";
import HandleCustomizationComponent from "./Components/HandleCustomizationComponent";
import SheathCustomizationComponent from "./Components/SheathCustomizationComponent";
import BladeCoatingCustomizationComponent from "./Components/BladeCoatingCustomizationComponent";
import FasteningCustomizationComponent from "./Components/FasteningCustomizationComponent";
import EngravingComponent from "../EngravingComponent/EngravingComponent";
import BladeShape from "@/app/Models/BladeShape";
import SheathColor from "@/app/Models/SheathColor";
import BladeCoatingColor from "@/app/Models/BladeCoatingColor";
import { useCanvasState } from "@/app/state/canvasState";
import HandleColor from "@/app/Models/HandleColor";
import InitialDataService from "@/app/services/InitialDataService";
import ArrowCard from "./Menu/ArrowCard";

const CustomizationPanel = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const initialDataService = new InitialDataService();

  const state = useCanvasState();

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchBladeShapes = async () => {
      try {
        const initialData = await initialDataService.getData();

        SelectByDefault(
          initialData.bladeShape,
          initialData.bladeCoatingColor,
          initialData.sheathColor,
          initialData.handleColor
        );
      } catch (error) {
        console.error("Error fetching blade shapes:", error);
      }
    };
    fetchBladeShapes();
  }, []);

  // Calculate total pages based on screen width
  const getCardsPerPage = (width: number): number => {
    if (width >= 480) return 2;
    return 1;
  };

  const cardsPerPage = getCardsPerPage(screenWidth);
  const menuOptionsCount = 6; // Total number of menu options

  useEffect(() => {
    const newTotalPages = Math.ceil(menuOptionsCount / cardsPerPage);
    setTotalPages(newTotalPages);

    // Reset to first page if current page is out of bounds
    if (currentPage >= newTotalPages) {
      setCurrentPage(0);
    }
  }, [cardsPerPage, currentPage, menuOptionsCount]);

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  const SelectByDefault = (
    shape: BladeShape,
    coatingColor: BladeCoatingColor,
    sheath: SheathColor,
    handleColor: HandleColor
  ) => {
    state.bladeShape = {
      ...state.bladeShape,
      id: shape.id,
      name: shape.name,
      price: shape.price,
      totalLength: shape.totalLength,
      bladeLength: shape.bladeLength,
      bladeWidth: shape.bladeWidth,
      bladeWeight: shape.bladeWeight,
      sharpeningAngle: shape.sharpeningAngle,
      rockwellHardnessUnits: shape.rockwellHardnessUnits,
      bladeShapeModelUrl: shape.bladeShapeModelUrl,
      sheathModelUrl: shape.sheathModelUrl,
    };
    state.bladeCoatingColor = coatingColor;
    state.handleColor = handleColor;
    state.sheathColor = sheath;
  };

  const renderContent = () => {
    switch (selectedOption) {
      case "bladeShape":
        return <BladeShapeCustomizationComponent />;
      case "bladeCoating":
        return <BladeCoatingCustomizationComponent />;
      case "handleColor":
        return <HandleCustomizationComponent />;
      case "scabbardColor":
        return <SheathCustomizationComponent />;
      case "attachments":
        return <FasteningCustomizationComponent />;
      case "engraving":
        return <EngravingComponent />;
      default:
        return (
          <div className="text-black text-center p-4 text-sm">
            Виберіть опцію для кастомізації
          </div>
        );
    }
  };

  // Determine if we should show navigation arrows
  const showNavigation = totalPages > 1;
  const isVerySmallScreen = screenWidth > 0 && screenWidth < 320;

  return (
    <div className="customization-panel flex flex-col h-full bg-white rounded-md shadow-sm min-w-[250px]">
      {/* Navigation Header */}
      <div
        className={`relative flex items-center border-b border-gray-100 ${
          isVerySmallScreen ? "p-1" : "p-2"
        }`}
      >
        {showNavigation && (
          <ArrowCard
            icon={"icons/arrowLeft.svg"}
            tooltipText={"Попередня сторінка"}
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            isSmall={isVerySmallScreen}
          />
        )}

        <div
          className={`flex-1 ${
            showNavigation ? (isVerySmallScreen ? "mx-1" : "mx-2") : ""
          }`}
        >
          <CustomizationPanelMenu
            setSelectedOption={setSelectedOption}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>

        {showNavigation && (
          <ArrowCard
            icon={"icons/arrowRight.svg"}
            tooltipText={"Наступна сторінка"}
            onClick={goToNextPage}
            disabled={currentPage >= totalPages - 1}
            isSmall={isVerySmallScreen}
          />
        )}
      </div>

      {/* Content Area */}
      <div className="customization-content flex-1 p-2 sm:p-4 bg-white rounded-b-md overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default CustomizationPanel;
