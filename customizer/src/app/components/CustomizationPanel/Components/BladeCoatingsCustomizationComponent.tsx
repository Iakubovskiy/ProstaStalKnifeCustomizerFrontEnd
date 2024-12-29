import React, { useEffect, useState } from "react";
import BladeCoating from "../../../Models/BladeCoating";
import BladeCoatingService from "../../../services/BladeCoatingService";
import CardComponent from "./CardComponent";

const BladeCoatingCustomizationComponent: React.FC = () => {
    const [bladeCoatingOptions, setBladeCoatingOptions] = useState<
        { coating: string; colorName: string; colorCode: string }[]
    >([]);

    useEffect(() => {
        const fetchBladeCoatings = async () => {
            const service = new BladeCoatingService();
            try {
                const coatings = await service.getAll();
                const options: {
                    coating: string;
                    colorName: string;
                    colorCode: string;
                }[] = [];

                for (const coating of coatings) {
                    const detailedCoating = await service.getById(coating.id);
                    detailedCoating.colors.forEach((color) => {
                        options.push({
                            coating: detailedCoating.name,
                            colorName: color.color,
                            colorCode: color.colorCode,
                        });
                    });
                }

                setBladeCoatingOptions(options);
            } catch (error) {
                console.error("Error fetching blade coatings:", error);
            }
        };

        fetchBladeCoatings();
    }, []);

    const handleCoatingSelection = (coating: string, color: string) => {
        console.log(`Selected coating: ${coating}, color: ${color}`);
    };

    return (
        <div className="grid grid-cols-3 gap-4">
            {bladeCoatingOptions.map((option, index) => (
                <CardComponent
                    key={index}
                    backgroundPicture={option.colorCode}
                    tooltipText={`${option.coating}, ${option.colorName}`}
                    onClick={() =>
                        handleCoatingSelection(option.coating, option.colorName)
                    }
                />
            ))}
        </div>
    );
};

export default BladeCoatingCustomizationComponent;
