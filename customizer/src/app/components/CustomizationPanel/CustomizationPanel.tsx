"use client";
import React, { useEffect } from "react";
import CustomizationPanelMenu from "./Menu/CustomizationPanelMenu";
import BladeShapeCustomizationComponent from "./Components/BladeShapeCustomizationComponent";
import HandleCustomizationComponent from "./Components/HandleCustomizationComponent";
import SheathCustomizationComponent from "./Components/SheathCustomizationComponent";
import BladeCoatingCustomizationComponent from "./Components/BladeCoatingCustomizationComponent";
import FasteningCustomizationComponent from "./Components/FasteningCustomizationComponent";
import { useState } from "react";
import EngravingComponent from "../EngravingComponent/EngravingComponent";
import BladeShapeService from "@/app/services/BladeShapeService";
import BladeCoatingColorService from "@/app/services/BladeCoatingColorService";
import SheathColorService from "@/app/services/SheathColorService";
import BladeShape from "@/app/Models/BladeShape";
import SheathColor from "@/app/Models/SheathColor";
import BladeCoatingColor from "@/app/Models/BladeCoatingColor";
import HandleColorService from "@/app/services/HandleColorService";
import { useCanvasState } from "@/app/state/canvasState";
import HandleColor from "@/app/Models/HandleColor";
import MenuCard from "./Menu/MenuCard";

const CustomizationPanel = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const bladeShapeService = new BladeShapeService();
  const bladeCoatingColorService = new BladeCoatingColorService();
  const handleColorsService = new HandleColorService();
  const sheathColorService = new SheathColorService();

  const state = useCanvasState();

  useEffect(() => {
    const fetchBladeShapes = async () => {
      try {
        const shapes = await bladeShapeService.getAllActive();
        const ColorCoatings = await bladeCoatingColorService.getAllActive();
        const handleColors = await handleColorsService.getAllActive();
        const sheaths = await sheathColorService.getAllActive();

        SelectByDefault(
          shapes[0],
          ColorCoatings[0],
          sheaths[0],
          handleColors[0]
        );
      } catch (error) {
        console.error("Error fetching blade shapes:", error);
      }
    };
    fetchBladeShapes();
  }, []);
  const scrollLeft = () => {
    const container = document.getElementById("scrollContainer");
    // @ts-ignore
    container.scrollBy({
      left: -200, // Прокрутка вліво на 200px
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    const container = document.getElementById("scrollContainer");
    // @ts-ignore
    container.scrollBy({
      left: 200, // Прокрутка вправо на 200px
      behavior: "smooth",
    });
  };
  const SelectByDefault = (
    shape: BladeShape,
    coatingcolor: BladeCoatingColor,
    sheath: SheathColor,
    hadleColor: HandleColor
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
    state.bladeCoatingColor = coatingcolor;
    state.handleColor = hadleColor;
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
          <div className="text-black">Виберіть опцію для кастомізації</div>
        );
    }
  };

  return (
    <div className="customization- flex flex-col col-3 row-1 h-full bg-white rounded-md">
      <div className="relative flex items-center">
        <div className="invis">
          <MenuCard
            icon={"icons/arrowLeft.svg"}
            tooltipText={""}
            onClick={() => scrollLeft()}
          />
        </div>
        <div
          className="overflow-x-auto mx-4 scrollbar-hide flex items-center"
          id="scrollContainer"
        >
          <CustomizationPanelMenu setSelectedOption={setSelectedOption} />
        </div>
        <div className="invis">
          <MenuCard
            icon={"icons/arrowRight.svg"}
            tooltipText={""}
            onClick={() => scrollRight()}
          />
        </div>
      </div>

      <div className="customization-content  mt-4 p-4 bg-white rounded scrollbar-hide flex-1 h-full overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default CustomizationPanel;
