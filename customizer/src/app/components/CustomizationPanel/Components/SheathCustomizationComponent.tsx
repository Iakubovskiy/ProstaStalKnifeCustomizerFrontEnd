import React, { useEffect, useState } from "react";
import SheathColorService from "../../../services/SheathColorService";
import CardComponent from "./CardComponent";

const SheathCustomizationComponent: React.FC = () => {
    const [sheathColors, setSheathColors] = useState<SheathColor[]>([]);

    useEffect(() => {
        const fetchSheathColors = async () => {
            const service = new SheathColorService();
            const colors = await service.getAll();
            console.log(colors);
            setSheathColors(colors);
        };

        fetchSheathColors();
    }, []);

    const sheathColorClick = (colorCode: string) => {
        console.log("Selected color: ", colorCode);
    };

    return (
        <div className="grid grid-cols-3 gap-4">
            {sheathColors.map((color) => (
                <CardComponent
                    key={color.id}
                    backgroundPicture={color.colorCode}
                    tooltipText={color.colorName}
                    onClick={() => sheathColorClick(color.colorCode)}
                />
            ))}
        </div>
    );
};

export default SheathCustomizationComponent;
