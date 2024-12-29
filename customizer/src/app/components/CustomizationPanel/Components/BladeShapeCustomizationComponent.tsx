'use client';

import React, { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import BladeShapeService from "@/app/services/BladeShapeService";
import CardComponent from "./CardComponent";
import BladeShape from "@/app/Models/BladeShape";
import { useCanvasState } from '@/app/state/canvasState';

const PreviewGenerator = dynamic(() => import('./PreviewGenerator'), {
    ssr: false,
    loading: () => <div style={{ width: 150, height: 150, background: '#f0f0f0' }} />
});

const BladeShapeCustomizationComponent: React.FC = () => {
    const [bladeShapes, setBladeShapes] = useState<BladeShape[]>([]);
    const [previews, setPreviews] = useState<{ [key: number]: string }>({});
    const bladeShapeService = new BladeShapeService();
    const state = useCanvasState();

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const fetchBladeShapes = async () => {
            try {
                const shapes = await bladeShapeService.getAll();
                setBladeShapes(shapes);
            } catch (error) {
                console.error('Error fetching blade shapes:', error);
            }
        };

        fetchBladeShapes();
    }, []);

    const handlePreviewGenerated = (id: number, preview: string) => {
        setPreviews(prev => ({
            ...prev,
            [id]: preview
        }));
    };
    const bladeShapeSelection = (shape:BladeShape)=>{
        state.bladeShape = {
            ...state.bladeShape,
            id:shape.id,
            name:shape.name,
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
            bladeShapeModelUrl:shape.bladeShapeModelUrl,
            sheathModelUrl:shape.sheathModelUrl,
        };
    };

    //"https://res.cloudinary.com/ddcvocdfe/image/upload/v1735212813/tanto2.glb"
    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", position: "relative" }}>
            {bladeShapes.map((shape) => (
                <React.Fragment key={shape.id}>
                    <CardComponent
                        backgroundPicture={previews[shape.id] || '#ffffff'}
                        tooltipText={shape.name}
                        onClick={() => bladeShapeSelection(shape)}
                    />
                    {!previews[shape.id] && (
                        <PreviewGenerator
                            modelUrl={shape.bladeShapeModelUrl}
                            onPreviewGenerated={(preview) => handlePreviewGenerated(shape.id, preview)}
                        />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default BladeShapeCustomizationComponent;