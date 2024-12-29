'use client';

import React, { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import FasteningService from "@/app/services/FasteningService";
import CardComponent from "./CardComponent";
import Fastening from "@/app/Models/Fastening";

const PreviewGenerator = dynamic(() => import('./PreviewGenerator'), {
    ssr: false,
    loading: () => <div style={{ width: 150, height: 150, background: '#f0f0f0' }} />
});

const FasteningCustomizationComponent: React.FC = () => {
    const [fastenings, setFastenings] = useState<Fastening[]>([]);
    const [previews, setPreviews] = useState<{ [key: number]: string }>({});
    const fasteningService = new FasteningService();

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const fetchFastenings = async () => {
            try {
                const fastenings = await fasteningService.getAll();
                setFastenings(fastenings);
            } catch (error) {
                console.error('Error fetching fastenings:', error);
            }
        };

        fetchFastenings();
    }, []);

    const handlePreviewGenerated = (id: number, preview: string) => {
        setPreviews(prev => ({
            ...prev,
            [id]: preview
        }));
    };

    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", position: "relative" }}>
            {fastenings.map((fastening) => (
                <React.Fragment key={fastening.id}>
                    <CardComponent
                        backgroundPicture={previews[fastening.id] || '#ffffff'}
                        tooltipText={fastening.name}
                        onClick={() => console.log("Selected Fastening:", fastening)}
                    />
                    {!previews[fastening.id] && (
                        <PreviewGenerator
                            modelUrl={fastening.modelUrl}
                            onPreviewGenerated={(preview) => handlePreviewGenerated(fastening.id, preview)}
                        />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default FasteningCustomizationComponent;