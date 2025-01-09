import React from "react";
import CustomizationPanelMenu from "./Menu/CustomizationPanelMenu";
import BladeShapeCustomizationComponent from "./Components/BladeShapeCustomizationComponent";
import HandleCustomizationComponent from "./Components/HandleCustomizationComponent";
import SheathCustomizationComponent from "./Components/SheathCustomizationComponent";
import FasteningCustomizationComponent from "./Components/FasteningCustomizationComponent";
import BladeCoatingCustomizationComponent from "./Components/BladeCoatingsCustomizationComponent";
import Characteristics from "../Characteristics/Characteristics";
import { useState } from "react";
import EngravingComponent from "../EngravingComponent/EngravingComponent";
import BladeShapeService from "@/app/services/BladeShapeService";
import BladeCoatingService from "@/app/services/BladeCoatingService";
import BladeCoatingColorService from "@/app/services/BladeCoatingColorService";
import SheathColorService from "@/app/services/SheathColorService";
import BladeShape from "@/app/Models/BladeShape";
import BladeCoating from "@/app/Models/BladeCoating";
import SheathColor from "@/app/Models/SheathColor";
import BladeCoatingColor from "@/app/Models/BladeCoatingColor";
import HandleColorService from "@/app/services/HandleColorService";
import { useCanvasState } from "@/app/state/canvasState";
import HandleColor from "@/app/Models/HandleColor";

const CustomizationPanel = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const bladeShapeService = new BladeShapeService();
  const bladeCoatingService = new BladeCoatingService();
  const handleColors = new HandleColorService();
  const SheathColorservice = new SheathColorService();

  const state = useCanvasState();

  let detailedCoatings;
  const fetchBladeShapes = async () => {
    try {
      const shapes = await bladeShapeService.getAll();
      const coatings = await bladeCoatingService.getAll();
      const detailedCoatings: {
        coating: BladeCoating;
        color: BladeCoatingColor;
      }[] = [];

      for (const coating of coatings) {
        const detailedCoating = await bladeCoatingService.getById(coating.id);
        detailedCoating.colors.forEach((color: BladeCoatingColor) => {
          detailedCoatings.push({
            coating: detailedCoating,
            color: color,
          });
        });
      }
      const handlecolors = await handleColors.getAll();
      const sheaths = await SheathColorservice.getAll();
      console.log(coatings);
      SelectByDefault(
        shapes[0],
        detailedCoatings[0].coating,
        detailedCoatings[0].color,
        sheaths[0],
        handlecolors[0]
      );
    } catch (error) {
      console.error("Error fetching blade shapes:", error);
    }
  };

  const SelectByDefault = (
    shape: BladeShape,
    coating: BladeCoating,
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
      engravingLocationX: shape.engravingLocationX,
      engravingLocationY: shape.engravingLocationY,
      engravingLocationZ: shape.engravingLocationZ,
      engravingRotationX: shape.engravingRotationX,
      engravingRotationY: shape.engravingRotationY,
      engravingRotationZ: shape.engravingRotationZ,
      bladeShapeModelUrl: shape.bladeShapeModelUrl,
      sheathModelUrl: shape.sheathModelUrl,
    };
    state.bladeCoating = coating;
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
        return <div>ше не робить</div>;
      case "engraving":
        return <EngravingComponent />;

      default:
        return <div>Виберіть опцію для кастомізації</div>;
    }
  };

  fetchBladeShapes();
  return (
    <div className="customization-panel flex flex-col h-full bg-gray-800">
      <CustomizationPanelMenu setSelectedOption={setSelectedOption} />
      <div className="customization-content mt-4 p-4 bg-gray-700 rounded flex-1 h-full overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default CustomizationPanel;
