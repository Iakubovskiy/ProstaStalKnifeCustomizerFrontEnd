"use client";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import CustomizationPanelMenu, {menuOptions} from "./Menu/CustomizationPanelMenu";
import BladeShapeCustomizationComponent from "./Components/BladeShapeCustomizationComponent";
import HandleCustomizationComponent from "./Components/HandleCustomizationComponent";
import SheathCustomizationComponent from "./Components/SheathCustomizationComponent";
import BladeCoatingCustomizationComponent from "./Components/BladeCoatingCustomizationComponent";
import FasteningCustomizationComponent from "./Components/AttachmentCustomizationComponent";
import EngravingComponent, {PositioningControls,} from "../EngravingComponent/EngravingComponent";
import {useCanvasState} from "@/app/state/canvasState";
import ArrowCard from "./Menu/ArrowCard";
import {XCircle} from "lucide-react";
import {Engraving} from "@/app/Interfaces/Engraving";
import {EngravingForCanvas} from "@/app/Interfaces/Knife/EngravingForCanvas";
import EngravingLibraryComponent from "@/app/components/CustomizationPanel/Components/EngravingLibraryComponent";


const CustomizationPanel = () => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
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
  const menuOptionsCount = 7;

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

  const openCurrentOption = (optionId: number) => {
    const currentOption = menuOptions[optionId];
    if (currentOption) {
      setSelectedOption(currentOption.id);
    }
  }

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
    if (isMobile && cardsPerPage === 1) {
      openCurrentOption(currentPage-1);
    }
  };
  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
    if (isMobile) {
      if (isMobile && cardsPerPage === 1) {
        openCurrentOption(currentPage+1);
      }
    }
  };

  const toggleMobilePositioningTarget = (id: number | null) => {
    setMobilePositioningTargetId((prevId) => (id === null || prevId === id ? null : id));
  };

  const replaceStrokeColor = (svgText: string, newColor: string): string => {
    return svgText.replace(
        /(<(path|g|svg)[^>]*style="[^"]*)stroke\s*:\s*#[0-9a-fA-F]{3,6}([^"]*)"/gi,
        (match, p1, tag, p3) => `${p1}stroke:${newColor}${p3}"`
    );
  };

  const createEngravingForCanvas = (libraryEngraving: Engraving): EngravingForCanvas => {
    if (!libraryEngraving.picture) {
      throw("Selected engraving from library has no picture.");
    }
    return {
      id: "",
      picture: { ...libraryEngraving.picture },
      pictureForLaser: libraryEngraving.pictureForLaser,
      side: 1,
      text: null,
      font: null,
      locationX: libraryEngraving.position?.locationX ?? 0,
      locationY: libraryEngraving.position?.locationY ?? 0,
      locationZ: libraryEngraving.position?.locationZ ?? 10,
      rotationX: libraryEngraving.rotation?.rotationX ?? 0,
      rotationY: libraryEngraving.rotation?.rotationY ?? 0,
      rotationZ: libraryEngraving.rotation?.rotationZ ?? 0,
      scaleX: libraryEngraving.scale?.scaleX ?? 20,
      scaleY: libraryEngraving.scale?.scaleY ?? 20,
      scaleZ: libraryEngraving.scale?.scaleZ ?? 20,
      name: libraryEngraving.name,
      fileObject: null
    };
  };

  const processSVGAndCreateFile = async (fileUrl: string, engravingColor: string): Promise<{url: string, file: File}> => {
    try {
      const response = await fetch(fileUrl);
      const svgText = await response.text();
      const coloredSvgText = replaceStrokeColor(svgText, engravingColor);

      const blob = new Blob([coloredSvgText], { type: "image/svg+xml" });
      const svgUrl = URL.createObjectURL(blob);
      const file = new File([blob], `library-engraving.svg`, { type: "image/svg+xml" });

      return { url: svgUrl, file };
    } catch (error) {
      console.error("Failed to process SVG:", error);
      throw error;
    }
  };

  const handleEngravingSelectedFromLibrary = async (libraryEngraving: Engraving) => {
    if (!libraryEngraving.picture) {
      console.error("Selected engraving from library has no picture.");
      return;
    }

    const newEngravingForCanvas = createEngravingForCanvas(libraryEngraving);

    const { fileUrl } = libraryEngraving.picture;
    const isSVG = fileUrl.endsWith(".svg");

    if (isSVG) {
      const engravingColor = state.bladeCoatingColor.engravingColorCode;
      const {url,file} = await processSVGAndCreateFile(fileUrl, engravingColor);

      newEngravingForCanvas.picture.fileUrl = url;
      newEngravingForCanvas.fileObject = file
    }

    state.engravings = [...state.engravings, newEngravingForCanvas];
    state.invalidate();
    setSelectedOption("engraving");
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
      case "engravingLibrary":
        return <EngravingLibraryComponent onSelect={handleEngravingSelectedFromLibrary} />;
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