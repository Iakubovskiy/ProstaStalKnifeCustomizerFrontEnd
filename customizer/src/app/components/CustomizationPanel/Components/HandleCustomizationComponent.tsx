import React, { useEffect, useState } from "react";
import HandleColorService from "../../../services/HandleColorService";
import CardComponent from "./CardComponent";

const HandleCustomizationComponent: React.FC = () => {
    const [handleColors, setHandleColors] = useState<HandleColor[]>([]);

    useEffect(() => {
        const fetchHandleColors = async () => {
            const service = new HandleColorService();
            const colors = await service.getAll();
            setHandleColors(colors);
        };

        fetchHandleColors();
    }, []);

    const handleColorClick = (colorCode: string) => {
        console.log("Selected color: ", colorCode);
    };

    return (
        <div className="grid grid-cols-3 gap-4">
            {handleColors.map((color) => (
                <CardComponent
                    key={color.id}
                    backgroundPicture={color.colorCode}
                    tooltipText={color.colorName}
                    onClick={() => handleColorClick(color.colorCode)}
                />
            ))}
        </div>
    );
};

export default HandleCustomizationComponent;
