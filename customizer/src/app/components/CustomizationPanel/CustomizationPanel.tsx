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
import BladeShape from "@/app/Models/BladeShape";
import SheathColor from "@/app/Models/SheathColor";
import BladeCoatingColor from "@/app/Models/BladeCoatingColor";
import { useCanvasState } from "@/app/state/canvasState";
import HandleColor from "@/app/Models/HandleColor";
import MenuCard from "./Menu/MenuCard";
import InitialDataService from "@/app/services/InitialDataService";

const CustomizationPanel = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const initialDataService = new InitialDataService();

  const state = useCanvasState();

  useEffect(() => {
    const fetchBladeShapes = async () => {
      try {
        const initialData = await initialDataService.getData();

        SelectByDefault(
          initialData.bladeShape,
          initialData.bladeCoatingColor,
          initialData.sheathColor,
          initialData.handleColor,
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
