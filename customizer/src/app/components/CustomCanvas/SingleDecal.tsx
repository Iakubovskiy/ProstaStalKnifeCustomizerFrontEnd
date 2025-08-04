import React, { Suspense } from "react";
import { Decal } from "@react-three/drei";
import DecalMaterial from "./DecalMaterial";

// @ts-ignore
const SingleDecal = ({ meshRef, engraving, arrayPosition, offsetFactor }) => {

    if (!meshRef.current || !engraving?.picture || !engraving?.picture.fileUrl) {
        return null;
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
            scale={engraving.scaleX || 20}
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