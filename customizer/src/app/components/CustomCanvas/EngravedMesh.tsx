import * as THREE from "three";
import Engraving from "@/app/Models/Engraving";
import React, {useEffect, useRef, useState} from "react";
import SingleDecal from "./SingleDecal";

interface EngravedMeshProps {
    geometry: THREE.BufferGeometry;
    material: THREE.Material;
    position: THREE.Vector3 | [number, number, number];
    rotation: THREE.Euler | [number, number, number];
    matrix?: THREE.Matrix4;
    engravings: Engraving[];
}

const EngravedMesh : React.FC<EngravedMeshProps> = ({
                                                        geometry,
                                                        material,
                                                        position,
                                                        rotation,
                                                        matrix,
                                                        engravings,
                                                    }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [meshKey, setMeshKey] = useState(0);

    useEffect(() => {
        setMeshKey((prev) => prev + 1);
    }, [engravings.length, engravings.map((e) => e.pictureUrl).join(",")]);

    useEffect(() => {
        if (meshRef.current && matrix) {
            meshRef.current.applyMatrix4(matrix);
        }
    }, [matrix]);

    return (
        //@ts-ignore
        <group key={meshKey}>
            {/*@ts-ignore*/}
            <mesh
                ref={meshRef}
                geometry={geometry}
                material={material}
            >
                {engravings?.map(
                    (eng, index) =>
                        "engravingSide" + eng.side === material.name && (
                            <SingleDecal
                                key={`${eng.id}-${index}-${meshKey}`}
                                meshRef={meshRef}
                                engraving={eng}
                                offsetFactor={index * -0.1}
                            />
                        )
                )}
                {/*@ts-ignore*/}
            </mesh>
            {/*@ts-ignore*/}
        </group>
    );
};

export default EngravedMesh;