import React from "react";
import CustomizationPanelMenu from "./Menu/CustomizationPanelMenu";
import { useState } from "react";

const CustomizationPanel =()=>{
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const renderContent = () => {
        switch (selectedOption) {
            case "bladeShape":
                return <div>Компонент для форми клинка</div>;
            case "bladeCoating":
                return <div>Компонент для покриття клинка</div>;
            case "handleColor":
                return <div>Компонент для кольору руків'я</div>;
            case "scabbardColor":
                return <div>Компонент для кольору піхв</div>;
            case "attachments":
                return <div>Компонент для кріплень</div>;
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