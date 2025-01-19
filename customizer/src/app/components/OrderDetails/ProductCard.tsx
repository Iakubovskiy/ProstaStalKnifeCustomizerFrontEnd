import React, {Suspense, useEffect, useState} from 'react';
import { Card } from '@nextui-org/react';
import CustomCanvas from '../CustomCanvas/CustomCanvas';
import KnifeService from "@/app/services/KnifeService";
import FasteningService from "@/app/services/FasteningService";
import { useCanvasState } from "@/app/state/canvasState";

interface ProductCardProps {
    id: string;
    type: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ id, type }) => {
    const state = useCanvasState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                switch (type.toLowerCase()) {
                    case 'knife': {
                        const knifeService = new KnifeService();
                        const knife = await knifeService.getById(id);
                        state.bladeShape = knife.shape;
                        state.bladeCoatingColor = knife.bladeCoatingColor;
                        state.sheathColor = knife.sheathColor;
                        state.handleColor = knife.handleColor;
                        state.fastening = knife.fastening;
                        if (knife.engravings) {
                            state.engravings = knife.engravings;
                        }
                        break;
                    }
                    case 'fastening': {
                        const fasteningService = new FasteningService();
                        const fastening = await fasteningService.getById(id);
                        state.fastening = fastening;
                        break;
                    }
                    default:
                        console.error(`Unknown product type: ${type}`);
                        break;
                }
            } catch (error) {
                console.error(`Error loading product data:`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, type, state]);

    if (loading) {
        return <div>Завантаження продукту...</div>;
    }

    return (
        <Card>
            <div className="w-full md:w-1/2 h-[300px]">
                <Suspense fallback={<div>Завантаження 3D Моделі...</div>}>
                    <CustomCanvas />
                </Suspense>
            </div>
        </Card>
    );
};