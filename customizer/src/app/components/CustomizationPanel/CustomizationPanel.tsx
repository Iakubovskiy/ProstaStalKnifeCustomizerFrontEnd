"use client";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CustomizationPanelMenu from "./Menu/CustomizationPanelMenu";
import BladeShapeCustomizationComponent from "./Components/BladeShapeCustomizationComponent";
import HandleCustomizationComponent from "./Components/HandleCustomizationComponent";
import SheathCustomizationComponent from "./Components/SheathCustomizationComponent";
import BladeCoatingCustomizationComponent from "./Components/BladeCoatingCustomizationComponent";
import FasteningCustomizationComponent from "./Components/AttachmentCustomizationComponent";
import EngravingComponent, {
  PositioningControls,
} from "../EngravingComponent/EngravingComponent";
import { useCanvasState } from "@/app/state/canvasState";
import ArrowCard from "./Menu/ArrowCard";
import { XCircle } from "lucide-react";

const CustomizationPanel = () => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const state = useCanvasState();

  const [isMobile, setIsMobile] = useState(false);
  const [mobilePositioningTargetId, setMobilePositioningTargetId] = useState<
      number | null
  >(null);

  useEffect(() => {
    const handleResize = () => {
      const currentScreenWidth = window.innerWidth;
      setScreenWidth(currentScreenWidth);
      setIsMobile(currentScreenWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getCardsPerPage = (width: number): number => {
    if (width <= 0) return 1;
    if (width >= 480) return 2;
    return 1;
  };

  const cardsPerPage = getCardsPerPage(screenWidth);
  const menuOptionsCount = 6;

  useEffect(() => {
    if (menuOptionsCount > 0 && cardsPerPage > 0) {
      const newTotalPages = Math.ceil(menuOptionsCount / cardsPerPage);
      setTotalPages(newTotalPages);
      if (currentPage >= newTotalPages) {
        setCurrentPage(0);
      }
    } else {
      setTotalPages(1);
      setCurrentPage(0);
    }
  }, [cardsPerPage, currentPage, menuOptionsCount]);

  const goToPreviousPage = () =>
      setCurrentPage((prev) => Math.max(0, prev - 1));
  const goToNextPage = () =>
      setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));

  const toggleMobilePositioningTarget = (id: number | null) => {
    setMobilePositioningTargetId((prevId) => (id === null || prevId === id ? null : id));
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
        return (
            <EngravingComponent
                isMobileContext={isMobile}
                mobilePositioningTargetIdContext={mobilePositioningTargetId}
                onToggleMobilePositioningTarget={toggleMobilePositioningTarget}
            />
        );
      default:
        return (
            <div className="text-black text-center p-4 text-sm">
              {t("customizationPanel2.selectOptionPrompt")}
            </div>
        );
    }
  };

  const showNavigation = totalPages > 1;
  const isVerySmallScreen = screenWidth > 0 && screenWidth < 320;

  return (
      <div className="customization-panel flex flex-col h-full bg-white rounded-md shadow-sm min-w-[250px] overflow-hidden">
        {isMobile && mobilePositioningTargetId !== null && (
            <div
                className="detached-positioning-controls p-3 rounded-t-lg shadow-md border-b"
                style={{
                  background: "linear-gradient(to bottom, #f9f6f2, #f3eadf)",
                  borderColor: "#b8845f",
                  order: -1,
                }}
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-md font-semibold" style={{ color: "#2d3748" }}>
                  {t("customizationPanel2.positioningTitle", { id: mobilePositioningTargetId + 1 })}
                </h4>
                <button
                    onClick={() => toggleMobilePositioningTarget(null)}
                    className="p-1 rounded hover:bg-gray-200 active:bg-gray-300"
                    title={t("customizationPanel2.closePositioningPanelTooltip")}
                    style={{ color: "#8b7258" }}
                >
                  <XCircle size={20} />
                </button>
              </div>
              {mobilePositioningTargetId >= 0 &&
              mobilePositioningTargetId < state.engravings.length ? (
                  <PositioningControls id={mobilePositioningTargetId} />
              ) : (
                  <p className="text-xs text-red-500">
                    {t("customizationPanel2.engravingNotFoundError")}
                  </p>
              )}
            </div>
        )}

        <div
            className={`relative flex items-center border-b border-gray-100 ${
                isVerySmallScreen ? "p-1" : "p-2"
            } ${
                isMobile && mobilePositioningTargetId !== null
                    ? "rounded-b-lg"
                    : "rounded-t-lg"
            }`}
        >
          {showNavigation && (
              <ArrowCard
                  icon={"icons/arrowLeft.svg"}
                  tooltipText={t("customizationPanel2.previousPageTooltip")}
                  onClick={goToPreviousPage}
                  disabled={currentPage === 0}
                  isSmall={isVerySmallScreen}
              />
          )}
          <div
              className={`flex-1 overflow-hidden ${
                  showNavigation ? (isVerySmallScreen ? "mx-1" : "mx-2") : ""
              }`}
          >
            <CustomizationPanelMenu
                setSelectedOption={(option) => {
                  setSelectedOption(option);
                  if (option !== "engraving" && isMobile && mobilePositioningTargetId !== null) {
                    setMobilePositioningTargetId(null);
                  }
                }}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
          </div>
          {showNavigation && (
              <ArrowCard
                  icon={"icons/arrowRight.svg"}
                  tooltipText={t("customizationPanel2.nextPageTooltip")}
                  onClick={goToNextPage}
                  disabled={currentPage >= totalPages - 1 || totalPages === 0}
                  isSmall={isVerySmallScreen}
              />
          )}
        </div>

        <div
            className={`customization-content flex-1 p-2 sm:p-4 bg-white rounded-b-md overflow-y-auto overflow-x-hidden ${
                isMobile && mobilePositioningTargetId !== null ? "rounded-t-none" : ""
            }`}
        >
          {renderContent()}
        </div>
      </div>
  );
};

export default CustomizationPanel;