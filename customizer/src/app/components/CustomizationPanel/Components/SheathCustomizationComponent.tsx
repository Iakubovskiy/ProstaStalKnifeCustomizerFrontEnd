import React, { useEffect, useState } from "react";
import SheathColorService from "../../../services/SheathColorService";
import CardComponent from "./CardComponent";
import SheathColor from "@/app/Models/SheathColor";
import { useCanvasState } from '@/app/state/canvasState';
import {color} from "framer-motion";

const SheathCustomizationComponent: React.FC = () => {
    const [sheathColors, setSheathColors] = useState<SheathColor[]>([]);
    const state = useCanvasState();

    useEffect(() => {
        const fetchSheathColors = async () => {
            const service = new SheathColorService();
            const colors = await service.getAll();
            console.log(colors);
            setSheathColors(colors);
        };

        fetchSheathColors();
    }, []);

    const sheathColorClick = (color: SheathColor) => {
        state.sheathColor = color;
    };

    return (
        <div className="grid grid-cols-3 gap-4">
            {sheathColors.map((color) => (
                <CardComponent
                    key={color.id}
                    backgroundPicture={color.colorCode}
                    tooltipText={color.colorName}
                    onClick={() => sheathColorClick(color)}
                />
            ))}
        </div>
    );
};

export default SheathCustomizationComponent;
