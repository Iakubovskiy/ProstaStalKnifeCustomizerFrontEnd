import React, { useEffect, useState } from "react";
import HandleColorService from "../../../services/HandleColorService";
import HandleColor from "../../../Models/HandleColor";
import CardComponent from "./CardComponent";
import { useCanvasState } from '@/app/state/canvasState';

const HandleCustomizationComponent: React.FC = () => {
    const [handleColors, setHandleColors] = useState<HandleColor[]>([]);
    const state = useCanvasState();

    useEffect(() => {
        const fetchHandleColors = async () => {
            const service = new HandleColorService();
            const colors = await service.getAll();
            setHandleColors(colors);
        };

        fetchHandleColors();
    }, []);

    const handleColorClick = (color:HandleColor ) => {
        state.handleColor = color.colorCode;
    };

    return (
        <div className="grid grid-cols-3 gap-4">
            {handleColors.map((color) => (
                <CardComponent
                    key={color.id}
                    backgroundPicture={color.colorCode}
                    tooltipText={color.colorName}
                    onClick={() => handleColorClick(color)}
                />
            ))}
        </div>
    );
};

export default HandleCustomizationComponent;
