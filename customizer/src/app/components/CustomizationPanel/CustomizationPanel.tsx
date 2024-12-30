import React from "react";
import CustomizationPanelMenu from "./Menu/CustomizationPanelMenu";
import BladeShapeCustomizationComponent from "./Components/BladeShapeCustomizationComponent";
import HandleCustomizationComponent from "./Components/HandleCustomizationComponent";
import SheathCustomizationComponent from "./Components/SheathCustomizationComponent";
import FasteningCustomizationComponent from "./Components/FasteningCustomizationComponent";
import BladeCoatingCustomizationComponent from "./Components/BladeCoatingsCustomizationComponent";
import Characteristics from "../Characteristics/Characteristics";
import { useState } from "react";

const CustomizationPanel =()=>{
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const renderContent = () => {
        switch (selectedOption) {
            case "bladeShape":
                return (
                    <BladeShapeCustomizationComponent/>
                );
            case "bladeCoating":
                return <BladeCoatingCustomizationComponent/>;
            case "handleColor":
                return <HandleCustomizationComponent/>;
            case "scabbardColor":
                return <SheathCustomizationComponent/>;
            case "attachments":
                return <FasteningCustomizationComponent/>;
            case "engraving":
                return <div>Компонент для гравіювання</div>;
            default:
                return <div>Виберіть опцію для кастомізації</div>;
        }
    };
    return (
        <div className="customization-panel flex flex-col h-full">
            <CustomizationPanelMenu setSelectedOption={setSelectedOption}/>
            <div className="customization-content mt-4 p-4 bg-gray-700 rounded flex-1">
                {renderContent()}
            </div>
        </div>
    );
}

export default CustomizationPanel;