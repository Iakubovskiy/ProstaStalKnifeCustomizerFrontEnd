import React, {useEffect, useMemo, useState} from "react";
import {useTexture} from "@react-three/drei";
import {useCanvasState} from "@/app/state/canvasState";
import {useSnapshot} from "valtio";
import * as THREE from "three";

interface DecalMaterialProps {
    pictureUrl: string;
    engravingSide: number;
    offsetFactor: number;
}

enum Side {
    Right = 1,
    Left = 2,
    Axillary = 3,
}

const replaceStrokeColor = (svgText: string, newColor: string): string => {
    return svgText.replace(/(<(path|g|svg)[^>]*style="[^"]*)stroke\s*:\s*#[0-9a-fA-F]{3,6}([^"]*)"/gi,
        (match, p1, tag, p3) => {
            return `${p1}stroke:${newColor}${p3}"`;
        }
    );
}

const DecalMaterial: React.FC<DecalMaterialProps> = ({
                                                         pictureUrl,
                                                         engravingSide,
                                                         offsetFactor = 2,
                                                     }) => {
    const initialTexture = useTexture(pictureUrl);
    const [processedTexture, setProcessedTexture] = useState<THREE.Texture | null>(null);
    const state = useCanvasState();
    const snap = useSnapshot(state);


    const isSVG = useMemo(() => pictureUrl.endsWith('.svg'), [pictureUrl]);

    useEffect(() => {
        if (!initialTexture) {
            console.log('Texture not found');
            return;
        }

        let isMounted = true;
        console.log('IsSVG = ', isSVG);

        if (isSVG) {
            const engravingColor = engravingSide === Side.Axillary
                ? snap.sheathColor.engravingColorCode
                : snap.bladeCoatingColor.engravingColorCode;

            fetch(initialTexture.image.src)
                .then(res => res.text())
                .then(svgText => {
                    const modifiedSvg = replaceStrokeColor(svgText, engravingColor);
                    const blob = new Blob([modifiedSvg], { type: 'image/svg+xml' });
                    const url = URL.createObjectURL(blob);

                    const loader = new THREE.TextureLoader();
                    loader.load(url, (newTexture) => {
                        if (isMounted) {
                            setProcessedTexture(newTexture);
                        }
                        URL.revokeObjectURL(url);
                    });
                });
        } else {
            console.log('Texture is not SVG');
            setProcessedTexture(initialTexture);
        }

        return () => {
            isMounted = false;
        };

    }, [engravingSide, initialTexture, isSVG, snap.bladeCoatingColor.engravingColorCode, snap.sheathColor.engravingColorCode]);

    if (!processedTexture) {
        return null;
    }

    return (
        <meshStandardMaterial
            map={processedTexture}
            transparent
            polygonOffset
            polygonOffsetFactor={offsetFactor}
            polygonOffsetUnits={-2}
            needsUpdate={true}
        />
    );
};

export default DecalMaterial;