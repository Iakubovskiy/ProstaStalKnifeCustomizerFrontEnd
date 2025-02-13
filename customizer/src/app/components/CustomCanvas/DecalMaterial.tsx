import React, {useEffect} from "react";
import {useTexture} from "@react-three/drei";

interface DecalMaterialProps {
    pictureUrl: string;
    offsetFactor: number;
}

const DecalMaterial: React.FC<DecalMaterialProps> = ({
                                                         pictureUrl,
                                                         offsetFactor = 2,
                                                     }) => {
    const texture = useTexture(pictureUrl);

    // Ефект для оновлення текстури
    useEffect(() => {
        texture.needsUpdate = true;
    }, [pictureUrl, texture]);

    return (
        //@ts-ignore
        <meshStandardMaterial
            map={texture}
            transparent
            polygonOffset
            polygonOffsetFactor={offsetFactor}
            polygonOffsetUnits={-2}
            needsUpdate={true}
        />
    );
};

export default DecalMaterial;