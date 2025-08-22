import React, { Suspense } from "react";
import { Decal } from "@react-three/drei";
import DecalMaterial from "./DecalMaterial";
import {EngravingForCanvas} from "@/app/Interfaces/Knife/EngravingForCanvas";

interface SingleDecalProps {
    meshRef: any;
    engraving: EngravingForCanvas;
    offsetFactor: number;
}

const getTextDecalParameters = (engraving:EngravingForCanvas) => {
    if(!engraving.text)
        return;
    const decalTextHeight = engraving.scaleY;
    const decalTextWidth = engraving.text.length/2 * decalTextHeight;

    return {
        decalTextHeight,
        decalTextWidth
    }
};

const SingleDecal = ({ meshRef, engraving, offsetFactor }:SingleDecalProps) => {

    if (!meshRef.current || !engraving?.picture || !engraving?.picture.fileUrl) {
        return null;
    }
    let textWidth: number | undefined;
    let textHeight: number | undefined;
    if(engraving.text) {
        textWidth = getTextDecalParameters(engraving)?.decalTextWidth;
        textHeight = getTextDecalParameters(engraving)?.decalTextHeight;
    }

    return (
        <Decal
            mesh={meshRef.current}
            position={[
                engraving.locationX || 0,
                engraving.locationY || 0,
                engraving.text === null ? 0 : -1,
            ]}
            rotation={[
                0,
                engraving.side === 2 ? Math.PI : 0,
                engraving.rotationZ || 0,
            ]}
            scale={[textWidth || engraving.scaleX || 20, textHeight || engraving.scaleY || 20, 30]}
        >
            <Suspense fallback={null}>
                <DecalMaterial
                    pictureUrl={engraving.picture.fileUrl}
                    engravingSide={engraving.side}
                    offsetFactor={offsetFactor}
                />
            </Suspense>
        </Decal>
    );
};

export default SingleDecal;